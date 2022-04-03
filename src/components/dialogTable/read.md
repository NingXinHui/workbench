根据父组件的openModal来判断当前页面是否显示 
 父组件通过ref来操作子组件的一些方法
 <update-add
      v-if="openModal" 
      ref="child"
      :isedit="isedit" // 是新增还是编辑
      :sendarr="sendarr" // 要显示的弹框里面的添加项 []
      :sendnew="sendnew"// 传给要显示的数据 {}
      @closeModal="closeModal"// 关闭弹框操作 
      @addNewSure="addNewSure"// 新增走的方法
      @updateOneSure="updateOneSure" // 编辑走的接口
    />