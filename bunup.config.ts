import { defineConfig } from 'bunup'

export default defineConfig({
	isolatedDeclarations: false,
	dts: {
		compilerOptions: {
			strict: true,
			skipLibCheck: true,
			moduleResolution: 'bundler',
			declaration: true,
			declarationMap: true,
			// Suppress TS9010 warnings for inferred const declarations
			// The types are correctly inferred by TypeScript from Zod schemas
			noImplicitAny: false,
		},
	},
})
