import { CapacitorConfig } from '@capacitor/cli';

// Hinweis:
// - Für Dev auf iOS/Android mit Live-Reload setze server.url auf deine LAN-IP (nicht localhost).
// - Beispiel: http://192.168.1.50:3000
// - Für Android-Emulator: http://10.0.2.2:3000
// - Für iOS-Simulator: nimm die LAN-IP; localhost funktioniert nicht in der WebView.
// - cleartext true erlaubt http für Dev. Für Prod entferne server.url und nutze gebaute Assets (webDir).

const config: CapacitorConfig = {
  appId: 'com.eventfinder.app',
  appName: 'EventFinder',
  webDir: 'out',
  bundledWebRuntime: false,
  server: {
    // Setze diese URL zur Laufzeit manuell auf deine tatsächliche LAN-IP.
    // Beispiel: 'http://192.168.1.50:3000'
    // Für Android Emulator: 'http://10.0.2.2:3000'
    // Für iOS Simulator/Device: 'http://<DEINE_LAN_IP>:3000'
    url: 'http://192.168.10.104:3000',
    cleartext: true,
  },
};

export default config;

