import request from "@/utils/request";
//销售退货
// 获取列表
export function getDataList(data) {
  return request({
    // url: '/trade-po/order/queryPage',
    url: "/sd/return/list",
    method: "get",
    params: data
  });
}

// 新增数据
export function addData(data) {
  return request({
    url: "/sd/return/add",
    method: "post",
    params: data
  });
}
//修改接口
export function updateData(data) {
  return request({
    url: "/sd/return/update",
    method: "put",
    data: data
  });
}

// 删除
export function deleteData(data) {
  return request({
    // url: '/trade-po/order/deleteBatch',
    url: "/sd/return/delete/batch",
    method: "delete",
    params: data
  });
}

// 提交
export function submitData(data) {
  return request({
    url: "/sd/return/submit",
    method: "put",
    params: data
  });
}

// 撤回
export function withdrawData(data) {
  return request({
    url: "/sd/return/cancel-submit",
    method: "put",
    params: data
  });
}
//销售退货完成接口
export function completeRetrunOrder(data) {
  return request({
    url: "/sd/return/complete",
    method: "put",
    params: data
  });
}
//销售退货取消完成接口
export function cancelCompleteRetrunOrder(data) {
  return request({
    url: "/sd/return/cancel-complete",
    method: "put",
    params: data
  });
}
//销售退货关闭接口
export function closeRetrunOrder(data) {
  return request({
    url: "/sd/return/close",
    method: "put",
    params: data
  });
}
//销售退货取消关闭接口
export function cancelCloseRetrunOrder(data) {
  return request({
    url: "/sd/return/cancel-close",
    method: "put",
    params: data
  });
}

// 保存
export function saveData(data) {
  return request({
    url: "/trade-po/order/add",
    method: "post",
    data
  });
}

// 编辑
export function editData(data) {
  return request({
    url: "/trade-po/order/edit",
    method: "put",
    data
  });
}

// 通过主键获取
export function getDetailsData(id) {
  return request({
    url: `/sd/return/get/${id}`,

    method: "get"
  });
}

// 获取详情
export function detailsData(data) {
  return request({
    url: "/trade-po/order/queryById",

    method: "get",
    params: data
  });
}

//销售订单类型下拉框
export function select_order_type(data) {
  return request({
    url: "/trade-po/sdordertype/queryAll",
    method: "get",
    params: data
  });
}

//条款下拉
export function select_clause_type(data) {
  return request({
    url: "/trade-po/sd/sdorderclause/queryAll",
    method: "get",
    params: data
  });
}

//客户联系人下拉
export function queryContactById(data) {
  return request({
    url: "/trade-sm/checkItem/queryContactById",
    method: "get",
    params: data
  });
}

//销售订单报表
export function getReportDataList(data) {
  return request({
    url: "/trade-po/orderDtl/reportForm",
    method: "get",
    params: data
  });
}

//销售下拉订单
export function orderLookUp(data) {
  return request({
    url: "/trade-po/orderDtl/lookUp",
    method: "get",
    params: data
  });
}
// lookUp查询联系人
export function concatLookUp(data) {
  return request({
    url: "/mdm/check-item-contact/lookup",
    method: "get",
    params: data
  });
}
// 收货方式
export function receiveMethods(typeCode) {
  return request({
    url: `/sm/dict-data/list/${typeCode}`,
    method: "get"
  });
}
// 取消关闭
export function closeMethods(data) {
  return request({
    url: "/sm/dict-data/list/",
    method: "post",
    data
  });
}

// 生产任务书
// 分页获取所有数据
export function getProduceList(data) {
  return request({
    url: "/sd/production-task/list",
    method: "get",
    params: data
  });
}
// 通过主键查询单条数据
export function getProduceDetail(id) {
  return request({
    url: `/sd/production-task/get/${id}`,
    method: "get"
  });
}

// 删除数据
export function deleteProduct(ids) {
  return request({
    url: `/sd/production-task/delete/batch/`,
    method: "delete",
    params: ids
  });
}
// 选单
export function getProductMenu(data) {
  return request({
    url: "/sd/order/list/choose",
    method: "get",
    params: data
  });
}

//部门表
export function getDepartmentList(data) {
  return request({
    url: "/uc/department/look-up",
    method: "get",
    params: data
  });
}
// 物料编号
export function materialIdList(data) {
  return request({
    url: "/mdm/material-variety/lookup/material",
    method: "get",
    params: data
  });
}
// 文件上传
export function uploadPhoto(data) {
  return request({
    url: "/sm/file/upload",
    method: "get",
    data
  });
}
// 增加数据
export function addDataOne(data) {
  return request({
    url: "/sd/production-task/add",
    method: "post",
    data
  });
}

// 修改数据

export function updateDataOne(data) {
  return request({
    url: "/sd/production-task/update",
    method: "put",
    data
  });
}
// 取消关闭
export function cancelClose(data) {
  return request({
    url: "/sd/production-task/update/cancel-close",
    method: "put",
    params: data
  });
}
// 手动取消完成
export function cancelComplete(data) {
  return request({
    url: "/sd/production-task/update/cancel-complete",
    method: "put",
    params: data
  });
}

// 手动关闭
export function autoClose(data) {
  return request({
    url: "/sd/production-task/update/close",
    method: "put",
    params: data
  });
}
// 手动完成
export function autoComplate(data) {
  return request({
    url: "/sd/production-task/update/complete",
    method: "put",
    params: data
  });
}
// 手动撤回
export function autoRecover(data) {
  return request({
    url: "/sd/production-task/update/revocation",
    method: "put",
    params: data
  });
}
//手动提交
export function autoSubmit(data) {
  return request({
    url: "/sd/production-task/submit",
    method: "put",
    params: data
  });
}
// 根据userId获取部门
// /uc/department/get/company/department/{userId}
export function getUserDepartments(userId) {
  return request({
    url:`/uc/department/get/company/department/${userId}`,
    method: "get",
    
  });
}
export function getTrackList(data){
  return request({
    url:'/pd/track-template/list',
    method:"get",
    params:data
  })
}

// 获取投料信息
export function getfeedDetailList(materialId){
  return request({
    url:`/pd/bom/list-detail/${materialId}`,
    method:"get",
    
  })
}