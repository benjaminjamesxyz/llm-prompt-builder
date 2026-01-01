import { validateNodes, safeJsonParse } from './validation';

export const saveToLocalStorage = (key: string, data: any): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
};

export const loadFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return defaultValue;
    
    const result = safeJsonParse(saved);
    if (!result.data) {
      console.error('localStorage corrupted, using default:', result.error);
      return defaultValue;
    }
    
    return result.data as T;
  } catch (err) {
    console.error('Failed to load from localStorage:', err);
    return defaultValue;
  }
};

// Load and validate nodes from localStorage
export const loadNodesFromLocalStorage = (): any[] => {
  try {
    const saved = localStorage.getItem('prompt_builder_autosave');
    if (!saved) return [];
    
    const result = safeJsonParse(saved);
    if (!result.data) {
      console.error('Invalid data in localStorage:', result.error);
      return [];
    }
    
    const data = result.data;
    if (!Array.isArray(data)) {
      console.error('Data is not an array');
      return [];
    }
    
    const validation = validateNodes(data);
    if (!validation.valid) {
      console.error('Schema validation failed:', validation.error);
      return [];
    }
    
    return validation.nodes!;
  } catch (err) {
    console.error('Failed to load nodes:', err);
    return [];
  }
};
