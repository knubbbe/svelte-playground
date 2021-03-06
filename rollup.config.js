import svelte from 'rollup-plugin-svelte';
import replace from 'rollup-plugin-replace';
import { scss } from '@kazzkiq/svelte-preprocess-scss';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import livereload from 'rollup-plugin-livereload';


const production = !process.env.ROLLUP_WATCH;

export default {
	input: 'src/main.js',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'public/bundle.js',
		dir: 'public/',
		experimentalCodeSplitting: true,
	},
	plugins: [
		replace({
			ENVIRONMENT: JSON.stringify(production ? 'production' : 'development'),
			'process.env.NODE_ENV': JSON.stringify(production ? 'production' : 'development')
		}),

		!production && livereload(),
		svelte({
			// opt in to v3 behaviour today
			skipIntroByDefault: true,
			nestedTransitions: true,

			// enable run-time checks when not in production
			dev: !production,
			preprocess: {
				style: scss()
			},
			// we'll extract any component CSS out into
			// a separate file — better for performance
			css: css => {
				css.write('public/bundle.css');
			}
		}),


		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration —
		// consult the documentation for details:
		// https://github.com/rollup/rollup-plugin-commonjs
		resolve(),
		commonjs(),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser()
	]
};
