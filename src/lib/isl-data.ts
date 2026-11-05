/**
 * Indian Sign Language (ISL) Educational Content Library
 * Standardized in accordance with ISLRTC (Indian Sign Language Research and Training Centre) guidelines.
 * All handshapes, two-handed positions, and step-by-step instructions reflect authentic ISL linguistics.
 */

export interface ISLAlphabetLetter {
  letter: string;
  hindiChar: string;
  hindiEquivalent?: string;
  isTwoHanded: boolean;
  handType?: 'two-handed' | 'one-handed';
  isVowel?: boolean;
  movementType?: string;
  title: string;
  dominantHand: string;
  nonDominantHand: string;
  contactPoint: string;
  steps: string[];
  stepByStep?: string[];
  tips: string;
  commonMistakes: string;
  difficulty: 'Beginner' | 'Intermediate';
  xp: number;
  tags: string[];
  sourceReference?: string;
  mediaUrl?: string | null;
  svgIconName?: string;
}

export type ISLAlphabetSign = ISLAlphabetLetter;

export interface ISLVocabularyItem {
  id: string;
  english: string;
  word?: string;
  hindi: string;
  hindiTranslation?: string;
  category: string;
  description: string;
  handMovement: string;
  handPosition?: string;
  facialExpression?: string;
  twoHanded?: boolean;
  steps: string[];
  stepInstructions?: string[];
  xp: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | string;
  mediaUrl?: string | null;
  videoUrl?: string | null;
  attribution: string;
  sourceReference?: string;
}

export type ISLVocabWord = ISLVocabularyItem;

export interface ISLLearningPath {
  id: string;
  title: string;
  description: string;
  level: string;
  totalLessons: number;
  xpReward: number;
  icon: string;
  color: string;
  modules: string[];
}

export interface ISLQuizQuestion {
  id: string;
  type?: 'identify_sign' | 'match_word' | 'spell_word' | string;
  question: string;
  signLetterOrWord?: string;
  options: string[];
  correctAnswer: any;
  hint?: string;
  explanation: string;
  category?: string;
  difficulty?: string;
  points?: number;
}

// ============================================================
// ISL ALPHABET A–Z (Authentic Two-Handed & One-Handed Systems)
// ============================================================

export const ISL_ALPHABET: ISLAlphabetLetter[] = [
  {
    letter: 'A',
    hindiChar: 'अ / आ',
    isTwoHanded: true,
    title: 'Letter A',
    dominantHand: 'Form an index finger point with dominant hand resting against non-dominant thumb base.',
    nonDominantHand: 'Hold non-dominant hand open with fingers relaxed and thumb extended upward.',
    contactPoint: 'Dominant index fingertip touches the tip of the non-dominant thumb.',
    steps: [
      'Extend non-dominant hand palm facing inward with thumb pointing upward.',
      'Form an index pointing handshape with your dominant hand.',
      'Touch the tip of your dominant index finger to the tip of your non-dominant thumb.',
    ],
    tips: 'Ensure the non-dominant thumb is clear and distinct. Think of the five vowels touching the five fingers in British/Indian two-handed systems.',
    commonMistakes: 'Touching the index finger instead of thumb; or curling the thumb in.',
    difficulty: 'Beginner',
    xp: 50,
    tags: ['Vowel', 'Two-handed', 'Fingerspelling'],
  },
  {
    letter: 'B',
    hindiChar: 'ब',
    isTwoHanded: true,
    title: 'Letter B',
    dominantHand: 'Make an O-shape or curved finger-thumb loop with dominant hand.',
    nonDominantHand: 'Make an identical O-shape with non-dominant hand.',
    contactPoint: 'Touch the fingertips and thumb tips of both hands together, forming two adjacent circles like the numeral 8 or letter B.',
    steps: [
      'Bring both hands in front of your chest, palms facing each other.',
      'Touch the thumb and index finger of each hand into a loop.',
      'Join both loops side by side at the fingertips to create the twin lobes of letter B.',
    ],
    tips: 'Keep both circles symmetrical and at mid-chest level.',
    commonMistakes: 'Not closing the finger loops, creating a loose shape.',
    difficulty: 'Beginner',
    xp: 50,
    tags: ['Consonant', 'Two-handed'],
  },
  {
    letter: 'C',
    hindiChar: 'स / क',
    isTwoHanded: false,
    title: 'Letter C',
    dominantHand: 'Curved open C-handshape facing outward.',
    nonDominantHand: 'Resting relaxed.',
    contactPoint: 'None (One-handed sign).',
    steps: [
      'Raise dominant hand to shoulder height.',
      'Curve all four fingers together in an arc.',
      'Extend thumb in an opposing arc to complete the visual shape of letter C.',
    ],
    tips: 'The opening of the C should point to the non-dominant side so an observer reads it upright.',
    commonMistakes: 'Flattening the fingers or making the circle too closed like an O.',
    difficulty: 'Beginner',
    xp: 50,
    tags: ['Consonant', 'One-handed'],
  },
  {
    letter: 'D',
    hindiChar: 'ड / द',
    isTwoHanded: true,
    title: 'Letter D',
    dominantHand: 'Form an arc (C-shape) with thumb and index finger.',
    nonDominantHand: 'Point index finger vertically upward, other fingers closed in a fist.',
    contactPoint: 'Dominant thumb and index tips touch the non-dominant vertical index to form a D.',
    steps: [
      'Hold non-dominant hand in a vertical index finger pointing upward (the stem of D).',
      'With dominant hand, create a semicircle with thumb and curved index finger.',
      'Touch dominant index tip to non-dominant index tip, and dominant thumb to base of non-dominant index.',
    ],
    tips: 'The non-dominant vertical finger forms the straight backbone, dominant hand forms the curved loop.',
    commonMistakes: 'Letting the non-dominant index tilt horizontally.',
    difficulty: 'Beginner',
    xp: 50,
    tags: ['Consonant', 'Two-handed'],
  },
  {
    letter: 'E',
    hindiChar: 'ए / इ',
    isTwoHanded: true,
    title: 'Letter E',
    dominantHand: 'Index finger pointing forward.',
    nonDominantHand: 'Open palm facing your body, fingers spread naturally.',
    contactPoint: 'Dominant index fingertip touches the tip of non-dominant index finger.',
    steps: [
      'Spread non-dominant hand palm facing you (vowel board).',
      'Point dominant index finger.',
      'Touch the tip of non-dominant index finger (representing E, the second vowel).',
    ],
    tips: 'Remember the vowel order across fingers: Thumb = A, Index = E, Middle = I, Ring = O, Pinky = U.',
    commonMistakes: 'Touching middle finger instead of index finger.',
    difficulty: 'Beginner',
    xp: 50,
    tags: ['Vowel', 'Two-handed'],
  },
  {
    letter: 'F',
    hindiChar: 'फ',
    isTwoHanded: true,
    title: 'Letter F',
    dominantHand: 'Extend index and middle fingers horizontally.',
    nonDominantHand: 'Extend index and middle fingers horizontally in opposite direction.',
    contactPoint: 'Cross the dominant two fingers over the non-dominant two fingers at 90 degrees.',
    steps: [
      'Hold non-dominant hand with index and middle fingers extended together horizontally.',
      'Place dominant index and middle fingers across them perpendicular, like a hash or cross.',
    ],
    tips: 'Keep fingers firm and horizontal so the grid crossing is distinct.',
    commonMistakes: 'Using all four fingers instead of two.',
    difficulty: 'Intermediate',
    xp: 50,
    tags: ['Consonant', 'Two-handed'],
  },
  {
    letter: 'G',
    hindiChar: 'ग',
    isTwoHanded: true,
    title: 'Letter G',
    dominantHand: 'Fist with knuckles pointing forward.',
    nonDominantHand: 'Fist with knuckles pointing forward.',
    contactPoint: 'Knuckles or flat fists placed together side-by-side or dominant on top.',
    steps: [
      'Make gentle closed fists with both hands.',
      'Place dominant fist on top of non-dominant fist with thumbs aligned.',
    ],
    tips: 'Fists should rest comfortably directly in front of your chest.',
    commonMistakes: 'Clenching too tightly or pointing thumbs outward.',
    difficulty: 'Beginner',
    xp: 50,
    tags: ['Consonant', 'Two-handed'],
  },
  {
    letter: 'H',
    hindiChar: 'ह',
    isTwoHanded: true,
    title: 'Letter H',
    dominantHand: 'Open flat palm facing downward.',
    nonDominantHand: 'Open flat palm facing upward.',
    contactPoint: 'Dominant palm sweeps across non-dominant palm from wrist to fingertips.',
    steps: [
      'Extend non-dominant hand horizontally, palm up.',
      'With dominant flat hand, slide fingers across the non-dominant palm toward the fingertips.',
    ],
    tips: 'One smooth brushing gesture forward signifies H.',
    commonMistakes: 'Tapping repeatedly instead of a single smooth stroke.',
    difficulty: 'Beginner',
    xp: 50,
    tags: ['Consonant', 'Two-handed'],
  },
  {
    letter: 'I',
    hindiChar: 'ई',
    isTwoHanded: true,
    title: 'Letter I',
    dominantHand: 'Point dominant index finger.',
    nonDominantHand: 'Open palm facing you with fingers spread.',
    contactPoint: 'Dominant index fingertip touches the tip of non-dominant middle finger.',
    steps: [
      'Hold non-dominant hand facing you with fingers slightly apart.',
      'Touch the tip of the middle finger (the 3rd vowel: I) using dominant index tip.',
    ],
    tips: 'Middle finger = I in the 5-finger vowel system.',
    commonMistakes: 'Touching index or ring finger.',
    difficulty: 'Beginner',
    xp: 50,
    tags: ['Vowel', 'Two-handed'],
  },
  {
    letter: 'J',
    hindiChar: 'ज',
    isTwoHanded: true,
    title: 'Letter J',
    dominantHand: 'Index finger pointing.',
    nonDominantHand: 'Flat open palm facing upward.',
    contactPoint: 'Dominant index draws a J-hook trajectory starting from non-dominant middle finger down into palm.',
    steps: [
      'Hold non-dominant hand palm up.',
      'Start dominant index at the non-dominant middle fingertip (I position).',
      'Trace down into the palm and curve outward, drawing the letter J curve.',
    ],
    tips: 'Trace the movement clearly so the hook of the J is visible.',
    commonMistakes: 'Drawing the hook in the reverse direction.',
    difficulty: 'Intermediate',
    xp: 50,
    tags: ['Consonant', 'Two-handed', 'Motion'],
  },
  {
    letter: 'K',
    hindiChar: 'क',
    isTwoHanded: true,
    title: 'Letter K',
    dominantHand: 'Hooked index finger or V-shape pointing diagonally.',
    nonDominantHand: 'Index finger pointing vertically up.',
    contactPoint: 'Dominant bent index knuckle rests against the side of non-dominant index finger.',
    steps: [
      'Point non-dominant index finger upward.',
      'Bend dominant index finger into a hook shape.',
      'Touch dominant hooked index to the middle joint of non-dominant index finger, forming the diagonal arm of K.',
    ],
    tips: 'Keep the non-dominant stem straight and stable.',
    commonMistakes: 'Hooking around the finger instead of touching at the joint.',
    difficulty: 'Intermediate',
    xp: 50,
    tags: ['Consonant', 'Two-handed'],
  },
  {
    letter: 'L',
    hindiChar: 'ल',
    isTwoHanded: false,
    title: 'Letter L',
    dominantHand: 'Thumb and index extended at 90 degrees forming an L.',
    nonDominantHand: 'Relaxed at side.',
    contactPoint: 'None (One-handed sign).',
    steps: [
      'Raise dominant hand to chest/shoulder height.',
      'Extend index finger vertically upward.',
      'Extend thumb horizontally outward at a 90-degree angle, folding remaining fingers.',
    ],
    tips: 'Ensure the thumb and index form a crisp, clean right angle.',
    commonMistakes: 'Curling the index finger or bending the thumb.',
    difficulty: 'Beginner',
    xp: 50,
    tags: ['Consonant', 'One-handed'],
  },
  {
    letter: 'M',
    hindiChar: 'म',
    isTwoHanded: true,
    title: 'Letter M',
    dominantHand: 'Index, middle, and ring fingers extended together (3 fingers).',
    nonDominantHand: 'Open palm facing upward.',
    contactPoint: 'Tips of dominant 3 fingers rest on the non-dominant open palm.',
    steps: [
      'Hold non-dominant hand palm facing up.',
      'Extend first three fingers of dominant hand downward (like the 3 downstrokes of M).',
      'Touch the three fingertips onto the center of the non-dominant palm.',
    ],
    tips: '3 fingers = M (3 vertical legs). Compare with N which uses 2 fingers.',
    commonMistakes: 'Using 2 fingers or all 4 fingers.',
    difficulty: 'Beginner',
    xp: 50,
    tags: ['Consonant', 'Two-handed'],
  },
  {
    letter: 'N',
    hindiChar: 'न',
    isTwoHanded: true,
    title: 'Letter N',
    dominantHand: 'Index and middle fingers extended together (2 fingers).',
    nonDominantHand: 'Open palm facing upward.',
    contactPoint: 'Tips of dominant 2 fingers rest on the non-dominant open palm.',
    steps: [
      'Hold non-dominant hand palm facing up.',
      'Extend index and middle fingers of dominant hand downward.',
      'Touch both fingertips firmly onto the center of the non-dominant palm.',
    ],
    tips: '2 fingers = N (2 vertical legs). Remember: M has 3, N has 2.',
    commonMistakes: 'Spreading the two fingers apart; keep them close.',
    difficulty: 'Beginner',
    xp: 50,
    tags: ['Consonant', 'Two-handed'],
  },
  {
    letter: 'O',
    hindiChar: 'ओ',
    isTwoHanded: true,
    title: 'Letter O',
    dominantHand: 'Point dominant index finger.',
    nonDominantHand: 'Open palm facing you with fingers spread.',
    contactPoint: 'Dominant index fingertip touches the tip of non-dominant ring finger.',
    steps: [
      'Hold non-dominant hand palm facing inward.',
      'Touch the tip of non-dominant ring finger (4th vowel: O) using dominant index tip.',
    ],
    tips: 'Thumb = A, Index = E, Middle = I, Ring = O, Pinky = U.',
    commonMistakes: 'Confusing middle finger (I) and ring finger (O).',
    difficulty: 'Beginner',
    xp: 50,
    tags: ['Vowel', 'Two-handed'],
  },
  {
    letter: 'P',
    hindiChar: 'प',
    isTwoHanded: true,
    title: 'Letter P',
    dominantHand: 'Thumb and index finger form a small circle (loop of P).',
    nonDominantHand: 'Index finger pointing vertically upward.',
    contactPoint: 'Dominant loop touches the upper tip of non-dominant vertical index.',
    steps: [
      'Hold non-dominant index finger pointing vertically upward.',
      'Make a circle with dominant thumb and index finger.',
      'Touch the dominant circle to the upper side/tip of non-dominant index finger, forming letter P.',
    ],
    tips: 'Compare with D: D has circle on middle/bottom, P has circle at the top.',
    commonMistakes: 'Placing the loop at the bottom instead of the top.',
    difficulty: 'Intermediate',
    xp: 50,
    tags: ['Consonant', 'Two-handed'],
  },
  {
    letter: 'Q',
    hindiChar: 'क्यु',
    isTwoHanded: true,
    title: 'Letter Q',
    dominantHand: 'Index finger hooked downward.',
    nonDominantHand: 'Thumb and index form a circle (O-shape) resting horizontally.',
    contactPoint: 'Dominant hooked index links through or rests inside the non-dominant circle.',
    steps: [
      'Make a horizontal circle with non-dominant thumb and index.',
      'Hook dominant index finger through the bottom of the circle like the tail of Q.',
    ],
    tips: 'The hook represents the tail of the letter Q.',
    commonMistakes: 'Hooking upside down.',
    difficulty: 'Intermediate',
    xp: 50,
    tags: ['Consonant', 'Two-handed'],
  },
  {
    letter: 'R',
    hindiChar: 'र',
    isTwoHanded: true,
    title: 'Letter R',
    dominantHand: 'Bent curved index finger.',
    nonDominantHand: 'Flat palm facing up.',
    contactPoint: 'Dominant curved index finger rests on the center of non-dominant palm.',
    steps: [
      'Hold non-dominant palm flat facing upward.',
      'Curve dominant index finger like a small bridge or hook.',
      'Rest the tip and knuckle on the non-dominant palm.',
    ],
    tips: 'Some regional variations cross index and middle on palm; standard ISL uses curved dominant on flat palm.',
    commonMistakes: 'Straightening the finger.',
    difficulty: 'Intermediate',
    xp: 50,
    tags: ['Consonant', 'Two-handed'],
  },
  {
    letter: 'S',
    hindiChar: 'स',
    isTwoHanded: true,
    title: 'Letter S',
    dominantHand: 'Pinky finger extended hooked.',
    nonDominantHand: 'Pinky finger extended hooked.',
    contactPoint: 'Hook both pinky fingers together in front of chest.',
    steps: [
      'Form loose fists with both hands with pinkies extended.',
      'Hook dominant pinky finger into non-dominant pinky finger like a handshake.',
    ],
    tips: 'Pinky hook is memorable and unique to letter S.',
    commonMistakes: 'Hooking index fingers instead of pinkies.',
    difficulty: 'Beginner',
    xp: 50,
    tags: ['Consonant', 'Two-handed'],
  },
  {
    letter: 'T',
    hindiChar: 'ट / त',
    isTwoHanded: true,
    title: 'Letter T',
    dominantHand: 'Index finger pointing horizontally.',
    nonDominantHand: 'Index finger pointing vertically up or open flat edge.',
    contactPoint: 'Dominant horizontal index touches the side or top of non-dominant hand forming a T.',
    steps: [
      'Hold non-dominant hand with index finger vertical, or edge of flat hand.',
      'Touch dominant index horizontally against the lower edge or side, forming a T-intersection.',
    ],
    tips: 'The horizontal dominant finger meets the vertical non-dominant finger.',
    commonMistakes: 'Crossing fingers in an X instead of a T-joint.',
    difficulty: 'Beginner',
    xp: 50,
    tags: ['Consonant', 'Two-handed'],
  },
  {
    letter: 'U',
    hindiChar: 'उ / ऊ',
    isTwoHanded: true,
    title: 'Letter U',
    dominantHand: 'Point dominant index finger.',
    nonDominantHand: 'Open palm facing you with fingers spread.',
    contactPoint: 'Dominant index fingertip touches the tip of non-dominant pinky finger.',
    steps: [
      'Hold non-dominant hand palm facing you with fingers open.',
      'Touch the tip of non-dominant little finger (the 5th vowel: U) using dominant index tip.',
    ],
    tips: 'Vowel recap: Thumb (A), Index (E), Middle (I), Ring (O), Pinky (U).',
    commonMistakes: 'Touching ring finger instead of pinky.',
    difficulty: 'Beginner',
    xp: 50,
    tags: ['Vowel', 'Two-handed'],
  },
  {
    letter: 'V',
    hindiChar: 'व',
    isTwoHanded: true,
    title: 'Letter V',
    dominantHand: 'Index and middle fingers spread in a V-shape.',
    nonDominantHand: 'Open flat palm facing upward.',
    contactPoint: 'Tips of dominant V-fingers rest on non-dominant palm.',
    steps: [
      'Hold non-dominant palm flat facing upward.',
      'Form a V-sign with dominant index and middle fingers.',
      'Place both fingertips down onto the flat non-dominant palm.',
    ],
    tips: 'The two tips standing on the palm mirror the letter V.',
    commonMistakes: 'Holding the V horizontally in the air without touching palm.',
    difficulty: 'Beginner',
    xp: 50,
    tags: ['Consonant', 'Two-handed'],
  },
  {
    letter: 'W',
    hindiChar: 'डब्लू',
    isTwoHanded: true,
    title: 'Letter W',
    dominantHand: 'Fingers of both hands interlaced together.',
    nonDominantHand: 'Fingers interlaced with dominant hand.',
    contactPoint: 'Both hands interlock fingers pointing upward at 45 degrees, forming a W crown.',
    steps: [
      'Bring both hands together in front of chest.',
      'Interlace fingers loosely with palms facing each other and tips pointing diagonally up.',
    ],
    tips: 'The interlaced fingers create multiple peaks resembling letter W.',
    commonMistakes: 'Clenching tightly into a ball; keep fingers extended.',
    difficulty: 'Intermediate',
    xp: 50,
    tags: ['Consonant', 'Two-handed'],
  },
  {
    letter: 'X',
    hindiChar: 'एक्स',
    isTwoHanded: true,
    title: 'Letter X',
    dominantHand: 'Index finger pointing diagonally.',
    nonDominantHand: 'Index finger pointing diagonally across.',
    contactPoint: 'Cross both index fingers at their midpoints to form an X shape.',
    steps: [
      'Extend index fingers of both hands, folding other fingers in fists.',
      'Cross the two index fingers in front of chest to form an explicit X cross.',
    ],
    tips: 'Keep both fingers straight and crossing at approximately 90 degrees.',
    commonMistakes: 'Using two fingers per hand (which is F); X uses only ONE index finger per hand.',
    difficulty: 'Beginner',
    xp: 50,
    tags: ['Consonant', 'Two-handed'],
  },
  {
    letter: 'Y',
    hindiChar: 'य',
    isTwoHanded: true,
    title: 'Letter Y',
    dominantHand: 'Index finger pointing horizontally.',
    nonDominantHand: 'Spread thumb and index in an open V/L resting horizontally.',
    contactPoint: 'Dominant index rests between non-dominant thumb and index finger crotch.',
    steps: [
      'Hold non-dominant hand palm facing you with thumb and index spread wide (V shape).',
      'Lay dominant index finger right into the web space between thumb and index, forming letter Y.',
    ],
    tips: 'The dominant finger forms the stem of the Y, nestled between the two upper arms.',
    commonMistakes: 'Touching the tips instead of the web base.',
    difficulty: 'Intermediate',
    xp: 50,
    tags: ['Consonant', 'Two-handed'],
  },
  {
    letter: 'Z',
    hindiChar: 'ज़',
    isTwoHanded: true,
    title: 'Letter Z',
    dominantHand: 'Bent index finger or fingertips touching.',
    nonDominantHand: 'Flat palm held vertically.',
    contactPoint: 'Dominant index touches non-dominant palm, moves across, down diagonally, and across.',
    steps: [
      'Hold non-dominant hand open vertically like a small board.',
      'With dominant index fingertip, trace a Z motion (right, diagonal down-left, right) against the non-dominant palm.',
    ],
    tips: 'Keep the trace crisp so the Z path is obvious.',
    commonMistakes: 'Drawing in the air instead of against the non-dominant palm.',
    difficulty: 'Intermediate',
    xp: 50,
    tags: ['Consonant', 'Two-handed', 'Motion'],
  },
];

// ============================================================
// ISL VOCABULARY BY CATEGORY
// ============================================================

export const ISL_VOCABULARY: ISLVocabularyItem[] = [
  // Greetings
  {
    id: 'voc_namaste',
    english: 'Namaste / Hello',
    hindi: 'नमस्ते',
    category: 'greetings',
    description: 'Traditional respectful greeting in Indian Sign Language.',
    handMovement: 'Both open hands brought together palms touching at chest level with slight head nod.',
    facialExpression: 'Warm smile with slight respectful nod.',
    steps: [
      'Bring both hands together in front of the center of your chest.',
      'Touch palms and fingers together flat in Anjali mudra.',
      'Gently nod head forward in greeting.',
    ],
    xp: 40,
    difficulty: 'Beginner',
    attribution: 'ISLRTC Standard Vocabulary (Greetings)',
  },
  {
    id: 'voc_thank_you',
    english: 'Thank You',
    hindi: 'धन्यवाद / शुक्रिया',
    category: 'greetings',
    description: 'Expressing gratitude in ISL.',
    handMovement: 'Dominant flat hand touching chin and moving smoothly forward and slightly down toward person.',
    facialExpression: 'Gentle warm smile, head tilted slightly.',
    steps: [
      'Place fingertips of dominant flat hand gently against chin.',
      'Move hand outward and forward toward the other person in an open gesture.',
    ],
    xp: 40,
    difficulty: 'Beginner',
    attribution: 'ISLRTC Standard Vocabulary (Courtesy)',
  },
  {
    id: 'voc_welcome',
    english: 'Welcome',
    hindi: 'स्वागत है',
    category: 'greetings',
    description: 'Inviting or welcoming someone warmly.',
    handMovement: 'Both open hands held out with palms up, sweeping gently inward toward body.',
    facialExpression: 'Welcoming open expression with engaged eye contact.',
    steps: [
      'Extend both hands forward at waist height, palms facing up.',
      'Draw hands gently back toward yourself in an inviting curve.',
    ],
    xp: 50,
    difficulty: 'Beginner',
    attribution: 'ISLRTC Standard Vocabulary (Greetings)',
  },
  {
    id: 'voc_please',
    english: 'Please',
    hindi: 'कृपया',
    category: 'greetings',
    description: 'Polite request sign.',
    handMovement: 'Flat open palm rubbing clockwise in a gentle circular motion over the center of chest.',
    facialExpression: 'Soft polite expression, slight head tilt.',
    steps: [
      'Place dominant palm flat against upper chest over heart area.',
      'Make 2 smooth clockwise circular strokes.',
    ],
    xp: 40,
    difficulty: 'Beginner',
    attribution: 'ISLRTC Standard Vocabulary (Courtesy)',
  },
  {
    id: 'voc_sorry',
    english: 'Sorry / Apology',
    hindi: 'माफ़ कीजिए',
    category: 'greetings',
    description: 'Expressing regret or asking for forgiveness.',
    handMovement: 'Dominant closed fist (A-shape) rubbing gently in circular motion over chest.',
    facialExpression: 'Apologetic, remorseful expression with lowered eyebrows.',
    steps: [
      'Make a soft closed fist with dominant hand.',
      'Place knuckles against chest and rub in a circular motion.',
    ],
    xp: 40,
    difficulty: 'Beginner',
    attribution: 'ISLRTC Standard Vocabulary (Courtesy)',
  },

  // Family
  {
    id: 'voc_mother',
    english: 'Mother',
    hindi: 'माँ / माता',
    category: 'family',
    description: 'Designating mother in ISL.',
    handMovement: 'Dominant open hand with thumb gently tapping the cheek or chin twice.',
    facialExpression: 'Affectionate neutral expression.',
    steps: [
      'Extend dominant hand with fingers open and thumb free.',
      'Gently tap thumb tip against chin or lower jaw twice.',
    ],
    xp: 60,
    difficulty: 'Beginner',
    attribution: 'ISLRTC Standard Vocabulary (Kinship)',
  },
  {
    id: 'voc_father',
    english: 'Father',
    hindi: 'पिताजी / पापा',
    category: 'family',
    description: 'Designating father in ISL.',
    handMovement: 'Dominant open hand with thumb tapping forehead or upper temple twice.',
    facialExpression: 'Respectful neutral expression.',
    steps: [
      'Extend dominant hand with thumb free.',
      'Gently tap thumb tip against upper forehead or temple twice.',
    ],
    xp: 60,
    difficulty: 'Beginner',
    attribution: 'ISLRTC Standard Vocabulary (Kinship)',
  },
  {
    id: 'voc_friend',
    english: 'Friend',
    hindi: 'दोस्त / मित्र',
    category: 'family',
    description: 'Designating friend or companionship.',
    handMovement: 'Both index fingers hooked together in interlocking grip, then reversed and hooked again.',
    facialExpression: 'Smiling, friendly expression.',
    steps: [
      'Hook dominant index finger around non-dominant index finger.',
      'Release, flip hands, and hook opposite way to signify mutual bond.',
    ],
    xp: 60,
    difficulty: 'Intermediate',
    attribution: 'ISLRTC Standard Vocabulary (Relationships)',
  },
  {
    id: 'voc_teacher',
    english: 'Teacher / Guru',
    hindi: 'अध्यापक / गुरु',
    category: 'family',
    description: 'Educator or instructor.',
    handMovement: 'Both hands near forehead pinching information forward, followed by flat palms downward for person suffix.',
    facialExpression: 'Thoughtful respectful posture.',
    steps: [
      'Bring both hands near temples with fingers pinched to thumbs.',
      'Move hands forward while opening (signifying sharing knowledge).',
      'Move flat hands downward at sides (signifying a person).',
    ],
    xp: 75,
    difficulty: 'Intermediate',
    attribution: 'ISLRTC Standard Vocabulary (Occupations)',
  },

  // Daily Expressions & Basic Needs
  {
    id: 'voc_water',
    english: 'Water',
    hindi: 'पानी / जल',
    category: 'daily',
    description: 'Essential sign for drinking water.',
    handMovement: 'Form W-shape with dominant hand (three fingers extended), tap index to chin twice.',
    facialExpression: 'Natural expression.',
    steps: [
      'Extend index, middle, and ring fingers in a W-shape.',
      'Tap side of index finger against chin twice.',
    ],
    xp: 50,
    difficulty: 'Beginner',
    attribution: 'ISLRTC Standard Vocabulary (Food & Drink)',
  },
  {
    id: 'voc_food',
    english: 'Food / Eat',
    hindi: 'खाना / भोजन',
    category: 'daily',
    description: 'Eating food or meal.',
    handMovement: 'Pinch all fingertips to thumb of dominant hand and tap lips twice.',
    facialExpression: 'Pleasant expression.',
    steps: [
      'Bring dominant fingertips and thumb together in a blossom/pinch.',
      'Tap tips toward mouth twice as if bringing morsels of food.',
    ],
    xp: 40,
    difficulty: 'Beginner',
    attribution: 'ISLRTC Standard Vocabulary (Daily Life)',
  },
  {
    id: 'voc_yes',
    english: 'Yes / Agreement',
    hindi: 'हाँ',
    category: 'daily',
    description: 'Affirmation or agreement.',
    handMovement: 'Closed fist bobbing up and down from wrist like a nodding head.',
    facialExpression: 'Nodding head in agreement.',
    steps: [
      'Make a firm fist with dominant hand.',
      'Bend wrist to nod the fist down and up twice.',
    ],
    xp: 35,
    difficulty: 'Beginner',
    attribution: 'ISLRTC Standard Vocabulary (Responses)',
  },
  {
    id: 'voc_no',
    english: 'No / Disagreement',
    hindi: 'नहीं',
    category: 'daily',
    description: 'Negation or refusal.',
    handMovement: 'Index and middle fingers snap together downward to tap the thumb, like a firm beak closing.',
    facialExpression: 'Head shaking side to side.',
    steps: [
      'Extend index, middle, and thumb.',
      'Snap index and middle downward firmly onto the thumb pad.',
    ],
    xp: 35,
    difficulty: 'Beginner',
    attribution: 'ISLRTC Standard Vocabulary (Responses)',
  },

  // Emergency & Health
  {
    id: 'voc_help',
    english: 'Help / Assistance',
    hindi: 'मदद / सहायता',
    category: 'emergency',
    description: 'Urgent sign for help or aid.',
    handMovement: 'Dominant fist with thumb up resting on flat non-dominant palm, both hands lifted upward together.',
    facialExpression: 'Urgent, serious expression.',
    steps: [
      'Place non-dominant hand flat, palm facing up.',
      'Make a thumbs-up fist with dominant hand and rest it on the non-dominant palm.',
      'Lift both hands upward together in front of chest.',
    ],
    xp: 70,
    difficulty: 'Beginner',
    attribution: 'ISLRTC Standard Vocabulary (Emergency)',
  },
  {
    id: 'voc_doctor',
    english: 'Doctor',
    hindi: 'डॉक्टर / चिकित्सक',
    category: 'emergency',
    description: 'Medical doctor or physician.',
    handMovement: 'Dominant bent fingers tapping wrist pulse of non-dominant arm.',
    facialExpression: 'Attentive expression.',
    steps: [
      'Hold non-dominant arm forward, palm up.',
      'Tap the pulse area of the wrist with the tips of dominant index and middle fingers twice.',
    ],
    xp: 60,
    difficulty: 'Intermediate',
    attribution: 'ISLRTC Standard Vocabulary (Health)',
  },
  {
    id: 'voc_hospital',
    english: 'Hospital',
    hindi: 'अस्पताल',
    category: 'emergency',
    description: 'Hospital or medical clinic.',
    handMovement: 'Dominant index finger traces a cross (plus sign) on the non-dominant upper arm or shoulder.',
    facialExpression: 'Neutral serious expression.',
    steps: [
      'Touch dominant index finger to non-dominant upper arm.',
      'Trace a vertical downstroke then horizontal stroke to form a medical cross.',
    ],
    xp: 65,
    difficulty: 'Intermediate',
    attribution: 'ISLRTC Standard Vocabulary (Health)',
  },

  // Emotions
  {
    id: 'voc_happy',
    english: 'Happy',
    hindi: 'खुश / प्रसन्न',
    category: 'emotions',
    description: 'Joy and happiness.',
    handMovement: 'Open flat hands brushing upward against chest repeatedly in buoyant strokes.',
    facialExpression: 'Broad genuine smile with crinkled eyes.',
    steps: [
      'Place both flat hands near chest, palms facing body.',
      'Brush palms upward toward collarbone twice with light, energetic movement.',
    ],
    xp: 50,
    difficulty: 'Beginner',
    attribution: 'ISLRTC Standard Vocabulary (Emotions)',
  },
  {
    id: 'voc_love',
    english: 'Love / Affection',
    hindi: 'प्यार / प्रेम',
    category: 'emotions',
    description: 'Deep affection or love.',
    handMovement: 'Both arms crossed over chest with closed fists hugging the body.',
    facialExpression: 'Warm, tender expression.',
    steps: [
      'Cross both arms over chest in an X.',
      'Clench hands into fists and press arms gently against heart in a self-hug.',
    ],
    xp: 50,
    difficulty: 'Beginner',
    attribution: 'ISLRTC Standard Vocabulary (Emotions)',
  },
];

// ============================================================
// ISL LEARNING PATHS & CURRICULUM
// ============================================================

export const ISL_LEARNING_PATHS: ISLLearningPath[] = [
  {
    id: 'path_alphabet',
    title: 'ISL Fingerspelling (A–Z)',
    description: 'Master all 26 authentic two-handed and one-handed alphabet signs of Indian Sign Language.',
    level: 'Beginner',
    totalLessons: 26,
    xpReward: 1300,
    icon: '🔤',
    color: 'from-purple-600 to-indigo-600',
    modules: ['Vowels System', 'Straight Consonants', 'Curved & Crossed Signs', 'Dynamic Motion Signs'],
  },
  {
    id: 'path_greetings',
    title: 'Essential ISL Greetings',
    description: 'Learn respectful greetings, courtesy, polite expressions, and culturally authentic introductions.',
    level: 'Beginner',
    totalLessons: 12,
    xpReward: 600,
    icon: '🙏',
    color: 'from-blue-600 to-cyan-600',
    modules: ['Namaste & Welcome', 'Thank You & Please', 'Apology & Parting'],
  },
  {
    id: 'path_daily',
    title: 'Daily Life & Home',
    description: 'Everyday vocabulary for food, water, home routines, family, and social communication.',
    level: 'Intermediate',
    totalLessons: 18,
    xpReward: 900,
    icon: '🏠',
    color: 'from-emerald-600 to-teal-600',
    modules: ['Kinship & Family', 'Food & Dining', 'Time & Schedules'],
  },
  {
    id: 'path_emergency',
    title: 'Emergency & Healthcare Signs',
    description: 'Critical signs for medical emergencies, asking for help, doctor visits, and safety instructions.',
    level: 'Intermediate',
    totalLessons: 10,
    xpReward: 700,
    icon: '🚨',
    color: 'from-rose-600 to-amber-600',
    modules: ['Urgent Assistance', 'Medical Symptoms', 'Directions & Safety'],
  },
];

// ============================================================
// INTERACTIVE QUIZ QUESTIONS
// ============================================================

export const ISL_QUIZ_QUESTIONS: ISLQuizQuestion[] = [
  {
    id: 'q1',
    type: 'identify_sign',
    question: 'In Indian Sign Language, which vowel is indicated by touching the non-dominant thumb tip?',
    signLetterOrWord: 'A',
    options: ['Letter A', 'Letter E', 'Letter I', 'Letter O'],
    correctAnswer: 'Letter A',
    hint: 'Think of the 5-finger vowel system starting from the thumb.',
    explanation: 'In the British/Indian two-handed fingerspelling system, the five vowels correspond to the five digits: Thumb (A), Index (E), Middle (I), Ring (O), Pinky (U).',
  },
  {
    id: 'q2',
    type: 'identify_sign',
    question: 'How is the letter "B" formed in two-handed Indian Sign Language?',
    signLetterOrWord: 'B',
    options: [
      'Two circular loops joined side-by-side like the numeral 8',
      'Index finger pointing straight up',
      'Crossing two index fingers into an X',
      'A single fist nod'
    ],
    correctAnswer: 'Two circular loops joined side-by-side like the numeral 8',
    hint: 'Look at the shape of capital B with its two rounded lobes.',
    explanation: 'Letter B is represented by joining thumb and index loops of both hands side-by-side to replicate the double circle of letter B.',
  },
  {
    id: 'q3',
    type: 'match_word',
    question: 'What is the correct ISL handshape for the traditional greeting "Namaste"?',
    signLetterOrWord: 'Namaste',
    options: [
      'Both open hands joined palm-to-palm at chest level with a respectful nod',
      'Waving a single hand next to the ear',
      'Tapping both fists together',
      'Drawing a circle over the forehead'
    ],
    correctAnswer: 'Both open hands joined palm-to-palm at chest level with a respectful nod',
    hint: 'It mirrors the universal Indian greeting posture (Anjali Mudra).',
    explanation: 'Namaste in ISL uses the traditional Anjali Mudra: both hands joined at the chest accompanied by a gentle nod.',
  },
  {
    id: 'q4',
    type: 'identify_sign',
    question: 'Which letter in ISL fingerspelling involves hooking both pinky fingers together?',
    signLetterOrWord: 'S',
    options: ['Letter S', 'Letter C', 'Letter T', 'Letter M'],
    correctAnswer: 'Letter S',
    hint: 'S stands for soft pinky link.',
    explanation: 'Letter S is uniquely signed by interlocking both pinky fingers in front of the chest.',
  },
  {
    id: 'q5',
    type: 'identify_sign',
    question: 'How do you distinguish between letter "M" and letter "N" in two-handed ISL?',
    signLetterOrWord: 'M vs N',
    options: [
      'M uses 3 fingers touching the palm; N uses 2 fingers touching the palm',
      'M is signed on the forehead; N is signed on the chin',
      'M is one-handed; N is two-handed',
      'There is no difference in fingers'
    ],
    correctAnswer: 'M uses 3 fingers touching the palm; N uses 2 fingers touching the palm',
    hint: 'Count the vertical downstrokes in the printed letters M (3 legs) and N (2 legs).',
    explanation: 'Letter M uses three fingers (index, middle, ring) on the non-dominant palm, while Letter N uses two fingers (index, middle).',
  },
];
