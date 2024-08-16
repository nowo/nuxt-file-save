<template>
    <div>
        <input type="file" multiple @change="handleFileChange">
        <hr>

        <button @click="submit()">
            submit
        </button>
        <div>
            <img :src="src" alt="">
        </div>
        <div>
            <!-- <img src="/public/face_1.png" alt=""> -->
            <img src="/face_1.png" alt="">
        </div>
        <div v-if="loading" class="loading">
            uploading...
        </div>
    </div>
</template>

<script lang="ts" setup>
const src = ref()
const loading = ref(false)
const file = ref<File>()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleFileChange = (e: any) => {
    console.log('e.target :>> ', e.target.files)
    const files = e.target.files[0]

    if (files) file.value = files
}

// use send FormData
const submit = async () => {
    if (!file.value) return
    const formData = new FormData()

    formData.append('files', file.value)
    formData.append('data', 'sds1042357')
    // const a = formData.getAll('files')
    // console.log('a :>> ', a)
    try {
        await useFileVerify(formData, {
            ensure: {
                maxSize: '100MB',
                types: ['audio', 'image', 'video', 'pdf', 'zip'],
            },
        })
    }
    catch (error) {
        alert(error)
        return
    }

    loading.value = true
    const res = await $fetch<{ code: number, data: string, msg: string }>('/api/upload', {
        method: 'POST',
        body: formData,
    })
    loading.value = false
    console.log(res)
    if (res.code !== 200) return alert(res.msg)
    src.value = res.data
}
</script>

<style setup>
.loading {
    width: 100%;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, .3);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
}
</style>
