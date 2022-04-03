
import { getDataList } from '@/api/marketOrder';
import {
  selectCheckItem,
  selectBusinessPerson,
  selectDepartment,
  selectCheckContact
} from "@/api/purchase/order";
import {
  searchMaterial,
} from "@/api/sale/order";
import {
  getPersonList,
} from "@/api/purchase/base";
export default {
  supplier: {
    method: selectCheckItem,
    visible: false,
    type: "supplier",
    params: {},
    searchArr: [
      {
        label: "客商编号",
        field: "checkItemNo",
        type: 1,
        maxLength: "60"
      },
      {
        label: "客商名称",
        field: "checkItemName",
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
        label: "客商编号",
        prop: "checkItemNo"
      },
      {
        label: "客商名称",
        prop: "checkItemName"
      },
      {
        label: "业务员",
        prop: "userName"
      },
      {
        label: "业务组",
        prop: "departmentName"
      }
    ]
  },
  purchase: {
    method: selectBusinessPerson,
    visible: false,
    type: "purchase",
    params: {},
    searchArr: [
      {
        label: "业务员",
        field: "userName",
        type: 1,
        maxLength: "60"
      },
      {
        label: "联系电话",
        field: "phone",
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
        label: "业务员",
        prop: "userName"
      },
      {
        label: "联系电话",
        prop: "phone"
      },
      {
        label: "业务类型",
        prop: "departmentName"
      },
      {
        label: "",
        prop: ""
      }
    ]
  },
  purchaseGroup: {
    method: selectDepartment,
    visible: false,
    type: "purchaseGroup",
    params: {},
    searchArr: [
      {
        label: "采购组",
        field: "departmentName",
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
        label: "采购组",
        prop: "departmentName"
      },
      {
        label: "主管",
        prop: "fullName"
      },
      {
        label: "主管电话",
        prop: "phone"
      },
      {
        label: "",
        prop: ""
      }
    ]
  },
  salesMan: {
    method: selectCheckContact,
    visible: false,
    type: "salesMan",
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
      },
      {
        label: "单位名称",
        field: "companyName",
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
        label: "部门名称",
        prop: "departmentName"
      }
    ]
  },
  rules: {
    method: getDataList,
    visible: false,
    type: "rules",
    params: {},
    searchArr: [
      {
        label: "规则编制",
        field: "orderNo",
        type: 1,
        maxLength: "60"
      },
      {
        label: "规则名称",
        field: "materialNo",
        type: 1,
        maxLength: "60"
      },
      {
        label: "创建人",
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
        label: "规则编号",
        prop: "arrangeNo"
      },
      {
        label: "规则名称",
        prop: "orderNo"
      },
      {
        label: "创建人",
        prop: "materialNo"
      },
      {
        label: "创建时间",
        prop: "materialName"
      }
    ]
  },
  company: {
    method: selectCheckItem,
    visible: false,
    type: "company",
    params: {},
    searchArr: [
      {
        label: "客商编号",
        field: "checkItemNo",
        type: 1,
        maxLength: "60"
      },
      {
        label: "客商名称",
        field: "checkItemName",
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
        label: "客商编号",
        prop: "checkItemNo"
      },
      {
        label: "客商名称",
        prop: "checkItemName"
      },
      {
        label: "客商类型",
        prop: "checkItemTypeName"
      },
      {
        label: "业务员",
        prop: "contactName"
      },
      {
        label: "业务组",
        prop: "departmentName"
      }
    ]
  },
  person: {
    method: getPersonList,
    visible: false,
    type: "person",
    params: {
      positionCode: "1,2,3,4,5,6,7"
    },
    searchArr: [
      {
        label: "员工姓名",
        field: "fullName",
        type: 1,
        maxLength: "60"
      },
      {
        label: "手机号",
        field: "phone",
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
      },
      {
        label: "手机号",
        prop: "phone"
      },
      {
        label: "所属部门",
        prop: "positionName"
      },
      {
        label: "",
        prop: ""
      }
    ]
  },
  materil: {
    method: searchMaterial,
    visible: false,
    type: "materil",
    title: "查询选择(物料)",
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
        label: "序号",
        type: "index",
        maxLength: "20"
      },
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
      },
      {
        label: "",
        prop: ""
      }
    ]
  }
};
