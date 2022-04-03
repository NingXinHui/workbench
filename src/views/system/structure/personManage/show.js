import {
  departmentListSelect,
  roleListSelect,
  positionDataList
} from "@/api/apizhu";
export function tableOne(that, isEdit) {
  return [
    {
      label: "序号",
      type: "index"
    },
    {
      label: "公司名称",
      prop: "companyName",

      isEdit: true,
      config: {
        key: "companyName",
        attrs: {
          readonly: true,
          suffixIcon: "el-icon-arrow-down"
        },

        type: "input",

        custormRules: {
          message: "组织信息下公司不能为空"
        },

        listeners: {
          focus: e => {
            that.selectCheckItemName("company");
            that.categoryType = "company1";
            that.isSelectMore = false;
            that.index = Number(
              e.target.parentNode.parentNode.parentNode.getAttribute("index")
            );
          },
          change: () => {
            that.tableDataOne[that.index].departmentName = "";
          }
        }
      }
    },
    {
      label: "部门名称",

      prop: "departmentName",
      isEdit: true,
      config: {
        key: "departmentName",
        type: "input",
        attrs: {
          readonly: true,
          suffixIcon: "el-icon-arrow-down"
        },

        input: (a, b) => {
          that.theIndex = b;
        },
        listeners: {
          focus: e => {
            that.index = Number(
              e.target.parentNode.parentNode.parentNode.getAttribute("index")
            );
            if (!that.tableDataOne[that.index].companyId) {
              that.$message.error("请先选择公司");
              return;
            }
            that.categoryType = "department";
            that.selectCheckItemName("department");

            that.isSelectMore = false;
          }
        },
        custormRules: {
          message: "部门不能为空"
        }
      }
    },
    {
      label: "是否部门负责人",
      prop: "divisionDirector",
      align: "center",
      width: 120,
      isEdit: true,
      config: {
        key: "isPeople",
        type: "checkbox",
        subtype: "text",
        placeholder: " "
      }
    }
  ];
}
export function tableTwo(that, isEdit) {
  return [
    {
      label: "序号",
      type: "index"
    },
    {
      label: "公司名称",
      prop: "companyName",
      isEdit: true,
      config: {
        key: "companyName",
        type: "input",
        attrs: {
          readonly: true,
          suffixIcon: "el-icon-arrow-down"
        },

        custormRules: {
          message: "职位信息下公司名称不能为空"
        },

        listeners: {
          focus: e => {
            that.selectCheckItemName("company");
            that.categoryType = "company2";
            that.isSelectMore = false;
            that.index = Number(
              e.target.parentNode.parentNode.parentNode.getAttribute("index")
            );
          }
        }
      }
    },
    {
      label: "职位名称",
      prop: isEdit ? "positionName" : "positionCode",
      // prop:"positionCode",
      isEdit: true,
      config: {
        key: isEdit ? "positionName" : "positionCode",

        // key:"positionCode",
        // type: "input",
        type: isEdit ? "select" : "input",

        attrs: {
          readonly: true,
          suffixIcon: "el-icon-arrow-down"
        },
        options: that.positionData,
        optionLabel: "value",
        optionValue: "code",

        listeners: {
          focus: e => {
            that.index = Number(
              e.target.parentNode.parentNode.parentNode.parentNode.getAttribute(
                "index"
              )
            );
            if (that.tableDataTwo[that.index].companyId) {
              positionDataList("position").then(res => {
                if (res.code === 0) {
                  that.positionData = res.data;
                }
              });
            } else {
              that.$message.error("请先选择公司");
              that.positionData = [];
              return;
            }
          },
          change: e => {
            let flag = false;

            that.tableDataTwo.forEach((item, m) => {
              if (m != that.index) {
                if (
                  that.tableDataTwo[that.index].companyId === item.companyId &&
                  item.positionCode == e
                ) {
                  flag = true;
                }
              }
            });
        
            if (!flag) {
              that.tableDataTwo[that.index].positionCode = e;
              // that.tableDataTwo[that.index].positionName = data[0].value;
            } else {
              that.$message.error("已经选择过该职位");
              that.tableDataTwo[that.index].positionCode = "";
              that.tableDataTwo[that.index].positionName = "";
            }
          }
        },
        custormRules: {
          message: "职位不能为空"
        }
      }
    },
    {
      label: "业务员等级",
      prop: "rank",
      align: "right",
      isEdit: true,
      config: {
        key: "grade",
        type: "input",
        subtype: "text",
        placeholder: " "
      }
    }
  ];
}
export function tableThree(that, isEdit) {
  return [
    {
      label: "序号",
      type: "index"
    },
    {
      label: "公司名称",
      prop: "unit",
      isEdit: true,
      width: 123,
      config: {
        key: "unit",
        type: "input",
        attrs: {
          readonly: true,
          suffixIcon: "el-icon-arrow-down"
        },

        custormRules: {
          message: "角色信息下公司名称不能为空"
        },
        input: (a, b) => {
          // 当公司名称发生改变时 后面的角色要变更
          that.tableDataThree[b].unitx = [];
        },

        listeners: {
          focus: e => {
            that.selectCheckItemName("company");
            that.categoryType = "company3";
            that.isSelectMore = false;
            that.index = Number(
              e.target.parentNode.parentNode.parentNode.getAttribute("index")
            );
          },
          change: e => {
            that.tableDataThree[that.index].unitx = [];
          }
        }
      }
    },
    {
      label: "角色名称",
      prop: "unitx",

      isEdit: true,
      width: "",
      // width: "",
      config: {
        key: "unitx",

        type: "selectLook",
        placeholder: "   请选择",

        showLook: e => {
          that.index = e.target.parentNode.parentNode.parentNode.parentNode.getAttribute(
            "index"
          );

          if (!that.tableDataThree[that.index].companyId) return;

          that.isSelectMore = true;
          that.selectCheckItemName("roles");
          that.categoryType = "roles";
        },
        attrs: {
          style: "width:300px !important"
        },

        multiple: true,
        collapse: true,
        options: that.RoleList,
        optionLabel: "name",
        optionValue: "name",
        custormRules: {
          message: "角色不能为空"
        },
        listeners: {
          focus: async e => {
            that.index = Number(
              e.target.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute(
                "index"
              )
            );
            //  console.log(that.index);

            if (!that.tableDataThree[that.index].companyId) {
              await that.$message.error("请先选择公司");
              that.RoleList = [];
              return;
            } else {
              let data1 = {
                current: that.current,
                size: that.size,
                companyId: that.tableDataThree[that.index].companyId
              };

              roleListSelect(data1).then(res => {
                if (res.success) {
                  console.log(res.data.records);
                  that.RoleList = res.data.records;
                  // console.log(that.roleDataList[that.index]);

                  if (
                    that.roleDataList[that.index] &&
                    that.roleDataList[that.index].roleList.length > 0
                  ) {
                    that.RoleList.unshift(
                      ...that.roleDataList[that.index].roleList
                    );

                    var a = {};
                    that.RoleList = that.RoleList.reduce((item, next) => {
                      a[next.id] ? "" : (a[next.id] = true && item.push(next));
                      return item;
                    }, []);
                    // console.log(that.RoleList);
                  }

                  // that.$forceUpdate();
                }
              });
            }
          },
          change: e => {
            // console.log(that.tableDataThree[that.index].idList, that.index);

            that.tableDataThree[that.index].idList = [];

            // console.log(that.tableDataThree[that.index].unitx);
            that.RoleList.forEach(item => {
              const o = that.tableDataThree[that.index].unitx.findIndex(i => {
                return i == item.name;
              });
              if (o !== -1) {
                that.tableDataThree[that.index].idList.push(item.id);
                /* if (theIndex !== -1) {
                  that.tableDataThree[that.index].idList.push(
                    that.RoleList[theIndex].id
                  );
                } */
              }
            });
            console.log(that.tableDataThree[that.index].idList);
          }
        }
      }
    }
    /*  {
       label: "",
       prop: ""
     } */
  ];
}
