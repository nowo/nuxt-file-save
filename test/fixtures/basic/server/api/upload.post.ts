import type { BlobType, BlobSize, MessageLangType } from '../../../../../src/runtime/composables/blob'

// Minimal upload endpoint used by the e2e tests. Validation is driven by query
// params so a single endpoint can exercise the different code paths.
export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const lang = (query.lang as MessageLangType) || 'en'

    try {
        const files = await useFileVerify(await readFormData(event), {
            multiple: true,
            lang,
            ensure: {
                maxSize: (query.maxSize as BlobSize) || undefined,
                types: query.types ? (query.types as string).split(',') as BlobType[] : undefined,
            },
        })

        const data: (string | undefined)[] = []
        for (const file of files) {
            data.push(await useFileSave(file, file.name, 'files'))
        }
        return { code: 200, data }
    }
    catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
        return { code: error?.statusCode, msg: error?.message }
    }
})
