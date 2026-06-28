import React, { createContext, useContext, useMemo, useState } from 'react';

export type ThemeMode = 'dark' | 'light';

/** Default brand color — overridable per host. */
export const DEFAULT_PRIMARY = '#7855FF';

interface ThemeContextValue {
  mode: ThemeMode;
  /** Primary/brand color (hex). */
  primaryColor: string;
  /** Background override (hex). `null` → use the mode's default background. */
  bgColor: string | null;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
  setPrimaryColor: (color: string) => void;
  setBgColor: (color: string | null) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

// eslint-disable-next-line react/only-export-components
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a <ThemeProvider>');
  }
  return ctx;
}

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultMode?: ThemeMode;
  defaultPrimaryColor?: string;
  defaultBgColor?: string | null;
  /** Stretch the themed container to fill the viewport. */
  fullscreen?: boolean;
  className?: string;
}

/**
 * Wraps the app in a themed scope. Renders a `[data-theme]` element and writes
 * the two configurable tokens (`--primary`, `--bg`) as inline styles so every
 * derived token in index.css re-computes from them. Components only ever use the
 * semantic Tailwind utilities (bg-surface, text-content, bg-primary, …), so they
 * follow whatever this provider sets without any per-component wiring.
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultMode = 'dark',
  defaultPrimaryColor = DEFAULT_PRIMARY,
  defaultBgColor = null,
  fullscreen = false,
  className = '',
}) => {
  const [mode, setMode] = useState<ThemeMode>(defaultMode);
  const [primaryColor, setPrimaryColor] = useState(defaultPrimaryColor);
  const [bgColor, setBgColor] = useState<string | null>(defaultBgColor);

  const style = useMemo(() => {
    const vars: Record<string, string> = { '--primary': primaryColor };
    if (bgColor) vars['--bg'] = bgColor;
    return vars as React.CSSProperties;
  }, [primaryColor, bgColor]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      primaryColor,
      bgColor,
      setMode,
      toggleMode: () => setMode((m) => (m === 'dark' ? 'light' : 'dark')),
      setPrimaryColor,
      setBgColor,
    }),
    [mode, primaryColor, bgColor],
  );

  return (
    <ThemeContext.Provider value={value}>
      <div
        data-theme={mode}
        style={style}
        className={`bg-bg text-content text-left ${fullscreen ? 'min-h-screen' : ''} ${className}`}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
};
