
import { getDataList } from '@/api/marketOrder'
import {
  searchMaterial,
} from "@/api/sale/order";
export default {
  material: {
    method: searchMaterial,
    visible: false,
    type: "materil",
    title: "查询选择",
    params: {},
    searchArr: [
      {
        label: "物料编号",
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
  table: {
    method: searchMaterial,
    visible: false,
    type: "table",
    title: "查询选择",
    params: {},
    searchArr: [
      {
        label: "物料编号",
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
