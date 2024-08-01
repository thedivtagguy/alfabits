/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			fontFamily: {
				serif: ['Libre Caslon Condensed', 'serif']
			},
			colors: {
				purple: '#3D0066',
				yellow: '#FDC500',
				black: '#3D3B30'
			}
		}
	},
	plugins: []
};
