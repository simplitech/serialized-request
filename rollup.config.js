// rollup.config.js

import merge from 'deepmerge';
import { createBasicConfig } from '@open-wc/building-rollup';

const baseConfig = createBasicConfig();

export default merge(baseConfig, {
  input: 'dist/lib/index.js',
  output: {
      dir: 'dist',
  }
});