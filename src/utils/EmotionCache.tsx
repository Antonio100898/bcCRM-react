import rtlPlugin from 'stylis-plugin-rtl';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';
import { PropsWithChildren } from 'react';

// Create rtl cache
const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

function EmotionCache({ children }: PropsWithChildren) {
  return <CacheProvider value={cacheRtl}>{children}</CacheProvider>;
}

export default EmotionCache;