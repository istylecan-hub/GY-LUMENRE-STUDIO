export type ProductType = 'TOPS' | 'DRESSES' | 'COORDS' | 'KURTI';
export type PoseStyle = 'COMMERCIAL' | 'EDITORIAL' | 'CASUAL' | 'GLAMOROUS' | 'URBAN_NIGHT' | 'STREET_STYLE';
export type BackgroundStyle = 'STUDIO_GREY' | 'STUDIO_WHITE' | 'STUDIO_BEIGE' | 'OUTDOOR_NATURE' | 'URBAN_STREET' | 'LUXURY_INTERIOR' | 'URBAN_NIGHT' | 'STREET_STYLE' | 'STUDIO_COLORS';
export type PartyBackgroundType = 'CLUB_LOUNGE' | 'ROOFTOP_PARTY' | 'PENTHOUSE_PARTY' | 'MINIMAL_PARTY' | 'URBAN_NIGHT_CITY';
export type FabricEmphasisType = 'TEXTURE_BOOST' | 'SPARKLE_HIGHLIGHT';

export interface GeneratedImage {
  id: string;
  label: string;
  url: string;
  timestamp: number;
}

export interface PoseConfig {
  id: string;
  label: string;
  promptDescription: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  referenceImages: string[];
  productType?: ProductType;
  poseStyle?: PoseStyle;
  backgroundStyle?: BackgroundStyle;
  partyBackground?: PartyBackgroundType;
  fabricEmphasis?: FabricEmphasisType;
  results: GeneratedImage[];
}

export enum AppState {
  CHECKING_KEY = 'CHECKING_KEY',
  UPLOAD = 'UPLOAD',
  GENERATING = 'GENERATING',
  RESULTS = 'RESULTS',
  HISTORY = 'HISTORY',
  ERROR = 'ERROR'
}

export interface GenerationProgress {
  total: number;
  completed: number;
  currentTask: string;
}