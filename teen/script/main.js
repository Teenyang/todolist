import { taskList, tasksArray, compareDaysAgo, updateTaskData, dateSlashFormat } from './modules.js';

setInterval(function () {
  const daysAgos = taskList.querySelectorAll('.upload_daysAgo');
  daysAgos.forEach((daysAgo, index) => {
    daysAgo.outerHTML = `
      <p class="upload_daysAgo">${(tasksArray[index].file !== '') ? 'uploaded ' + compareDaysAgo(tasksArray[index].fileUpload) : ''}
        (<span class="upload_dateSlash">${(tasksArray[index].file !== '') ? dateSlashFormat(tasksArray[index].fileUpload) : ''}</span>)
      </p>
    `
  })
}, 1000);

// 自動載入已保存在LocalStorage中的tasks
export default updateTaskData(tasksArray, taskList);