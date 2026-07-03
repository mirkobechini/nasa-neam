export interface AsteroidData {
  id: string;
  name: string;
  distKm: number;
  sizeM: number;
  velocityKmh: number;
  hazardous: boolean;
}

export interface StatsData {
  total: number;
  hazardous: number;
  avgVelocity: number;
  minDistance: number;
  data: AsteroidData[];
}

export type TimeRange = "3d" | "7d" | "custom";