# Changelog


## v1.2.5

[compare changes](https://github.com/nowo/nuxt-file-save/compare/v1.2.4...v1.2.5)

### 🩹 Fixes

- Prevent path traversal and fix i18n race ([397f377](https://github.com/nowo/nuxt-file-save/commit/397f377))

### 📖 Documentation

- Recommend storing uploads outside public ([de4ed2f](https://github.com/nowo/nuxt-file-save/commit/de4ed2f))

### 📦 Build

- **deps:** Bump rollup from 3.29.4 to 3.29.5 ([b989ca4](https://github.com/nowo/nuxt-file-save/commit/b989ca4))
- Upgrade module-builder to 1.0, ESM-only output ([6340899](https://github.com/nowo/nuxt-file-save/commit/6340899))

### 🏡 Chore

- Update deps ([8375368](https://github.com/nowo/nuxt-file-save/commit/8375368))
- **release:** V1.2.4 ([7876b60](https://github.com/nowo/nuxt-file-save/commit/7876b60))

### ✅ Tests

- Add file upload e2e tests ([8067cee](https://github.com/nowo/nuxt-file-save/commit/8067cee))

### 🤖 CI

- Use pnpm in publish workflow ([571834a](https://github.com/nowo/nuxt-file-save/commit/571834a))

### ❤️ Contributors

- Nowo ([@nowo](http://github.com/nowo))
- Cooj ([@nowo](http://github.com/nowo))

## v1.2.4

[compare changes](https://github.com/nowo/nuxt-file-save/compare/v1.2.3...v1.2.4)

### 🏡 Chore

- Set local build with ci as standby ([ec8892a](https://github.com/nowo/nuxt-file-save/commit/ec8892a))
- Update deps ([8375368](https://github.com/nowo/nuxt-file-save/commit/8375368))

### 🤖 CI

- Update ci configuration ([1726b48](https://github.com/nowo/nuxt-file-save/commit/1726b48))

### ❤️ Contributors

- Cooj ([@nowo](http://github.com/nowo))

## v1.2.3

[compare changes](https://github.com/nowo/nuxt-file-save/compare/v1.2.2...v1.2.3)

### 💅 Refactors

- `useFileVerify` is extracted from `server/utils` and designed to be used simultaneously on both the client and server sides ([45a09c9](https://github.com/nowo/nuxt-file-save/commit/45a09c9))

### 📖 Documentation

- Update the document ([d75115c](https://github.com/nowo/nuxt-file-save/commit/d75115c))

### 🤖 CI

- Fix a packaging error ([db0d7b5](https://github.com/nowo/nuxt-file-save/commit/db0d7b5))

### ❤️ Contributors

- Cooj <z8888788@163.com>

## v1.2.2

[compare changes](https://github.com/nowo/nuxt-file-save/compare/v1.2.1...v1.2.2)

### 🩹 Fixes

- Replace `ModuleOptions` with `FileSaveOptions` ([43e5468](https://github.com/nowo/nuxt-file-save/commit/43e5468))

### 🤖 CI

- Configure github action to publish automatically ([82dd5af](https://github.com/nowo/nuxt-file-save/commit/82dd5af))
- Change the CI folder name ([c8fb6d9](https://github.com/nowo/nuxt-file-save/commit/c8fb6d9))

### ❤️ Contributors

- Cooj ([@nowo](http://github.com/nowo))

## v1.2.1

[compare changes](https://github.com/nowo/nuxt-file-save/compare/v1.2.0...v1.2.1)

### 🩹 Fixes

- Set the type of the `lang` parameter ([bad131a](https://github.com/nowo/nuxt-file-save/commit/bad131a))

### 📖 Documentation

- Update the document, Explanation of precautions for production environment ([56386a8](https://github.com/nowo/nuxt-file-save/commit/56386a8))

### 🏡 Chore

- **release:** V1.2.0 ([cd051c4](https://github.com/nowo/nuxt-file-save/commit/cd051c4))
- Update deps, add loading to app.vue ([169df5a](https://github.com/nowo/nuxt-file-save/commit/169df5a))

### ❤️ Contributors

- Cooj ([@nowo](http://github.com/nowo))

## v1.2.0

[compare changes](https://github.com/nowo/nuxt-file-save/compare/v1.1.1...v1.2.0)

### 🩹 Fixes

- Handles the case where the `useFileSave` method fileName parameter has an empty string name ([8215169](https://github.com/nowo/nuxt-file-save/commit/8215169))

### 💅 Refactors

- `receiveFiles` , `handleFileUpload` methods are renamed `useFileVerify` and `useFileSave` ([7979b11](https://github.com/nowo/nuxt-file-save/commit/7979b11))

### 📖 Documentation

- Update the document ([210571d](https://github.com/nowo/nuxt-file-save/commit/210571d))
- Update the document ([d104c93](https://github.com/nowo/nuxt-file-save/commit/d104c93))

### 🏡 Chore

- Remove the extra files and replace `pathJoin` with `joinURL` ([7def499](https://github.com/nowo/nuxt-file-save/commit/7def499))
- Remove console.log() and fix code style ([f0ea2b1](https://github.com/nowo/nuxt-file-save/commit/f0ea2b1))

### ❤️ Contributors

- Cooj ([@nowo](http://github.com/nowo))

## v1.1.1

[compare changes](https://github.com/nowo/nuxt-file-save/compare/v1.1.1-0...v1.1.1)

## v1.1.0

[compare changes](https://github.com/nowo/nuxt-file-save/compare/v1.0.1...v1.1.0)

### 🚀 Enhancements

- Add file upload method, using `i18n` internationalization configuration ([92c478d](https://github.com/nowo/nuxt-file-save/commit/92c478d))

### 🩹 Fixes

- Fix code style ([49937c8](https://github.com/nowo/nuxt-file-save/commit/49937c8))
- Typescript types are written together, reducing the output of the file package ([7f301b8](https://github.com/nowo/nuxt-file-save/commit/7f301b8))
- The `useFileVerify` function uses `event` as an argument in the case of a build-time error ([1e0c81a](https://github.com/nowo/nuxt-file-save/commit/1e0c81a))

### 📦 Build

- Fix a situation where the type was dropped when the package was published ([80498a3](https://github.com/nowo/nuxt-file-save/commit/80498a3))

### 🏡 Chore

- Add CI workflow configuration, automatically publish ([fdcd858](https://github.com/nowo/nuxt-file-save/commit/fdcd858))

### ❤️ Contributors

- Cooj ([@nowo](http://github.com/nowo))

## v1.0.1


### 🏡 Chore

- Init code ([1fbd33c](https://github.com/your-org/nuxt-file-save/commit/1fbd33c))

### 🎨 Styles

- Eslint rule change ([f1c7266](https://github.com/your-org/nuxt-file-save/commit/f1c7266))

### ❤️ Contributors

- Cooj ([@nowo](http://github.com/nowo))

