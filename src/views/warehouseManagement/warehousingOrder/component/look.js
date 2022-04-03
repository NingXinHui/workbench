

import { materialIdList } from "@/api/marketOrder";
export default {
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
  },
};
