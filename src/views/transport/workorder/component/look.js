
import { getDataList } from '@/api/marketOrder'
import {
  selectCheckItem,
} from "@/api/purchase/order";
import {
  searchContact
} from "@/api/sale/order";
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
        prop: "contactName"
      },
      {
        label: "业务组",
        prop: "departmentName"
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
        label: "业务员",
        prop: "contactName"
      },
      {
        label: "业务组",
        prop: "departmentName"
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
  companyName: {
    method: searchContact,
    visible: false,
    type: "companyName",
    params: {},
    searchArr: [
      {
        label: "联系人名称",
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
        label: "序号",
        type: "index",
        maxLength: "20"
      },
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
  }
};
