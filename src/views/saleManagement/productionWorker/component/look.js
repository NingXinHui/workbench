
// import { dictDataList } from '@/api/marketOrder'

import { getPersonList } from "@/api/purchase/base";

import { getDepartmentList,materialIdList } from "@/api/marketOrder";

export default {
  saleMan: {
    method: getPersonList,
    visible: false,
    type: "saleMan",
    params: {
      positionCode: "2"
    },
    searchArr: [
      {
        label: "业务员",
        field: "fullName",
        type: 1,
        maxLength: "60"
      },
      {
        label: "联系电话",
        field: "phone",
        type: 1,
        maxLength: "11"
      }
    ],
    tableColumn: [
      /* {
        label: "序号",
        type: "index",
        maxLength: "20"
      }, */
      {
        label: "员工姓名",
        prop: "fullName"
      },
      {
        label: "手机号",
        prop: "phone"
      },
      {
        label: "所属部门",
        prop: "positionName"
      },
      /* {
        label: "",
        prop: ""
      } */
    ]
  },
  saleMan1: {
    method: getPersonList,
    visible: false,
    type: "saleMan1",
    params: {
      positionCode: "8"
    },
    searchArr: [
      {
        label: "业务员",
        field: "fullName",
        type: 1,
        maxLength: "60"
      },
      {
        label: "联系电话",
        field: "phone",
        type: 1,
        maxLength: "11"
      }
    ],
    tableColumn: [
      /* {
        label: "序号",
        type: "index",
        maxLength: "20"
      }, */
      {
        label: "业务员",
        prop: "fullName"
      },
      {
        label: "联系电话",
        prop: "phone"
      },
      {
        label: "业务类型",
        prop: "positionName"
      }
      /* {
        label: "",
        prop: ""
      } */
    ]
  },

  departMent: {
    method: getDepartmentList,
    visible: false,
    type: "departMent",
    params: {
      // useId:that.
    },
    searchArr: [
      {
        label: "业务组",
        // isEdit: true,
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

  materil: {
    method: materialIdList,
    visible: false,
    type: "materil",
    params: {},
    searchArr: [
      {
        label: "物料编码",
        field: "materialNo",
        type: 1,
        maxLength: "60"
      },
      {
        label: "物料名称",
        field: "materialName",
        type: 1,
        maxLength: "60"
      }
    ],
    tableColumn: [
      {
        label: "物料编号",
        prop: "materialNo"
      },
      {
        label: "物料名称",
        prop: "materialName"
      },
      {
        label: "物料描述",
        prop: "materialDescription"
      }
    ]
  },
  company: {
    method: getPersonList,
    visible: false,
    type: "company",
    params: {},
    searchArr: [
      {
        label: "联系人",
        field: "fullName",
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
  },
  
  productDetail: {
    method: materialIdList,
    visible: false,
    type: "productDetail",
    lookWidth:"632",
    params: {},
    searchArr: [
      {
        label: "产品编码",
        field: "materialNo",
        width:200,
        type: 1,
        maxLength: "60"
      },
      {
        label: "产品名称",
        field: "materialName",
        type: 1,
        maxLength: "60"
      }
    ],
    tableColumn: [
      {
        label: "产品编号",
        prop: "materialNo"
      },
      {
        label: "产品名称",
        prop: "materialName"
      },
      {
        label: "产品描述",
        prop: "materialDescription"
      }
    ]
  },
  merchandiserName:{
    method: getPersonList,
    visible: false,
    type: "merchandiserName",
    params: {
      positionCode:"3"
    },
    searchArr: [
      {
        label: "跟单员",
        field: "fullName",
        type: 1,
        maxLength: "60"
      },
      {
        label: "手机号",
        field: "phone",
        type: 1,
        maxLength: "60"
      },
      
    ],
    tableColumn: [
      {
        label: "跟单员",
        prop: "fullName"
      },
      {
        label: "手机号",
        prop: "phone"
      },
      {
        label: "业务类型",
        prop: "positionName"
      }
    ]
  },
};