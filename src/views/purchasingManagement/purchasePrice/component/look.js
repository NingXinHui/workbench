
import { getDataList } from '@/api/marketOrder'
export default {
  companyName: {
    method: getDataList,
    visible: false,
    type: "companyName",
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
    method: getDataList,
    visible: false,
    type: "company",
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
