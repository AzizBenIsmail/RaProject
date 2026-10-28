import React from 'react';
import { AppProvider } from './context/AppContext';
import AppRouter from './routes/AppRouter';
import './App.css';

export default function App() {
  return <AppProvider><AppRouter /></AppProvider>;
}
