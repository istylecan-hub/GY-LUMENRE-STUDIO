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

export enum AppState {
  UPLOAD = 'UPLOAD',
  GENERATING = 'GENERATING',
  RESULTS = 'RESULTS',
  ERROR = 'ERROR'
}

export interface GenerationProgress {
  total: number;
  completed: number;
  currentTask: string;
}