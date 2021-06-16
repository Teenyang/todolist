import { main, taskList, tasksArray, setLocalStorage } from './modules.js';

// General function
function newUpload(uploadInput, taskItem) {
  const fileName = uploadInput.value.replace(/.*[\/\\]/, '');
  const today = new Date();
  // getMonth()介於0~11
  const uploadDate = `${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}`;
  const fileData = taskItem.querySelector('.file_data');

  fileData.classList.toggle('show', fileName !== '');
  return fileData.innerHTML = `
      <p>${fileName}</p>
      <span>${(fileName !== '') ? 'uploaded ' + uploadDate : ''}</span>
    `
}


// Listener function
function changeDateInputType(event) {
  if (event.target.className === 'deadline_date') {
    event.target.type = 'date';
  }
  else if (event.target.className === 'deadline_time') {
    event.target.type = 'time';
  }
}

function editComment(event) {
  if (event.target.className === 'edit_comment') {
    event.target.removeAttribute('readonly');
  }

  event.target.addEventListener('blur', () => {
    event.target.setAttribute('readonly', '');
  })
}

function uploadFile(event) {
  if (event.target.className !== 'upload_file') {
    return;
  }

  newUpload(event.target, this);
}

// pen只負責展開編輯區塊，若要結束編輯狀態則透過form的cancel或add/save的結果而定
// 若所在表失去focus，則alert提醒要cancel or save
function toggleEditArea(event) {
  if (event.target.className !== 'marker_pen') {
    return;
  }

  // pen只負責展開編輯區塊，一旦展開便將其checked狀態一律存為true
  event.target.checked = true;
  const checkboxStatus = event.target.checked;
  const taskIndex = event.target.dataset.edit;
  const allTasks = taskList.querySelectorAll('.task');
  const currentTask = allTasks[taskIndex];

  if (checkboxStatus) {
    currentTask.classList.add('editing');

    // 從pen edit狀態控制upload顯示：若localStorage存有file資訊，則顯示upload紀錄
    const fileName = tasksArray[taskIndex].file;
    if (fileName !== '') {
      currentTask.querySelector('.file_data').classList.toggle('show', fileName !== '');
    }
    // 若uploadInput接收到change事件，則更新file資訊顯示在file_data上
    const uploadInput = currentTask.querySelector('.upload_file');
    uploadInput.addEventListener('change', () => {
      newUpload(uploadInput, currentTask);
    });
  }

  setLocalStorage(tasksArray);

  // 若所在表失去focus，則alert提醒要cancel or save
  // currentTask.focus();
}

main.addEventListener('click', changeDateInputType);
main.addEventListener('change', uploadFile);
main.addEventListener('dblclick', editComment);
taskList.addEventListener('click', toggleEditArea);

export { changeDateInputType, uploadFile, editComment, toggleEditArea };