import { useState, useEffect } from 'react';
import { useAuthStore } from './use-auth';

// Add this to coordinate dark mode, though defaults to light per spec
export function ThemeProvider() {
  useEffect(() => {
    // Force light mode
    document.documentElement.classList.remove('dark');
  }, []);
  return null;
}
