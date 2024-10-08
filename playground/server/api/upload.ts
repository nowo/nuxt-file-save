// example
export default defineEventHandler(async (event) => {
    try {
        const form = await readFormData(event)

        // multiple
        // const files = await useFileVerify(form, {
        //     multiple: 3, // Max 3 files at a time for now
        //     ensure: {
        //         maxSize: '50MB', // Max 50 MB each file
        //         types: ['audio', 'csv', 'image', 'video', 'pdf', 'text'], // Only allow these file types
        //     },
        // });

        // for (const file of files) {
        //     await useFileSave(file);
        // }

        // single
        const [file] = await useFileVerify(form, {
            formKey: 'files', // The key of the form data
            multiple: false, // Only allow one file at a time
            ensure: {
                maxSize: '25.6MB',
                types: ['audio', 'csv', 'image', 'video', 'pdf', 'text', 'zip', 'exe'],
            },
            lang: 'zh', // Language for error messages
        })

        const date = new Date()
        // Generate folders based on time
        const dateDir = date.toLocaleDateString('zh-cn') // 2023/01/02
        // const dateDir = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
        const randomStr = Math.random().toString(36).substring(2, 6 + 2) // Random String 6 bits
        const fileDir = `/upload/${dateDir}`
        // randomStr
        const url = await useFileSave(file, `${Date.now()}-${randomStr}`, fileDir)
        if (!url) return { code: 500, msg: 'error' }
        return { code: 200, msg: 'success', data: url }
    } catch (error: any) {    // eslint-disable-line
        if (error?.statusCode === 1000) { // Rewrite the message
            return { code: error.statusCode, msg: 'Please upload the correct file' }
        }
        else {
            return { code: error.statusCode, msg: error.message }
        }
    }
})
