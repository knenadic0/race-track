/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}', './app/**/*.{js,ts,jsx,tsx}'],
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
		extend: {
			spacing: {
				128: '32rem',
				144: '36rem',
			},
			colors: {
				'rt-blue': 'rgb(59 130 246)',
				'rt-dark-blue': 'rgb(37 99 235)',
			},
			borderRadius: {
				'4xl': '2rem',
			},
			backgroundImage: (theme) => ({
				'race-flag': "url('/assets/images/race-flag-1.png')",
			}),
			backgroundPosition: {
				'bt-100': 'center top 100px',
			},
		},
	},
	plugins: [require('@headlessui/tailwindcss'), require('@tailwindcss/forms')],
};
