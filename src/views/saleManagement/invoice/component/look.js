
import { getDataList } from '@/api/marketOrder'
import {
  searchContact,
} from "@/api/sale/order";
import { searchOrderDetail } from "@/api/sale/invoice";
export default {
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
        maxLength: "11"
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
        label: "收货人",
        prop: "orderNo"
      },
      {
        label: "联系电话",
        prop: "orderNo"
      },
      {
        label: "省市区",
        prop: "materialNo"
      },
      {
        label: "详细地址",
        prop: "materialName"
      }
    ]
  },

  materil: {
    method: searchOrderDetail,
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
        prop: "materialLot"
      },
      {
        label: "",
        prop: ""
      }
    ]
  },
  warehouse: {
    method: getDataList,
    visible: false,
    type: "company",
    params: {},
    searchArr: [
      {
        label: "批次号",
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
        label: "数量",
        prop: ""
      }
    ]
  }
};
