import { main, compareDaysAgo, convertDateStringToSlashFormat } from './modules.js';

//~ General function
function recordUploadFileData(date, uploadInput, taskItem) {
  //* 清除上傳檔案路徑C:\fakepath\
  const fileName = uploadInput.value.replace(/.*[\/\\]/, '');
  const uploadDate = convertDateStringToSlashFormat(date);
  const uploadDaysAgo = compareDaysAgo(date);
  const fileData = taskItem.querySelector('.file_data');

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

  const tasks = main.querySelectorAll('.task');
  const taskIndex = event.target.dataset.upload;

  if (taskIndex) {
    //* 因聚焦任務的index計算另包含AddTask，故在taskList中的index需加1
    const currentTask = tasks[Number(taskIndex) + 1];
    recordUploadFileData(Date.now(), event.target, currentTask);
  }
  else {
    //* 因AddTask未設置data-upload，故taskIndex＝undefined為falsy值
    recordUploadFileData(Date.now(), event.target, this);
  }
}


main.addEventListener('click', changeDateTimeInputType);
main.addEventListener('change', uploadFile);
main.addEventListener('dblclick', editComment);

export { changeDateTimeInputType, uploadFile, editComment };