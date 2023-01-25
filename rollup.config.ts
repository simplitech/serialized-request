import camelCase from 'lodash.camelcase'
import typescript from 'rollup-plugin-typescript2'

const pkg = require('./package.json')

const libraryName = 'serialized-request'

export default {
  input: `src/index.ts`,
  output: [
    { file: pkg.main, name: camelCase(libraryName), format: 'umd', sourcemap: true },
    { file: pkg.module, format: 'es', sourcemap: true },
  ],
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  external: ['axios', 'class-transformer'],
  watch: {
    include: 'src/**',
  },
  plugins: [
    // Compile TypeScript files
    typescript({ useTsconfigDeclarationDir: true }),
  ],
}
