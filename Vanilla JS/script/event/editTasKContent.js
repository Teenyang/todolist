import { compareDaysAgo, separateDateFormatWithSlash } from '../modules/convertDateFormat.js';

const main = document.querySelector('main');

//~ General function
function recordUploadFileData(date, uploadInput, currentTask) {
  //* 清除上傳檔案路徑C:\fakepath\
  const fileName = uploadInput.value.replace(/.*[\/\\]/, '');
  const uploadDate = separateDateFormatWithSlash(date);
  const uploadDaysAgo = compareDaysAgo(date);
  const fileData = currentTask.querySelector('.file_data');

  // const filesObject = uploadInput.files[0];
  // const objectURL = URL.createObjectURL(filesObject);

  fileData.classList.toggle('show', fileName !== '');
  return fileData.innerHTML = `
      <span class="upload_fileName">${fileName}</span>
      <p class="upload_days_ago">${(fileName !== '') ? ('uploaded ' + uploadDaysAgo) : ''}
        (<span class="upload_dateSlash">${(fileName !== '') ? uploadDate : ''}</span>)
      </p>
      <span class="upload_dateMillisecond">${date}</span>
    `
}

function changeInputType(className, eventTarget) {
  eventTarget.type = className;
  eventTarget.addEventListener('blur', () => eventTarget.type = 'text');
}


//~ Listener function
function modifyDeadline(event) {
  //* 因<input>為text時才可設置placeholder，故觸發click事件再改變type，失去focus時再換回
  const eventTarget = event.target;
  const isDeadlineDate = eventTarget.classList.contains('deadline_date');
  const isDeadlineTime = eventTarget.classList.contains('deadline_time');

  if (isDeadlineDate) {
    changeInputType('date', eventTarget);
  }
  else if (isDeadlineTime) {
    changeInputType('time', eventTarget);
  }
}

function editComment(event) {
  //* 初始設定<textarea>為readonly模式，觸發dblclick事件才可編輯，失去focus時再換回
  const isComment = event.target.classList.contains('edit_comment');
  if (isComment) {
    event.target.removeAttribute('readonly');
    event.target.addEventListener('blur', () => event.target.setAttribute('readonly', ''));
  }
}

function uploadFile(event) {
  const isUploadInput = event.target.classList.contains('upload_file');
  if (!isUploadInput) {
    return;
  }

  const uploadInput = event.target;
  const currentTask = event.target.closest('.task');
  recordUploadFileData(Date.now(), uploadInput, currentTask);
}

//* 上傳日期需根據檢視日期隨之遞減
function countUploadDaysAgo() {
  const tasksDataArray = JSON.parse(localStorage.getItem('lists')) || [];
  const taskList = document.querySelector('.task_list');
  const daysAgo = taskList.querySelectorAll('.upload_days_ago');

  daysAgo.forEach((daysAgo, index) => {
    daysAgo.outerHTML = `
      <p class="upload_days_ago">${(tasksDataArray[index].file !== '') ? 'uploaded ' + compareDaysAgo(tasksDataArray[index].fileUpload) : ''}
        (<span class="upload_dateSlash">${(tasksDataArray[index].file !== '') ? separateDateFormatWithSlash(tasksDataArray[index].fileUpload) : ''}</span>)
      </p>
    `
  })
}


function editTaskContent() {
  main.addEventListener('click', modifyDeadline);
  main.addEventListener('change', uploadFile);
  main.addEventListener('dblclick', editComment);

  window.addEventListener('load', countUploadDaysAgo);
}

export default editTaskContent;