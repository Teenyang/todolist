import { main, focusEditing, taskList, tasksArray, compareDaysAgo, dateSlashFormat, setLocalStorage } from './modules.js';

//~ General function
function recordUploadFileData(date, uploadInput, taskItem) {
  //* 清除上傳檔案路徑C:\fakepath\
  const fileName = uploadInput.value.replace(/.*[\/\\]/, '');
  const uploadDate = dateSlashFormat(date);
  const uploadDaysAgo = compareDaysAgo(date);
  const fileData = taskItem.querySelector('.file_data');

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
  //* 起初就設定<textarea>為readonly模式，當dblclick事件觸發時才可被編輯，失去focus時再回復readonly模式
  if (event.target.className === 'edit_comment') {
    event.target.removeAttribute('readonly');
    event.target.addEventListener('blur', () => event.target.setAttribute('readonly', ''));
  }
}

function uploadFile(event) {
  if (event.target.className !== 'upload_file') {
    return;
  }

  console.log(this);
  recordUploadFileData(Date.now(), event.target, this);
}

function toggleEditArea(event) {
  if (event.target.className !== 'edit_task') {
    return;
  }

  //! pen只負責展開編輯區塊，一旦展開便將其checked狀態一律存為true
  event.target.checked = true;
  const checkboxStatus = event.target.checked;
  const taskIndex = event.target.dataset.edit;
  const allTasks = taskList.querySelectorAll('.task');
  const currentTask = allTasks[taskIndex];
  //* edit狀態時無法拖曳task區塊
  currentTask.classList.remove('drag');

  //! 展開編輯區塊後，只能對該區塊進行編輯，其他任務將消失，待任務被cancel或save後才回復顯示所有任務清單
  focusEditing(allTasks, taskIndex);


  if (checkboxStatus) {
    currentTask.classList.add('editing');

    //* 從pen edit狀態控制upload顯示：若localStorage存有file資訊，則顯示upload紀錄
    const fileName = tasksArray[taskIndex].file;
    currentTask.querySelector('.file_data').classList.toggle('show', fileName !== '');
    //* 若uploadInput接收到change事件，則更新file資訊顯示在file_data上
    const uploadInput = currentTask.querySelector('.upload_file');
    uploadInput.addEventListener('change', () => {
      recordUploadFileData(Date.now(), uploadInput, currentTask);
    });
  }

  setLocalStorage(tasksArray);
}

main.addEventListener('click', changeDateTimeInputType);
main.addEventListener('change', uploadFile);
main.addEventListener('dblclick', editComment);
taskList.addEventListener('click', toggleEditArea);

export { changeDateTimeInputType, uploadFile, editComment, toggleEditArea };