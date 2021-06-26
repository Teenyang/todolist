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


//~ Listener function
function changeDateTimeInputType(event) {
  //* 因為<input type="text">才可設置placeholder，因此click事件觸發時才改變input type，失去focus時再換回text
  if (event.target.className === 'deadline_date') {
    event.target.type = 'date';
    event.target.addEventListener('blur', () => event.target.type = 'text');
  }
  else if (event.target.className === 'deadline_time') {
    event.target.type = 'time';
    event.target.addEventListener('blur', () => event.target.type = 'text');
  }
}

function editComment(event) {
  //* 初始設定<textarea>為readonly模式，當dblclick事件觸發時才可編輯，失去focus時再換回readonly模式
  if (event.target.className === 'edit_comment') {
    event.target.removeAttribute('readonly');
    event.target.addEventListener('blur', () => event.target.setAttribute('readonly', ''));
  }
}

function uploadFile(event) {
  if (event.target.className !== 'upload_file') {
    return;
  }

  const uploadInput = event.target;
  const currentTask = event.target.closest('.task');
  const taskIndex = Number(currentTask.dataset.index);  // string

  if (taskIndex) {
    //* 因聚焦任務的index計算另包含AddTask，故在taskList中的index需加1
    recordUploadFileData(Date.now(), uploadInput, currentTask);
  }
  else {
    //* 因AddTask未設置data-index，故taskIndex＝undefined為falsy值
    recordUploadFileData(Date.now(), uploadInput, this);
  }
}

//* 上傳日期需根據檢視日期隨之遞減
function countUploadDaysAgo() {
  const taskList = main.querySelector('.task_list');
  const tasksDataArray = JSON.parse(localStorage.getItem('lists')) || [];

  const daysAgo = taskList.querySelectorAll('.upload_days_ago');
  daysAgo.forEach((daysAgo, index) => {
    daysAgo.outerHTML = `
      <p class="upload_days_ago">${(tasksDataArray[index].file !== '') ? 'uploaded ' + compareDaysAgo(tasksDataArray[index].fileUpload) : ''}
        (<span class="upload_dateSlash">${(tasksDataArray[index].file !== '') ? separateDateFormatWithSlash(tasksDataArray[index].fileUpload) : ''}</span>)
      </p>
    `
  })
}
window.addEventListener('load', countUploadDaysAgo);


function editTaskBodyContent() {
  main.addEventListener('click', changeDateTimeInputType);
  main.addEventListener('change', uploadFile);
  main.addEventListener('dblclick', editComment);
}

export default editTaskBodyContent;