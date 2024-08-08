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
            <img src="/public/face_1.png" alt="">
            <!-- <img src="/face_1.png" alt=""> -->
        </div>
    </div>
</template>

<script lang="ts" setup>
const src = ref()

const file = ref<File>()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleFileChange = (e: any) => {
    console.log('e.target :>> ', e.target.files)
    const files = e.target.files[0]
    // console.log(files)
    if (files) file.value = files
}

// use send FormData
const submit = async () => {
    // console.log('file.value :>> ', file.value)
    if (!file.value) return
    const formData = new FormData()

    formData.append('files', file.value)
    formData.append('data', 'sds1042357')

    const res = await $fetch<{code:number, data: string,msg:string }>('/api/upload', {
        method: 'POST',
        body: formData,
    })
    console.log(res)

    if (res.code!==200) return alert(res.msg)
    src.value = res.data
}
</script>
