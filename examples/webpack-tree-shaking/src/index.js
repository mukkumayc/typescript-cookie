// Illustrate tree shaking here.. Webpack should not include
// anything else apart from getCookie + decoders from
// typescript-cookie in the bundled file!
import { getCookie } from 'typescript-cookie'

getCookie('foo')
