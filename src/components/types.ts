import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export type SensorStatus = 'connected' | 'disconnected' | 'low_battery' | 'syncing';

export type MetricUnit = '%' | '°C' | 'pH' | 'ppm' | 'mS/cm' | 'kPa';

export interface SoilMetric {
  key: string;
  label: string;
  unit: MetricUnit;
  value: number | null;
  rangeMin: number;
  rangeMax: number;
  fromSensorId: string;
  fromSensorName: string;
  capturedAt: string | null;
}

export interface SensorSummary {
  id: string;
  name: string;
  model: string;
  zone: string;
  status: SensorStatus;
  batteryPercent: number;
  signalStrength: number;
  lastSyncAt: string | null;
  supportedMetricKeys: string[];
  values: Record<string, number | null>;
}

export interface SoilReadingResponse {
  fieldId: string;
  location: string;
  overallStatus: SensorStatus;
  capturedAt: string;
  sensorsConnected: number;
  sensorsTotal: number;
  sensors: SensorSummary[];
  metrics: SoilMetric[];
  legacyCompat: {
    moisture: number | null;
    temperature: number | null;
    ph: number | null;
    nitrogen: number | null;
    phosphorus: number | null;
    potassium: number | null;
  };
  availableMetricKeys: string[];
}

export interface ForecastDay {
  date: string;
  tempMax: number;
  tempMin: number;
  rainfall: number;
  condition: string;
}

export interface ForecastResponse {
  location: string;
  source: string;
  days: ForecastDay[];
}

export interface CropRec {
  crop: string;
  suitability: 'High' | 'Medium' | 'Low';
  bestPlanting: string;
  why: string;
  weatherNotes?: string | null;
  companions: string[];
  avoidInRotation: string[];
  caveats?: string | null;
}

export interface CropRecResponse {
  basedOnMetricKeys: string[];
  weatherContext?: string;
  recommendations: CropRec[];
}

export interface FarmRecord {
  season: string;
  crop: string;
  planted: string;
  harvested: string;
  yieldKg: number;
  notes: string;
}

export interface FarmRecordsResponse {
  history: FarmRecord[];
  rotationSuggestion: string;
}

export interface PlanStep {
  week: string;
  action: string;
  crop: string | null;
  note: string;
}

export interface PlantingPlanResponse {
  weatherContext?: string;
  plan: PlanStep[];
}

export type StatTone = 'moisture' | 'temp' | 'ph' | 'nitrogen' | 'rain' | 'sprout' | 'history' | 'calendar';

export interface StatCardProps {
  icon: LucideIcon;
  tone: StatTone;
  label: string;
  value: string;
  trend?: { dir: 'up' | 'down' | 'flat'; text: string };
}

export interface CardProps {
  children: ReactNode;
  className?: string;
  icon?: LucideIcon;
  iconBg?: string;
  iconColor?: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export type StatusTone = 'good' | 'warn' | 'danger' | 'muted';

export function statusFor(s: SensorStatus): { label: string; tone: StatusTone } {
  switch (s) {
    case 'connected':    return { label: 'Connected',   tone: 'good' };
    case 'low_battery':  return { label: 'Low battery', tone: 'warn' };
    case 'syncing':      return { label: 'Syncing…',    tone: 'muted' };
    case 'disconnected':
    default:             return { label: 'Offline',     tone: 'danger' };
  }
}
