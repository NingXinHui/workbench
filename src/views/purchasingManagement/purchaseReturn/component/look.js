
import { getDataList } from '@/api/marketOrder'
import { getPersonList } from "@/api/purchase/base";
import {

  selectCheckContact
} from "@/api/purchase/order";
export default {
  applyMan: {
    method: getPersonList,
    visible: false,
    type: "applyMan",
    params: {
      positionCode: "1,2,3,4,5,6,7,8"
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
        maxLength: "11"
      }
    ],
    tableColumn: [
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
      }
    ]
  },
  checkItemName: {

    method:selectCheckContact,
    visible: false,
    type: "checkItemName",
    params: {
   
    },
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
        prop: "checkItemName"
      },
      {
        label: "省市区",
        prop: "address"
      },
      {
        label: "详细地址",

        prop: "addressDtl"
      },
      
      

    ]
  },
 
  materilLot: {

    method:selectCheckContact,
    visible: false,
    type: "checkItemName",
    params: {
   
    },
    searchArr: [
      {
        label: "批次号",
        field: "contactName",

        type: 1,
        maxLength: "60"
      },
      {
        label: "厂家批次",
        field: "contactPhoneNumber",
        type: 1,
        maxLength: "60"
      }
    ],
    tableColumn: [
      {
        label: "批次号",
        prop: "contactName"

      },
      {
        label: "厂家批次",
        prop: "contactPhoneNumber"
      },
      {
        label: "数量",
        prop: "contactTypeName"
      },
      {
        label: "仓位",
        prop: "companyName"
      },
      {
        label: "入库时间",
        prop: "address"
      },
     
    ]
  },
};
