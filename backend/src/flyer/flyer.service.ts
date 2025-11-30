// backend/src/flyer/flyer.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ExtractedEventDto } from './dto/extract-event.dto';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import OpenAI from 'openai';

@Injectable()
export class FlyerService {
  private readonly logger = new Logger(FlyerService.name);
  private visionClient: ImageAnnotatorClient | null = null;
  private openaiClient: OpenAI | null = null;

  constructor() {
    this.initializeClients();
  }

  private initializeClients(): void {
    // Initialize Google Cloud Vision client
    const googleCredentials = process.env.GOOGLE_CLOUD_VISION_CREDENTIALS;
    if (googleCredentials) {
      try {
        // Handle both file path and base64-encoded JSON
        if (googleCredentials.startsWith('{')) {
          // Direct JSON string
          const credentials = JSON.parse(googleCredentials);
          this.visionClient = new ImageAnnotatorClient({ credentials });
        } else if (googleCredentials.endsWith('.json')) {
          // File path
          this.visionClient = new ImageAnnotatorClient({
            keyFilename: googleCredentials,
          });
        } else {
          // Base64 encoded JSON
          const decoded = Buffer.from(googleCredentials, 'base64').toString(
            'utf-8',
          );
          const credentials = JSON.parse(decoded);
          this.visionClient = new ImageAnnotatorClient({ credentials });
        }
        this.logger.log('Google Cloud Vision client initialized');
      } catch (error) {
        this.logger.warn(
          'Failed to initialize Google Cloud Vision client:',
          error,
        );
      }
    } else {
      this.logger.warn(
        'GOOGLE_CLOUD_VISION_CREDENTIALS not set, OCR will not be available',
      );
    }

    // Initialize Groq client (OpenAI compatible)
    const groqApiKey = process.env.GROQ_API_KEY;
    if (groqApiKey) {
      this.openaiClient = new OpenAI({
        apiKey: groqApiKey,
        baseURL: 'https://api.groq.com/openai/v1',
      });
      this.logger.log('Groq LLM client initialized');
    } else {
      this.logger.warn('GROQ_API_KEY not set, LLM extraction will not work');
    }
  }

  async extractTextUsingOCR(buffer: Buffer): Promise<string> {
    if (!this.visionClient) {
      throw new Error(
        'Google Cloud Vision client not initialized. Please configure GOOGLE_CLOUD_VISION_CREDENTIALS.',
      );
    }

    try {
      const [result] = await this.visionClient.textDetection({
        image: { content: buffer },
      });

      const detections = result.textAnnotations;
      if (!detections || detections.length === 0) {
        this.logger.warn('No text detected in the image');
        return '';
      }

      // The first annotation contains the full extracted text
      const fullText = detections[0].description || '';
      this.logger.log(`Extracted ${fullText.length} characters from image`);
      return fullText;
    } catch (error) {
      this.logger.error('OCR extraction failed:', error);
      throw new Error(
        `OCR extraction failed: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async extractEventDataUsingGroq(text: string): Promise<ExtractedEventDto> {
    if (!this.openaiClient) {
      throw new Error(
        'Groq LLM client not initialized. Please configure GROQ_API_KEY.',
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
        model: 'llama3-70b-8192',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.1,
        max_tokens: 1000,
      });

      const content = response.choices[0]?.message?.content || '';
      this.logger.log('LLM response received');

      // Parse the JSON response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        this.logger.warn('No JSON found in LLM response');
        return {
          needsManualReview: true,
          extractedText: text,
          confidence: 0,
        };
      }

      const parsed = JSON.parse(jsonMatch[0]);
      const confidence = parsed.confidence || 50;

      // Determine if manual review is needed
      const needsManualReview = !parsed.startDate || confidence < 50;

      return {
        title: parsed.title || undefined,
        description: parsed.description || undefined,
        startDate: parsed.startDate || undefined,
        endDate: parsed.endDate || undefined,
        category: parsed.category || undefined,
        priceInfo: parsed.priceInfo || undefined,
        locationName: parsed.locationName || undefined,
        address: parsed.address || undefined,
        latitude: parsed.latitude || undefined,
        longitude: parsed.longitude || undefined,
        website: parsed.website || undefined,
        organizerName: parsed.organizerName || undefined,
        needsManualReview,
        extractedText: text,
        confidence,
      };
    } catch (error) {
      this.logger.error('LLM extraction failed:', error);
      return {
        needsManualReview: true,
        extractedText: text,
        confidence: 0,
      };
    }
  }

  async processFlyer(buffer: Buffer): Promise<ExtractedEventDto> {
    // Step 1: Extract text using OCR
    const extractedText = await this.extractTextUsingOCR(buffer);

    // Step 2: Extract structured event data using LLM
    const eventData = await this.extractEventDataUsingGroq(extractedText);

    return eventData;
  }
}
