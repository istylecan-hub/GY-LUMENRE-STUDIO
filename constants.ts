import { PoseConfig } from './types';

export const POSES: PoseConfig[] = [
  {
    id: 'front_view',
    label: 'Front View',
    promptDescription: 'Front View: Model facing camera directly, neutral confident pose, arms relaxed. Fashion catalog style. Full visibility of front clothing details.'
  },
  {
    id: 'left_angle',
    label: 'Left Side Angle',
    promptDescription: 'Left Side Angle: Body rotated 45 degrees left, face turned slightly towards camera. Natural standing posture.'
  },
  {
    id: 'right_angle',
    label: 'Right Side Angle',
    promptDescription: 'Right Side Angle: Body rotated 45 degrees right, face turned slightly towards camera. Natural standing posture.'
  },
  {
    id: 'back_view',
    label: 'Back View',
    promptDescription: 'Back View: Full back visibility. Clothing back details clearly visible. Head neutral.'
  },
  {
    id: 'full_body',
    label: 'Full Body View',
    promptDescription: 'Full Body View: Head to toe visible. Balanced stance. Fashion catalog posture.'
  },
  {
    id: 'pose_1',
    label: 'Pose Variation 1',
    promptDescription: 'Pose Variation 1: One hand on waist, slight hip shift. Professional fashion pose.'
  },
  {
    id: 'pose_2',
    label: 'Pose Variation 2',
    promptDescription: 'Pose Variation 2: Arms crossed or soft hand movement near chest. Editorial but realistic fashion pose.'
  }
];

export const SYSTEM_INSTRUCTION = `
You are a high-precision fashion photoshoot generation AI.
Your task is to generate professional photoshoot images from the uploaded reference image.

CRITICAL CONSTRAINTS (MUST FOLLOW STRICTLY):
1. The model’s FACE must remain 100% IDENTICAL to the reference image.
2. Facial structure, skin tone, eye shape, nose, lips, jawline, and expression style must NOT change.
3. Body type, height proportion, posture realism, and limb proportions must remain consistent.
4. Clothing must remain EXACTLY THE SAME: Same fabric, color, fit, texture, neckline, sleeves, length, and design details.
5. Do NOT modify clothing folds, branding, prints, or stitching patterns.
6. No beautification, no face swapping, no AI face reinterpretation.
7. Preserve real human anatomy and natural fashion modeling proportions.
8. Remove blur and noise while keeping identity intact.

BACKGROUND: Pure light grey professional e-commerce background with soft floor shadow.
LIGHTING: Softbox studio lighting, balanced highlights and shadows. No dramatic cinematic lighting.
QUALITY: Ultra-sharp, DSLR-quality, 8K resolution.
`;
