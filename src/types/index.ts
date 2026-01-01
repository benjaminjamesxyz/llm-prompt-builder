export interface Node {
  id: string;
  tag: string;
  content: string;
  isList?: boolean;
  children?: Node[];
}

export interface BlockDef {
  tag: string;
  content: string;
  desc: string;
}

export interface ModelConfig {
  name: string;
  blocks: string[];
}

export interface Example {
  name: string;
  nodes: Node[];
}

export type Format = 'xml' | 'json' | 'yaml' | 'toon' | 'md';
export type ModelKey = keyof ModelConfigs;
export type Theme = '' | 'theme-dracula' | 'theme-gruvbox' | 'theme-tokyo';
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

export interface ModelConfigs {
  generic: ModelConfig;
  gemini: ModelConfig;
  claude: ModelConfig;
  openai: ModelConfig;
  llama: ModelConfig;
  deepseek: ModelConfig;
  qwen: ModelConfig;
  glm: ModelConfig;
  image: ModelConfig;
  video: ModelConfig;
}

export interface BlockDefs {
  [key: string]: BlockDef;
}

export interface ModelExamples {
  [key: string]: Example[];
}
