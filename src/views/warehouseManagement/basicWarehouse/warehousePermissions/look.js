
import { storeWarehouseApi, searchUserApi } from "@/api/wareManagementApi/permissionMaintenance";

export function lookData (that, val) {

  let obj = {
    //用户名称
    userNameLookList: {
      method: searchUserApi,
      visible: true,
      type: "userNameLookList",
      params: {
        positionCode: 7
      },
      searchArr: [
        {
          label: "用户名称",
          field: "fullName",
          type: 1,
          maxLength: "60"
        },
        {
          label: "手机号",
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
          label: "用户名称",
          prop: "fullName"
        },
        {
          label: "手机号",
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
    //权限列表
    jurisdictionLookList: {
      method: storeWarehouseApi,
      visible: true,
      type: "jurisdictionLookList",
      params: {},
      searchArr: [
        {
          label: '仓库地区',
          field: "regionName",
          type: 2,
          optionList: that.districtList,
          optionLabel: "regionName",
          optionValue: "regionName",
        },
        {
          label: "仓名称",
          field: "warehouseName",
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
          label: "仓库地区",
          prop: "regionName"
        },
        {
          label: "仓名称",
          prop: "warehouseName"
        },
        {
          label: "",
          prop: ""
        }
      ]
    },

  }
  return obj[val]
}

