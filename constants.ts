import { PoseConfig, ProductType, PoseStyle, BackgroundStyle, PartyBackgroundType, FabricEmphasisType } from './types';

export const SYSTEM_INSTRUCTION = `
You are a high-precision fashion photoshoot generation AI.
Your task is to generate professional photoshoot images from the provided reference images.
You are provided with one or more reference images of the same person and outfit. Use all provided references to achieve maximum precision in identity and clothing detail.

CRITICAL CONSTRAINTS (MUST FOLLOW STRICTLY):
1. The model’s FACE must remain 100% IDENTICAL to the reference images.
2. Facial structure, skin tone, eye shape, nose, lips, jawline, and expression style must NOT change.
3. Body type, height proportion, posture realism, and limb proportions must remain consistent.
4. Clothing must remain EXACTLY THE SAME: Same fabric, color, fit, texture, neckline, sleeves, length, and design details.
5. Do NOT modify clothing folds, branding, prints, or stitching patterns.
6. No beautification, no face swapping, no AI face reinterpretation.
7. Preserve real human anatomy and natural fashion modeling proportions.
8. Remove blur and noise while keeping identity intact.

QUALITY: Ultra-sharp, DSLR-quality, 8K resolution.
`;

export const BACKGROUND_STYLES: Record<BackgroundStyle, string> = {
  STUDIO_GREY: "BACKGROUND: Professional Studio Grey (#F0F0F0). Clean, neutral, soft floor shadows. Standard e-commerce look. LIGHTING: Softbox studio lighting.",
  STUDIO_WHITE: "BACKGROUND: Pure High-Key White (#FFFFFF). Infinite white background, no visible corners. Bright commercial lighting. LIGHTING: High-key studio lighting.",
  STUDIO_BEIGE: "BACKGROUND: Warm Minimalist Beige. Soft latte/cream tones (#F5F5DC). Organic, warm lighting, elegant vibe. LIGHTING: Warm softbox lighting.",
  STUDIO_COLORS: "BACKGROUND: Vibrant Color Studio. High-saturation solid color background (Electric Blue, Gen-Z Purple, or Bold Orange). Pop-art aesthetic. LIGHTING: Creative RGB gel lighting, strong contrast, high-energy fashion vibe.",
  STUDIO_VALENTINE: "BACKGROUND: Valentine's Studio. Soft romantic pink and rose tones (#FFC0CB to #FF69B4). Subtle hearts or floral hints in background bokeh. Dreamy, loving atmosphere. LIGHTING: Soft, flattering, warm pink/rose lighting. Seasonal campaign look.",
  OUTDOOR_NATURE: "BACKGROUND: Blurred Outdoor Nature. Park or garden environment with soft bokeh. Natural sunlight. LIGHTING: Natural daylight, golden hour.",
  URBAN_STREET: "BACKGROUND: City Street. Blurred urban texture, concrete/brick. Daylight city vibe. LIGHTING: Natural outdoor lighting, slight contrast.",
  LUXURY_INTERIOR: "BACKGROUND: Luxury Interior. High-end architectural space, soft warm indoor lighting, elegant furniture in background (blurred). LIGHTING: Ambient interior lighting.",
  URBAN_NIGHT: "BACKGROUND: Urban Night. City lights, bokeh, neon signs, wet asphalt. Cinematic night atmosphere. LIGHTING: Mixed street lighting and neon, moody contrast.",
  STREET_STYLE: "BACKGROUND: Trendy Street Fashion. Textured concrete walls, graffiti hints, or modern urban architecture. Blurred depth. LIGHTING: Natural daylight, cool shadows, fashion editorial look."
};

export const PARTY_BACKGROUNDS: Record<PartyBackgroundType, string> = {
  CLUB_LOUNGE: `PARTY BACKGROUND ADD-ON: Club Lounge (Indoor Party)
• Premium nightlife vibe
• Dim club lighting
• Soft neon accents
• Dark interiors
• Flash-lit subject
• Best for: Party tops, Bodycon dresses`,
  ROOFTOP_PARTY: `PARTY BACKGROUND ADD-ON: Rooftop Party Lights
• Night-time rooftop party environment
• Warm decorative lights visible
• City skyline in background
• Festive but clean atmosphere
• No people or props
• Subject illuminated by direct flash
• Background slightly darker than subject`,
  PENTHOUSE_PARTY: `PARTY BACKGROUND ADD-ON: House Party / Penthouse
• Luxury but natural
• Modern penthouse
• Warm ambient lights
• Casual party environment
• Best for: Premium SKUs, Lifestyle lookbooks`,
  MINIMAL_PARTY: `PARTY BACKGROUND ADD-ON: Minimal Party (Marketplace Safe)
• Dark neutral background
• Subtle bokeh party lights
• No identifiable venue
• No people or objects
• Clean, commercial-friendly look`,
  URBAN_NIGHT_CITY: `PARTY BACKGROUND ADD-ON: Urban Night City
• City lights, bokeh, neon signs
• Wet asphalt, cinematic night atmosphere
• Mixed street lighting and neon
• Moody contrast
• Best for: Streetwear, Edgy party looks`
};

export const FABRIC_EMPHASIS_STYLES: Record<FabricEmphasisType, string> = {
  TEXTURE_BOOST: `FABRIC ADD-ON: Texture Boost
• Enhance visibility of fabric weave, ribbing, knits, and surface details.
• Increase micro-contrast on the clothing surface.
• Do NOT alter the design.
• Best for: Knits, Ribbed textures, Linen.`,
  SPARKLE_HIGHLIGHT: `FABRIC ADD-ON: Sparkle Highlight (Flash Pop)
• Enhance specular highlights and shine on the fabric.
• Emphasize sequins, shimmer, or glossy materials.
• Simulate direct flash reflection.
• Best for: Satins, Sequins, Metallic fabrics.`
};

export const POSE_STYLES: Record<PoseStyle, string> = {
  COMMERCIAL: "MOOD: Commercial E-commerce. Expression: Pleasant, approachable, soft smile or neutral-positive. Body Language: Standard catalog poses, clear visibility of garment, upright posture.",
  EDITORIAL: "MOOD: High Fashion Editorial. Expression: Serious, confident, intense gaze, mouth slightly open or neutral. Body Language: Angular, dynamic, artistic, asymmetrical posing. Hands usage is more expressive.",
  CASUAL: "MOOD: Relaxed / Lifestyle. Expression: Natural, candid, soft, maybe looking away slightly. Body Language: Fluid, comfortable, 'caught in the moment', soft movement, less rigid than studio poses.",
  GLAMOROUS: "MOOD: High-End Glamour / Red Carpet. Expression: Captivating, confident, magnetic gaze, slight pout or radiant smile. Body Language: Statuesque, elegant curves, dramatic but sophisticated, hand on hip or near face, emphasizing luxury.",
  STREET_STYLE: "MOOD: Gen-Z Street Style. Expression: Confident, cool, nonchalant, maybe a slight smirk. Body Language: Casual, dynamic, urban-inspired movements, interaction with environment, relaxed but stylish.",
  URBAN_NIGHT: `STYLE ADD-ON: Urban Night Glam (Flash Editorial)

Apply a night-time urban photoshoot aesthetic.

Environment:
• Rooftop or balcony at night
• City skyline in background
• Distant building lights visible
• Dark surroundings

Lighting:
• Direct camera flash lighting
• Strong foreground illumination
• Natural flash reflections on fabric
• Mild background darkness
• No studio softbox lighting

Camera Style:
• Handheld fashion editorial
• Natural, slightly angled framing
• Sharp focus on subject
• No motion blur

Posing:
• Relaxed party-style poses
• Slight body lean
• Hand touching hair or strap
• Arm resting on railing
• Natural, confident posture

Accuracy Constraints (ABSOLUTE):
• Model face must remain identical to reference
• Body proportions unchanged
• Garment design, color, fabric, and fit must remain exactly the same
• No stylization, no beautification

Output Quality:
• High-resolution
• Photorealistic
• Commercial-grade
• No AI artifacts

This style must feel like a real night party photoshoot taken with flash. OVERRIDE any previous background instructions.`
};

export const PRODUCT_PRESETS: Record<ProductType, PoseConfig[]> = {
  TOPS: [
    {
      id: 'top_1',
      label: 'Full Body Reference',
      promptDescription: 'Full Body View: Head to toe visible. Neutral stance. Purpose: Overall proportion reference. Bottomwear must be visible but is secondary.'
    },
    {
      id: 'top_2',
      label: 'Waist-Up Portrait',
      promptDescription: 'Front Top-Focused View: CROP: Upper body only (Top of head to waist/hips). FOCUS: Neckline, shoulders, and front fit. Clear visibility of the top.'
    },
    {
      id: 'top_closeup',
      label: 'Front Close-up',
      promptDescription: 'Detailed Chest Shot: CROP: Chin to Chest/Torso. FOCUS: Neckline construction, collar details, button plackets, print clarity, and fabric texture near the face.'
    },
    {
      id: 'top_3',
      label: 'Left Angle 3/4',
      promptDescription: 'Left Angle Top-Focused: CROP: Upper body only. ROTATION: Body turned 45 degrees left. FOCUS: Sleeve detail and side fit.'
    },
    {
      id: 'top_4',
      label: 'Right Angle 3/4',
      promptDescription: 'Right Angle Top-Focused: CROP: Upper body only. ROTATION: Body turned 45 degrees right. FOCUS: Fabric fall and side silhouette.'
    },
    {
      id: 'top_side',
      label: 'Side Profile',
      promptDescription: 'Side Profile View: CROP: Upper body. ROTATION: Body turned 90 degrees sideways. FOCUS: Sleeve length, armhole fit, side seam details, and silhouette.'
    },
    {
      id: 'top_6',
      label: 'Back View',
      promptDescription: 'Back Top-Focused View: CROP: Upper body back. FOCUS: Upper back details, neck back, zipper, or seams.'
    },
    {
      id: 'top_action',
      label: 'Dynamic Action Pose',
      promptDescription: 'Dynamic Movement Shot: ACTION: Model walking, turning, or moving arms naturally. CROP: Waist up or 3/4 body. FOCUS: Fabric movement, drape, creases in motion, and natural fit.'
    }
  ],
  DRESSES: [
    {
      id: 'dress_1',
      label: 'Full Body Front',
      promptDescription: 'Full Body View: Head to toe visible. Straight confident posture. FOCUS: Full length of the dress, hemline, and silhouette.'
    },
    {
      id: 'dress_mid_1',
      label: 'Mid-Shot Portrait',
      promptDescription: 'Mid-Shot View: Waist-up crop. FOCUS: Bodice fit, neckline, and sleeves. Model looking at camera.'
    },
    {
      id: 'dress_2',
      label: 'Full Body Left',
      promptDescription: 'Full Body Left Angle: Body rotated 45 degrees left. Head to toe visible. FOCUS: Flow of the dress from the side.'
    },
    {
      id: 'dress_3',
      label: 'Full Body Right',
      promptDescription: 'Full Body Right Angle: Body rotated 45 degrees right. Head to toe visible.'
    },
    {
      id: 'dress_4',
      label: 'Full Body Back',
      promptDescription: 'Full Body Back View: Model turned away. Head to toe visible. FOCUS: Back design, zip, tie, or cut details.'
    },
    {
      id: 'dress_macro_1',
      label: 'Texture Extreme Macro',
      promptDescription: 'Extreme Macro Close-Up: Focused on a specific detail (button, stitching, or pattern). Abstract composition.'
    },
    {
      id: 'dress_6',
      label: 'Editorial Pose',
      promptDescription: 'Full Body Editorial Pose: Weight shift, crossed legs, or hand on hip. Stylish fashion posture.'
    }
  ],
  COORDS: [
    {
      id: 'coord_1',
      label: 'Full Body Front',
      promptDescription: 'Full Body Front View: Head to toe. Showing both top and bottom pieces clearly together.'
    },
    {
      id: 'coord_2',
      label: 'Full Body Left',
      promptDescription: 'Full Body Left Angle: 45 degree turn. Showing the side profile of the matching set.'
    },
    {
      id: 'coord_3',
      label: 'Full Body Right',
      promptDescription: 'Full Body Right Angle: 45 degree turn. Showing the side profile.'
    },
    {
      id: 'coord_4',
      label: 'Mid-Shot (Top Focus)',
      promptDescription: 'Upper Body Close-Up: Focus specifically on the top piece of the set. CROP: Waist up.'
    },
    {
      id: 'coord_5',
      label: 'Mid-Shot (Bottom Focus)',
      promptDescription: 'Lower Body Focus: Focus specifically on the bottom piece (trousers/skirt). CROP: Waist down to knees/feet.'
    },
    {
      id: 'coord_macro_1',
      label: 'Texture Extreme Macro',
      promptDescription: 'Extreme Macro Close-Up: Focused on fabric texture or intersection of top and bottom.'
    },
    {
      id: 'coord_6',
      label: 'Full Body Back',
      promptDescription: 'Full Body Back View: Showing the rear view of the entire set.'
    }
  ],
  KURTI: [
    {
      id: 'kurti_1',
      label: 'Full Body Front',
      promptDescription: 'Full Body Front View: Traditional/Fusion wear stance. Head to toe. Showing full length of Kurti and bottom wear.'
    },
    {
      id: 'kurti_mid_1',
      label: 'Mid-Shot Portrait',
      promptDescription: 'Mid-Shot View: Waist-up crop. FOCUS: Yoke work, neckline, and jewelry styling.'
    },
    {
      id: 'kurti_2',
      label: 'Full Body Side',
      promptDescription: 'Full Body Side Profile: Showing the side slit or cut of the Kurti.'
    },
    {
      id: 'kurti_3',
      label: 'Full Body Back',
      promptDescription: 'Full Body Back View: Showing the back design.'
    },
    {
      id: 'kurti_5',
      label: 'Yoke Detail Close-Up',
      promptDescription: 'Close-Up Detail: CROP: Chest/Neck area. FOCUS: Embroidery, buttons, or yoke design details.'
    },
    {
      id: 'kurti_6',
      label: 'Sleeve Detail',
      promptDescription: 'Close-Up Sleeve Focus: CROP: Focused on one arm/side. FOCUS: Sleeve border or pattern.'
    },
    {
      id: 'kurti_7',
      label: 'Graceful Pose',
      promptDescription: 'Full Body Graceful Pose: Elegant standing posture suitable for ethnic wear.'
    }
  ]
};