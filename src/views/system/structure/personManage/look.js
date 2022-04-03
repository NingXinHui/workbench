import { interestRulesList } from "@/api/sale/base";
import {departmentListSelect,departmentListSelectPart,companyListSelect,roleListSelect,dictDataList,positionDataList} from "@/api/apizhu/index.js"


export function look(that) {
    let obj = {
      company1: {
        title: "查询选择(公司名称)",
        looktype: that.categoryType,
        params: {
          // name: that.name
        },
        searchArr: [
        
          {
            label: "公司名称",
            field: "name",
            type: 1
          }
        ],
        methods: companyListSelect,
        tableColumn: [
          {
            label: "公司名称",
            prop: "name"
          },
         
        ]
      },
      department: {
        title: "查询选择(部门名称)",
        looktype: that.categoryType,
        params: {
          
        //  companyId: that.theCompanyId

        },
        searchArr: [
          {
            label: "部门名称",
            field: "departmentName",
            type: 1
          },
          
        ],
        methods: departmentListSelect,
        tableColumn: [
          {
            label: "部门名称",
            prop: "fullName"
          },
          
        ]
      },
      company2: {
        title: "查询选择(公司名称)",
        looktype: that.categoryType,
        params: {
          // name: that.name
        },
        searchArr: [
        
          {
            label: "公司名称",
            field: "name",
            type: 1
          }
        ],
        methods: companyListSelect,
        tableColumn: [
          {
            label: "公司名称",
            prop: "name"
          },
         
        ]
      },
      position: {
        title: "查询选择(职位名称)",
        looktype: that.categoryType,
        params: {
          position:"position"
        },
        searchArr: [
          {
            label: "职位名称",
            field: "value",
            type: 1
          }
        ],
        methods: positionDataList,
        tableColumn: [
          {
            label: "职位名称",
            prop: "value"
          },
         
        ]
      },
      company3: {
        title: "查询选择(公司名称)",
        looktype: that.categoryType,
        params: {
          // name: that.name
        },
        searchArr: [
        
          {
            label: "公司名称",
            field: "name",
            type: 1
          }
        ],
        methods: companyListSelect,
        tableColumn: [
          {
            label: "公司名称",
            prop: "name"
          },
         
        ]
      },
      roles: {
        title: "查询选择(角色名称)",
        looktype: that.categoryType,
        params: {
          /* current:1,
          size:30, */
          // companyId:that.theCompanyId
        },
        searchArr: [
          
          {
            label: "角色名称",
            field: "name",
            type: 1
          }
        ],
        methods: roleListSelect,
        tableColumn: [
          {
            label: "角色名称",
            prop: "name"
          },
         
        ]
      }
    };
    return obj[that.categoryType] || { tableColumn: [], searchArr: [] };
  }