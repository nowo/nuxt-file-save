import { createWriteStream, mkdirSync } from 'node:fs'
import { pipeline } from 'node:stream'
import { promisify } from 'node:util'
import { basename, extname, join, resolve, sep } from 'node:path'
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
    const named = fileName.endsWith(ext) ? fileName : (fileName ? fileName + ext : file.name)
    /** Strip any directory components so a (possibly client-controlled) name can't escape the mount dir */
    const saveFileName = basename(named)
    /** Drop leading separators so the sub-dir is never treated as an absolute path */
    const subDir = fileDir.replace(/^[\\/]+/, '')

    const mountRoot = resolve(mount)
    /** The directory where the file will be stored, resolved against the mount root */
    const targetDir = resolve(mountRoot, subDir)

    /** Guard against path traversal via `..` in fileDir */
    if (targetDir !== mountRoot && !targetDir.startsWith(mountRoot + sep)) {
        console.error('Blocked path traversal attempt:', { fileName, fileDir })
        return undefined
    }

    mkdirSync(targetDir, { recursive: true })
    /** The absolute path of the file in the local file system */
    const filePath = join(targetDir, saveFileName)

    try {
        /** Stream the file into the file system to save it */
        await pump(file.stream() as any, createWriteStream(filePath)) // eslint-disable-line @typescript-eslint/no-explicit-any

        return joinURL(subDir, saveFileName)
    }
    catch (error) {
        console.error('Error uploading file:', error) // Print error logs, such as PM2 log collection
        /** Return error response to the client */
        // throw createError({ statusCode: 500, message: 'Error uploading file' });
        return undefined
    }
}
