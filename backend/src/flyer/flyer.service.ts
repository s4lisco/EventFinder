// backend/src/flyer/flyer.service.ts
import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { ExtractedEventDto } from './dto/extract-event.dto';
import OpenAI from 'openai';

@Injectable()
export class FlyerService {
  private readonly logger = new Logger(FlyerService.name);
  private openaiClient: OpenAI | null = null;

  constructor() {
    this.initializeClients();
  }

  private initializeClients(): void {
    // Initialize Groq client (OpenAI compatible) for both OCR and LLM
    const groqApiKey = process.env.GROQ_API_KEY;
    if (groqApiKey) {
      this.openaiClient = new OpenAI({
        apiKey: groqApiKey,
        baseURL: 'https://api.groq.com/openai/v1',
      });
      this.logger.log('Groq client initialized (OCR + LLM)');
    } else {
      this.logger.warn('GROQ_API_KEY not set, flyer processing will not work');
    }
  }

  async extractTextUsingOCR(buffer: Buffer): Promise<string> {
    if (!this.openaiClient) {
      throw new ServiceUnavailableException(
        'Flyer-Verarbeitung ist nicht verfügbar. Bitte GROQ_API_KEY konfigurieren.',
      );
    }

    try {
      const base64Image = buffer.toString('base64');
      const mimeType = this.detectMimeType(buffer);

      const response = await this.openaiClient.chat.completions.create({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: {
                  url: `data:${mimeType};base64,${base64Image}`,
                },
              },
              {
                type: 'text',
                text: 'Extract ALL text from this image/flyer. Return only the extracted text, nothing else.',
              },
            ],
          },
        ],
        max_tokens: 2000,
        temperature: 0.1,
      });

      const extractedText = response.choices[0]?.message?.content || '';
      this.logger.log(`OCR: ${extractedText.length} Zeichen extrahiert`);
      return extractedText;
    } catch (error) {
      this.logger.error('OCR-Extraktion fehlgeschlagen', error instanceof Error ? error.stack : String(error));
      this.throwGroqException(error);
    }
  }

  private detectMimeType(buffer: Buffer): string {
    // Simple MIME type detection based on magic bytes
    if (buffer[0] === 0xff && buffer[1] === 0xd8) return 'image/jpeg';
    if (buffer[0] === 0x89 && buffer[1] === 0x50) return 'image/png';
    if (buffer[0] === 0x47 && buffer[1] === 0x49) return 'image/gif';
    if (buffer[0] === 0x25 && buffer[1] === 0x50) return 'application/pdf';
    return 'application/octet-stream';
  }

  /** Übersetzt Groq/OpenAI API-Fehler in sprechende NestJS-Exceptions. */
  private throwGroqException(error: unknown): never {
    if (error instanceof OpenAI.APIError) {
      if (error.status === 401) {
        throw new ServiceUnavailableException(
          'Flyer-Verarbeitung ist nicht verfügbar (ungültiger API-Schlüssel).',
        );
      }
      if (error.status === 429) {
        throw new ServiceUnavailableException(
          'Flyer-Verarbeitung ist momentan ausgelastet. Bitte kurz warten und erneut versuchen.',
        );
      }
      if (error.status != null && error.status >= 500) {
        throw new ServiceUnavailableException(
          'Flyer-Verarbeitung ist vorübergehend nicht verfügbar. Bitte erneut versuchen.',
        );
      }
    }
    throw new ServiceUnavailableException(
      'Flyer konnte nicht verarbeitet werden. Bitte erneut versuchen oder Event manuell ausfüllen.',
    );
  }

  async extractEventDataUsingGroq(text: string): Promise<ExtractedEventDto> {
    if (!this.openaiClient) {
      throw new ServiceUnavailableException(
        'Flyer-Verarbeitung ist nicht verfügbar. Bitte GROQ_API_KEY konfigurieren.',
      );
    }

    if (!text || text.trim().length === 0) {
      return {
        needsManualReview: true,
        extractedText: text || '',
        confidence: 0,
      };
    }

    const systemPrompt = `You are an expert at extracting structured event information from text. 
Your task is to analyze the provided text (extracted from an event flyer) and extract event details.

Return ONLY a valid JSON object with the following fields (use null for fields you cannot determine):
- title: string (event name/title)
- description: string (event description or summary)
- startDate: string (ISO 8601 format like "2024-12-15T19:00:00", extract date and time if available)
- endDate: string or null (ISO 8601 format, if end time/date is mentioned)
- category: string (one of: "music", "sports", "family", "arts", "food" - pick the most appropriate)
- priceInfo: string or null (e.g., "Free", "€15", "$20 at door")
- locationName: string or null (venue name)
- address: string or null (full address if available)
- latitude: string or null (only if explicitly mentioned)
- longitude: string or null (only if explicitly mentioned)
- website: string or null (URL if mentioned)
- organizerName: string or null (event organizer/host name)
- confidence: number (0-100, your confidence level in the extraction)

Important rules:
1. If no clear date/time is found, still try to extract other fields
2. For dates, assume the current or upcoming year if not specified
3. Be conservative with confidence - lower if information is ambiguous
4. Always return valid JSON, nothing else`;

    const userPrompt = `Extract event details from this flyer text:\n\n${text}`;

    try {
      const response = await this.openaiClient.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.1,
        max_tokens: 1000,
      });

      const content = response.choices[0]?.message?.content || '';
      this.logger.log('LLM-Antwort empfangen');

      // Parse the JSON response
      const jsonMatch = content.match(/{[\s\S]*}/);
      if (!jsonMatch) {
        this.logger.warn('No JSON found in LLM response');
        return {
          needsManualReview: true,
          extractedText: text,
          confidence: 0,
        };
      }

      const parsed = JSON.parse(jsonMatch[0]) as Record<string, unknown>;
      const confidence = (parsed.confidence as number) || 50;

      const needsManualReview = !parsed.startDate || confidence < 50;

      const str = (v: unknown): string | undefined =>
        v && typeof v === 'string' ? v : undefined;

      return {
        title: str(parsed.title),
        description: str(parsed.description),
        startDate: str(parsed.startDate),
        endDate: str(parsed.endDate),
        category: str(parsed.category),
        priceInfo: str(parsed.priceInfo),
        locationName: str(parsed.locationName),
        address: str(parsed.address),
        latitude: str(parsed.latitude),
        longitude: str(parsed.longitude),
        website: str(parsed.website),
        organizerName: str(parsed.organizerName),
        needsManualReview,
        extractedText: text,
        confidence,
      };
    } catch (error) {
      this.logger.error('LLM-Extraktion fehlgeschlagen', error instanceof Error ? error.stack : String(error));
      this.throwGroqException(error);
    }
  }

  async processFlyer(buffer: Buffer): Promise<ExtractedEventDto> {
    // Step 1: Extract text using OCR
    const extractedText = await this.extractTextUsingOCR(buffer);

    // Step 2: Extract structured event data using LLM
    return this.extractEventDataUsingGroq(extractedText);
  }
}
