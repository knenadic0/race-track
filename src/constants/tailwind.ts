import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../tailwind.config.js';

export const tailwindTheme = resolveConfig(tailwindConfig);

export const rtBlue = tailwindTheme.theme?.colors ? tailwindTheme.theme.colors['rt-blue'].toString() : '#3b82f6';
export const rtLightBlue = tailwindTheme.theme?.colors ? tailwindTheme.theme.colors['rt-light-blue'].toString() : '#eff6ff';
export const rtDarkBlue = tailwindTheme.theme?.colors ? tailwindTheme.theme.colors['rt-dark-blue'].toString() : '#2563eb';
export const rtRed = tailwindTheme.theme?.colors ? tailwindTheme.theme.colors['rt-red'].toString() : '#ef4444';
export const rtDarkRed = tailwindTheme.theme?.colors ? tailwindTheme.theme.colors['rt-dark-red'].toString() : '#dc2626';
export const rtSlate = tailwindTheme.theme?.colors ? tailwindTheme.theme.colors['rt-slate'].toString() : '#e2e8f0';
export const rtWhite = tailwindTheme.theme?.colors ? tailwindTheme.theme.colors['rt-white'].toString() : '#dc2626';
export const rtGray = tailwindTheme.theme?.colors ? tailwindTheme.theme.colors['rt-gray'].toString() : '#9ca3af';
