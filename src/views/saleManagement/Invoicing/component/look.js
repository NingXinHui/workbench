
import { getDataList } from '@/api/marketOrder'
export default {
  chargeMan: {
    method: getDataList,
    visible: false,
    type: "chargeMan",
    params: {},
    searchArr: [
      {
        label: "员工姓名",
        field: "orderNo",
        type: 1,
        maxLength: "60"
      },
      {
        label: "手机号",
        field: "orderNo",
        type: 1,
        maxLength: "60"
      }
    ],
    tableColumn: [
      {
        label: "序号",
        type: "index",
        maxLength: "20"
      },
      {
        label: "员工姓名",
        prop: "arrangeNo"
      },
      {
        label: "手机号",
        prop: "orderNo"
      },
      {
        label: "所属部门",
        prop: "orderNo"
      },
      {
        label: "",
        prop: ""
      }
    ]
  },
  returnMan: {
    method: getDataList,
    visible: false,
    type: "returnMan",
    params: {},
    searchArr: [
      {
        label: "员工姓名",
        field: "orderNo",
        type: 1,
        maxLength: "60"
      },
      {
        label: "手机号",
        field: "orderNo",
        type: 1,
        maxLength: "60"
      }
    ],
    tableColumn: [
      {
        label: "序号",
        type: "index",
        maxLength: "20"
      },
      {
        label: "员工姓名",
        prop: "arrangeNo"
      },
      {
        label: "手机号",
        prop: "orderNo"
      },
      {
        label: "所属部门",
        prop: "orderNo"
      },
      {
        label: "",
        prop: ""
      }
    ]
  },

  materil: {
    method: getDataList,
    visible: false,
    type: "materil",
    params: {},
    searchArr: [
      {
        label: "物料编码",
        field: "orderNo",
        type: 1,
        maxLength: "60"
      },
      {
        label: "物料名称",
        field: "materialNo",
        type: 1,
        maxLength: "60"
      }
    ],
    tableColumn: [
      {
        label: "序号",
        type: "index",
        maxLength: "20"
      },
      {
        label: "物料编号",
        prop: "arrangeNo"
      },
      {
        label: "物料名称",
        prop: "orderNo"
      },
      {
        label: "物料描述",
        prop: "materialNo"
      },
      {
        label: "",
        prop: ""
      }
    ]
  },
  company: {
    method: getDataList,
    visible: false,
    type: "company",
    params: {},
    searchArr: [
      {
        label: "联系人",
        field: "orderNo",
        type: 1,
        maxLength: "60"
      },
      {
        label: "联系电话",
        field: "orderNo",
        type: 1,
        maxLength: "60"
      },
      {
        label: "单位名称",
        field: "orderNo",
        type: 1,
        maxLength: "60"
      }
    ],
    tableColumn: [
      {
        label: "序号",
        type: "index",
        maxLength: "20"
      },
      {
        label: "联系人",
        prop: "arrangeNo"
      },
      {
        label: "联系电话",
        prop: "orderNo"
      },
      {
        label: "联系人类型",
        prop: "materialNo"
      },
      {
        label: "单位名称",
        prop: ""
      },
      {
        label: "省市区",
        prop: ""
      },
      {
        label: "详细地址",
        prop: ""
      }
    ]
  }
};
