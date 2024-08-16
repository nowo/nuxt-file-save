import { defineNuxtModule, addPlugin, createResolver, addServerScanDir, addImportsDir, addServerImports } from '@nuxt/kit'
import defu from 'defu'
import type { BlobUploadOptions } from './runtime/composables/blob'

// Here's the augmentation that makes it work
declare module '@nuxt/schema' {
    interface PublicRuntimeConfig {
        // this key is used meta.configKey
        fileSave: FileSaveOptions
    }
}
// Module options TypeScript interface definition
declare interface FileSaveOptions {
    /**
     * The path to the file mount
     * @default 'public'
     */
    mount?: string
    options?: BlobUploadOptions
}

export default defineNuxtModule<FileSaveOptions>({
    meta: {
        name: 'file-save',
        configKey: 'fileSave',
        // Compatibility constraints
        compatibility: {
            // Semver version of supported nuxt versions
            nuxt: '>=3.0.0',
        },
    },
    // Default configuration options of the Nuxt module
    defaults: {
        mount: 'public',
    },
    setup(_options, _nuxt) {
        const config = _nuxt.options.runtimeConfig
        config.public.fileSave = defu(config.public.fileSave, {
            ..._options,
        })

        const resolver = createResolver(import.meta.url)

        // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
        // addPlugin(resolver.resolve('./runtime/plugin'))

        addImportsDir(resolver.resolve('./runtime/composables'))
        addServerImports([{ name: 'useFileVerify', from: resolver.resolve('./runtime/composables/blob.ts') }])
        addServerScanDir(resolver.resolve('./runtime/server'))
    },
})
