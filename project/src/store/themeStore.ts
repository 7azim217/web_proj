import { create } from 'zustand';

interface ThemeState {
  darkMode: boolean;
  toggleTheme: () => void;
}

const useThemeStore = create<ThemeState>((set) => ({
  darkMode: false,
  toggleTheme: () =>
    set((state) => {
      const newTheme = !state.darkMode;
      document.documentElement.classList.toggle('dark', newTheme);
      return { darkMode: newTheme };
    }),
}));

export default useThemeStore;
