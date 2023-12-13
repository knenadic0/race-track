import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../tailwind.config.js';

export const tailwindTheme = resolveConfig(tailwindConfig);

export const waveColor = tailwindTheme.theme?.colors ? tailwindTheme.theme.colors['rt-blue'].toString() : '#4fa94d';
