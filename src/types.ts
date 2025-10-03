export interface UrlCheck {
  url: string;
  status: number;
  responseTime: number;
  timestamp: number;
  success: boolean;
}

export interface MonitoringData {
  timestamp: number;
  checks: UrlCheck[];
}

export const MONITORED_URLS = [
  'https://www.edc.dk/bolig/',
  'https://www.edc.dk/bolig/villa/',
  'https://www.edc.dk/bolig/villalejlighed/',
  'https://www.edc.dk/bolig/raekkehus/',
  'https://www.edc.dk/bolig/ejerlejlighed/',
  'https://www.edc.dk/bolig/sommerhus/',
  'https://www.edc.dk/bolig/fritidsgrund/',
  'https://www.edc.dk/bolig/helaarsgrund/',
  'https://www.edc.dk/bolig/andelsbolig/',
  'https://www.edc.dk/bolig/landejendom/',
];
