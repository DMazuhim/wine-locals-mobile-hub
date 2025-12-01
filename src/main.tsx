import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initSecurity } from './lib/security'

// Inicializa proteções de segurança
initSecurity();

createRoot(document.getElementById("root")!).render(<App />);
