import { ModelExamples } from '../types';
import { uuid } from '../utils/uuid';

export const MODEL_EXAMPLES: ModelExamples = {
  generic: [
    {
      name: "Chain of Thought",
      nodes: [
        { id: uuid(), tag: "ROLE", content: "You are an expert problem solver with a focus on logical deduction." },
        { id: uuid(), tag: "TASK", content: "Analyze the input and provide a solution." },
        { id: uuid(), tag: "METHODOLOGY", content: "Use Chain of Thought reasoning. Break down the problem into steps before concluding." }
      ]
    },
    {
      name: "Code Analysis",
      nodes: [
        { id: uuid(), tag: "ROLE", content: "Senior Software Engineer" },
        { id: uuid(), tag: "OBJECTIVE", content: "Refactor the provided code for performance and readability." },
        {
          id: uuid(), tag: "CONSTRAINTS", isList: true, content: "", children: [
            { id: uuid(), tag: "ITEM", content: "Maintain original functionality" },
            { id: uuid(), tag: "ITEM", content: "Use modern syntax" },
            { id: uuid(), tag: "ITEM", content: "Add type hints" }
          ]
        },
        { id: uuid(), tag: "INPUT_CODE", content: "// Paste code here" }
      ]
    },
    {
      name: "Bug Fixer",
      nodes: [
        { id: uuid(), tag: "CONTEXT", content: "A user is reporting a crash in the application." },
        { id: uuid(), tag: "ERROR_LOG", content: "Paste stack trace here" },
        { id: uuid(), tag: "INSTRUCTION", content: "Identify the root cause and propose a fix." }
      ]
    },
    { name: "Empty", nodes: [] }
  ],
  gemini: [
    {
      name: "Content Creator",
      nodes: [
        { id: uuid(), tag: "SYSTEM_INSTRUCTIONS", content: "You are a creative content strategist. Your goal is to draft engaging content." },
        { id: uuid(), tag: "USER_INPUT", content: "Product: AI-powered coffee maker.\nTarget Audience: Developers." },
        { id: uuid(), tag: "MODEL_OUTPUT", content: "(Draft a LinkedIn post...)" }
      ]
    },
    {
      name: "Multimodal Analysis",
      nodes: [
        { id: uuid(), tag: "SYSTEM_INSTRUCTIONS", content: "Analyze the provided image input and output a structured description." },
        {
          id: uuid(), tag: "USER_INPUT", content: "[Image Data Placeholder]", children: [
            { id: uuid(), tag: "CONTEXT", content: "This is a UI screenshot." }
          ]
        },
        { id: uuid(), tag: "MODEL_OUTPUT", content: "JSON format with keys: 'header', 'sidebar', 'content'." }
      ]
    }
  ],
  claude: [
    {
      name: "Complex Reasoning (XML)",
      nodes: [
        { id: uuid(), tag: "SYSTEM", content: "You are Claude, an expert analyst. Use XML tags to structure your analysis." },
        {
          id: uuid(), tag: "USER", content: "Analyze the contract.", children: [
            {
              id: uuid(), tag: "documents", content: "", children: [
                { id: uuid(), tag: "contract", content: "[Paste Contract Text Here]" }
              ]
            },
            { id: uuid(), tag: "instructions", content: "Think step-by-step before providing the final risk assessment." }
          ]
        },
        {
          id: uuid(), tag: "ASSISTANT", content: "", children: [
            { id: uuid(), tag: "thinking", content: "I will first read the liability clause..." }
          ]
        }
      ]
    }
  ],
  openai: [
    {
      name: "System Persona",
      nodes: [
        { id: uuid(), tag: "SYSTEM", content: "You are a helpful assistant that speaks like a 17th-century pirate." },
        { id: uuid(), tag: "USER", content: "Explain quantum physics to me." }
      ]
    },
    {
      name: "Few-Shot Classification",
      nodes: [
        { id: uuid(), tag: "SYSTEM", content: "Classify the sentiment of the user's text." },
        { id: uuid(), tag: "USER", content: "I love this product!" },
        { id: uuid(), tag: "ASSISTANT", content: "Positive" },
        { id: uuid(), tag: "USER", content: "This is terrible." },
        { id: uuid(), tag: "ASSISTANT", content: "Negative" }
      ]
    }
  ],
  deepseek: [
    {
      name: "DeepSeek-R1 Reasoning",
      nodes: [
        { id: uuid(), tag: "USER", content: "How many Rs are in the word Strawberry?" },
        {
          id: uuid(), tag: "ASSISTANT", content: "", children: [
            { id: uuid(), tag: "think", content: "The user is asking for the count of the letter 'r' in 'Strawberry'.\n\n1. S-t-r-a-w-b-e-r-r-y\n2. Count: r (3rd), r (8th), r (9th).\n3. Total is 3." },
            { id: uuid(), tag: "RESPONSE", content: "There are 3 Rs in Strawberry." }
          ]
        }
      ]
    }
  ],
  llama: [
    {
      name: "Llama 3 Instruct",
      nodes: [
        { id: uuid(), tag: "SYSTEM", content: "You are a helpful, respectful, and honest assistant." },
        { id: uuid(), tag: "USER", content: "Write a python script to scrape a website." },
        { id: uuid(), tag: "ASSISTANT", content: "I can help with that. Here is a basic example using BeautifulSoup..." }
      ]
    }
  ],
  qwen: [
    {
      name: "Qwen Coding",
      nodes: [
        { id: uuid(), tag: "SYSTEM", content: "You are an expert programmer." },
        {
          id: uuid(), tag: "USER", content: "Fix the memory leak in this C++ code snippet.", children: [
            { id: uuid(), tag: "CODE", content: "void func() { int* p = new int[10]; }" }
          ]
        }
      ]
    }
  ],
  glm: [
    {
      name: "ChatGLM Dialogue",
      nodes: [
        { id: uuid(), tag: "USER", content: "你好 (Hello)" },
        { id: uuid(), tag: "ASSISTANT", content: "你好！有什么我可以帮你的吗？ (Hello! How can I help you?)" }
      ]
    }
  ],
  image: [
    {
      name: "Midjourney Photorealism",
      nodes: [
        { id: uuid(), tag: "SUBJECT", content: "A weary astronaut sitting in a diner on Mars, looking out the window at a dust storm." },
        { id: uuid(), tag: "STYLE", content: "Cinematic, photorealistic, 8k, shot on 35mm film." },
        { id: uuid(), tag: "LIGHTING", content: "Neon sign reflection, moody atmosphere, volumetric dust." },
        { id: uuid(), tag: "PARAMETERS", content: "--ar 16:9 --v 6.0 --stylize 250" }
      ]
    },
    {
      name: "Stable Diffusion Anime",
      nodes: [
        { id: uuid(), tag: "SUBJECT", content: "Cyberpunk girl with glowing headphones standing in rain." },
        { id: uuid(), tag: "STYLE", content: "Anime style, Makoto Shinkai, vibrant colors, detailed background." },
        { id: uuid(), tag: "NEGATIVE_PROMPT", content: "low quality, bad anatomy, missing fingers, blurry." },
        { id: uuid(), tag: "PARAMETERS", content: "Steps: 30, Sampler: Euler a, CFG scale: 7" }
      ]
    },
    {
      name: "Google Imagen (Nano Banana)",
      nodes: [
        { id: uuid(), tag: "SUBJECT", content: "A close-up portrait of an iridescent beetle on a fern leaf." },
        { id: uuid(), tag: "STYLE", content: "Macro photography, shallow depth of field, hyper-realistic, vivid colors." },
        { id: uuid(), tag: "LIGHTING", content: "Natural morning sunlight, soft bokeh." },
        { id: uuid(), tag: "PARAMETERS", content: "--aspect_ratio 4:3 --safety_filter_level block_few" }
      ]
    },
    {
      name: "DALL-E 3 Vector Art",
      nodes: [
        { id: uuid(), tag: "SUBJECT", content: "A futuristic robot playing chess against an old man in a park." },
        { id: uuid(), tag: "STYLE", content: "Flat vector art, minimal design, clean lines, pastel color palette." },
        { id: uuid(), tag: "AESTHETIC", content: "Whimsical, modern, tech-meets-nature." },
        { id: uuid(), tag: "PARAMETERS", content: "--size 1024x1024 --quality hd" }
      ]
    },
    {
      name: "Commercial Product Photo",
      nodes: [
        { id: uuid(), tag: "SUBJECT", content: "A luxury perfume bottle made of amber glass sitting on a black reflective surface." },
        { id: uuid(), tag: "LIGHTING", content: "Studio lighting, sharp rim light, soft fill, water droplets on the bottle." },
        { id: uuid(), tag: "CAMERA", content: "100mm macro lens, f/2.8, eye-level angle." },
        { id: uuid(), tag: "STYLE", content: "High-end advertising, elegant, crisp details." }
      ]
    }
  ],
  video: [
    {
      name: "Google Veo Cinematic",
      nodes: [
        { id: uuid(), tag: "SCENE", content: "A slow, expansive drone flyover captures the breathtaking, hyper-realistic spectacle of a technologically advanced eco-city cascading down a massive, verdant cliff face." },
        {
          id: uuid(), tag: "VISUALS", content: "Primary subject is an immense, vertical city composed of sleek bio-domes.", children: [
            { id: uuid(), tag: "ENVIRONMENT", content: "Misty canyon, rugged rock face, dense jungle canopy at the base." },
            { id: uuid(), tag: "LIGHTING", content: "Bright, natural daylight (high noon, slightly overcast), National Geographic style." },
            { id: uuid(), tag: "COLOR_PALETTE", content: "Deep emerald greens, stark white architecture, cyan blue water." },
            { id: uuid(), tag: "AESTHETIC", content: "Hyper-realistic, grand, and awe-inspiring eco-futurism." }
          ]
        },
        {
          id: uuid(), tag: "CAMERA", content: "", children: [
            { id: uuid(), tag: "SHOT_TYPE", content: "Extreme wide shot / establishing shot." },
            { id: uuid(), tag: "ANGLE", content: "High-angle (drone view), slowly panning downward." },
            { id: uuid(), tag: "MOVEMENT", content: "Slow, steady drone flyover descending and panning across the vertical landscape." }
          ]
        },
        { id: uuid(), tag: "AUDIO", content: "Blend of immense natural forces and subtle technological hum." },
        {
          id: uuid(), tag: "SFX", isList: true, content: "", children: [
            { id: uuid(), tag: "ITEM", content: "Powerful roar of waterfalls echoing." },
            { id: uuid(), tag: "ITEM", content: "Rush and spray of water hitting the basin." },
            { id: uuid(), tag: "ITEM", content: "Subtle low-frequency hum of infrastructure." },
            { id: uuid(), tag: "ITEM", content: "Distant cry of a jungle bird." }
          ]
        },
        { id: uuid(), tag: "MUSIC", content: "Minimalist, ambient electronic score with subtle pads and high-register string swell." }
      ]
    },
    {
      name: "Cinematic Drone Shot",
      nodes: [
        { id: uuid(), tag: "SUBJECT", content: "A sweeping view of a futuristic eco-city built into a cliffside." },
        { id: uuid(), tag: "MOTION", content: "Slow drone flyover, panning down to reveal waterfalls." },
        { id: uuid(), tag: "STYLE", content: "National Geographic style, hyper-realistic, lush greenery." },
        { id: uuid(), tag: "PARAMETERS", content: "--video_duration 5s --motion_bucket_id 127" }
      ]
    },
    {
      name: "Character Performance (Gen-3)",
      nodes: [
        { id: uuid(), tag: "SUBJECT", content: "An elderly woman reading a handwritten letter by a window." },
        { id: uuid(), tag: "MOTION", content: "Subtle facial micro-expressions. A single tear rolls down her cheek. Her hand trembles slightly holding the paper." },
        { id: uuid(), tag: "LIGHTING", content: "Soft, diffused afternoon window light. Dust motes dancing in the air." },
        { id: uuid(), tag: "CAMERA", content: "Extreme close-up on face, shallow depth of field, sharp focus on eyes." }
      ]
    },
    {
      name: "Nature Time-Lapse",
      nodes: [
        { id: uuid(), tag: "SCENE", content: "A rare orchid blooming in a dark rainforest." },
        { id: uuid(), tag: "MOTION", content: "Fast-forward time-lapse. The petals unfurl smoothly over 5 seconds." },
        { id: uuid(), tag: "VISUALS", content: "Vibrant purple and neon pink colors against a dark, blurry green background." },
        { id: uuid(), tag: "CAMERA", content: "Static macro shot, locked off." }
      ]
    }
  ]
};
