// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-11-01',
    devtools: { enabled: true },
    runtimeConfig: {
        public: {
            wpApiUrl: process.env.WP_API_URL || 'https://www.bluewaterpe.com/wp-json/wp/v2',
        },
    },
  })
