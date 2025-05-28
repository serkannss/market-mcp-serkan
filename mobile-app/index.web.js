import { createRoot } from 'react-dom/client';
import App from './App.web';

// Web için basit React DOM render
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />); 