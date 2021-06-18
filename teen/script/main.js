import { taskList, tasksArray, compareDaysAgo, updateTaskData, dateSlashFormat } from './modules.js';

//todo 上傳日期需根據檢視日期隨之遞減
setInterval(function () {
  const daysAgo = taskList.querySelectorAll('.upload_daysAgo');
  daysAgo.forEach((daysAgo, index) => {
    daysAgo.outerHTML = `
      <p class="upload_daysAgo">${(tasksArray[index].file !== '') ? 'uploaded ' + compareDaysAgo(tasksArray[index].fileUpload) : ''}
        (<span class="upload_dateSlash">${(tasksArray[index].file !== '') ? dateSlashFormat(tasksArray[index].fileUpload) : ''}</span>)
      </p>
    `
  })
}, 1000);

//* 自動載入已保存在LocalStorage中的tasks
export default updateTaskData(tasksArray, taskList);