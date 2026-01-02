import { useState, useEffect } from 'preact/hooks';

export const useModuleLoader = (moduleName: string) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadModule = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // This simulates dynamic import for modules that are code-split
        // In production, this would be a real dynamic import
        if (moduleName === 'prism') {
          // PrismJS is already available globally in the bundle
          setIsLoaded(true);
        } else if (moduleName === 'yaml') {
          // YAML is already available globally in the bundle
          setIsLoaded(true);
        }
      } catch (err) {
        setError(`Failed to load ${moduleName}: ${(err as Error).message}`);
      } finally {
        setIsLoading(false);
      }
    };

    loadModule();
  }, [moduleName]);

  return { isLoaded, isLoading, error };
};