const { withSentryConfig } = require('@sentry/nextjs');

const nextConfig = {
  reactStrictMode: true,
  sentry: {
    hideSourceMaps: true,
  },
};

const sentryWebpackPluginOptions = {
  silent: true,
  org: "paybyt",
  project: "paybyt-frontend",
};

module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions); 