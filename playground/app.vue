<template>
    <div>
        <input type="file" multiple @change="handleFileChange" />
        <hr>
        <button @click="submit()">submit</button>
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

defineEmits()

const src = ref()

const file = ref<File>()

const handleFileChange = (e:any) => {
    console.log('e.target :>> ', e.target.files);
    const files = e.target.files[0]
    console.log(files)
    file.value = files
    // const reader = new FileReader()
    // reader.onload = (e) => {
    //     const data = e.target.result
    //     const workbook = XLSX.read(data, { type: 'array' })
    //     const worksheet = workbook.Sheets[workbook.SheetNames[0]]
    //     const jsonData = XLSX.utils.sheet_to_json(worksheet)
    //     console.log(jsonData)
    // }
    // reader.readAsArrayBuffer(file)
}

// use send FormData
const submit = async () => {
    console.log('file.value :>> ', file.value);
    if (!file.value) return
    console.time("submit2");
    console.profile('submit2-profile');
    // for (let item of Array.from({ length: 10 }).fill(1)) {
    const formData = new FormData()
    // Array.from(filesList.value).forEach((file) => {
    // 	formData.append('file', file)
    // })
    formData.append('files', file.value)
    formData.append('data', 'sds1042357')

    const res = await $fetch<{ data: string }>('/api/upload', {
        method: 'POST',
        body: formData,
    })
    console.log(res)
    console.timeEnd("submit2");
    console.profileEnd('submit2-profile');
    if (!res) return
    src.value = res.data

}
</script>

<style>
/* 让内容按列纵向展示 */
.container {
    display: flex;
    flex-flow: column wrap;
    height: 600px;

    &::before,
    &::after {
        content: "";
        flex-basis: 100%;
        width: 0;
        order: 2;
    }

    /* 重新定义内容块排序优先级，让其横向排序 */
    .item:nth-child(3n+1) {
        order: 1;
    }

    .item:nth-child(3n+2) {
        order: 2;
    }

    .item:nth-child(3n) {
        order: 3;
    }

}


/* 强制使内容块分列的隐藏列 */
/* .container {
    column-count: auto;
    column-width: 150px;
    .item{
        display: block;
    }
} */
</style>
