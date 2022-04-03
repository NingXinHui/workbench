<template>
<!--
@time:2021/12/1
@author:chenqian
-->
    <div>
        <component :is="current"  :operateType="operateType" :currentData="currentData" @submit="submit"/>
    </div>
</template>
<script>
import list from './component/list'
import editAdd from './component/editadd'
export default {
    name: 'Invoice',
    components: {
        list,
        editAdd,
    },
    data() {
        return {
            current: 'list',
            operateType: 'add',
            currentData: {},
        }
    },
    mounted() {
      if(this.$route.query.priceType) {
        console.log(this.$route.query)
        setTimeout(() => {
           this.submit({
          type: 'copy',
          data: {
            ids:this.$route.query.ids
          }
        })
        },300)

      }
    },
    methods: {
        submit(data) {
            let current = this.current

            if(current === 'list') {
                this.operateType = data.type
                this.currentData = data.data

                current = 'editAdd'
            } else {
                current = 'list'
            }

            this.current = current
        },
    },
}
</script>
