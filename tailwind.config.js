/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');

module.exports = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx}',
		'./src/components/**/*.{js,ts,jsx,tsx}',
		'./app/**/*.{js,ts,jsx,tsx}',
		'./node_modules/flowbite/**/*.js',
	],
	theme: {
		screens: {
			sm: '480px',
			md: '768px',
			lg: '976px',
			xl: '1440px',
		},
		fontFamily: {
			sans: ['Varela Round', 'sans-serif'],
		},
		colors: {
			'rt-light-blue': '#eff6ff',
			'rt-blue': '#3b82f6',
			'rt-dark-blue': '#2563eb',
			'rt-slate': '#e2e8f0',
			'rt-red': '#ef4444',
			'rt-dark-red': '#dc2626',
			'rt-white': colors.white,
			'rt-gray': '#9ca3af',
			'rt-light-gray': '#e5e7eb',
			'rt-black': colors.black,
		},
		extend: {
			spacing: {
				128: '32rem',
				144: '36rem',
			},
			borderRadius: {
				'4xl': '2rem',
			},
			backgroundImage: {
				'race-flag': "url('/assets/images/race-flag-1.png')",
			},
			backgroundPosition: {
				'bt-100': 'center top 100px',
				'bt-180': 'center top 180px',
			},
			borderWidth: {
				1: '1px',
				3: '3px',
			},
		},
	},
	plugins: [require('@headlessui/tailwindcss'), require('@tailwindcss/forms'), require('flowbite/plugin')],
};
