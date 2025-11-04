import { defineConfig } from 'bunup'

export default defineConfig({
	// Generate multiple output formats for better compatibility
	format: ['esm', 'cjs'],

	// Target Node.js environment (most common for this library)
	target: 'node',

	// Externalize Zod to avoid bundling it (it's a dependency)
	packages: 'external',

	// Enable code splitting for better tree-shaking
	splitting: true,

	// Enable minification for production builds
	minify: true,

	// Generate linked source maps for debugging
	sourcemap: 'linked',

	// TypeScript declaration options
	dts: {
		// Enable type inference to handle isolatedDeclarations
		inferTypes: true,

		// Enable declaration splitting to share common types
		splitting: true,

		// Minify declaration files to reduce size
		minify: true,
	},

	// Build report configuration
	report: {
		// Enable gzip size calculation (default: true)
		gzip: true,

		// Enable brotli size calculation for better compression metrics
		brotli: true,

		// Warn if any bundle exceeds 500KB (reasonable for a types library)
		maxBundleSize: 500 * 1024,
	},

	// Automatically generate and sync package.json exports
	exports: true,
})
