export interface SolarFlare {
  flrID: string;
  beginTime: string;
  peakTime: string;
  endTime: string | null;
  classType: string;
  sourceLocation: string;
  activeRegionNum: number | null;
  linkedEvents: { activityID: string }[] | null;
}

export interface CMEAnalysis {
  speed: number;
  type: string;
  time21_5: string | null;
  latitude: number | null;
  longitude: number | null;
  halfAngle: number | null;
}

export interface CME {
  activityID: string;
  startTime: string;
  sourceLocation: string | null;
  activeRegionNum: number | null;
  note: string;
  cmeAnalyses: CMEAnalysis[] | null;
}

export interface GeomagneticStorm {
  gstID: string;
  startTime: string;
  allKpIndex: { observedTime: string; kpIndex: number; source: string }[];
  linkedEvents: { activityID: string }[] | null;
}

export interface SolarWindPlasmaPoint {
  time_tag: string;
  speed: number | null;
  density: number | null;
  temperature: number | null;
}

export interface SolarWindMagPoint {
  time_tag: string;
  bx_gsm: number | null;
  by_gsm: number | null;
  bz_gsm: number | null;
  bt: number | null;
}

export interface KpPoint {
  time_tag: string;
  kp_index: number;
  source: string;
}

export type LoadState = 'idle' | 'loading' | 'success' | 'error';

export interface SolarData {
  flares: SolarFlare[];
  cmes: CME[];
  storms: GeomagneticStorm[];
  solarWind: SolarWindPlasmaPoint[];
  magField: SolarWindMagPoint[];
  kp: KpPoint[];
}
