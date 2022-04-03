import request from '@/utils/request'
//   核算项目类型-查询所有
export function materialType (query) {
  return request({
    url: '/trade-sm/sm/pbcheckitemtype/queryAll',
    method: 'get',
    params: query
  })
}
//
export function pbworkorder (query) {
  return request({
    url: '/trade-sm/pb/pbworkordertype/workingProcedureSelect',
    method: 'get',
    params: query
  })
}

// 工单类型-查询表格
export function pbworkordertype (query) {
  return request({
    url: '/trade-sm/pb/pbworkordertype/queryPage',
    method: 'get',
    params: query
  })
}
//   工单类型-add
export function pbworkordertypeAdd (query) {
  return request({
    url: '/trade-sm/pb/pbworkordertype/add',
    method: 'post',
    data: query
  })
}
//   工单类型-id查询
export function pbworkordertypeQueryById (query) {
  return request({
    url: '/trade-sm/pb/pbworkordertype/queryById',
    method: 'get',
    params: query
  })
}
//工单类型-编辑
export function pbworkordertypeEditById (query) {
  return request({
    url: '/trade-sm/pb/pbworkordertype/editById',
    method: 'PUT',
    data: query
  })
}
//工单类型-删除
export function pbworkordertypeDelete (query) {
  return request({
    url: '/trade-sm/pb/pbworkordertype/deleteById',
    method: 'DELETE',
    params: query
  })
}
//车间档案维护-分页查询
export function pbworkshop (query) {
  return request({
    url: '/trade-sm/pb/pbworkshop/queryPage',
    method: 'get',
    params: query
  })
}
//车间档案维护-add
export function pbworkshopAdd (query) {
  return request({
    url: '/trade-sm/pb/pbworkshop/add',
    method: 'post',
    data: query
  })
}
//车间档案维护-编辑
export function pbworkshopEdit (query) {
  return request({
    url: '/trade-sm/pb/pbworkshop/editById',
    method: 'PUT',
    data: query
  })
}
//   车间档案维护-id查询
export function pbworkshopQueryById (query) {
  return request({
    url: '/trade-sm/pb/pbworkshop/queryById',
    method: 'get',
    params: query
  })
}
//   车间档案维护-Delete
export function pbworkshopDelete (query) {
  return request({
    url: '/trade-sm/pb/pbworkshop/deleteById',
    method: 'DELETE',
    params: query
  })
}
//工人维护-分页查询
export function pbworker (query) {
  return request({
    url: '/trade-sm/pb/pbworker/queryPage',
    method: 'get',
    params: query
  })
}
//车间下拉
export function pbworkshopSelectList (query) {
  return request({
    url: '/trade-sm/pb/pbworkshop/selectList',
    method: 'get',
    params: query
  })
}
//工人维护-add
export function pbworkerAdd (query) {
  return request({
    url: '/trade-sm/pb/pbworker/add',
    method: 'post',
    data: query
  })
}

//工人维护-获取所有工人
export function pbworkerAll (query) {
  return request({
    url: '/trade-sm/pb/pbworker/queryAll',
    method: 'get',
    params: query
  })
}

//工人维护-编辑
export function pbworkerEdit (query) {
  return request({
    url: '/trade-sm/pb/pbworker/editById',
    method: 'PUT',
    data: query
  })
}
//   工人维护-Delete
export function pbworkerDelete (query) {
  return request({
    url: '/trade-sm/pb/pbworker/deleteById',
    method: 'DELETE',
    params: query
  })
}
//   工人维护-id查询
export function pbworkerById (query) {
  return request({
    url: '/trade-sm/pb/pbworker/queryById',
    method: 'get',
    params: query
  })
}
//班组维护-左边
export function pbworkgroup (query) {
  return request({
    url: '/trade-sm/pb/pbworkgroup/queryAll',
    method: 'get',
    params: query
  })
}
//班组维护-通过id查询
export function pbworkgroupQueryById (query) {
  return request({
    url: '/trade-sm/pb/pbworkgroup/queryById',
    method: 'get',
    params: query
  })
}
//未和班组匹配的工人列表
export function UnWorkerList (query) {
  return request({
    url: '/trade-sm/pb/pbworker/UnWorkerList',
    method: 'get',
    params: query
  })
}
//未和班组匹配的工人列表
export function UnWorkerListG (query) {
  return request({
    url: '/trade-sm/pb/pbworker/UnTypeList',
    method: 'get',
    params: query
  })
}
//班组维护-add
export function pbworkgroupAdd (query) {
  return request({
    url: '/trade-sm/pb/pbworkgroup/add',
    method: 'post',
    data: query
  })
}
//班组维护-编辑
export function pbworkgroupEditById (query) {
  return request({
    url: '/trade-sm/pb/pbworkgroup/editById',
    method: 'put',
    data: query
  })

}
//   班组维护-Delete
export function pbworkgroupDelete (query) {
  return request({
    url: '/trade-sm/pb/pbworkgroup/deleteById',
    method: 'DELETE',
    params: query
  })
}
//工种-左边
export function pbworktype (query) {
  return request({
    url: '/trade-sm/pb/pbworktype/queryAllType',
    method: 'get',
    params: query
  })
}
//工种-通过id查询
export function pbworktypeQueryById (query) {
  return request({
    url: '/trade-sm/pb/pbworktype/queryById',
    method: 'get',
    params: query
  })
}
//工种-add
export function pbworktypeAdd (query) {
  return request({
    url: '/trade-sm/pb/pbworktype/add',
    method: 'post',
    data: query
  })
}
//工种-编辑
export function pbworktypeEditById (query) {
  return request({
    url: '/trade-sm/pb/pbworktype/editById',
    method: 'put',
    data: query
  })
}
//   工种-Delete
export function pbworktypeDelete (query) {
  return request({
    url: '/trade-sm/pb/pbworktype/deleteById',
    method: 'DELETE',
    params: query
  })
}
//销售员组-分页查询
export function pbsalesgroup (query) {
  return request({
    url: '/trade-sm/pc/pbsalesgroup/queryPage',
    method: 'get',
    params: query
  })
}
//销售员组-add
export function pbsalesgroupAdd (query) {
  return request({
    url: '/trade-sm/pc/pbsalesgroup/add',
    method: 'post',
    data: query
  })
}
//销售员组-编辑
export function pbsalesgroupEditById (query) {
  return request({
    url: '/trade-sm/pc/pbsalesgroup/editById',
    method: 'put',
    data: query
  })
}
//   销售员组-Delete
export function pbsalesgroupDelete (query) {
  return request({
    url: '/trade-sm/pc/pbsalesgroup/deleteById',
    method: 'DELETE',
    params: query
  })
}

//销售员组-通过id查询
export function pbsalesgroupById (query) {
  return request({
    url: '/trade-sm/pc/pbsalesgroup/queryById',
    method: 'get',
    params: query
  })
}
//订单-分页查询
export function sdordertype (query) {
  return request({
    url: '/trade-po/sdordertype/queryPage',
    method: 'get',
    params: query
  })
}
//订单-add
export function sdordertypeAdd (query) {
  return request({
    url: '/trade-po/sdordertype/add',
    method: 'post',
    data: query
  })
}
//订单-编辑
export function pbsalesgroupEdit (query) {
  return request({
    url: '/trade-po/sdordertype/editById',
    method: 'put',
    data: query
  })
}
//订单-id查询
export function sdordertypeById (query) {
  return request({
    url: '/trade-po/sdordertype/queryById',
    method: 'get',
    params: query
  })
}

//订单-删除
export function sdordertypeDelete (query) {
  return request({
    url: '/trade-po/sdordertype/deleteById',
    method: 'DELETE',
    params: query
  })
}
//销售员-分页查询
export function pbsales (query) {
  return request({
    url: '/trade-sm/pc/pbsales/queryPage',
    method: 'get',
    params: query
  })
}
//销售员-add
export function pbsalesAdd (query) {
  return request({
    url: '/trade-sm/pc/pbsales/add',
    method: 'post',
    data: query
  })
}
//销售员-编辑
export function pbsalesEdit (query) {
  return request({
    url: '/trade-sm/pc/pbsales/editById',
    method: 'put',
    data: query
  })
}
//销售员-通过id查询
export function pbsalesById (query) {
  return request({
    url: '/trade-sm/pc/pbsales/queryById',
    method: 'get',
    params: query
  })
}
export function pbsalesDelete (query) {
  return request({
    url: '/trade-sm/pc/pbsales/deleteById',
    method: 'DELETE',
    params: query
  })
}
export function pbsalesgroupAll (query) {
  return request({
    url: '/trade-sm/pc/pbsalesgroup/queryAll',
    method: 'get',
    params: query
  })
}
//系统用户lookup
export function userlookup (query) {
  return request({
    url: '/trade-sm/user/lookup',
    method: 'get',
    params: query
  })
}
//系统用户-角色
export function rolequeryAll (query) {
  return request({
    url: '/trade-sm/role/queryAll',
    method: 'get',
    params: query
  })
}
//物料类别-分页
export function materialTypeAll (query) {
  return request({
    url: '/trade-sm/materialType/queryAll',
    method: 'get',
    params: query
  })
}
///物料-delete
export function materialDelete (parameter) {
  return request({
    url: '/trade-sm/material/delete',
    method: 'DELETE',
    params: parameter
  })
}
///物料类别-delete
export function materialTypeDelete (parameter) {
  return request({
    url: '/trade-sm/materialType/deleteById',
    method: 'DELETE',
    params: parameter
  })
}

//物料类别-add-Edit
export function pbsalesaddOrEdit (query) {
  return request({
    url: '/trade-sm/materialType/addOrEdit',
    method: 'post',
    data: query
  })
}
//物料维护-分页
export function materialqueryPage (query) {
  return request({
    url: '/trade-sm/material/queryPage',
    method: 'get',
    params: query
  })
}
//物料维护-Add
export function materialAdd (query) {
  return request({
    url: '/trade-sm/material/add',
    method: 'post',
    data: query
  })
}
//供应商-列表
export function getCheckItemList (query) {
  return request({
    url: '/trade-sm/checkItem/queryPage',
    method: 'get',
    params: query
  })
}
//供应商分类-下拉
export function getCustomerType (query) {
  return request({
    url: '/trade-sm/sm/pbcheckitemtypedtl/queryDropAll',
    method: 'get',
    params: query
  })
}
// 字典下拉-通用
export function getDictByTypeList (query) {
  return request({
    url: '/trade-sm/sysDictData/type/getDictByTypeList',
    method: 'get',
    params: query
  })
}
// 物料-id查询
export function materialqueryById (query) {
  return request({
    url: '/trade-sm/material/queryById',
    method: 'get',
    params: query
  })
}
// 物料-编辑
export function materialEdit (query) {
  return request({
    url: '/trade-sm/material/edit',
    method: 'put',
    data: query
  })
}
// 单位-下拉
export function querySelectList (query) {
  return request({
    url: '/trade-sm/sysUnit/queryAll',
    method: 'get',
    params: query
  })
}

// return doPost('',query)
// function doPost(url,query) {
//   return request({
//     url: url,
//     method: 'post',
//     data: query
//   })
// }

// 物测项目-测试人员维护
export function textQueryPage (parameter) {
  return request({
    url: '/qm/tester/queryPage',
    method: 'get',
    params: parameter
  })
}
// 物测项目-测试员
export function textqueryAll (parameter) {
  return request({
    url: '/qm/testerGroup/queryAll',
    method: 'get',
    params: parameter
  })
}
// 物测项目-用户所有
export function userlistAll (parameter) {
  return request({
    url: '/framework-user/user-list',
    method: 'GET',
    params: parameter
  })
}
// 物测项目-测试员add
export function textqueryadd (parameter) {
  return request({
    url: '/qm/tester/add',
    method: 'POST',
    data: parameter
  })
}
// 物测项目-测试员edit
export function textqueryedit (parameter) {
  return request({
    url: '/qm/tester/edit',
    method: 'PUT',
    data: parameter
  })
}
// 物测项目-测试员delete
export function textquerydelete (parameter) {
  return request({
    url: '/qm/tester/delete',
    method: 'DELETE',
    params: parameter
  })
}
// 物测项目-测试员组all
export function textqueryqueryAll (parameter) {
  return request({
    url: '/qm/testerGroup/queryAll',
    method: 'GET',
    params: parameter
  })
}
// 物测项目-测试员组save
export function textquerysave (parameter) {
  return request({
    url: '/qm/testerGroup/save',
    method: 'POST',
    data: parameter
  })
}
// 物测项目-测试项目维护-测试项目组别
export function textgroupqueryAll (parameter) {
  return request({
    url: '/qm/pc/qmtestitemgroup/queryAll',
    method: 'GET',
    params: parameter
  })
}
// 物测项目-测试项目维护-测试项目组别-新增-编辑
export function textgroupqueryedit (parameter) {
  return request({
    url: '/qm/pc/qmtestitemgroup/edit',
    method: 'PUT',
    data: parameter
  })
}
// 物测项目-测试项目维护-分页查询
export function textqmqueryPage (parameter) {
  return request({
    url: '/qm/pc/qmtestitemhdr/queryPage',
    method: 'GET',
    params: parameter
  })
}
// 物测项目-测试方法all
export function textqmqueryAll (parameter) {
  return request({
    url: '/qm/pc/qmtestmethod/queryAll',
    method: 'GET',
    params: parameter
  })
}
// 物测项目-测试项目add
export function textqmqueryadd (parameter) {
  return request({
    url: '/qm/pc/qmtestitemhdr/add',
    method: 'POST',
    data: parameter
  })
}
//物测项目-测试项目id查询
export function textqmqueryById (parameter) {
  return request({
    url: '/qm/pc/qmtestitemhdr/queryById',
    method: 'GET',
    params: parameter
  })
}
//物测项目-测试项目id删除
export function textqmqueryByIdDele (parameter) {
  return request({
    url: '/qm/pc/qmtestitemhdr/delete',
    method: 'DELETE',
    params: parameter
  })
}
//物测项目-测试项目-编辑
export function textqmqueryByIdEdit (parameter) {
  return request({
    url: '/qm/pc/qmtestitemhdr/edit',
    method: 'PUT',
    data: parameter
  })
}
//物测项目-测试项目-查询所有
export function qmtesqueryAll (parameter) {
  return request({
    url: '/qm/pc/qmtestitemhdr/queryAll',
    method: 'get',
    params: parameter
  })
}
//物测项目-测试标准-分页查询
export function textqmdardhdr (parameter) {
  return request({
    url: '/qm/pc/qmteststandardhdr/queryPage',
    method: 'get',
    params: parameter
  })
}
//物测项目-测试标准-add
export function textqmdardhdradd (parameter) {
  return request({
    url: '/qm/pc/qmteststandardhdr/add',
    method: 'POST',
    data: parameter
  })
}
//物测项目-测试标准-id查询
export function textqmdarqueryById (parameter) {
  return request({
    url: '/qm/pc/qmteststandardhdr/queryById',
    method: 'GET',
    params: parameter
  })
}
//物测项目-测试标准-编辑
export function textqmdarqueryedit (parameter) {
  return request({
    url: '/qm/pc/qmteststandardhdr/edit',
    method: 'PUT',
    data: parameter
  })
}
//物测项目-测试标准-删除
export function textqmdelete (parameter) {
  return request({
    url: '/qm/pc/qmteststandardhdr/delete',
    method: 'DELETE',
    params: parameter
  })
}
//物测项目-测试结果-分页
export function textqmtesthdrPage (parameter) {
  return request({
    url: '/qm/testHdr/queryPage',
    method: 'GET',
    params: parameter
  })
}
///物测项目-测试结果-详情
export function testDtlqmqueryPage (parameter) {
  return request({
    url: 'qm/testDtl/queryPage',
    method: 'GET',
    params: parameter
  })
}
///物测项目-测试标准-all
export function testDtqueryAll (parameter) {
  return request({
    url: '/qm/pc/qmteststandardhdr/queryAll',
    method: 'GET',
    params: parameter
  })
}
///物测项目-测试种类-查询左侧列表
export function testCateryAll (parameter) {
  return request({
    url: '/qm/pc/testCatery/queryAll',
    method: 'GET',
    params: parameter
  })
}
// 物测项目-测试种类-查询id
export function testCateryId (parameter) {
  return request({
    url: '/qm/pc/testCatery/queryById',
    method: 'GET',
    params: parameter
  })
}
// 物测项目-测试种类-事件类别下拉
export function testqueryReadyData (parameter) {
  return request({
    url: '/qm/pc/testCatery/queryReadyData',
    method: 'GET',
    params: parameter
  })
}
// 物测项目-测试种类-事件类别下拉
export function testqueryqueryAll (parameter) {
  return request({
    url: '/qm/pc/qmtestvalidate/queryAll',
    method: 'GET',
    params: parameter
  })
}
// 物测项目-测试种类-add
export function testqueryqueryadd (parameter) {
  return request({
    url: '/qm/pc/testCatery/add',
    method: 'POST',
    data: parameter
  })
}
// 物测项目-测试种类-edit
export function testqueryeditById (parameter) {
  return request({
    url: '/qm/pc/testCatery/editById',
    method: 'put',
    data: parameter
  })
}
// 物测项目-测试结果-分页
export function testqueryPage (parameter) {
  return request({
    url: '/qm/pc/testHdr/queryPage',
    method: 'GET',
    params: parameter
  })
}
// 物测项目-测试结果表头-分页
export function testqueryHeader (parameter) {
  return request({
    url: '/qm/pc/testHdr/queryHeader',
    method: 'GET',
    params: parameter
  })
}
///物测项目-测试结果添加-动态
export function queryAddForm (parameter) {
  return request({
    url: '/qm/pc/testHdr/queryAddForm',
    method: 'GET',
    params: parameter
  })
}
///物测项目-测试结果添加报存
export function queryAddFormadd (parameter) {
  return request({
    url: '/qm/pc/testHdr/add',
    method: 'POST',
    data: parameter
  })
}
///物测项目-测试结果edit
export function queryAddFormedit (parameter) {
  return request({
    url: '/qm/pc/testHdr/editById',
    method: 'PUT',
    data: parameter
  })
}
///物测项目-测试结果editStaus
export function queryAddFormeditStaus (parameter) {
  return request({
    url: '/qm/pc/testHdr/editStaus',
    method: 'PUT',
    data: parameter
  })
}
///物测项目-测试结果delete
export function queryAddFormedelete (parameter) {
  return request({
    url: '/qm/pc/testHdr/delete',
    method: 'DELETE',
    params: parameter
  })
}
//物测项目-测试结果下拉
export function queryAddformula (parameter) {
  return request({
    url: '/qm/pc/testHdr/formula?id=' + parameter.id,
    method: 'POST',
    data: parameter.data
  })
}

//物测项目-测试结果lookup
export function stockStoreLookUp (parameter) {
  return request({
    url: '/qm/pc/testHdr/lookup',
    method: 'POST',
    data: parameter
  })
}

//
export function generatorByPageRoute (parameter) {
  return request({
    url: '/system/pc/pbBillFormulahdr/generatorByPageRoute',
    method: 'GET',
    params: parameter
  })
}
///qm/pc/testHdr/queryById
export function generaqueryById (parameter) {
  return request({
    url: '/qm/pc/testHdr/queryById',
    method: 'GET',
    params: parameter
  })
}
//单据编码规则-分页查询
export function pbBillFormulahdr (parameter) {
  return request({
    url: '/trade-sm/pc/pbBillFormulahdr/queryPage',
    method: 'get',
    params: parameter
  })
}
//单据编码规则-edit
export function pbBillFormulahdredit (parameter) {
  return request({
    url: '/trade-sm/pc/pbBillFormulahdr/editById',
    method: 'POST',
    data: parameter
  })
}
//单据编码规则-测试获取单号
export function generatorTest (parameter) {
  return request({
    url: '/trade-sm/pc/pbBillFormulahdr/generatorTest',
    method: 'POST',
    data: parameter
  })
}
//钢筘信息-分页查询
export function pbweavereed (parameter) {
  return request({
    url: '/trade-sm/sm/pbweavereed/queryPage',
    method: 'get',
    params: parameter
  })
}
//钢筘信息-add
export function pbweavereedAdd (parameter) {
  return request({
    url: '/trade-sm/sm/pbweavereed/add',
    method: 'POST',
    data: parameter
  })
}
///钢筘信息-edit
export function pbweavereedEdit (parameter) {
  return request({
    url: '/trade-sm/sm/pbweavereed/editById',
    method: 'PUT',
    data: parameter
  })
}
//   钢筘信息-id查询
export function pbweavereedById (query) {
  return request({
    url: '/trade-sm/sm/pbweavereed/queryById',
    method: 'get',
    params: query
  })
}
//钢筘信息-删除
export function pbweavereedDelete (query) {
  return request({
    url: '/trade-sm/sm/pbweavereed/deleteById',
    method: 'DELETE',
    params: query
  })
}
//   订单查询-分页
export function orderDtl (query) {
  return request({
    url: '/trade-po/orderDtl/queryPage',
    method: 'get',
    params: query
  })
}
//   订单进度查询-分页
export function orderDtlQueryProcess (query) {
  return request({
    url: '/trade-po/orderDtl/queryProcess',
    method: 'get',
    params: query
  })
}
//   采购进度查询-分页
export function orderDtlPage (query) {
  return request({
    url: '/trade-po/order/orderDtl/page',
    method: 'get',
    params: query
  })
}
//   进度下拉
export function orderDtlGetLineStatus (query) {
  return request({
    url: '/trade-po/order/orderDtl/getLineStatus',
    method: 'get',
    params: query
  })
}
//型号下拉
export function emequipmentmodel (query) {
  return request({
    url: '/trade-pp/pp/emequipmentmodel/queryAllName',
    method: 'get',
    params: query
  })
}
//////////////////////////////////////////////////////////////////////////
//物料分类
export function materialTypePage(query) {
  return request({
    url: '/trade-sm/materialType/queryPage',
    method: 'get',
    params: query
  })
}
//物料大类-下拉
export function materialTypeSelect(query) {
  return request({
    url: '/trade-sm/materialType/allSelect',
    method: 'get',
    params: query
  })
}
//物料类型-新增
export function materialTypeAdd(query) {
  return request({
    url: '/trade-sm/materialType/add',
    method: 'POST',
    data: query
  })
}
//物料类型-edit
export function materialTypeEdit(query) {
  return request({
    url: '/trade-sm/materialType/editById',
    method: 'put',
    data: query
  })
}
//客商分类-分页
export function pbcheckitemtype(query) {
  return request({
    url: '/trade-sm/sm/pbcheckitemtype/queryPage',
    method: 'get',
    params: query
  })
}
//采购订单条款-分页
export function poorderclause(query) {
  return request({
    url: '/trade-po/po/poorderclause/queryPage',
    method: 'get',
    params: query
  })
}
//采购订单条款-add
export function poorderclauseAdd(query) {
  return request({
    url: '/trade-po/po/poorderclause/add',
    method: 'POST',
    data: query
  })
}
//采购订单条款-Edit
export function poorderclauseEdit(query) {
  return request({
    url: '/trade-po/po/poorderclause/editById',
    method: 'PUT',
    data: query
  })
}
//采购订单条款-ById
export function poorderclauseById(query) {
  return request({
    url: '/trade-po/po/poorderclause/queryById',
    method: 'GET',
    params: query
  })
}
//采购订单条款-Delete
export function poorderclauseDelete(query) {
  return request({
    url: '/trade-po/po/poorderclause/deleteById',
    method: 'DELETE',
    params: query
  })
}
//委外订单-分页
export function subordertype(query) {
  return request({
    url: '/trade-po/sd/subordertype/queryPage',
    method: 'get',
    params: query
  })
}
//委外订单-add
export function subordertypeAdd(query) {
  return request({
    url: '/trade-po/sd/subordertype/add',
    method: 'POST',
    data: query
  })
}
//委外订单-Edit
export function subordertypeEdit(query) {
  return request({
    url: '/trade-po/sd/subordertype/editById',
    method: 'PUT',
    data: query
  })
}
//委外订单-ById
export function subordertypeById(query) {
  return request({
    url: '/trade-po/sd/subordertype/queryById',
    method: 'GET',
    params: query
  })
}
//委外订单-Delete
export function subordertypeDelete(query) {
  return request({
    url: '/trade-po/sd/subordertype/deleteById',
    method: 'DELETE',
    params: query
  })
}
//跟单员-分页
export function subfollower(query) {
  return request({
    url: '/trade-po/po/subfollower/queryPage',
    method: 'get',
    params: query
  })
}
//跟单组-分页
export function subfollowergroup(query) {
  return request({
    url: '/trade-po/po/subfollowergroup/queryPage',
    method: 'get',
    params: query
  })
}
//跟单员-add
export function subfollowerAdd(query) {
  return request({
    url: '/trade-po/po/subfollower/add',
    method: 'POST',
    data: query
  })
}
//跟单组-add
export function subfollowergroupAdd(query) {
  return request({
    url: '/trade-po/po/subfollowergroup/add',
    method: 'POST',
    data: query
  })
}
//跟单组-add
export function subfollowergroupEdit(query) {
  return request({
    url: '/trade-po/po/subfollowergroup/editById',
    method: 'PUT',
    data: query
  })
}
//跟单员-e
export function subfollowerEdit(query) {
  return request({
    url: '/trade-po/po/subfollower/editById',
    method: 'PUT',
    data: query
  })
}
//跟单员-Delete
export function subfollowerDelete(query) {
  return request({
    url: '/trade-po/po/subfollower/deleteById',
    method: 'DELETE',
    params: query
  })
}
//跟单组-Delete
export function subfollowergroupDelete(query) {
  return request({
    url: '/trade-po/po/subfollowergroup/deleteById',
    method: 'DELETE',
    params: query
  })
}
//跟单组-ById
export function subfollowergroupById(query) {
  return request({
    url: '/trade-po/po/subfollowergroup/queryById',
    method: 'GET',
    params: query
  })
}
//跟单员-ById
export function subfollowerById(query) {
  return request({
    url: '/trade-po/po/subfollower/queryById',
    method: 'GET',
    params: query
  })
}
//跟单组-所有
export function subfollowergroupAll(query) {
  return request({
    url: '/trade-po/po/subfollowergroup/queryAll',
    method: 'GET',
    params: query
  })
}
//委外-分页
export function suborderclausePage(query) {
  return request({
    url: '/trade-po/po/suborderclause/queryPage',
    method: 'GET',
    params: query
  })
}
//委外-add
export function suborderclauseAdd(query) {
  return request({
    url: '/trade-po/po/suborderclause/add',
    method: 'post',
    data: query
  })
}
//委外-Edit
export function suborderclauseEdit(query) {
  return request({
    url: '/trade-po/po/suborderclause/editById',
    method: 'PUT',
    data: query
  })
}
//委外-Delete
export function suborderclauseDelete(query) {
  return request({
    url: '/trade-po/po/suborderclause/deleteById',
    method: 'DELETE',
    params: query
  })
}
//委外-Delete
export function suborderclauseById(query) {
  return request({
    url: '/trade-po/po/suborderclause/queryById',
    method: 'GET',
    params: query
  })
}
// //销售-分页
// export function sdorderclausePage(query) {
//   return request({
//     url: '/trade-po/sd/sdorderclause/queryPage',
//     method: 'GET',
//     params: query
//   })
// }
//销售-分页
export function sdorderclausePage(query) {
  return request({
    url: '/trade-po/sd/sdorderclause/queryPage',
    method: 'GET',
    params: query
  })
}
//销售-add
export function sdorderclauseAdd(query) {
  return request({
    url: '/trade-po/sd/sdorderclause/add',
    method: 'post',
    data: query
  })
}
//销售-Edit
export function sdorderclauseEdit(query) {
  return request({
    url: '/trade-po/sd/sdorderclause/editById',
    method: 'PUT',
    data: query
  })
}
//销售-Delete
export function sdorderclauseDelete(query) {
  return request({
    url: '/trade-po/sd/sdorderclause/deleteById',
    method: 'DELETE',
    params: query
  })
}
//库存流水-查询
export function stockStatement(query) {
  return request({
    url: '/store/stock/statement',
    method: 'get',
    params: query
  })
}
//销售-ById
export function sdorderclauseById(query) {
  return request({
    url: '/trade-po/sd/sdorderclause/queryById',
    method: 'GET',
    params: query
  })
}
//银行维护-page
export function fibankinfoPage(query) {
  return request({
    url: '/fi/fi/fibankinfo/queryPage',
    method: 'GET',
    params: query
  })
}
//银行维护-Add
export function fibankinfoAdd(query) {
  return request({
    url: '/fi/fi/fibankinfo/add',
    method: 'post',
    data: query
  })
}
//银行维护-Edit
export function fibankinfoEdit(query) {
  return request({
    url: '/fi/fi/fibankinfo/editById',
    method: 'put',
    data: query
  })
}
//银行维护-Delete
export function fibankinfoDelete(query) {
  return request({
    url: '/fi/fi/fibankinfo/deleteById',
    method: 'Delete',
    params: query
  })
}
//获取物料编号lookup
export function look_up_material_no(query){
  return request({
      url:'/trade-sm/material/lookup',
      method:'get',
      params:query
  })
}
//收发存报表
export function reconciliation(query){
  return request({
      url:'/store/storeIn/reconciliation',
      method:'get',
      params:query
  })
}
//仓库管理员
export function locationGroupList(query){
  return request({
      url:'/store/locationGroup/list',
      method:'get',
      params:query
  })
}
//库位
export function locationQuery(query){
  return request({
      url:'/store/location/query',
      method:'get',
      params:query
  })
}
//仓管员-下拉
export function locationGroupUserAll(query){
  return request({
      url:'/store/locationGroup/userAll',
      method:'get',
      params:query
  })
}
//仓管员-add
export function locationGroupAdd(query){
  return request({
      url:'/store/locationGroup/add',
      method:'post',
      data:query
  })
}
//仓管员-edit
export function locationGroupEdit(query){
  return request({
      url:'/store/locationGroup/edit',
      method:'put',
      data:query
  })
}
//仓管员-delete
export function locationGroupDelete(query){
  return request({
      url:'/store/locationGroup/delete',
      method:'delete',
      params:query
  })
}
//仓管员-idLook
export function queryLocationByMainId(query){
  return request({
      url:'/store/locationGroup/queryById',
      method:'get',
      params:query
  })
}

















































