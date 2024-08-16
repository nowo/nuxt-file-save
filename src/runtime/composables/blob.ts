import { defu } from 'defu'
import i18n from '../lang'
import { createError, useRuntimeConfig } from '#imports'

// Credits from shared utils of https://github.com/pingdotgg/uploadthing
export type FileSizeUnit = 'B' | 'KB' | 'MB' | 'GB' | 'TB'
export type BlobSize = `${number}${FileSizeUnit}`
export type BlobType =
    | 'image'
    | 'video'
    | 'audio'
    | 'pdf'
    | 'csv'
    | 'text'
    | 'blob'
    | (string & Record<never, never>)

export type MessageLangType = 'en' | 'zh'
export interface BlobUploadOptions {
    /**
     * The key to get the file/files from the request form.
     * @default 'files'
     */
    formKey?: string
    /**
     * Whether to allow multiple files to be uploaded.
     * @default true
     */
    multiple?: boolean | number
    /**
     * Options used for the ensure() method.
     */
    ensure?: BlobEnsureOptions
    /**
     * The language in which the text message corresponds
     * @default 'en'
     */
    lang?: MessageLangType
}

export interface BlobEnsureOptions {
    /**
     * The maximum size of the blob (e.g. '1MB')
     */
    maxSize?: BlobSize
    /**
     * The allowed types of the blob (e.g. ['image/png', 'application/json', 'video'])
     */
    types?: BlobType[]
}

/**
 * Helper function that converts any valid BlobSize into numeric bytes value
 *
 * @example "1MB", "1500B", "1.2GB"
 *
 * @throws If the input is not a valid BlobSize
 */
export function fileSizeToBytes(input: BlobSize) {
    // Credits from shared utils of https://github.com/pingdotgg/uploadthing
    const FILE_SIZE_UNITS = ['B', 'KB', 'MB', 'GB', 'TB']
    const regex = new RegExp(`^(\\d+)(\\.\\d+)?\\s*(${FILE_SIZE_UNITS.join('|')})$`, 'i')
    const match = input.match(regex)

    if (!match) {
        throw createError({
            statusCode: 1006,
            message: i18n.t('1006', { blobSize: input }),
        })
    }

    const sizeValue = Number.parseFloat(match[1])
    const sizeUnit = match[3].toUpperCase() as FileSizeUnit

    if (!FILE_SIZE_UNITS.includes(sizeUnit)) {
        throw createError({
            statusCode: 1007,
            message: i18n.t('1007', { sizeUnit }),
        })
    }

    const bytes = sizeValue * Math.pow(1024, FILE_SIZE_UNITS.indexOf(sizeUnit))
    return Math.floor(bytes)
}

/**
 * Ensure the blob is valid and meets the specified requirements.
 *
 * @param blob The blob to check
 * @param options The options to check against
 * @param options.maxSize The maximum size of the blob (e.g. '1MB')
 * @param options.types The allowed types of the blob (e.g. ['image/png', 'application/json', 'video'])
 *
 * @throws If the blob does not meet the requirements
 */
export function ensureBlob(blob: Blob & { name?: string }, options: BlobEnsureOptions = {}) {
    if (!(blob instanceof Blob)) {
        // Received invalid file
        throw createError({
            statusCode: 1000,
            message: i18n.t('1000'),
        })
    }

    if (options.maxSize) {
        const maxFileSizeBytes = fileSizeToBytes(options.maxSize)

        if (blob.size > maxFileSizeBytes) {
            // File too heavy
            throw createError({
                statusCode: 1002,
                message: i18n.t('1002', { maxSize: options.maxSize }),
            })
        }
    }

    const [blobType, blobSubtype] = blob.type.split('/')
    const ext = blob.name?.split('.')?.pop() || ''

    if (
        options.types?.length
        && !options.types?.includes(blob.type)
        && !options.types?.includes(blobType)
        && !options.types?.includes(blobSubtype)
        && !options.types?.includes(ext)
    ) {
        // Invalid file type
        throw createError({
            statusCode: 1001,
            message: i18n.t('1001', { types: options.types.join(', ') }),
        })
    }
}

/**
 * Utility to receive a file or files from body's FormData without storing it.
 * @param form FormData
 * @param options The options to use
 * @example
 * ```js
 *  const form = await readFormData(event)
 *  // multiple
 *  const files = await useFileVerify(form, {
 *      multiple: 3, // Max 3 files at a time for now
 *      ensure: {
 *          maxSize: '50MB', // Max 50 MB each file
 *          types: ['audio', 'csv', 'image', 'video', 'pdf', 'text'], // Only allow these file types
 *      },
 *  });
 *
 *  // single
 *  const [file] = await useFileVerify(form, {
 *      formKey: 'files',   // The key of the form data
 *      multiple: false,    // Only allow one file at a time
 *      ensure: {
 *          maxSize: '256MB',
 *          types: ['audio', 'csv', 'image', 'video', 'pdf', 'text', 'zip', 'exe'],
 *      },
 *      lang: 'zh', // Language for error messages
 *  });
 * ```
 * @throws
 * If the files are invalid or don't meet the ensure conditions.
 */
export async function useFileVerify(form: FormData, options: BlobUploadOptions = {}) {
    const opt = useRuntimeConfig().public.fileSave.options
    options = defu(options, opt, { formKey: 'files', multiple: true, lang: 'en' } satisfies BlobUploadOptions)
    if (i18n.language != options.lang) {
        await i18n.changeLanguage(options.lang)
    }
    // const form = await readFormData(event)
    const files = form.getAll(options.formKey!) as File[]

    if (!files?.length) {
        throw createError({
            statusCode: 1003,
            message: i18n.t('1003'),
        })
    }

    if (!options.multiple && files.length > 1) {
        throw createError({
            statusCode: 1004,
            message: i18n.t('1004'),
        })
    }

    if (typeof options.multiple === 'number' && files.length > options.multiple) {
        throw createError({
            statusCode: 1005,
            message: i18n.t('1005', { multiple: options.multiple }),
        })
    }

    if (options.ensure?.maxSize || options.ensure?.types?.length) {
        for (const file of files) {
            ensureBlob(file, options.ensure)
        }
    }

    return files
}
