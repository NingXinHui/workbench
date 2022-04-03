import request from "@/utils/request";


import { Message, } from 'element-ui'

/**
 * 根据ID获取币种详情
 * @returns {AxiosPromise}
 */
export function commonRequest(url, method = 'get', option = {}) {
    return request({
        url: url,
        method: method,
        ...option
    })
}

/**
 * 修改或增加对象属性
 * @param obj
 * @param newObj
 * @returns {*}
 */
export function resetObj(obj, newObj) {
    return Object.assign(obj, {
        ...newObj
    })
}

/**
 *深拷贝
 * @param obj
 * @returns {{}|any}
 */
export function deepCopy(obj) {
    if (typeof obj === 'object') {
        return JSON.parse(JSON.stringify(obj))
    }
    return obj
}


//新增数据
export function addArr(table, obj = {}, children = false, deep = 0) {
    let arr = {}
    let initId = 1
    let initIndex = 1
    let initRowNo = 1
    let initOrderNumber = 1
    if (table&&table.length) {
        table.map(item => {
            if (item.id && item.id > initId) {
                initId = item.id
            }
            if (item.orderNumber && item.orderNumber > initOrderNumber) {
                initOrderNumber = item.orderNumber
            }
            if (item.rowNo && item.rowNo > initRowNo) {
                initRowNo = item.rowNo
            }
            if (item.index && item.index > initIndex) {
                initIndex = item.index
            }
        })
        arr.id = initId + 1
        arr.index = initIndex + 1
        arr.rowNo = initRowNo + 1
        arr.isEdit = true
        arr.orderNumber = Number(initOrderNumber) + 1
    } else {
        arr.id = initId
        arr.index = initIndex
        arr.isEdit = true
        arr.rowNo = initRowNo
        arr.orderNumber = initOrderNumber
    }
    if (obj) {
        for (const arrKey in obj) {
            arr[arrKey] = obj[arrKey]
        }
    }
    if (children) {
        arr.deep = deep + 1
    } else {
        arr.deep = 1
    }
    arr.id = Math.random()
    // if(children){
    //     arr.children=[]
    // }
    return arr
}


//复制数据
export function copyArr(table, obj) {
    //防止修改原数组，保持排序
    let soreTable = deepCopy(table)
    let arr = {}
    let maxId = soreTable.sort((a, b) => {
        return b.id - a.id
    })[0].id
    let maxOrderNumber = soreTable.sort((a, b) => {
        return b.orderNumber - a.orderNumber
    })[0].orderNumber
    let maxIndex = soreTable.sort((a, b) => {
        return b.index - a.index
    })[0].index
    let maxRowNo = soreTable.sort((a, b) => {
        return b.rowNo - a.rowNo
    })[0].rowNo
    for (const objKey in obj) {
        arr[objKey] = obj[objKey]
    }
    arr.id = maxId + 1
    arr.index = maxIndex + 1
    arr.rowNo = maxRowNo + 1
    arr.orderNumber = Number(maxOrderNumber) + 1
    return arr
}

export function FixFixed(num, len) {
    let result = num.toString()
    let numberArr = result.split('.');

    let intNum = numberArr[0] //整数部分
    let deciNum = numberArr[1]//小数部分
    let lastNum = deciNum.substr(len, 1);//最后一个数字
    if (num.length == len) {
        //需要截取的长度等于当前长度
        return result;
    }
    if (numberArr.length < 2) {
        //整数的情况
        return padNum(result);
    }
}

//对数字末尾加0
function padNum(num) {
    let dotPos = num.indexOf('.');
    if (dotPos === -1) {
        //整数的情况
        num += '.';
        for (var i = 0; i < len; i++) {
            num += '0';
        }
        return num;
    } else {
        //小数的情况
        var need = len - (num.length - dotPos - 1);
        for (var j = 0; j < need; j++) {
            num += '0';
        }
        return num;
    }
}

//查询该数组里是否有当前值
export function checkExistData(array = [], value = '', key = '') {
    let index = array.findIndex(item => {
        if (key) {
            return item[key] == value
        } else {
            return item === value
        }
    })

    return {
        isExist: index != -1,
        data: array[index],
    }
}

/**
 * @desc 获取唯一值
 */
export function getMathIndex(array, key) {
    let value = Math.random()

    let index = array.findIndex(item => {
        return value == item[key]
    })

    if (index != -1) {
        return getMathIndex()
    } else {
        return value
    }
}



/**
 * @desc 表单进行校验
 */
 export function checkFormData(formItemList = [], queryForm = {}) {
    let bool = true
    let count = 0

    try {
        formItemList.forEach(item => {
            if(count === 0) {
                if(item.rules) {
                    if(item.rules.validator) {
                        count++
                        item.rules.validator('', queryForm[item.key],() => {
                            --count
                        })
                    } else if((!queryForm[item.key] && queryForm[item.key] !== 0)) {
                        count++
                        Message.error(item.rules.message || (item.label + '不能为空'))
                    } else if ((Array.isArray(queryForm[item.key]) && !queryForm[item.key].length)) {
                      count++;
                      Message.error(
                        item.rules.message || item.label + "不能为空"
                      );
                    }
                }
            } else {
                throw Error()
            }
        })
    } catch(e) {
        // console.group(e)
    }

    if(count !== 0) {
        bool = false
    }
    return bool
}
