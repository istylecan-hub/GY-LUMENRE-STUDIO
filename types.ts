export type ProductType = 'TOPS' | 'DRESSES' | 'COORDS' | 'KURTI' | 'ACCESSORIES' | 'FOOTWEAR';
export type PoseStyle = 'COMMERCIAL' | 'EDITORIAL' | 'CASUAL' | 'GLAMOROUS' | 'URBAN_NIGHT' | 'STREET_STYLE' | 'FLAT_LAY' | 'EDITORIAL_HIGH_FASHION' | 'VINTAGE_RETRO' | 'ATHLETIC_SPORTY' | 'MINIMALIST_ZEN' | 'CANDID_DOCUMENTARY' | 'FIERCE_BOSS' | 'ROMANTIC_DREAMY' | 'RUNWAY_WALK';
export type BackgroundStyle = 'STUDIO_GREY' | 'STUDIO_WHITE' | 'STUDIO_BEIGE' | 'OUTDOOR_NATURE' | 'URBAN_STREET' | 'LUXURY_INTERIOR' | 'URBAN_NIGHT' | 'STREET_STYLE' | 'STUDIO_COLORS' | 'STUDIO_VALENTINE' | 'MINIMALIST_COLOR' | 'CYBERPUNK_CITY' | 'HAVELI_HERITAGE' | 'STUDIO_PASTEL_PINK' | 'STUDIO_SAGE_GREEN' | 'STUDIO_LAVENDER' | 'TEXTURED_CANVAS' | 'JAIPUR_PINK_CITY' | 'MUGHAL_GARDEN' | 'FASHION_RUNWAY' | 'VARANASI_GHATS';
export type PartyBackgroundType = 'CLUB_LOUNGE' | 'ROOFTOP_PARTY' | 'PENTHOUSE_PARTY' | 'MINIMAL_PARTY' | 'URBAN_NIGHT_CITY';
export type FabricEmphasisType = 'TEXTURE_BOOST' | 'SPARKLE_HIGHLIGHT';
export type LightingStyle = 'SOFT_STUDIO' | 'HARSH_SUNLIGHT' | 'NEON_CYBERPUNK' | 'CINEMATIC_MOODY';
export type AspectRatio = '1:1' | '3:4' | '4:3' | '9:16' | '16:9';
export type ModelTier = 'FREE' | 'PRO';

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
  lightingStyle?: LightingStyle;
  aspectRatio?: AspectRatio;
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