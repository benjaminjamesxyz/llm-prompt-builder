import { useEffect, useState } from 'preact/hooks';
import init, { calculate_tokens, fast_xml, fast_json, fast_yaml, fast_toon, fast_markdown } from '../wasm-pkg/llm_prompt_builder_wasm';

// Initialize immediately to start fetching/compiling as soon as this module is loaded
const wasmInitPromise = init();

export const useWasm = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    wasmInitPromise.then(() => setIsReady(true));
  }, []);

  return {
    isReady,
    calculateTokens: calculate_tokens,
    fastXml: fast_xml,
    fastJson: fast_json,
    fastYaml: fast_yaml,
    fastToon: fast_toon,
    fastMarkdown: fast_markdown
  };
};
