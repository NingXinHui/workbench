export function formone(that,isEdit){

    let  newArr=[];

    let rule=(item)=>{
        return {
            
        }
    }

    that.VarietiesList.map(item=>{
        if(item.propertyDataType=='TEXT'){
            newArr.push({...{
                key: item.id,
                type: 'input',
                subtype: 'text',
                label: item.propertyName.length>4 ?item.propertyName.substr(0,4): item.propertyName ,
                isEdit,
                placeholder: '请输入',
                rules:item.required? {   
                    required: true, 
                    trigger: ' ',
                   
                }:undefined
    
            }})
        }
        if(item.propertyDataType=='ENUM'){
            newArr.push({
                key: isEdit? item.id+'x': item.id,
                type: isEdit ? 'input' : 'select',
                subtype: 'text',
                label: item.propertyName.length>4 ?item.propertyName.substr(0,4): item.propertyName ,
                isEdit,
                placeholder: '请输入',
                options:that.allIdList[item.id],
                optionLabel: 'itemName',
                optionValue: 'itemNo',
                multiple: item.multiselect,//是否多选
                attrs:{
                    'collapse-tags':true
                },
                rules:item.required? {   
                    required: true, 
                    trigger: ' ',
                   
                }:undefined
    
            

    
            })
        }
    })

    let formItemList = [
        {
            key: 'varietyNo',
            type: 'input',
            subtype: 'text',
            label: '品种编号',
            isEdit,
            disabled: true,
            placeholder: '保存后自动生成',
        },
       
        {
            key: 'varietyName',
            type: 'input',
            subtype: 'text',
            label: '品名',
            isEdit,
            maxlength: 40,
            rules: {   
                required: true, trigger: ' ',
            },
        },
     
      
        // {
        //     key: isEdit ? 'orderTypeName' : 'orderTypeNo',
        //     type: isEdit ? 'input' : 'select',
        //     subtype: 'text',
        //     label: '等级',
        //     isEdit,
        //     options:that.gradeList,
        //     optionLabel: 'value',
        //     optionValue: 'code',
        //     placeholder: '请选择',
           
        //     rules: {   
        //         required: true, trigger: 'change',
        //         validator: (rule, value, callback) => {
        //             if (value) {
        //                 callback()
        //             } else {
        //                 that.$message.error('等级不能为空')
        //             }
        //         },
        //     },
        // },
    
        // {
        //     key: 'taxRate',
        //     type: 'input',
        //     subtype: 'text',
        //     label: '产地',
        //     isEdit,
        //     placeholder: ' ',
          
        // },
        // {
        //     key: 'taxRate',
        //     type: 'input',
        //     subtype: 'text',
        //     label: '规格',
        //     isEdit,
        //     placeholder: ' ',
          
        // },
        ...newArr
       
    ]

    return formItemList

  }



