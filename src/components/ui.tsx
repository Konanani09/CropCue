import type { ReactNode } from 'react';
import { LucideIcon, Zap, Battery, Signal, Activity } from 'lucide-react';
import type { CardProps, SensorStatus, StatCardProps, StatusTone } from './types';
import { statusFor } from './types';

export function StatCard({ icon: Icon, tone, label, value, trend }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${tone}`}>
        <Icon size={24} />
      </div>
      <div className="stat-body">
        <div className="label">{label}</div>
        <div className="value">{value}</div>
        {trend && (
          <div className={`trend ${trend.dir}`}>
            {trend.dir === 'up'   && '▲'}
            {trend.dir === 'down' && '▼'}
            {trend.dir === 'flat' && '●'}
            <span>{trend.text}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function Card({
  children,
  className = '',
  icon: Icon,
  iconBg = 'var(--color-leaf-50)',
  iconColor = 'var(--color-leaf-700)',
  title,
  subtitle,
  action
}: CardProps) {
  return (
    <section className={`card ${className}`}>
      <div className="card-header">
        <div className="card-title">
          {Icon && (
            <div className="title-icon" style={{ background: iconBg, color: iconColor }}>
              <Icon size={18} />
            </div>
          )}
          <div>
            <h3>{title}</h3>
            {subtitle && <div className="card-subtitle">{subtitle}</div>}
          </div>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

interface BarMeterProps {
  name: string;
  value: number;
  max?: number;
  unit?: string;
  tone?: 'leaf' | 'sun' | 'sky' | 'soil';
}

export function BarMeter({ name, value, max = 100, unit = '%', tone = 'leaf' }: BarMeterProps) {
  const pct = Math.min(100, Math.max(0, Math.round((value / max) * 100)));
  return (
    <div className="bar-item">
      <div className="name">{name}</div>
      <div className="bar-track">
        <div className={`bar-fill ${tone}`} style={{ width: `${pct}%` }} />
      </div>
      <div className="val">{value}{unit}</div>
    </div>
  );
}

interface ChipProps {
  children: ReactNode;
  tone?: 'default' | 'leaf' | 'sun' | 'muted';
}

export function Chip({ children, tone = 'default' }: ChipProps) {
  return <span className={`chip ${tone === 'default' ? '' : tone}`}>{children}</span>;
}

export function SuitabilityBadge({ level }: { level: 'High' | 'Medium' | 'Low' }) {
  return <span className={`suitability ${level.toLowerCase()}`}>{level} Suitability</span>;
}

const toneStyles: Record<StatusTone, { bg: string; border: string; dot: string; text: string }> = {
  good:   { bg: 'var(--color-leaf-50)',  border: 'var(--color-leaf-200)', dot: 'var(--color-leaf-600)', text: 'var(--color-leaf-800)' },
  warn:   { bg: 'var(--color-sun-100)',  border: 'var(--color-sun-400)',  dot: 'var(--color-sun-500)',  text: 'var(--color-sun-700)' },
  danger: { bg: '#fde7e7',                border: '#f4bfbf',               dot: '#e45d5d',               text: '#a33' },
  muted:  { bg: 'var(--color-neutral-100)', border: 'var(--color-neutral-300)', dot: 'var(--color-neutral-500)', text: 'var(--color-neutral-700)' }
};

export function StatusChip({ status }: { status: SensorStatus }) {
  const { label, tone } = statusFor(status);
  const s = toneStyles[tone];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 10px',
        borderRadius: 999,
        background: s.bg,
        border: `1px solid ${s.border}`,
        color: s.text,
        fontSize: '0.75rem',
        fontWeight: 700
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: s.dot,
          boxShadow: status === 'syncing' ? `0 0 0 4px ${s.dot}22` : undefined,
          animation: status === 'syncing' ? 'pulse 1.2s ease-in-out infinite' : undefined
        }}
      />
      {label}
    </span>
  );
}

export interface SensorCardProps {
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
  onSync?: (id: string) => void;
  syncing?: boolean;
}

export function SensorCard({
  name, model, zone, status, batteryPercent, signalStrength,
  lastSyncAt, supportedMetricKeys, values, onSync, id, syncing
}: SensorCardProps) {
  return (
    <div
      style={{
        background: 'var(--color-white)',
        border: '1px solid var(--color-neutral-100)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-5)',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{
            width: 42, height: 42, borderRadius: 12,
            background: 'linear-gradient(135deg, var(--color-leaf-500), var(--color-leaf-700))',
            color: 'var(--color-white)', display: 'grid', placeItems: 'center'
          }}>
            <Zap size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 700, color: 'var(--color-leaf-900)' }}>{name}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-neutral-500)' }}>{model}</div>
          </div>
        </div>
        <StatusChip status={syncing ? 'syncing' : status} />
      </div>

      <div className="kv-list">
        <div className="kv">
          <span className="k">Zone</span>
          <span className="v">{zone}</span>
        </div>
        <div className="kv">
          <span className="k">Last sync</span>
          <span className="v">{lastSyncAt ? timeAgo(lastSyncAt) : 'Never'}</span>
        </div>
        <div className="kv">
          <span className="k"><Battery size={11} style={{ verticalAlign: '-1px' }} /> Battery</span>
          <span className="v" style={{ color: batteryPercent < 15 ? 'var(--color-sun-700)' : undefined }}>
            {batteryPercent}%
          </span>
        </div>
        <div className="kv">
          <span className="k"><Signal size={11} style={{ verticalAlign: '-1px' }} /> Signal</span>
          <span className="v">{signalStrength}%</span>
        </div>
      </div>

      <div>
        <div style={{
          fontSize: '0.72rem',
          fontWeight: 700,
          color: 'var(--color-neutral-500)',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          marginBottom: 8
        }}>
          <Activity size={11} style={{ verticalAlign: '-1px', marginRight: 4 }} />
          Supported readings
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {supportedMetricKeys.map(k => {
            const v = values[k];
            const hasValue = v !== null && v !== undefined;
            return (
              <span
                key={k}
                style={{
                  padding: '4px 10px',
                  borderRadius: 999,
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  border: `1px solid ${hasValue ? 'var(--color-leaf-200)' : 'var(--color-neutral-300)'}`,
                  background: hasValue ? 'var(--color-leaf-50)' : 'var(--color-neutral-100)',
                  color: hasValue ? 'var(--color-leaf-800)' : 'var(--color-neutral-500)'
                }}
              >
                {humanizeMetric(k)}
                {hasValue && <span style={{ marginLeft: 6, opacity: 0.9 }}>{formatMetricValue(k, v as number)}</span>}
              </span>
            );
          })}
        </div>
      </div>

      {onSync && (
        <div style={{ marginTop: 'auto' }}>
          <button
            className="btn btn-secondary"
            style={{ width: '100%' }}
            onClick={() => onSync(id)}
            disabled={syncing || status === 'disconnected'}
          >
            <Activity size={14} /> {syncing ? 'Syncing…' : 'Sync readings now'}
          </button>
        </div>
      )}
    </div>
  );
}

export function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.max(1, Math.floor(diffMs / 60000));
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr${hrs > 1 ? 's' : ''} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

export function humanizeMetric(k: string) {
  const map: Record<string, string> = {
    moisture: 'Moisture',
    temperature: 'Soil Temp',
    ec: 'EC',
    ph: 'pH',
    nitrogen: 'Nitrogen (N)',
    phosphorus: 'Phosphorus (P)',
    potassium: 'Potassium (K)',
    tension: 'Tension'
  };
  return map[k] ?? k;
}

export function formatMetricValue(k: string, v: number) {
  const unit: Record<string, string> = {
    moisture: '%',
    temperature: ' °C',
    ec: ' mS/cm',
    ph: '',
    nitrogen: ' ppm',
    phosphorus: ' ppm',
    potassium: ' ppm',
    tension: ' kPa'
  };
  return `${Number(v.toFixed(2))}${unit[k] ?? ''}`;
}
