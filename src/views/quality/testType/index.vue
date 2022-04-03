<template>
  <!-- 检验类型 -->
  <div>
    <component :is="current" :operateType="operateType" :currentData="currentData" @submit="submit"/>
  </div>
</template>
<script>
import list from './components/list'
import editAdd from './components/editAdd'

export default {
  name: 'QualityTestType',
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
  methods: {
    submit(data) {
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
