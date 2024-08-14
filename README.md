<!--
Get your module up and running quickly.

Find and replace all on all files (CMD+SHIFT+F):
- Name: My Module
- Package name: my-module
- Description: My new Nuxt module
-->

# Nuxt File Save

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

A nuxt plugin for file uploading to local disk

- [✨ &nbsp;Release Notes](/CHANGELOG.md)
<!-- - [🏀 Online playground](https://stackblitz.com/github/your-org/my-module?file=playground%2Fapp.vue) -->
<!-- - [📖  Documentation](https://example.com) -->

## Features

<!-- Highlight some of the features your module provide here -->

- ⛰ &nbsp;Configurable, support for multi-file upload
- 🚠 &nbsp;The type and size of the file are checked on the back end
- 🌲 &nbsp;Save to the local disk

## Quick Setup

Install the module to your Nuxt application with one command:

```bash
npx nuxi module add nuxt-file-save
```

Or add it manually to your `nuxt.config.ts`:

```bash
# Using pnpm
pnpm add -D nuxt-file-save

# Using yarn
yarn add --dev nuxt-file-save

# Using npm
npm install --save-dev nuxt-file-save
```

```ts
export default defineNuxtConfig({
    modules: ['nuxt-file-save'],
    fileSave: {
        // The location where the file is saved to disk, public by default, in the public folder at the root of the current project
        mount:'public',
        // Verify the configuration item associated with the upload file, overwriting it in the 'useFileVerify' method
        // options?: BlobUploadOptions
    }
})
```

That's it! You can now use Nuxt File Save in your Nuxt app ✨

<!-- ## Contribution

<details>
  <summary>Local development</summary>

  ```bash
  # Install dependencies
  npm install

  # Generate type stubs
  npm run dev:prepare

  # Develop with the playground
  npm run dev

  # Build the playground
  npm run dev:build

  # Run ESLint
  npm run lint

  # Run Vitest
  npm run test
  npm run test:watch

  # Release new version
  npm run release
  ```

</details> -->

## Usage

### Handling Files in the frontend

Just send the formData format data to the backend

```html
<template>
    <input type="file" multiple @change="handleFileChange" />
</template>

<script setup>
const handleFileChange = (e: any) => {
    const files = e.target.files[0]
    if (!files) return

    const formData = new FormData()
    formData.append('files', file.value)

    const res = await $fetch<{code: number, data: string, msg: string}>('/api/upload', {
        method: 'POST',
        body: formData,
    })
    console.log(res)
    if(res.code !== 200){ // fail
        return alert(res.msg)
    }

}
</script>
```

### Handling files in the backend

On the server side, the `useFileVerify` method is used to verify the file, and the `useFileSave` method is used to save it

```ts
// server/api/upload.ts

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
                maxSize: '256MB',
                types: ['audio', 'csv', 'image', 'video', 'pdf', 'text', 'zip', 'exe'],
            },
            lang: 'en', // Language for error messages
        })

        const date = new Date()
        // Generate folders based on time
        const dateDir = date.toLocaleDateString('zh-cn') // 2023/01/02
        // const dateDir = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
        const randomStr = Math.random().toString(36).substring(2, 6 + 2) // Random String 6 bits
        const fileDir = `/upload/${dateDir}`
        const url = await useFileSave(file, `${Date.now()}-${randomStr}`, fileDir)
        if (!url) return { code: 500, msg: 'error' }
        return { code: 200, msg: 'success', data: url }
    } catch (error: any) {    // eslint-disable-line
        return { code: error.statusCode, msg: error.message }
    }
})
```

If you don't want to check the file, just save the file

```ts
const form = await readFormData(event)
const [file] = form.getAll('files') as File[]
if (file) {
    const url = await useFileSave(file)
}
```

## Method

### `useFileVerify(form: FormData, options?: BlobUploadOptions)`

A method of receiving and validating files

- `form`: `FormData` object
- `options`: `BlobUploadOptions` object

**Options:**

- `formKey`: The key of the form data, default is `files`
- `multiple`: Whether to allow multiple files, The type is `number | boolean`, default is `true`
- `ensure`: The file validation rules, File size and file type
- `lang`: The language for error messages, default is `en`

**Returns:**

- An array of `File` objects, If validation fails and an error message is thrown, you can use try.catch

**Example:**

```ts
// multiple
const files = await useFileVerify(form, {
    multiple: 3, // Max 3 files at a time for now
    ensure: {
        maxSize: '50MB', // Max 50 MB each file
        types: ['audio', 'csv', 'image', 'video', 'pdf', 'text'], // Only allow these file types
    },
});

try{
    // single
    const [file] = await useFileVerify(form, {
        formKey: 'files', // The key of the form data
        multiple: false, // Only allow one file at a time
        ensure: {
            maxSize: '256MB',
            types: ['audio', 'csv', 'image', 'video', 'pdf', 'text', 'zip', 'exe'],
        },
        lang: 'en', // Language for error messages
    })
}catch(e){
    // error info
}
```

### `useFileSave(file: File, fileName = file.name, fileDir?: string)`

A method of uploading files.

- `file` is the file object data.
- `fileName` is the fileName, which defaults to the original fileName, or you can use a string with no suffix.
- `fileDir` is the directory where the file is stored.

**Returns:**

- The file url, Also using try.catch gets the error message

**Example:**

```ts
const url = await useFileSave(file, `${Date.now()}`, 'upload')
```

## Type Declarations

<details>
  <summary>Show Type Declarations</summary>

```ts
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
export type MessageLangType = 'en'|'zh'
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
```

</details>

## Error message code

| code   | message                                                 |
| ------ | ------------------------------------------------------- |
| `1000` | Received invalid file                                   |
| `1001` | Invalid file type. Only allowed: {{types}}              |
| `1002` | File too heavy. Max size is: {{maxSize}}                |
| `1003` | No files received                                       |
| `1004` | Multiple files are not allowed                          |
| `1005` | Number of files exceeded, Maximum allowed: {{multiple}} |
| `1006` | Invalid file size format: {{blobSize}}                  |
| `1007` | Invalid file size unit: {{sizeUnit}}                    |
| `1008` | Error uploading file                                    |

And that's it! Now you can use it happily in your project ✨

## Cautions (production environment related)
> (node:24872) ExperimentalWarning: buffer.File is an experimental feature and might change at any time
> - The message you are receiving isn't an issue, it's a warning emitted from the use of an experimental feature.


This library saves files to the public folder, so we can access them directly in the project.for example:

```html
<img src="/upload/1678438436123.png" alt="image" />
```

But in a production environment, when we use `nuxt build` to build a project, the `/public` file will be copied to `.output/public`(which will result in an increase in disk space), but in reality, the file will only be saved to `/public`.

For production environment problem, I suggest using nginx to configure proxies to solve them



**Run the project using PM2**
  
```js
// ecosystem.config.js  
// or 
// ecosystem.config.cjs 
module.exports = {
    apps: [
        {
            name: 'nuxt-web', // Sets the name of the PM2 process
            port: '8000', // The port on which the project runs
            exec_mode: 'cluster',
            instances: 'max',
            script: './.output/server/index.mjs',
            env: {
            },
        },
    ],
}
  
```
Run the project, if filename is `ecosystem.config.js`, `ecosystem.config.js` can be omitted
```bash
pm2 start ecosystem.config.js 
# or 
pm2 start ecosystem.config.cjs
```

**Nginx configuration**

```conf
# nuxt-web.conf
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Set variables, project root directory
    set $base_path /home/project/nuxt-web;

    location / {
        root  $base_path;
        proxy_pass   http://127.0.0.1:8000;
    }
    
    #############################################################
    # Change the directory accessed by `/upload`, Example of `useFileSave(file, '', '/upload')` with the third parameter '/upload'
    location ^~/upload {
        alias $base_path/public/upload; # Set access to file directory
        autoindex on;
        autoindex_exact_size off; # Display file size in MB, GB format instead of KB
        autoindex_localtime on; # The file time is the time of the server
        if ($request_filename ~* ^.*?\.(txt|doc|pdf|rar|gz|zip|docx|exe|xlsx|ppt|pptx|png|jpg|gif|webp)$){
            add_header Content-Disposition attachment;
            add_header  Content-Type application/octet-stream;
        } # These files with suffixes can be downloaded
    }
    #############################################################
}
```

At this point, the access path of `/upload` has been changed, and files uploaded in the production environment can still be accessed normally. The `.output/public/upload` folder can also be deleted or not

## Contribution

Run into a problem? Open a [new issue](https://github.com/nowo/nuxt-file-save/issues/new). I'll try my best to include all the features requested if it is fitting to the scope of the project.

Want to add some feature? PRs are welcome!

- Clone this repository
- install the dependencies
- prepare the project
- run dev server
  
```bash
git clone https://github.com/nowo/nuxt-file-save && cd nuxt-file-save
pnpm i
pnpm run dev:prepare
pnpm run dev
```
  
## License

MIT - Copyright (c) 2024 nowo

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/nuxt-file-save/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/nuxt-file-save

[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-file-save.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npmjs.com/package/nuxt-file-save

[license-src]: https://img.shields.io/npm/l/nuxt-file-save.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://npmjs.com/package/nuxt-file-save

[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt.js
[nuxt-href]: https://nuxt.com
