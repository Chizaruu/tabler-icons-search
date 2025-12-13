import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter(),
		paths: {
			// Update this to match your GitHub repo name
			// For example, if your repo is github.com/username/tabler-icons-search
			// set this to '/tabler-icons-search'
			// For custom domain or username.github.io, leave as ''
			base: process.env.NODE_ENV === 'production' ? '/tabler-icons-search' : ''
		}
	}
};

export default config;