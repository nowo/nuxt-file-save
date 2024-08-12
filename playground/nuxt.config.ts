export default defineNuxtConfig({
  modules: ['../src/module'],

  fileSave: {
      mount: 'playground/public',
  },

  devtools: { enabled: true },
  compatibilityDate: '2024-08-12',
})