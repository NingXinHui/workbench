import { getDataList } from "@/api/marketOrder";
import {
  selectCheckItem,
  selectBusinessPerson,
  selectDepartment,
  selectCheckContact
} from "@/api/purchase/order";
export default {

  checkItemName: {
    method: selectCheckItem,
    visible: false,
    type: "checkItemName",
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

  checkUserName: {
    method: selectCheckContact,
    visible: false,
    type: "checkUserName",
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


};
