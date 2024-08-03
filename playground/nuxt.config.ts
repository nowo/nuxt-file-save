export default defineNuxtConfig({
    modules: ['../src/module'],
    fileSave: {
        mount:'playground/public',
    },
    devtools: { enabled: true },
})
