// src/main.tsx
// Punto de entrada de la aplicación React

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Importar estilos CSS globales
import 'video.js/dist/video-js.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);