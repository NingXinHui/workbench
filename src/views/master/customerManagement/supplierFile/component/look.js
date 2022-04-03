
import { getDataList } from '@/api/marketOrder'
import { getPersonList } from "@/api/purchase/base";
import {
  lookupCheckItem
} from "@/api/master/supplierFile";
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
  country: {
    method: getDataList,
    visible: false,
    type: "country",
    params: {},
    searchArr: [
      {
        label: "国家中文简称",
        field: "orderNo",
        type: 1,
        maxLength: "60"
      },
      {
        label: "阿拉伯数字代码",
        field: "orderNo",
        type: 1,
        maxLength: "60"
      },
      {
        label: "拉丁字母代码",
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
        label: "国家中文简称",
        prop: "arrangeNo"
      },
      {
        label: "阿拉伯数字代码",
        prop: "orderNo"
      },
      {
        label: "拉丁字母代码",
        prop: "orderNo"
      },
      {
        label: "",
        prop: ""
      }
    ]
  },
  person: {
    method: getPersonList,
    visible: false,
    type: "person",
    title: "查询选择(业务员)",
    params: {
      positionCode: "1,2"
    },
    searchArr: [
      {
        label: "业务员",
        field: "fullName",
        type: 1,
        maxLength: "60"
      },
      {
        label: "联系人电话",
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
        prop: "fullName"
      },
      {
        label: "联系电话",
        prop: "phone"
      },
      {
        label: "业务类型",
        prop: "positionName"
      },
      {
        label: "",
        prop: ""
      }
    ]
  },
  company: {
    method: lookupCheckItem,
    visible: false,
    type: "company",
    title: "查询选择(客商)",
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
  }
};
