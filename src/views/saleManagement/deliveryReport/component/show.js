
  /**
   * @desc 表格显示的列
   */
  export function tableOne(that,isEdit){
    return [
      {
        label: "序号",
        type: "index"
      },

      {
        label: "发货通知单",
        prop: "width",
        width: 200
      },

      {
        label: "发货数量",
        width: 100,
        prop: "width"
      },

      {
        label: "待出库任务号",
        width: 160,
        prop: "width"
      },

      {
        label: "出库单号",
        width: 160,
        prop: "width"
      },

      {
        label: "批次号",
        width: 160,
        prop: "width"
      },

      {
        label: "细码单号",
        width: 160,
        prop: "width"
      },

      {
        label: "数量",
        width: 100,
        prop: "width"
      },

      {
        label: "",
        prop: ""
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
         label: "销售退货单",
         width: 200,
         prop: "width"
       },

       {
         label: "退货数量",
         width: 100,
         prop: "width"
       },

       {
         label: "待入库任务书号",
         width: 160,
         prop: "width"
       },

       {
         label: "入库单号",
         width: 160,
         prop: "width"
       },

       {
         label: "批次号",
         width: 160,
         prop: "width"
       },

       {
         label: "细码单号",
         width: 160,
         prop: "width"
       },

       {
         label: "数量",
         width: 100,
         prop: "width"
       },

       {
         label: "",
         prop: ""
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
            label: "采购订单",
            width: 200,
            prop: "width"
          },

          {
            label: "入库数量",
            width: 100,
            prop: "width"
          },

          {
            label: "",
            prop: ""
          }
        ];
      }
       export function tableFour(that, isEdit) {
         return [
           {
             label: "序号",
             type: "index"
           },

           {
             label: "生产任务书",
             width: 200,
             prop: "width"
           },

           {
             label: "委外加工单",
             width: 160,
             prop: "width"
           },
           {
             label: "入库数量",
             width: 100,
             prop: "width"
           },

           {
             label: "",
             prop: ""
           }
         ];
       }
export function tableFive(that, isEdit) {
  return [
    {
      label: "序号",
      type: "index"
    },

    {
      label: "物料编号",
      width: 200,
      prop: "width"
    },

    {
      label: "计量单位",
      width: 160,
      prop: "width"
    },
    {
      label: "订单数量",
      width: 100,
      prop: "width"
    },
    {
      label: "销售价",
      width: 100,
      prop: "width"
    },
    {
      label: "已开票数量",
      width: 100,
      prop: "width"
    },
    {
      label: "开票价",
      width: 100,
      prop: "width"
    },
    {
      label: "剩余开票数",
      width: 100,
      prop: "width"
    },

    {
      label: "",
      prop: ""
    }
  ];
}
