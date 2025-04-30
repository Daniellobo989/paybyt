import * as Sentry from '@sentry/react';
import env from './env';

Sentry.init({
  dsn: env.sentryDsn,
  environment: env.env,
  debug: env.debug,
  integrations: [
    new Sentry.BrowserTracing({
      tracePropagationTargets: ['localhost', /^https:\/\/api\.paybyt\.com/],
    }),
    new Sentry.Replay(),
  ],
  tracesSampleRate: env.debug ? 1.0 : 0.1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

export default Sentry; 