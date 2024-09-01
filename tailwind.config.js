/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				blue: '#2176AE',
				orange: '#FC620A',
				black: '#070707',
				white: '#FFFFFF',
				red: '#A5243D',
				'light-gray': '#A6A7AB'
			}
		},
		fontFamily: {
			sans: ['Open Sans Variable', 'sans-serif']
		}
	},
	plugins: []
};
