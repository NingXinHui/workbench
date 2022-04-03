
import { getPersonList } from "@/api/purchase/base";
import { getWorkprocedurelist } from "@/api/production/workingProcedure";
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
  procedure: {
    method: getWorkprocedurelist,
    visible: false,
    type: "procedure",
    params: {
      usable: "1"
    },
    searchArr: [
      {
        label: "工序编号",
        field: "procedureNo",
        type: 1,
        maxLength: "60"
      },
      {
        label: "工序名称",
        field: "procedureName",
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
        label: "工序编号",
        prop: "procedureNo"
      },
      {
        label: "工序名称",
        prop: "procedureName"
      },
      {
        label: "",
        prop: ""
      }
    ]
  }
};
