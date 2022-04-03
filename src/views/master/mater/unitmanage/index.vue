<template>
  <!-- 字典维护 -->
  <div id="zPage">
    <div class="z-header">
      <div class="z-header-button">
        <el-button @click="editAdd('add')">新增</el-button>
        <el-button @click="editAdd('edit')">编辑</el-button>
        <el-button class="delButton"  @click="() => deleteOne()" >删除</el-button>
      </div>

    </div>
    <div class="z-content">
      <el-card>
        <header-search :searchArr="searchArr" @sureSearch="searchMethod"></header-search>
        <div class="z-content-table">
          <common-table
              ref="mainTable"
              :isMain="true"
              :tableColumn="tableColumn"
              :tableData="tableData"
              :isSelection="true"
              :loading="loading"
              :pageParams="pageParams"
              @selePage="handleItemSelect"
              @pageChange="pageSizeChange"
          />
        </div>
      </el-card>
    </div>

    <edit-add v-if="config.show" :config="config" :editLoading="editLoading" :formConfig="formConfig"
              :editData="editAddData" @close="config.show = false" @submit="submit"></edit-add>
  </div>
</template>
<script>
import {
  getDictDataList,
  addDictData,
  editDictData,
  getDictDetailsData,
  queryAllData,
} from '@/api/basicConfig/commonality/dict'
import HeaderSearch from '@/components/CommonHeadSearch/ZSearch'
import commonTable from '@/components/CommonTable'
import editAdd from '@/components/DialogForm/index'

import {unitListAll,dictDataList,unitListAllNoPage,unitAdd,unitUpdate,unitGetCode,unitDelete} from "@/api/apizhu";

export default {
  name: 'CommonalityDictionary',
  components: {
    HeaderSearch,
    commonTable,
    editAdd,

  },
  data() {
    return {
      huanUnitList:[],//换算单位
      queryForm: {},
      //列表列
      tableColumn: [
        {
          // width: "60",
          type: "index",
          label: "序号",
        },
         {
          label: '单位名称',
          prop: 'unitName',
        },
        {
          label: '单位代码',
          prop: 'unitCode',
        },

        {
          label: '单位类型',
          prop: 'unitType',
        },
        {
          label: '是否可用',
          prop: 'system',
          align: 'center',
          render: (h, scope) => {
            let bool = scope.row.usable

            return h("el-checkbox", {
              attrs: {
                disabled: true,
                value: bool,
              },
            },);
          },
        },
        {
          label: '是否标准',
          prop: 'usable',
          align: 'center',
          render: (h, scope) => {
            let bool = scope.row.standard

            return h("el-checkbox", {
              attrs: {
                disabled: true,
                value: bool,
              },
            },);
          },
        },
         {
          label: '是否系统',
          prop: 'usable',
          align: 'center',
          render: (h, scope) => {
            let bool = scope.row.system

            return h("el-checkbox", {
              attrs: {
                disabled: true,
                value: bool,
              },
            },);
          },
        },
        {
          label: '换算单位',
          prop: 'conversionUnitId',
        },
        {
          label: '换算系数',
          prop: 'conversionFactor',
        },
          {
          label: '创建人',
          prop: 'createUser',
        },
        {
          label: '创建时间',
          prop: 'createTime',
        },
      ],
      //列表数据
      tableData: [],
      //加载效果
      loading: false,
      //分页
      pageParams: {
        pageNum: 1,
        pageSize: 30,
        total: 1,
      },
      //当前选中数据
      multipleSelection: [],
      //当前编辑数据
      editAddData: {},
      config: {
        show: false,
        type: 'add',
        title: '',
      },
      //字典大类列表
      dictTypeList: [],
      popConfig: {
        show: false,
      },
      editLoading: false,
    }
  },
  computed: {
    //查询条件
    searchArr() {
      return [
        {
          type: 1,
          label: '单位',
          value: 'unitName',
        },

        {
          type: 2,
          label: '单位类型',
          value: 'unitType',
          selectOption: this.dictTypeList,
          optionLabel: 'value',
          optionValue: 'value',
        },
      ]
    },
    formConfig() {
     let bool=false;
      let formItemList = [
        {
          key: 'unitName',
          type: 'input',
          subtype: 'text',
          label: '单位名称',
          disabled: bool,
          rules: {
            required: true, trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value) {
                callback()
              } else {
                this.$message.error('单位名称不能为空')
              }
            },
          },
        },
         {
          key: 'unitCode',
          type: 'input',
          subtype: 'text',
          label: '单位代码',
          disabled: bool,
          rules: {
            required: true, trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value) {
                callback()
              } else {
                this.$message.error('单位代码不能为空')
              }
            },
          },
        },
        // {
        //   key: 'dictTypeName',
        //   type: 'input',
        //   subtype: 'text',
        //   label: '类型名称',
        //   disabled: bool,
        //   rules: {
        //     required: true, trigger: 'blur',
        //     validator: (rule, value, callback) => {
        //       if (value) {
        //         callback()
        //       } else {
        //         this.$message.error('大类名称不能为空')
        //       }
        //     },
        //   },
        // },
        {
            key: 'unitType',
            type: 'select',
            label: '单位类型',
            options: this.dictTypeList,
            optionLabel: 'value',
            optionValue: 'value',
            disabled: bool,
            rules: {
              required: true, trigger: 'blur',
              validator: (rule, value, callback) => {
                if (value) {
                  callback()
                } else {
                  this.$message.error('单位类型不能为空')
                }
              },
            },
          },
           {
            key: 'conversionUnitId',
            type: 'select',
            label: '换算单位',
            options: this.huanUnitList,
             optionLabel: 'unitName',
            optionValue: 'id',
            //  options:[],
            disabled: bool,
            // rules: {
            //   required: true, trigger: 'blur',
            //   validator: (rule, value, callback) => {
            //     if (value) {
            //       callback()
            //     } else {
            //       this.$message.error('换算单位不能为空')
            //     }
            //   },
            // },
          },
          {
          key: 'conversionFactor',
          type: 'input',
          subtype: 'text',
          label: '换算系数',
          disabled: bool,
          // rules: {
          //   required: true, trigger: 'blur',
          //   validator: (rule, value, callback) => {
          //     if (value) {
          //       callback()
          //     } else {
          //       this.$message.error('换算系数不能为空')
          //     }
          //   },
          // },
        },
        {
          key: 'group',
          label: '',
          type: 'checkboxGroup',
          options: [
            {
              value: 'system',
              label: '是否标准',
            },
            {
              value: 'usable',
              label: '是否可用',
            },
          ],
        },
        // {
        //   key: 'remark',
        //   type: 'input',
        //   subtype: 'textarea',
        //   label: '备注',
        //   maxlength: 200
        // }
      ]

      return {
        inline: true,
        labelWidth: 'auto',
        size: 'mini',
        formItemList,
      }
    },
  },
  created() {
    this.queryAllData()
    this.pageChange(1)
  },
  methods: {

    deleteOne() {
      if (!this.checkCount()) {
        return;
      }
      this.$confirm('确定删除选中的数据', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        unitDelete(this.multipleSelection[0].id).then((res) => {
        if (res.success) {
          this.clearSelct();
          this.getDataList();
        }
      });


      }).catch(() => {

      })



    },
    /**
     * @desc 选择条数校验
     */
    checkCount() {
      let bool = true,
          count = this.multipleSelection.length

      if (count != 1) {
        let title = '此操作只允许操作一条数据'

        if (count < 1) {
          title = '请选择操作项'
        }

        this.$message({
          message: title,
          type: "error",
          showClose: true
        })
        bool = false
      }

      return bool
    },
    /**
     * @desc 查询字典大类下拉选择
     */
    queryAllData() {
      dictDataList('unitType').then(res => {


        this.dictTypeList = res.data;

      })
          .catch(error => {
            console.group(error)
            this.dictTypeList = []
          })
    },
    /**
     * @desc 字典配置
     */
    dictConfig() {
      if (!this.checkCount()) {
        return
      }
      this.editAddData = this.multipleSelection[0]
      this.popCancel(true)
    },
    /**
     * @desc 字典配置弹框显隐
     */
    popCancel(data) {
      this.popConfig.show = data
    },

    /**
     * #desc 获取换算的那位
     */
    // unitListAllNoPage
    getallunit(){
      unitListAllNoPage().then(res=>{
        this.huanUnitList=res.data
      })

    },



    /**
     * @desc 点击添加编辑
     */
    editAdd(type = 'add') {
      let title = '新增字典类型'

      this.getallunit()



      if (type !== 'add') {
        if (!this.checkCount()) {
          return
        }
        if (type === 'edit') {
          title = '编辑字典类型'
          this.getDetailsData()
        }

      } else {
        this.initEditData()
      }
      this.config = {
        ...this.config,
        type,
        title,
      }
    },
    /**
     * @desc 获取列表详情
     */
    getDetailsData() {
      let params = {
        id: this.multipleSelection[0].id,
      }

      unitGetCode(params.id).then(res => {
        this.initEditData(res.data)
      })
          .catch(error => {
            console.group(error)
            this.initEditData()
          })
    },
    /**
     * @desc 初始化新增和编辑数据
     */
    initEditData(data = {}) {
      this.$nextTick(() => {

        let basic = {
          // dictCategotyId: '',
          // dictTypeName: '',
          // dictTypeNo: '',
          // system: true,
          // remark: '',
          // usable: true,
          group: this.config.type === 'add' ? ['usable'] : [],
        }

        if (data.usable) {
          basic.group.push('usable')
        }

        if (data.system) {
          basic.group.push('system')
        }
        this.editAddData = {
          ...basic,
          ...data,
        }

        this.config.show = true
      })
    },
    /**
     * @desc 点击查询列表
     */
    searchMethod(data) {
      this.queryForm = data

      this.getDataList()
    },
    /**
     * @desc 获取数据列表
     */
    getDataList() {
      this.loading = true

      let params = this.getQueryParams()

      this.clearSelct()
      unitListAll(params).then(res => {
        this.loading = false

        this.tableData = res.data.records
        this.pageParams.total = res.data.total
      })
          .catch(() => {
            this.loading = false
            this.tableData = []
            this.pageParams.total = 0
          })
    },
    /**
     * @desc 初始化接口参数
     */
    getQueryParams() {
      let params = {
            current: this.pageParams.pageNum,
            size: this.pageParams.pageSize,
          },
          objParams = {
            unitCode: 'unitName',
            unitType: 'unitType',
            unitName:'unitName',

          }


      Object.keys(objParams).forEach(item => {
        if (typeof this.queryForm[objParams[item]] != 'undefined' && this.queryForm[objParams[item]] != '') {
          params[item] = this.queryForm[objParams[item]]
        }
      })

      return params
    },
    /**
     * @desc 获取选中的数据
     */
    handleItemSelect(val) {
      this.multipleSelection = val
    },

    /**
     * @desc 页面发生变化
     */
    pageChange(page) {
      this.pageParams.pageNum = page

      this.getDataList()
    },
    /**
     * @desc 页面页码页面数字改变
     */
    pageSizeChange(data) {
      this.pageParams.pageNum = data.page
      this.pageParams.pageSize = data.limit

      this.getDataList()
    },
    /**
     * @desc 编辑或添加取对应值
     */
    getEditParams() {
      let params = {},
          objParams = {
            dictCategotyId: 'dictCategotyId',
            dictTypeName: 'dictTypeName',
            dictTypeNo: 'dictTypeNo',
            system: 'system',
            remark: 'remark',
            usable: 'usable',
            id: 'id',
          }

      Object.keys(objParams).forEach(item => {
        let value = this.editAddData[objParams[item]]

        if (typeof value != 'undefined' || value === 0) {
          params[item] = value
        }
      })

      let group = this.editAddData.group

      if (group.includes('usable')) {
        params.usable = true
      } else {
        params.usable = false
      }

      if (group.includes('system')) {
        params.system = true
      } else {
        params.system = false
      }

      return params
    },
    /**
     * @desc 点击添加或编辑
     */
    submit(data) {
      let objFun = {
            add: unitAdd,
            edit: unitUpdate,
          },
          type = this.config.type

      if (objFun[type]) {
        this.editLoading = true
        this.editAddData = data
        // let params = this.getEditParams()

        let {group,...other}=this.editAddData;


        let params={
          ...other,
          system:group.find(item=>item=='system')?true:false,
          usable:group.find(item=>item=='usable')?true:false,
        };


        objFun[type](params).then(res => {
          this.editLoading = false
          this.config.show = false
          this.getDataList()
        })
            .catch((error) => {
              this.editLoading = false
              console.group(error)
            })
      }
    },
    /**
     * @desc 清空选中数据
     */
    clearSelct() {
      if (this.$refs.mainTable) {
        this.$refs.mainTable.resetSelect();
      }
    },
  },
}
</script>
