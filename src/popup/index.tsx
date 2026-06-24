import React from 'react';
import ReactDOM from 'react-dom/client';
import Popup from './Popup';

const container = document.getElementById('root');
if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(<Popup />);
}
