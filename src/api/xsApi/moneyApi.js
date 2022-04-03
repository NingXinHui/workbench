import request from '@/utils/request'
// 单位维护-列表
export function queryPageList(parameter){
    return request({
        url: '/sm/pc/pbunit/queryPage',
        method: 'POST',
        params: parameter
      })
}
// 单位维护-添加
export function queryPageListadd(parameter){
    return request({
        url: '/sm/pc/pbunit/add',
        method: 'POST',
        data: parameter
      })
}
// 单位维护-编辑
export function queryPageListedit(parameter){
    return request({
        url: '/sm/pc/pbunit/edit',
        method: 'POST',
        data: parameter
      })
}
// 单位维护-删除
export function queryPageListdelete(parameter){
    return request({
        url: '/sm/pc/pbunit/delete',
        method: 'POST',
        params: parameter
      })
}
// 单位维护-单位类型
export function getDictByTypeList(parameter){
    return request({
        url: '/system/dict/data/type/getDictByTypeList',
        method: 'get',
        params: parameter
      })
}
// 币种维护-列表
export function queryPageListBZ(parameter){
    return request({
        url: '/sm/pc/pbcurrency/queryPage',
        method: 'POST',
        params: parameter
      })
}
// 币种维护-添加
export function queryPageListBZadd(parameter){
    return request({
        url: '/sm/pc/pbcurrency/add',
        method: 'POST',
        data: parameter
      })
}
// 币种维护-编辑
export function queryPageListBZedit(parameter){
    return request({
        url: '/sm/pc/pbcurrency/edit',
        method: 'POST',
        data: parameter
      })
}
// 币种维护-删除
export function queryPageListBZdelete(parameter){
    return request({
        url: '/sm/pc/pbcurrency/delete',
        method: 'POST',
        params: parameter
      })
}
// 收付大类-查询所有
export function queryAll(parameter){
    return request({
        url: '/fi/recePaySort/queryAll',
        method: 'get',
        params: parameter
      })
}
// 收付类型维护-分页查询
export function queryPageZ(parameter){
    return request({
        url: '/fi/recePayType/queryPage',
        method: 'get',
        params: parameter
      })
}
// 收付类型维护-添加
export function queryPageZadd(parameter){
    return request({
        url: '/fi/recePayType/add',
        method: 'POST',
        data: parameter
    })
}
// 收付类型维护-编辑
export function queryPageZedit(parameter){
    return request({
        url: '/fi/recePayType/edit',
        method: 'PUT',
        data: parameter
    })
}
// 收付类型维护-删除
export function queryPageZdelete(parameter){
    return request({
        url: '/fi/recePayType/delete',
        method: 'DELETE',
        params: parameter
    })
}
// 收款查询-分页查询
export function queryDetail(parameter){
    return request({
        url: '/fi/receivableMoney/queryDetail',
        method: 'GET',
        params: parameter
    })
}
// 应收应付类型-查询所有
export function queryDataAll(parameter){
    return request({
        url: '/fi/recePayType/queryAll',
        method: 'GET',
        params: parameter
    })
}
// 实付查查-查询所有
export function queryDetailAll(parameter){
    return request({
        url: '/fi/payableMoney/queryDetail',
        method: 'GET',
        params: parameter
    })
}
// 应收款查询-查询所有
export function queryDetailPage(parameter){
    return request({
        url: '/fi/pc/fireceivablehdr/queryDetailPage',
        method: 'GET',
        params: parameter
    })
}
// 应付款查询-查询所有
export function fipayablehdr(parameter){
    return request({
        url: '/fi/pc/fipayablehdr/queryDetailPage',
        method: 'GET',
        params: parameter
    })
}
// 账龄维护-分页列表查询
export function ageQueryPage(parameter){
    return request({
        url: '/fi/pc/ficreditageitemhdr/queryPage',
        method: 'GET',
        params: parameter
    })
}
// 应收账龄报表-查询所有
export function ageAnalysis(parameter){
    return request({
        url: '/fi/pc/fireceivablehdr/ageAnalysis',
        method: 'GET',
        params: parameter
    })
}
// 应付账龄报表-查询所有
export function fipayablehdrage(parameter){
    return request({
        url: '/fi/pc/fipayablehdr/ageAnalysis',
        method: 'GET',
        params: parameter
    })
}
// 应付明细-查询所有
export function fipayablehdrQueryPage(parameter){
    return request({
        url: '/fi/pc/fipayablehdr/queryPage',
        method: 'GET',
        params: parameter
    })
}
// 应收明细-查询所有
export function fireceivablehdrQueryPage(parameter){
    return request({
        url: '/fi/pc/fireceivablehdr/queryPage',
        method: 'GET',
        params: parameter
    })
}
//核算项目-分页列表查询
export function checkItemList(parameter) {
    return request({
        url: '/sm/checkItem/queryPage',
        method: 'get',
        params: parameter
    })
}

//-分页列表查询
export function checkItemQueryAll(parameter) {
    return request({
        url: '/sm/checkItem/queryAll',
        method: 'get',
        params: parameter
    })
}
//币种-分页列表查询
export function pbcurrencyQueryAll(parameter) {
    return request({
        url: '/sm/pc/pbcurrency/queryAll',
        method: 'get',
        params: parameter
    })
}
// 物测项目-测试人员维护
export function textQueryPage(parameter) {
    return request({
        url: '/qm/tester/queryPage',
        method: 'get',
        params: parameter
    })
}
// 物测项目-测试员
export function textqueryAll(parameter) {
    return request({
        url: '/qm/testerGroup/queryAll',
        method: 'get',
        params: parameter
    })
}
// 物测项目-用户所有
export function userlistAll(parameter) {
    return request({
        url: '/framework-user/user-list',
        method: 'GET',
        params: parameter
    })
}
// 物测项目-测试员add
export function textqueryadd(parameter) {
    return request({
        url: '/qm/tester/add',
        method: 'POST',
        data: parameter
    })
}
// 物测项目-测试员edit
export function textqueryedit(parameter) {
    return request({
        url: '/qm/tester/edit',
        method: 'PUT',
        data: parameter
    })
}
// 物测项目-测试员delete
export function textquerydelete(parameter) {
    return request({
        url: '/qm/tester/delete',
        method: 'DELETE',
        params: parameter
    })
}
// 物测项目-测试员组all
export function textqueryqueryAll(parameter) {
    return request({
        url: '/qm/testerGroup/queryAll',
        method: 'GET',
        params: parameter
    })
}
// 物测项目-测试员组save
export function textquerysave(parameter) {
    return request({
        url: '/qm/testerGroup/save',
        method: 'POST',
        data: parameter
    })
}
// 物测项目-测试项目维护-测试项目组别
export function textgroupqueryAll(parameter) {
    return request({
        url: '/qm/pc/qmtestitemgroup/queryAll',
        method: 'GET',
        params: parameter
    })
}
// 物测项目-测试项目维护-测试项目组别-新增-编辑
export function textgroupqueryedit(parameter) {
    return request({
        url: '/qm/pc/qmtestitemgroup/edit',
        method: 'PUT',
        data: parameter
    })
}
// 物测项目-测试项目维护-分页查询
export function textqmqueryPage(parameter) {
    return request({
        url: '/qm/pc/qmtestitemhdr/queryPage',
        method: 'GET',
        params: parameter
    })
}
// 物测项目-测试方法all
export function textqmqueryAll(parameter) {
    return request({
        url: '/qm/pc/qmtestmethod/queryAll',
        method: 'GET',
        params: parameter
    })
}
// 物测项目-测试项目add
export function textqmqueryadd(parameter) {
    return request({
        url: '/qm/pc/qmtestitemhdr/add',
        method: 'POST',
        data: parameter
    })
}
//物测项目-测试项目id查询
export function textqmqueryById(parameter) {
    return request({
        url: '/qm/pc/qmtestitemhdr/queryById',
        method: 'GET',
        params: parameter
    })
}
//物测项目-测试项目id删除
export function textqmqueryByIdDele(parameter) {
    return request({
        url: '/qm/pc/qmtestitemhdr/delete',
        method: 'DELETE',
        params: parameter
    })
}
//物测项目-测试项目-编辑
export function textqmqueryByIdEdit(parameter) {
    return request({
        url: '/qm/pc/qmtestitemhdr/edit',
        method: 'PUT',
        data: parameter
    })
}
//物测项目-测试项目-查询所有
export function qmtesqueryAll(parameter) {
    return request({
        url: '/qm/pc/qmtestitemhdr/queryAll',
        method: 'get',
        params: parameter
    })
}
//物测项目-测试标准-分页查询
export function textqmdardhdr(parameter) {
    return request({
        url: '/qm/pc/qmteststandardhdr/queryPage',
        method: 'get',
        params: parameter
    })
}
//物测项目-测试标准-add
export function textqmdardhdradd(parameter) {
    return request({
        url: '/qm/pc/qmteststandardhdr/add',
        method: 'POST',
        data: parameter
    })
}
//物测项目-测试标准-id查询
export function textqmdarqueryById(parameter) {
    return request({
        url: '/qm/pc/qmteststandardhdr/queryById',
        method: 'GET',
        params: parameter
    })
}
//物测项目-测试标准-编辑
export function textqmdarqueryedit(parameter) {
    return request({
        url: '/qm/pc/qmteststandardhdr/edit',
        method: 'PUT',
        data: parameter
    })
}
//物测项目-测试标准-删除
export function textqmdelete(parameter) {
    return request({
        url: '/qm/pc/qmteststandardhdr/delete',
        method: 'DELETE',
        params: parameter
    })
}
//物测项目-测试结果-分页
export function textqmtesthdrPage(parameter) {
    return request({
        url: '/qm/testHdr/queryPage',
        method: 'GET',
        params: parameter
    })
}
///物测项目-测试结果-详情
export function testDtlqmqueryPage(parameter) {
    return request({
        url: 'qm/testDtl/queryPage',
        method: 'GET',
        params: parameter
    })
}
///物测项目-测试标准-all
export function testDtqueryAll(parameter) {
    return request({
        url: '/qm/pc/qmteststandardhdr/queryAll',
        method: 'GET',
        params: parameter
    })
}
///物测项目-测试种类-查询左侧列表
export function testCateryAll(parameter) {
    return request({
        url: '/qm/pc/testCatery/queryAll',
        method: 'GET',
        params: parameter
    })
}
// 物测项目-测试种类-查询id
export function testCateryId(parameter) {
    return request({
        url: '/qm/pc/testCatery/queryById',
        method: 'GET',
        params: parameter
    })
}
// 物测项目-测试种类-事件类别下拉
export function testqueryReadyData(parameter) {
    return request({
        url: '/qm/pc/testCatery/queryReadyData',
        method: 'GET',
        params: parameter
    })
}
// 物测项目-测试种类-事件类别下拉
export function testqueryqueryAll(parameter) {
    return request({
        url: '/qm/pc/qmtestvalidate/queryAll',
        method: 'GET',
        params: parameter
    })
}
// 物测项目-测试种类-add
export function testqueryqueryadd(parameter) {
    return request({
        url: '/qm/pc/testCatery/add',
        method: 'POST',
        data: parameter
    })
}
// 物测项目-测试种类-edit
export function testqueryeditById(parameter) {
    return request({
        url: '/qm/pc/testCatery/editById',
        method: 'put',
        data: parameter
    })
}
// 物测项目-测试结果-分页
export function testqueryPage(parameter) {
    return request({
        url: '/qm/pc/testHdr/queryPage',
        method: 'GET',
        params: parameter
    })
}
// 物测项目-测试结果表头-分页
export function testqueryHeader(parameter) {
    return request({
        url: '/qm/pc/testHdr/queryHeader',
        method: 'GET',
        params: parameter
    })
}
///物测项目-测试结果添加-动态
export function queryAddForm(parameter) {
    return request({
        url: '/qm/pc/testHdr/queryAddForm',
        method: 'GET',
        params: parameter
    })
}
///物测项目-测试结果添加报存
export function queryAddFormadd(parameter) {
    return request({
        url: '/qm/pc/testHdr/add',
        method: 'POST',
        data: parameter
    })
}
///物测项目-测试结果edit
export function queryAddFormedit(parameter) {
    return request({
        url: '/qm/pc/testHdr/editById',
        method: 'PUT',
        data: parameter
    })
}
///物测项目-测试结果editStaus
export function queryAddFormeditStaus(parameter) {
    return request({
        url: '/qm/pc/testHdr/editStaus',
        method: 'PUT',
        data: parameter
    })
}
///物测项目-测试结果delete
export function queryAddFormedelete(parameter) {
    return request({
        url: '/qm/pc/testHdr/delete',
        method: 'DELETE',
        params: parameter
    })
}
//物测项目-测试结果下拉
export function queryAddformula(parameter) {
    return request({
        url: '/qm/pc/testHdr/formula?id='+parameter.id,
        method: 'POST',
        data: parameter.data
    })
}

//物测项目-测试结果lookup
export function stockStoreLookUp(parameter) {
    return request({
        url: '/qm/pc/testHdr/lookup',
        method: 'POST',
        data: parameter
    })
}
//
export function generatorByPageRoute(parameter) {
    return request({
        url: '/system/pc/pbBillFormulahdr/generatorByPageRoute',
        method: 'GET',
        params: parameter
    })
}
///qm/pc/testHdr/queryById
export function generaqueryById(parameter) {
    return request({
        url: '/qm/pc/testHdr/queryById',
        method: 'GET',
        params: parameter
    })
}
// 获取所有的 
export function fiFinancePeriodQueryAll (parameter) {
    return request({
      url: '/fi/pc/fiFinancePeriod/queryAll',
      method: 'get',
      params: parameter
  
    })
  }
  // 添加 
export function fiFinancePeriodAdd (parameter) {
    return request({
      url: "/fi/pc/fiFinancePeriod/add",
      method: 'post',
      data: parameter
    })
  }
  // 通过id查询 获取某数据的详情 
  export function fiFinancePeriodQueryById (parameter) {
    return request({
      url: '/fi/pc/fiFinancePeriod/queryById',
      method: 'get',
      params: parameter
  
    })
  }
  // 编辑 
  export function fiFinancePeriodEdit (parameter) {
    return request({
      url: '/fi/pc/fiFinancePeriod/edit',
      method: 'PUT',
      data: parameter
  
    })
  }





