import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../tailwind.config.js';

const tailwindTheme = resolveConfig(tailwindConfig);

export default tailwindTheme;
