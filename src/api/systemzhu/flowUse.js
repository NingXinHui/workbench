import request from '@/utils/requestFlow'

// 我的待办列表
export function getTaskList(parameter) {
    return request({
        url: `/api/process/query/todoByUser/${JSON.parse(localStorage.getItem("userInfoNow")).userId}`,
        method: 'get',
        params: parameter
        
    })
}
// 我的已办
export function getHistoryByUserId(parameter) {
    return request({
        url:  `/api/process/query/processedByUser/${JSON.parse(localStorage.getItem("userInfoNow")).userId}`,
        method: 'get',
        params: parameter
    })
}
// 我发起的
export function getUserStarts(parameter) {
    return request({
        url:  `/api/process/query/startedByUser/${JSON.parse(localStorage.getItem("userInfoNow")).userId}`,
        method: 'get',
        params: parameter
    })
}
// 发起流程实例 
export function sendProcessStart(file) {
    return request({
      url: "/api/process/start",
      method: "post",
      data: file
    });
  }

//    获取流程实例图片
export function processDiagram(fileId) {
    return request({
        url:  `/api/process/diagram/${fileId}`,
        method: 'get',
    })
}
// 获取流程实例的历史记录  
export function processDiagramHistory(fileId) {
    return request({
        url:  `/api/process/query/history/${fileId}`,
        method: 'get',
    })
}
// 处理任务 
export function doneTaskSome(file) {
    return request({
      url: "/api/task",
      method: "post",
      data: file
    });
  }