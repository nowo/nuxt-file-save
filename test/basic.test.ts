import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'

const rootDir = fileURLToPath(new URL('./fixtures/basic', import.meta.url))

interface UploadResult { code: number, data?: (string | undefined)[], msg?: string }

function upload(files: File[], query: Record<string, string> = {}) {
    const form = new FormData()
    for (const file of files) form.append('files', file)
    return $fetch<UploadResult>('/api/upload', { method: 'POST', query, body: form })
}

describe('nuxt-file-save', async () => {
    await setup({ rootDir })

    it('renders the index page', async () => {
        // Get response to a server-rendered page with `$fetch`.
        const html = await $fetch('/')
        expect(html).toContain('<div>basic</div>')
    })

    it('saves an uploaded file and returns its url', async () => {
        const res = await upload([new File(['hello'], 'hello.txt', { type: 'text/plain' })])
        expect(res.code).toBe(200)
        expect(res.data?.[0]).toBe('files/hello.txt')
    })

    it('strips path traversal from the uploaded file name', async () => {
        const res = await upload([new File(['x'], '../../../evil.txt', { type: 'text/plain' })])
        // basename() drops the directory components, so the file stays inside the mount dir
        expect(res.code).toBe(200)
        expect(res.data?.[0]).toBe('files/evil.txt')
        expect(res.data?.[0]).not.toContain('..')
    })

    it('rejects a disallowed file type', async () => {
        const res = await upload([new File(['x'], 'a.txt', { type: 'text/plain' })], { types: 'image' })
        // NOTE: 1001 is not a valid HTTP status code, so H3 sanitizes it to 500.
        // Only the (localized) message survives — assert against that.
        expect(res.code).not.toBe(200)
        expect(res.msg).toContain('Invalid file type')
    })

    it('returns localized error messages', async () => {
        const res = await upload([new File(['x'], 'a.txt', { type: 'text/plain' })], { types: 'image', lang: 'zh' })
        expect(res.msg).toContain('无效的文件类型')
    })
})
