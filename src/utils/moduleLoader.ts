import { useState, useEffect, useRef } from 'preact/hooks';

// Track loaded modules to avoid duplicate loads
const loadedModules = new Map<string, boolean>();

// Track loading promises to avoid concurrent loads
const loadingPromises = new Map<string, Promise<any>>();

export const useModuleLoader = (moduleName: string) => {
  const [isLoaded, setIsLoaded] = useState(loadedModules.get(moduleName) || false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loadAttempted = useRef(false);

  useEffect(() => {
    // Skip if already loaded or attempted
    if (loadedModules.get(moduleName) || loadAttempted.current) {
      return;
    }

    const loadModule = async () => {
      loadAttempted.current = true;
      setIsLoading(true);
      setError(null);
      
      try {
        // Check if there's already a loading promise for this module
        let modulePromise = loadingPromises.get(moduleName);
        
if (!modulePromise) {
          // Create new loading promise
          modulePromise = (async () => {
            if (moduleName === 'prism') {
              // Dynamically import PrismJS
              const Prism = await import('prismjs');
              // Load necessary language components (XML is built-in to core)
              // @ts-ignore - PrismJS language components don't have type declarations
              await import('prismjs/components/prism-markdown');
              // @ts-ignore - PrismJS language components don't have type declarations
              await import('prismjs/components/prism-yaml');
              return Prism;
            } else if (moduleName === 'yaml') {
              // Dynamically import YAML
              return await import('js-yaml');
            }
            throw new Error(`Unknown module: ${moduleName}`);
          })();
          
          loadingPromises.set(moduleName, modulePromise);
        }

        await modulePromise;
        
        // Mark module as loaded
        loadedModules.set(moduleName, true);
        setIsLoaded(true);
      } catch (err) {
        setError(`Failed to load ${moduleName}: ${(err as Error).message}`);
        console.error('Module loading error:', err);
      } finally {
        setIsLoading(false);
        // Clean up loading promise
        loadingPromises.delete(moduleName);
      }
    };

    loadModule();
  }, [moduleName]);

  return { isLoaded, isLoading, error };
};