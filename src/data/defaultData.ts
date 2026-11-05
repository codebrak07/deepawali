export interface MemoryMilestone {
  id: string;
  date: string;
  title: string;
  location: string;
  summary: string;
  detailedMemory: string;
  chatExcerpts?: { time: string; text: string; sender: "Aalekh" | "Sana" }[];
  tag: string;
  iconName: string;
}

export interface LoveLetter {
  id: string;
  title: string;
  category: string;
  preview: string;
  content: string[];
  signature: string;
  unlockRequirement?: string;
  accentColor: string;
}

export interface LocalityPoint {
  id: string;
  name: string;
  subtext: string;
  category: "landmark" | "memory" | "festive" | "treat" | "dream";
  x: number; // percentage coordinates 0-100 on interactive map
  y: number;
  icon: string;
  color: string;
  title: string;
  story: string;
  actionText: string;
  unlockedContent: {
    heading: string;
    body: string;
    badge?: string;
    giftItem?: string;
  };
}

export interface BuildingLightConfig {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  roofColor: string;
  facadeColor: string;
  lightPattern: "festive-multicolor" | "golden-cascade" | "marigold-crimson" | "starlight-cyan";
  diwaliBanner?: string;
}

export interface BucketListItem {
  id: string;
  title: string;
  category: "travel" | "tradition" | "daily" | "adventure";
  completed: boolean;
  note: string;
}

export interface ReasonFlower {
  id: number;
  flowerName: string;
  color: string;
  petalCount: number;
  reason: string;
  quote: string;
}

export const INITIAL_TIMELINE: MemoryMilestone[] = [
  {
    id: "mem-1",
    date: "11 September",
    title: "The First Hello in DMs",
    location: "Instagram DMs",
    tag: "Where It All Began",
    iconName: "MessageCircleHeart",
    summary: "A simple DM exchange that subtly shifted the entire trajectory of my universe.",
    detailedMemory:
      "It started as an ordinary notification on September 11th, but from our very first messages, there was an effortless warmth. Talking to you didn't feel like talking to someone new; it felt like returning home to a conversation my heart had been waiting for all along.",
  },
  {
    id: "mem-2",
    date: "26 September",
    title: "The Midnight Confession & Official Beginning",
    location: "Late Night Calls & Messages",
    tag: "Officially Ours",
    iconName: "HeartHandshake",
    summary: "From late night laughs to making our love official in the quiet hours of 1:30 AM.",
    detailedMemory:
      "The quietest hours of the night witnessed the loudest beat of my heart. The hesitation melting away into sweet certainty, second by second, minute by minute.",
    chatExcerpts: [
      { time: "1:24 AM", text: "ig we are in relationship", sender: "Sana" },
      { time: "1:32 AM", text: "fine let's make it official", sender: "Aalekh" },
      { time: "1:36 AM", text: "LY2", sender: "Sana" },
      { time: "1:37 AM", text: "I loveeee youuu tooo babyyy ❤️", sender: "Aalekh" },
    ],
  },
  {
    id: "mem-3",
    date: "27 September",
    title: "First Meeting at Elpro Mall",
    location: "Elpro City Square Mall",
    tag: "First Sight",
    iconName: "Sparkles",
    summary: "Seeing your smile for the first time outside of screens.",
    detailedMemory:
      "Just one day after making it official, walking through Elpro Mall and catching sight of you in real life. My palms were a little nervous, but the moment you turned and smiled, all the nervousness turned into pure wonder. You looked even more breathtaking than every photo and video call.",
  },
  {
    id: "mem-4",
    date: "4 October",
    title: "Our Unforgettable Second Meeting",
    location: "INOX, Phullaura Cafe & Appu Garden",
    tag: "First Kiss & Magic",
    iconName: "Flame",
    summary: "Movie seats at INOX, our very first kiss, quiet laughs over coffee at Phullaura Cafe, and sunset strolls at Appu Garden.",
    detailedMemory:
      "A day etched into my soul forever. Sitting together in INOX, our hands brushing, finding the courage for our first kiss that made time literally stop. Then sneaking off to Phullaura Cafe for warm coffee and finishing the magical evening strolling under the leafy canopies of Appu Garden, wishing the day would never end.",
  },
  {
    id: "mem-5",
    date: "14 October",
    title: "Strolling the Streets of Europe",
    location: "Streets of Europe",
    tag: "European Romance",
    iconName: "Compass",
    summary: "Cobblestone charm, fairy-lit archways, and walking side by side as if we were in our own fairytale.",
    detailedMemory:
      "Under the vintage European lamps and ornate facade, with fairy lights reflecting in your eyes. Every step felt like a rehearsal for all the cities and foreign streets we will walk together hand-in-hand in our future.",
  },
  {
    id: "mem-6",
    date: "18 October",
    title: "Breeze & Sunset at Durga Tekdi",
    location: "Durga Tekdi Viewpoint",
    tag: "Overlooking the World",
    iconName: "Mountain",
    summary: "Sitting together on the hillside, feeling the cool evening breeze as the city lights started to flicker below.",
    detailedMemory:
      "High up at Durga Tekdi, breathing the fresh hilltop air with your head near my shoulder. Watching the sky turn from amber to twilight purple, realizing that out of everyone in the sprawling city beneath us, you are my safe haven.",
  },
];

export const INITIAL_LETTERS: LoveLetter[] = [
  {
    id: "letter-diwali",
    title: "Special Diwali Letter",
    category: "Festive Heart",
    accentColor: "from-amber-500 to-orange-600",
    preview: "To my most radiant light, on our very first Diwali together...",
    content: [
      "My dearest Shirjana,",
      "Diwali has always been called the festival of lights, but honestly, until you walked into my life, it was just another date on the calendar. This year, every diya lit across the city feels like a celebration of how your laughter lights up my darkest days.",
      "You bring a glow into my life that no oil lamp or chandelier could ever replicate. When you smile at me, the whole world softens.",
      "Happy Diwali, my Jaanuuuu. May this festive night bring you the same peace, warmth, and boundless joy that you give me unconditionally every single day.",
    ],
    signature: "Forever & always yours, Aalekh ❤️🪔",
  },
  {
    id: "letter-miss-me",
    title: "Open When You Miss Me",
    category: "Long Distance & Warmth",
    accentColor: "from-rose-500 to-pink-600",
    preview: "Whenever the distance feels a little too heavy and you crave my voice...",
    content: [
      "Hey Sana,",
      "If you're reading this, your heart is probably missing mine right now. I want you to close your eyes for three seconds, take a deep breath, and picture my arms wrapping gently around you.",
      "Remember September 26 at 1:36 AM? 'LY2' turned into 'I loveeee youuu tooo babyyy'. That love hasn't faded for a single second; it only expands with every passing breath.",
      "No matter where I am, a huge piece of my thoughts is always right beside you, whispering that you are safe, cherished, and deeply wanted.",
    ],
    signature: "Holding you tight in spirit, Aalekh",
  },
  {
    id: "letter-feel-low",
    title: "Open When You Feel Low",
    category: "Comfort & Solace",
    accentColor: "from-purple-500 to-indigo-600",
    preview: "On days when the world feels overwhelming and your heart feels weary...",
    content: [
      "My sweet girl,",
      "Take off the pressure to have everything figured out. It's completely okay to feel exhausted, quiet, or vulnerable.",
      "You don't have to carry the whole weight on your shoulders. You are allowed to rest, and you never have to be strong all by yourself because I am right here in your corner.",
      "You are so resilient, so gentle-hearted, and so infinitely precious. This cloudy day will pass, but my belief in you and my love for you will never waver.",
    ],
    signature: "Your biggest cheerleader & shelter, Aalekh",
  },
  {
    id: "letter-reassurance",
    title: "Open When You Need Reassurance",
    category: "Certainty & Devotion",
    accentColor: "from-emerald-500 to-teal-600",
    preview: "If self-doubt or anxious thoughts ever try to whisper in your ear...",
    content: [
      "Shirjana,",
      "Let me be crystal clear so your mind finds instant peace: I choose you. Not just on easy days, but on hard days, confusing days, quiet days, and every day in between.",
      "I fell in love with who you are at your core — your genuine kindness, your cute little habits, the way your voice sounds when you get excited.",
      "You are not too much, you are never a burden, and my feelings for you are rock solid. You are my person, Sana.",
    ],
    signature: "Anchored to you, Aalekh",
  },
  {
    id: "letter-cannot-sleep",
    title: "Open When You Cannot Sleep",
    category: "Bedtime Peace",
    accentColor: "from-blue-600 to-cyan-700",
    preview: "For the quiet 2 AM nights when your thoughts are spinning...",
    content: [
      "Shhh... it's bedtime, Jaanu.",
      "Let go of tomorrow's to-do list. Let go of past overthinking. The stars are on duty watching over Pune tonight, and Aalekh's heart is sending you a blanket of warm hugs.",
      "Think about our stroll at Appu Garden, the cool autumn air, the sweet taste of coffee after our first kiss at INOX. Let those happy memories rock you to sleep.",
      "Rest well, my angel. Dream sweet dreams. I'll be right here waiting to greet you tomorrow.",
    ],
    signature: "Goodnight my dream girl, Aalekh 🌙✨",
  },
  {
    id: "letter-remember-loved",
    title: "Open When You Need To Remember How Loved You Are",
    category: "Adoration",
    accentColor: "from-amber-400 to-yellow-600",
    preview: "A reminder of just how magnificent and deeply treasured you are...",
    content: [
      "My favourite human,",
      "If you could see yourself through my eyes for just ten seconds, you would never doubt your worth for the rest of your life.",
      "I love the sparkle in your eyes when something makes you genuinely giggle. I love how thoughtful you are. I love the way my name sounds when you say it.",
      "You are loved beyond measure, beyond words, and beyond the stars.",
    ],
    signature: "Madly in love with you, Aalekh",
  },
  {
    id: "letter-future",
    title: "Letter About Our Future",
    category: "Our Tomorrow",
    accentColor: "from-fuchsia-600 to-rose-700",
    preview: "Peeking into the beautiful life we are going to build together...",
    content: [
      "To my future partner in everything,",
      "I often close my eyes and picture our future home during Diwali. Us hanging marigold torans on the doorway, you arranging the rangoli petals while teasing me that mine isn't symmetrical, the smell of fresh sweets filling our kitchen.",
      "I see our living room lit up with fairy lights, our little balcony where we'll drink chai together watching the rain, and all the quiet mornings where I wake up thankful that it's you beside me.",
      "Every step we take today is leading us there. And I can't wait for every second of it.",
    ],
    signature: "Building our forever, Aalekh 🏡❤️",
  },
];

export const INITIAL_BUCKET_LIST: BucketListItem[] = [
  { id: "b1", title: "Light 100 diyas together in our own home", category: "tradition", completed: true, note: "Starting today in our digital wonderland!" },
  { id: "b2", title: "Midnight rooftop stargazing & hot cocoa", category: "adventure", completed: false, note: "Watching constellations and listening to our favourite songs." },
  { id: "b3", title: "Bake festive cookies and Diwali sweets together", category: "daily", completed: false, note: "Even if we make a hilarious flour mess in the kitchen!" },
  { id: "b4", title: "Visit Paris & walk hand-in-hand under real European street lamps", category: "travel", completed: false, note: "Just like Streets of Europe, but on cobblestone streets abroad." },
  { id: "b5", title: "Take a sunset boat ride with paper lanterns on the water", category: "travel", completed: false, note: "Releasing our wishes onto calm waters." },
  { id: "b6", title: "Recreate our first INOX movie date every anniversary", category: "tradition", completed: false, note: "Popcorn, sweet whispered laughs, and that exact butterflies feeling." },
  { id: "b7", title: "Build a cozy blanket fort with fairy lights and binge movies", category: "daily", completed: false, note: "Tucked inside with snacks when the winter evening is cold." },
];

export const INITIAL_REASON_FLOWERS: ReasonFlower[] = [
  { id: 1, flowerName: "Marigold of Radiance", color: "#F59E0B", petalCount: 8, reason: "The infectious warmth in your laugh that instantly resets my worst days.", quote: "Your joy is magnetic." },
  { id: 2, flowerName: "Rose of Gentleness", color: "#F43F5E", petalCount: 10, reason: "How tenderly and kindly you treat the people around you.", quote: "A heart of gold." },
  { id: 3, flowerName: "Lotus of Calm", color: "#EC4899", petalCount: 12, reason: "How peaceful it feels just sitting next to you without saying a word.", quote: "My serene sanctuary." },
  { id: 4, flowerName: "Jasmine of Pure Joy", color: "#FDE68A", petalCount: 6, reason: "The cute way you tell stories when you're super excited.", quote: "My favourite storyteller." },
  { id: 5, flowerName: "Orchid of Grace", color: "#A855F7", petalCount: 8, reason: "Your effortless elegance and how naturally beautiful you are, inside and out.", quote: "Flawless in every way." },
  { id: 6, flowerName: "Sunflower of Devotion", color: "#EAB308", petalCount: 12, reason: "The unwavering loyalty and honesty you show in our relationship.", quote: "My rock and truth." },
  { id: 7, flowerName: "Hibiscus of Passion", color: "#EF4444", petalCount: 8, reason: "The memory of our first kiss at INOX that still gives me chills.", quote: "Unforgettable spark." },
  { id: 8, flowerName: "Lily of Tomorrow", color: "#38BDF8", petalCount: 10, reason: "Knowing that whatever the future holds, you make every tomorrow something to look forward to.", quote: "My sweetest dream." },
];

export const INITIAL_DIYAS_MESSAGES = [
  "You make the simple moments feel cinematic.",
  "Your smile is Aalekh's favourite view in the entire world.",
  "Thank you for being my best friend and soulmate all in one.",
  "Remember: You are capable of accomplishing anything you set your mind to.",
  "I love the way your eyes crinkle when you laugh really hard.",
  "1:37 AM — I loveeee youuu tooo babyyy ❤️",
  "Every song about love suddenly reminds me of you.",
  "You look stunning when you don't even try.",
  "Our second meeting at INOX will forever be my lucky charm.",
  "I will always hold your hand across busy streets.",
  "You are my favourite notification, always.",
  "May your life always be illuminated with happiness, Shirjana.",
  "Forever grateful for September 11th's first DM.",
  "You give the absolute warmest hugs.",
  "My dream is to celebrate every single Diwali with you.",
];
