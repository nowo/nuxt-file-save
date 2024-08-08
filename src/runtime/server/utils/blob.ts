import { createWriteStream, mkdirSync } from 'node:fs'
import { pipeline } from 'node:stream'
import { promisify } from 'node:util'
import { extname } from 'node:path'
import { defu } from 'defu'
import { joinURL } from 'ufo'
// import type { H3Event } from 'h3'
// import { readFormData } from 'h3'
import i18n from '../../lang/i18n'
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
     * @default true
     */
    lang?: string
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
 *
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
    // console.log(files)
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

/** Inspired by Fastify's upload guide. Used to pipe the file stream into fs */
const pump = promisify(pipeline)

/**
 * Stores the file on the disk
 * @param file - The file to store
 * @param fileName - The name of the file (default: file.name)
 * @param fileDir - The directory where the file will be stored
 * @example
 * ```ts
 * // single file
 * let url = await useFileSave(file, 'example.jpg', 'images')  // /images/example.jpg
 * if (url) return url
 *
 * // multiple files
 * let list: string[] = []
 * for (const file of files) {
 *     let url = await useFileSave(file, `${Date.now()}.png`, 'images')  // /images/[Date.now()].png
 *     if(url) list.push(url)
 * }
 * ```
 */
export async function useFileSave(file: File, fileName = file.name, fileDir?: string) {
    const ext = extname(file.name)

    let mount = useRuntimeConfig().public.fileSave.mount
    mount = typeof mount === 'string' ? mount : 'public'

    /** The name of the file to save in the local file system, When the filename does not have a suffix, fill in */
    const saveFileName = fileName.endsWith(ext) ? fileName : fileName + ext

    mkdirSync(joinURL(mount, fileDir || ''), { recursive: true })
    /** The path to the directory where you want to save the file in the local file system */
    const filePath = joinURL(mount, fileDir || '', saveFileName)
    // console.log(filePath)

    try {
        /** Stream the file into the file system to save it */
        await pump(file.stream() as any, createWriteStream(filePath)) // eslint-disable-line @typescript-eslint/no-explicit-any

        return joinURL(fileDir || '', saveFileName)
    }
    catch (error) {
        console.error('Error uploading file:', error) // Print error logs, such as PM2 log collection
        /** Return error response to the client */
        // throw createError({ statusCode: 500, message: 'Error uploading file' });
        return undefined
    }
}
