
import { getDataList } from '@/api/marketOrder'
import { selectCheckContact } from "@/api/purchase/order";

export default {
  supplier: {
    method: getDataList,
    visible: false,
    type: "supplier",
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
        prop: "orderNo"
      },
      {
        label: "跟单员",
        prop: "orderNo"
      },
      {
        label: "跟单组",
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
  companyName: {
    method: getDataList,
    visible: false,
    type: "companyName",
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
  }
};
