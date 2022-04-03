
import { getDataList } from '@/api/marketOrder';
import {
  searchCustomer,
  searchContact,
  searchdepartment,
  searchMaterial,
  searchProductionTask
} from "@/api/sale/order";
import { getPersonList } from "@/api/purchase/base";
export default {
  lookall(that, type) {
    let obj = {
      customer: {
        method: searchCustomer,
        visible: false,
        type: "customer",
        title: "查询选择(客商)",
        params: {
          checkItemType: "1"
        },
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
            prop: "userName"
          },
          {
            label: "业务组",
            prop: "departmentName"
          }
        ]
      },
      saleman: {
        method: getPersonList,
        visible: false,
        type: "saleman",
        title: "查询选择(销售员)",
        params: {
          positionCode: "2"
        },
        searchArr: [
          {
            label: "销售员",
            field: "fullName",
            type: 1,
            maxLength: "60"
          },
          {
            label: "联系电话",
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
            label: "销售员",
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
      saleGroup: {
        method: searchdepartment,
        visible: false,
        type: "saleGroup",
        title: "查询选择(销售组)",
        params: {},
        searchArr: [
          {
            label: "销售组",
            field: "departmentName",
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
            label: "销售组",
            prop: "departmentName"
          },
          {
            label: "主管",
            prop: "fullName"
          },
          {
            label: "主管电话",
            prop: "phone"
          }
        ]
      },

      rules: {
        method: getDataList,
        visible: false,
        type: "rules",
        title: "查询选择(阿米巴规则)",
        params: {},
        searchArr: [
          {
            label: "规则编制",
            field: "orderNo",
            type: 1,
            maxLength: "60"
          },
          {
            label: "规则名称",
            field: "materialNo",
            type: 1,
            maxLength: "60"
          },
          {
            label: "创建人",
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
            label: "规则编号",
            prop: "arrangeNo"
          },
          {
            label: "规则名称",
            prop: "orderNo"
          },
          {
            label: "创建人",
            prop: "materialNo"
          },
          {
            label: "创建时间",
            prop: "materialName"
          }
        ]
      },
      workOrder: {
        method: searchProductionTask,
        visible: false,
        type: "workOrder",
        title: "查询选择(打样号)",
        params: {},
        searchArr: [
          {
            label: "生产任务书号",
            field: "billNo",
            type: 1,
            maxLength: "60"
          },
          {
            label: "生产业务员",
            field: "productionManName",
            type: "autocomplete",
            remoteMethod: getPersonList,
            queryOrparams: {
              pageNo: 1,
              pageSize: 50,
              positionCode: "8"
            },
            searchLable: "fullName",
            searchValue: "fullName",
            listeners: {
              select: e => {
                that.$set(
                  that.$refs.lookup.pageParams,
                  "productionManId",
                  e.id
                );
                that.$refs.lookup.getCheckList();
              },
              change: e => {
                if (e == "") {
                  that.$set(
                    that.$refs.lookup.pageParams,
                    "productionManId",
                    ""
                  );
                }
              }
            },
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
            label: "生产任务书号",
            prop: "billNo"
          },
          {
            label: "生产类型",
            prop: "productionTypeName"
          },
          {
            label: "生产业务员",
            prop: "productionManName"
          },
          {
            label: "生产部门",
            prop: "productionDepartmentName"
          }
        ]
      },
      business: {
        method: searchContact,
        visible: false,
        type: "business",
        title: "查询选择(联系人)",
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
            label: "部门",
            prop: "departmentName"
          }
        ]
      },
      company: {
        method: searchContact,
        visible: false,
        type: "company",
        title: "查询选择(收货单位)",
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
            label: "省市区",
            prop: "address"
          },
          {
            label: "详细地址",
            prop: "addressDtl"
          }
        ]
      },
      materil: {
        method: searchMaterial,
        visible: false,
        type: "materil",
        title: "查询选择(物料)",
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
      }
    };
    return obj[type]
  }

};
