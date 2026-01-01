import './index.css';
import { render } from 'preact';
import { App } from './App';
import { ErrorBoundary } from './components/ErrorBoundary';

const root = document.getElementById('app');
if (root) {
  render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>,
    root
  );
  document.body.style.background = '';
  document.body.style.color = '';
} else {
  console.error('Root element #app not found');
}
