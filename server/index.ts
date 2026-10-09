import express from 'express';
import cors from 'cors';

const app = express();
const DEFAULT_PORT = Number(process.env.PORT ?? 3005);

app.use(cors());
app.use(express.json());

type SensorStatus = 'connected' | 'disconnected' | 'low_battery' | 'syncing';

type MetricUnit = '%' | '°C' | 'pH' | 'ppm' | 'mS/cm' | 'kPa';

interface SensorSpec {
  id: string;
  name: string;
  model: string;
  location: { fieldId: string; zone: string; lat: number; lng: number };
  installedAt: string;
  supportedMetrics: {
    key: string;
    label: string;
    unit: MetricUnit;
    rangeMin: number;
    rangeMax: number;
  }[];
}

interface SensorRuntime {
  id: string;
  status: SensorStatus;
  batteryPercent: number;
  signalStrength: number;
  lastSyncAt: string | null;
  firmwareVersion: string;
}

type ReadingValue = number | null;

interface SensorReadings {
  sensorId: string;
  capturedAt: string;
  values: Record<string, ReadingValue>;
}

const SENSORS: SensorSpec[] = [
  {
    id: 'sensor-001',
    name: 'Field A · Main Probe',
    model: 'Meter Group 5TE (Soil Moisture + EC + Temp)',
    location: { fieldId: 'field-01', zone: 'North Ridge', lat: -23.9068, lng: 29.4847 },
    installedAt: '2025-08-12',
    supportedMetrics: [
      { key: 'moisture',    label: 'Volumetric Water Content', unit: '%',    rangeMin: 0,  rangeMax: 60 },
      { key: 'temperature', label: 'Soil Temperature',         unit: '°C',   rangeMin: -10, rangeMax: 60 },
      { key: 'ec',          label: 'Electrical Conductivity',  unit: 'mS/cm',rangeMin: 0,  rangeMax: 10 }
    ]
  },
  {
    id: 'sensor-002',
    name: 'Field A · NPK Pod',
    model: 'Atterotech NPK-100 (N + P + K + pH)',
    location: { fieldId: 'field-01', zone: 'Centre Bed', lat: -23.9070, lng: 29.4851 },
    installedAt: '2026-02-04',
    supportedMetrics: [
      { key: 'ph',         label: 'Soil pH',          unit: 'pH',  rangeMin: 3,  rangeMax: 10 },
      { key: 'nitrogen',   label: 'Available Nitrogen',unit: 'ppm',rangeMin: 0,  rangeMax: 200 },
      { key: 'phosphorus', label: 'Available Phosphorus', unit: 'ppm', rangeMin: 0, rangeMax: 200 },
      { key: 'potassium',  label: 'Available Potassium', unit: 'ppm',  rangeMin: 0, rangeMax: 300 }
    ]
  },
  {
    id: 'sensor-003',
    name: 'Field A · Tensiometer',
    model: 'Irrometer LT (Soil Water Tension)',
    location: { fieldId: 'field-01', zone: 'South Low', lat: -23.9073, lng: 29.4842 },
    installedAt: '2025-11-19',
    supportedMetrics: [
      { key: 'tension', label: 'Soil Water Tension', unit: 'kPa', rangeMin: 0, rangeMax: 100 }
    ]
  }
];

const SENSOR_RUNTIMES: Record<string, SensorRuntime> = {
  'sensor-001': {
    id: 'sensor-001',
    status: 'connected',
    batteryPercent: 84,
    signalStrength: 72,
    lastSyncAt: new Date(Date.now() - 37 * 60 * 1000).toISOString(),
    firmwareVersion: '2.4.1'
  },
  'sensor-002': {
    id: 'sensor-002',
    status: 'connected',
    batteryPercent: 61,
    signalStrength: 58,
    lastSyncAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    firmwareVersion: '1.9.0'
  },
  'sensor-003': {
    id: 'sensor-003',
    status: 'low_battery',
    batteryPercent: 12,
    signalStrength: 41,
    lastSyncAt: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(),
    firmwareVersion: '1.3.7'
  }
};

const READINGS_BY_SENSOR: Record<string, SensorReadings> = {
  'sensor-001': {
    sensorId: 'sensor-001',
    capturedAt: SENSOR_RUNTIMES['sensor-001'].lastSyncAt!,
    values: { moisture: 42, temperature: 24.6, ec: 1.12 }
  },
  'sensor-002': {
    sensorId: 'sensor-002',
    capturedAt: SENSOR_RUNTIMES['sensor-002'].lastSyncAt!,
    values: { ph: 6.4, nitrogen: 38, phosphorus: 22, potassium: 31 }
  },
  'sensor-003': {
    sensorId: 'sensor-003',
    capturedAt: SENSOR_RUNTIMES['sensor-003'].lastSyncAt!,
    values: { tension: 28 }
  }
};

function withRuntime(spec: SensorSpec): SensorSpec & { runtime: SensorRuntime; latestReadings: SensorReadings } {
  return { ...spec, runtime: SENSOR_RUNTIMES[spec.id], latestReadings: READINGS_BY_SENSOR[spec.id] };
}

function statusWeight(s: SensorStatus) {
  return { connected: 0, syncing: 1, low_battery: 2, disconnected: 3 }[s];
}

function availableMetrics() {
  const all: (SensorSpec['supportedMetrics'][number] & { sensorId: string; sensorName: string; value: ReadingValue; capturedAt: string | null })[] = [];
  for (const spec of SENSORS) {
    const r = SENSOR_RUNTIMES[spec.id];
    if (r.status === 'disconnected') continue;
    const readings = READINGS_BY_SENSOR[spec.id];
    for (const m of spec.supportedMetrics) {
      all.push({
        ...m,
        sensorId: spec.id,
        sensorName: spec.name,
        value: readings.values[m.key] ?? null,
        capturedAt: r.lastSyncAt
      });
    }
  }
  return all;
}

function aggregateReadings() {
  const byKey: Record<string, { value: number | null; unit: MetricUnit | ''; label: string; sources: { sensorId: string; sensorName: string; value: number | null; capturedAt: string | null }[] }> = {};
  for (const metric of availableMetrics()) {
    if (!byKey[metric.key]) {
      byKey[metric.key] = { value: null, unit: metric.unit, label: metric.label, sources: [] };
    }
    byKey[metric.key].sources.push({
      sensorId: metric.sensorId,
      sensorName: metric.sensorName,
      value: metric.value,
      capturedAt: metric.capturedAt
    });
    if (metric.value !== null) {
      byKey[metric.key].value = metric.value;
    }
  }
  return byKey;
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'CropCue API', version: '0.2.0', at: new Date().toISOString() });
});

app.get('/api/sensors', (_req, res) => {
  const list = SENSORS
    .map(withRuntime)
    .sort((a, b) => statusWeight(a.runtime.status) - statusWeight(b.runtime.status));
  res.json({ count: list.length, sensors: list });
});

app.get('/api/sensors/:id/readings', (req, res) => {
  const spec = SENSORS.find(s => s.id === req.params.id);
  if (!spec) return res.status(404).json({ error: 'Sensor not found', id: req.params.id });
  res.json(withRuntime(spec));
});

app.post('/api/sensors/:id/sync', (req, res) => {
  const id = req.params.id;
  const spec = SENSORS.find(s => s.id === id);
  if (!spec) return res.status(404).json({ error: 'Sensor not found' });
  const rt = SENSOR_RUNTIMES[id];
  rt.status = 'syncing';
  res.write(JSON.stringify({ ok: true, stage: 'requesting-read' }) + '\n');

  setTimeout(() => {
    const readings = READINGS_BY_SENSOR[id];
    for (const k of Object.keys(readings.values)) {
      const cur = readings.values[k] ?? 0;
      const jitter = (Math.random() - 0.5) * 4;
      readings.values[k] = Math.max(0, Number((cur + jitter).toFixed(2)));
    }
    readings.capturedAt = new Date().toISOString();
    rt.lastSyncAt = readings.capturedAt;
    rt.status = rt.batteryPercent < 15 ? 'low_battery' : 'connected';
    res.end(JSON.stringify({ ok: true, stage: 'complete', capturedAt: readings.capturedAt, readings: readings.values }) + '\n');
  }, 1200);
});

app.get('/api/soil-readings/latest', (_req, res) => {
  const sensors = SENSORS.map(withRuntime);
  const aggregate = aggregateReadings();

  const oldest = sensors
    .filter(s => s.runtime.status !== 'disconnected')
    .map(s => s.latestReadings.capturedAt)
    .sort()[0] ?? new Date().toISOString();

  const overallStatus: SensorStatus =
    sensors.every(s => s.runtime.status === 'disconnected') ? 'disconnected' :
    sensors.some(s => s.runtime.status === 'low_battery')    ? 'low_battery'  :
    sensors.some(s => s.runtime.status === 'syncing')        ? 'syncing'      : 'connected';

  res.json({
    fieldId: 'field-01',
    location: 'Limpopo, South Africa',
    overallStatus,
    capturedAt: oldest,
    sensorsConnected: sensors.filter(s => s.runtime.status !== 'disconnected').length,
    sensorsTotal: sensors.length,
    sensors: sensors.map(s => ({
      id: s.id,
      name: s.name,
      model: s.model,
      zone: s.location.zone,
      status: s.runtime.status,
      batteryPercent: s.runtime.batteryPercent,
      signalStrength: s.runtime.signalStrength,
      lastSyncAt: s.runtime.lastSyncAt,
      supportedMetricKeys: s.supportedMetrics.map(m => m.key),
      values: s.latestReadings.values
    })),
    metrics: availableMetrics().map(m => ({
      key: m.key,
      label: m.label,
      unit: m.unit,
      value: m.value,
      rangeMin: m.rangeMin,
      rangeMax: m.rangeMax,
      fromSensorId: m.sensorId,
      fromSensorName: m.sensorName,
      capturedAt: m.capturedAt
    })),
    legacyCompat: {
      moisture: aggregate.moisture?.value ?? null,
      temperature: aggregate.temperature?.value ?? null,
      ph: aggregate.ph?.value ?? null,
      nitrogen: aggregate.nitrogen?.value ?? null,
      phosphorus: aggregate.phosphorus?.value ?? null,
      potassium: aggregate.potassium?.value ?? null
    },
    availableMetricKeys: Object.keys(aggregate).filter(k => aggregate[k].value !== null)
  });
});

const FORECAST_DAYS = [
  { date: '2026-10-09', tempMax: 28, tempMin: 16, rainfall: 0,  condition: 'Sunny' },
  { date: '2026-10-10', tempMax: 27, tempMin: 17, rainfall: 2,  condition: 'Partly Cloudy' },
  { date: '2026-10-11', tempMax: 25, tempMin: 15, rainfall: 12, condition: 'Showers' },
  { date: '2026-10-12', tempMax: 24, tempMin: 14, rainfall: 18, condition: 'Rainy' },
  { date: '2026-10-13', tempMax: 26, tempMin: 15, rainfall: 3,  condition: 'Cloudy' }
];

const HEAVY_RAIN_DATES = FORECAST_DAYS.filter(d => d.rainfall >= 10).map(d => d.date);

function weatherContextSentence(): string {
  if (HEAVY_RAIN_DATES.length >= 2) {
    const a = new Date(HEAVY_RAIN_DATES[0]);
    const b = new Date(HEAVY_RAIN_DATES[HEAVY_RAIN_DATES.length - 1]);
    const fmt = (d: Date) => d.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' });
    const post = new Date(b.getTime() + 2 * 24 * 60 * 60 * 1000);
    return `Rainfall expected ${fmt(a)}–${fmt(b)}. Hold planting 1 day before rain so seeds don't wash away; start from ${fmt(post)} onward — after the soil has drained for 2 days.`;
  }
  if (HEAVY_RAIN_DATES.length === 1) {
    const a = new Date(HEAVY_RAIN_DATES[0]);
    const fmt = (d: Date) => d.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' });
    return `Heavy rainfall expected ${fmt(a)}. Plant 2 days after — from ${fmt(new Date(a.getTime() + 2 * 24 * 60 * 60 * 1000))} onward.`;
  }
  return 'Clear planting window for the next 5 days: mostly warm and dry. Water lightly if your sensor shows soil moisture under 35%.';
}

function recommendationsFromMetrics(metrics: ReturnType<typeof availableMetrics>) {
  const byKey = Object.fromEntries(metrics.map(m => [m.key, m.value]));
  const moisture = byKey.moisture ?? null;
  const ph       = byKey.ph ?? null;
  const n        = byKey.nitrogen ?? null;

  const why = (base: string) => {
    const parts: string[] = [base];
    if (moisture !== null) parts.push(`moisture ${moisture}%`);
    if (ph !== null)       parts.push(`pH ${ph}`);
    if (n !== null)        parts.push(`N ${n} ppm`);
    if (HEAVY_RAIN_DATES.length) {
      const first = new Date(HEAVY_RAIN_DATES[0]).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' });
      const last  = new Date(HEAVY_RAIN_DATES[HEAVY_RAIN_DATES.length - 1]).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' });
      parts.push(`rain window ${first}–${last} factored in`);
    }
    return parts.join(' · ');
  };

  return [
    {
      crop: 'Maize (White Corn)',
      suitability: (moisture !== null && moisture >= 35) ? 'High' : 'Medium' as 'High' | 'Medium' | 'Low',
      bestPlanting: '15 Oct – 5 Nov (after rains settle)',
      why: why('Fits 10-day warm weather window'),
      weatherNotes: HEAVY_RAIN_DATES.length
        ? 'Maize seeds wash out easily in heavy rain. Delay sowing until 2 days after the 11–12 Oct showers — that puts you in the 15–25 Oct sweet spot.'
        : 'Good 10-day warm window ahead — direct-sow into damp soil and cover lightly.',
      companions: ['Pumpkin', 'Beans'],
      avoidInRotation: ['Sorghum'],
      caveats: (n !== null && n < 40) ? 'Nitrogen is borderline — add compost pre-sow.' : null
    },
    {
      crop: 'Butternut Squash',
      suitability: (byKey.potassium !== null && byKey.potassium >= 25) ? 'High' : 'Medium',
      bestPlanting: '20 Oct – 10 Nov',
      why: why('Potassium profile supports fruiting'),
      weatherNotes: HEAVY_RAIN_DATES.length
        ? 'Butternut hates cold wet seedbeds. Wait until 20 Oct — 9 days after the big rains — so the mounds warm up and drain well.'
        : 'Good soil warmth for fruiting crops; plant on raised mounds for drainage.',
      companions: ['Corn', 'Radish'],
      avoidInRotation: ['Melons'],
      caveats: null
    },
    {
      crop: 'Spinach',
      suitability: (n !== null && n < 40) ? 'Medium' : 'High',
      bestPlanting: '14 Oct – 25 Oct',
      why: why('Cooler window suits leafy growth'),
      weatherNotes: HEAVY_RAIN_DATES.length
        ? 'Spinach can take a light rain but hates being pounded. Plant from 14 Oct (2 days after the last heavy shower) — the cooler days that follow will suit leafy growth.'
        : 'Cooler evenings are perfect for spinach; keep the bed moist and shaded midday.',
      companions: ['Strawberry', 'Onion'],
      avoidInRotation: ['Beetroot'],
      caveats: (n !== null && n < 40) ? 'N low for leafy greens — side-dress at 4 weeks.' : null
    }
  ];
}

app.get('/api/weather/forecast', (_req, res) => {
  res.json({
    location: 'Limpopo, ZA',
    source: 'Open-Meteo (simulated)',
    days: FORECAST_DAYS
  });
});

app.get('/api/recommendations/crops', (_req, res) => {
  const metrics = availableMetrics();
  res.json({
    basedOnMetricKeys: metrics.map(m => m.key),
    weatherContext: weatherContextSentence(),
    recommendations: recommendationsFromMetrics(metrics)
  });
});

app.get('/api/farm/records', (_req, res) => {
  res.json({
    history: [
      { season: '2025/26', crop: 'Maize',   planted: '2025-11-02', harvested: '2026-04-18', yieldKg: 2480, notes: 'Late rain reduced final yield' },
      { season: '2025/26', crop: 'Spinach', planted: '2025-09-10', harvested: '2025-12-04', yieldKg: 620,  notes: 'Good rotation with previous beans' },
      { season: '2024/25', crop: 'Beans',   planted: '2024-10-22', harvested: '2025-02-11', yieldKg: 540,  notes: 'Companion with pumpkin worked well' }
    ],
    rotationSuggestion: 'Consider legumes (beans / cowpeas) next to restore nitrogen — especially after this season\'s maize.'
  });
});

app.get('/api/planting-plan', (_req, res) => {
  const fmtShort = (iso: string) => new Date(iso).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' });
  const rainRangeStr = HEAVY_RAIN_DATES.length >= 2
    ? `${fmtShort(HEAVY_RAIN_DATES[0])}–${fmtShort(HEAVY_RAIN_DATES[HEAVY_RAIN_DATES.length - 1])}`
    : HEAVY_RAIN_DATES.length === 1 ? fmtShort(HEAVY_RAIN_DATES[0]) : null;
  const safeStart = HEAVY_RAIN_DATES.length
    ? fmtShort(new Date(new Date(HEAVY_RAIN_DATES[HEAVY_RAIN_DATES.length - 1]).getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10))
    : null;

  const week1Note = rainRangeStr
    ? `Apply compost this week — ahead of the ${rainRangeStr} rains so the moisture releases nutrients. Target 40 ppm available N baseline.`
    : 'Target 40 ppm available N baseline before sowing.';

  const week2Note = safeStart
    ? `Plant maize from ${safeStart} onward — 2 days after the heavy rains end so seeds don't wash out. Row spacing 75 cm.`
    : 'Good warm window; direct-sow maize at 75 cm row spacing into damp soil.';

  const week3Note = rainRangeStr
    ? `Butternut hates cold wet mounds — delay into this week (well after ${rainRangeStr}) so the soil warms back up. Plant between maize rows for ground cover.`
    : 'Plant between established maize rows for ground cover and moisture retention.';

  const week4Note = HEAVY_RAIN_DATES.length
    ? `After the recent rains, first check that sensor-001 moisture is trending back below 65% before top-dressing N. If < 30% for 48h, irrigate lightly.`
    : 'Moisture check via sensor-001 + top-dress; if < 30% for 48h, schedule light irrigation.';

  res.json({
    weatherContext: weatherContextSentence(),
    plan: [
      { week: '19–25 Oct', action: 'Apply compost / manure to Field A',        crop: null,         note: week1Note },
      { week: '26 Oct – 1 Nov', action: 'Plant Maize (row spacing 75 cm)',     crop: 'Maize',      note: week2Note },
      { week: '2–8 Nov',     action: 'Plant Butternut between maize rows',     crop: 'Butternut',  note: week3Note },
      { week: '9–15 Nov',   action: 'Moisture check via sensor-001 + top-dress', crop: null,      note: week4Note }
    ]
  });
});

function startServer(port: number) {
  const server = app.listen(port, () => {
    console.log(`CropCue API running on http://localhost:${port}`);
    console.log(`  ${SENSORS.length} sensors registered in device registry.`);
  });

  server.on('error', (error: NodeJS.ErrnoException) => {
    if (error.code === 'EADDRINUSE') {
      const nextPort = port + 1;
      console.warn(`Port ${port} is unavailable; retrying on ${nextPort}.`);
      startServer(nextPort);
      return;
    }

    throw error;
  });
}

startServer(DEFAULT_PORT);
