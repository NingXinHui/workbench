<template>
  <!--
@time:2022/1/10
@author:shaoliting 
-->
  <div>
    <component :is="current"
               :operateType="operateType"
               :currentData="currentData"
               @submit="submit" />
  </div>
</template>
<script>
import list from './component/list'
import editAdd from './component/editadd'

export default {
  name: 'Notice',
  components: {
    list,
    editAdd,
  },
  data () {
    return {
      current: 'list',
      operateType: 'add',
      currentData: {},
    }
  },
  methods: {
    submit (data) {
      let current = this.current

      if (current === 'list') {
        this.operateType = data.type
        this.currentData = data.data

        current = 'editAdd'
      } else {
        current = 'list'
      }

      this.current = current
    },
  }
}
</script>
