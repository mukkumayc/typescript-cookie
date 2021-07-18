import { terser } from 'rollup-plugin-terser'
import filesize from 'rollup-plugin-filesize'
import license from 'rollup-plugin-license'
import pkg from './package.json'

const licenseBanner = license({
  banner: {
    content: '/*! <%= pkg.name %> v<%= pkg.version %> | <%= pkg.license %> */',
    commentStyle: 'none'
  }
})

export default [
  {
    input: 'src/api.mjs',
    output: [
      {
        file: pkg.module,
        format: 'esm'
      }
    ],
    plugins: [licenseBanner]
  },
  {
    input: 'src/api.mjs',
    output: [
      {
        file: pkg.module.replace('.mjs', '.min.mjs'),
        format: 'esm'
      }
    ],
    plugins: [
      terser(),
      licenseBanner, // must be applied after terser, otherwise it's being stripped away...
      filesize()
    ]
  }
]
