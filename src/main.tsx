import './index.css';
import { render } from 'preact';
import { App } from './App';

console.log('Starting LLM Prompt Builder...');

// Render the app
const root = document.getElementById('app');
if (root) {
  render(<App />, root);
  console.log('App rendered successfully');
} else {
  console.error('Root element #app not found');
}
