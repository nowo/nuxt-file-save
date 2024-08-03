import { defineNuxtModule, addPlugin, createResolver, addServerScanDir } from '@nuxt/kit'
import defu from 'defu'

// Here's the augmentation that makes it work
declare module '@nuxt/schema' {
    interface PublicRuntimeConfig {
        fileSave: ModuleOptions
    }
}

export default defineNuxtModule<ModuleOptions>({
    meta: {
        name: 'file-save',
        configKey: 'fileSave',
    },
    // Default configuration options of the Nuxt module
    defaults: {},
    setup(_options, _nuxt) {


        const config = _nuxt.options.runtimeConfig
        config.public.fileSave = defu(config.public.fileSave, {
            ..._options,
        })
        // console.log(config.public.fileSave)

        const resolver = createResolver(import.meta.url)

        // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
        // addPlugin(resolver.resolve('./runtime/plugin'))

        addServerScanDir(resolver.resolve('./runtime/server'))
    },
})
