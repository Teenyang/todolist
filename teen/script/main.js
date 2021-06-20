import { taskList, tasksArray, compareDaysAgo, convertDateStringToSlashFormat, exportTaskDataFromLocalStorage } from './modules.js';

const clearStorageButton = document.querySelector('.clear_local_storage');

function clearLocalStorage() {
  localStorage.clear();
}

//* 上傳日期需根據檢視日期隨之遞減
function countUploadDaysAgo() {
  const daysAgo = taskList.querySelectorAll('.upload_days_ago');
  daysAgo.forEach((daysAgo, index) => {
    daysAgo.outerHTML = `
      <p class="upload_days_ago">${(tasksArray[index].file !== '') ? 'uploaded ' + compareDaysAgo(tasksArray[index].fileUpload) : ''}
        (<span class="upload_dateSlash">${(tasksArray[index].file !== '') ? convertDateStringToSlashFormat(tasksArray[index].fileUpload) : ''}</span>)
      </p>
    `
  })
}

clearStorageButton.addEventListener('click', clearLocalStorage);
window.addEventListener('load', countUploadDaysAgo);

//* 自動載入已保存在LocalStorage中的tasks
export default exportTaskDataFromLocalStorage(tasksArray, taskList);