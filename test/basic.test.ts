import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'
// import { useFileVerify } from '../src/runtime/server/utils/blob'

describe('ssr', async () => {
    await setup({
        rootDir: fileURLToPath(new URL('./fixtures/basic', import.meta.url)),
    })

    it('renders the index page', async () => {
        // Get response to a server-rendered page with `$fetch`.
        const html = await $fetch('/')
        expect(html).toContain('<div>basic</div>')
    })
})

// https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
const fileTypeData = [
    { suffix: '.txt', mime: 'text/plain' },
    { suffix: '.html', mime: 'text/html' },
    { suffix: '.json', mime: 'application/json' },
    { suffix: '.zip', mime: 'application/zip' },
    { suffix: '.exe', mime: 'application/octet-stream' },
    { suffix: '.png', mime: 'image/png' },
    { suffix: '.gif', mime: 'image/gif' },
    { suffix: '.gz', mime: 'application/gzip', size: 1024 * 1024 * 1024 },
]

// describe('upload test', async () => {
//     let form = new FormData()
//     fileTypeData.forEach(({ suffix, mime, size = 1024 }) => {
//         let content = 'hello'.padEnd(size, '01')
//         let data = new File([content], `test${suffix}`, {
//             type: mime,
//         })
//         form.append('files', data)
//     })
//     it('useFileVerify', () => {
//         try {
//             useFileVerify(form)
//             expect(false).toBe(true);
//         } catch (e: any) {

//             expect(e.message).toBe('出错了！');
//         }
//     });

//     // const file = new File(['hello world', '1423456'], 'test.txt', {
//     //     type: "text/plain",
//     // });
//     // console.log(file)
//     // const result = await useFileSave(file);
//     // expect(result?.code).toEqual(200);
// });
