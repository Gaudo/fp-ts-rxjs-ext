import { defineConfig } from 'tsup'

export default defineConfig({
	entry: [
		'src/Observable.ts',
		'src/ObservableEither.ts',
		'src/ReaderObservable.ts',
		'src/ReaderObservableEither.ts'
	],
	format: ['cjs', 'esm'],
	dts: true,
	splitting: false,
	sourcemap: true,
	clean: true
})
