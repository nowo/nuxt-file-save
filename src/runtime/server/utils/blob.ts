import { createWriteStream, mkdirSync } from 'node:fs'
import { pipeline } from 'node:stream'
import { promisify } from 'node:util'
import { extname } from 'node:path'
import { joinURL } from 'ufo'
import { useRuntimeConfig } from '#imports'

/** Inspired by Fastify's upload guide. Used to pipe the file stream into fs */
const pump = promisify(pipeline)

/**
 * Stores the file on the disk
 * @param file - The file to store
 * @param fileName - The name of the file (default: file.name)
 * @param fileDir - The directory where the file will be stored (default: '')
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
export async function useFileSave(file: File, fileName = file.name, fileDir = '') {
    const ext = extname(file.name)

    let mount = useRuntimeConfig().public.fileSave.mount
    mount = typeof mount === 'string' ? mount : 'public'

    /** The name of the file to save in the local file system, When the filename does not have a suffix, fill in */
    const saveFileName = fileName.endsWith(ext) ? fileName : (fileName ? fileName + ext : file.name)

    mkdirSync(joinURL(mount, fileDir), { recursive: true })
    /** The path to the directory where you want to save the file in the local file system */
    const filePath = joinURL(mount, fileDir, saveFileName)

    try {
        /** Stream the file into the file system to save it */
        await pump(file.stream() as any, createWriteStream(filePath)) // eslint-disable-line @typescript-eslint/no-explicit-any

        return joinURL(fileDir, saveFileName)
    }
    catch (error) {
        console.error('Error uploading file:', error) // Print error logs, such as PM2 log collection
        /** Return error response to the client */
        // throw createError({ statusCode: 500, message: 'Error uploading file' });
        return undefined
    }
}
