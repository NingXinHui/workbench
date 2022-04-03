import { getDataList } from "@/api/marketOrder";
import { selectCheckContact } from "@/api/purchase/order";
import { userListAll } from "@/api/apizhu";
import { getDepartmentList,materialIdList } from "@/api/marketOrder";


export default {
  chargeMan: {
    method: getDataList,
    visible: false,
    type: "chargeMan",
    params: {},
    searchArr: [
      {
        label: "销售员名称",
        field: "orderNo",
        type: 1,
        maxLength: "60"
      },
      {
        label: "手机号",
        field: "客商名称",
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
        label: "用户名称",
        prop: "arrangeNo"
      },
      {
        label: "用户编号",
        prop: "orderNo"
      },
      {
        label: "用户角色",
        prop: "orderNo"
      },
      {
        label: "销售组",
        prop: "orderNo"
      },
      {
        label: "",
        prop: ""
      }
    ]
  },
  
  returnMan: {
    method: userListAll,
    params: {},
    type: "returnMan",
    searchArr: [
      {
        label: "员工姓名",
        field: "keyword",
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
        prop: "fullName"
      }
    ]
  },

  // 单位
  checkItemName: {
    method: selectCheckContact,
    visible: false,
    type: "checkItemName",
    params: {},
    searchArr: [
      {
        label: "联系人",
        field: "contactName",

        type: 1,
        maxLength: "60"
      },
      {
        label: "联系电话",
        field: "contactPhoneNumber",
        type: 1,
        maxLength: "60"
      }
    ],
    tableColumn: [
      {
        label: "收货人",
        prop: "contactName"
      },
      {
        label: "联系电话",
        prop: "contactPhoneNumber"
      },
      {
        label: "联系人类型",
        prop: "contactTypeName"
      },
      {
        label: "单位名称",
        prop: "companyName"
      },
      {
        label: "省市区",
        prop: "address"
      },
      {
        label: "详细地址",

        prop: "addressDtl"
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
        label: "收货单位",
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
        label: "收货单位",
        prop: "arrangeNo"
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
        label: "省市区",
        prop: ""
      }
    ]
  },
  converter: {
    method: getDataList,
    visible: false,
    type: "converter",
    params: {},
    searchArr: [
      {
        label: "加工商编号",
        field: "orderNo",
        type: 1,
        maxLength: "60"
      },
      {
        label: "加工商名称",
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
        label: "加工商编号",
        prop: "arrangeNo"
      },
      {
        label: "加工商名称",
        prop: "arrangeNo"
      },
      {
        label: "跟单员",
        prop: "orderNo"
      },

      {
        label: "跟单组",
        prop: ""
      }
    ]
  },
  abilityPerson: {
    method: userListAll,
    params: {},
    type: "abilityPerson",
    searchArr: [
      {
        label: "员工姓名",
        field: "keyword",
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
        prop: "fullName"
      }
    ]
  },
  departMent1: {
    method: getDepartmentList,
    visible: false,
    type: "departMent1",
    params: {},
    searchArr: [
      {
        label: "业务组",
        field: "departmentName",
        type: 1,
        maxLength: "60"
      }
    ],
    tableColumn: [
      {
        label: "业务组",
        prop: "departmentName"
      },
      {
        label: "主管",
        prop: "fullName"
      },
      {
        label: "主管电话",
        prop: "phone"
      }
    ]
  },
};
