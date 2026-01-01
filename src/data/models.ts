import { ModelConfigs } from '../types';

export const MODELS: ModelConfigs = {
  generic: { name: "Generic / Any", blocks: ["role", "task", "context", "rules", "goal", "example", "input"] },
  gemini: { name: "Google (Gemini Family)", blocks: ["sys_instr", "user_input", "model_out", "context", "rules"] },
  claude: { name: "Anthropic (Claude Family)", blocks: ["system", "user", "assistant", "xml_wrapper", "thinking", "context"] },
  openai: { name: "OpenAI (GPT Family)", blocks: ["system", "user", "assistant", "context", "tools", "rules"] },
  llama: { name: "Meta (Llama Family)", blocks: ["system", "user", "assistant", "instruction"] },
  deepseek: { name: "DeepSeek (R1/V3)", blocks: ["system", "user", "assistant", "deepseek_think", "context"] },
  qwen: { name: "Qwen (Alibaba)", blocks: ["system", "user", "assistant", "tools", "context"] },
  glm: { name: "GLM (Zhipu)", blocks: ["system", "user", "assistant", "tools"] },
  image: { name: "Image Generation (Midjourney/DALL-E/Imagen)", blocks: ["scene", "subject", "visuals", "style", "environment", "lighting", "color", "camera", "negative", "params"] },
  video: { name: "Video Generation (Sora/Runway/Veo)", blocks: ["scene", "visuals", "camera", "audio", "sfx", "music", "subject", "movement", "style", "params"] }
};
