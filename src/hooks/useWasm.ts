import { useEffect, useState } from 'preact/hooks';
import init, { calculate_tokens, fast_xml } from '../wasm-pkg/llm_prompt_builder_wasm';

let wasmInitPromise: Promise<unknown> | null = null;

export const useWasm = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!wasmInitPromise) {
      wasmInitPromise = init().then(() => {
        setIsReady(true);
      });
    } else {
      // If already initialized or initializing
      wasmInitPromise.then(() => setIsReady(true));
    }
  }, []);

  return {
    isReady,
    calculateTokens: calculate_tokens,
    fastXml: fast_xml
  };
};
