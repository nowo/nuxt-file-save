import { fileURLToPath } from 'node:url'
import MyModule from '../../../src/module'

export default defineNuxtConfig({
    modules: [
        MyModule,
    ],

    fileSave: {
        // Absolute path so uploads land in a predictable, git-ignored dir regardless of cwd
        mount: fileURLToPath(new URL('./.data', import.meta.url)),
    },
})
