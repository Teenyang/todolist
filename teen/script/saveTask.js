import { taskList, tasksArray, focusEditCurrentTask, doneEditCurrentTask, recordTaskData, setLocalStorage } from './modules.js';

//~ Listener function
function toggleEditArea(event) {
  if (event.target.className !== 'edit_task') {
    return;
  }

  //! pen只負責展開編輯區塊，一旦展開便將其checked狀態存為true，如需關閉得選擇cancel或save
  event.target.checked = true;
  const checkboxStatus = event.target.checked;
  const taskIndex = event.target.dataset.edit;
  const currentTask = taskList.querySelectorAll('.task')[taskIndex];

  //* edit狀態時無法拖曳task
  currentTask.classList.remove('drag');

  //* 因聚焦任務的index計算另包含AddTask，故在taskList中的index需加1
  focusEditCurrentTask(Number(taskIndex) + 1);

  if (checkboxStatus) {
    currentTask.classList.add('editing');
  }

  setLocalStorage(tasksArray);
}


function modifyTaskTitle(event) {
  if (event.target.className !== 'task_title') {
    return;
  }

  const modifyTitle = event.target.value;
  if (modifyTitle === '') {
    alert('標題不能空白');
    window.location.reload();
    return;
  }

  const taskIndex = event.target.dataset.title;
  tasksArray[taskIndex].title = modifyTitle;
  setLocalStorage(tasksArray);
}

function cancelReloadTask(event) {
  if (event.target.className === 'task_cancel') {
    window.location.reload();
  }
}

function saveTask(event) {
  const taskIndex = event.target.dataset['form'];
  const currentTask = taskList.querySelectorAll('.task')[taskIndex];

  const updateTask = recordTaskData(currentTask);
  if (Object.values(updateTask).filter(data => data === "").length === 6) {
    alert('內容不得為空');
    return;
  }
  //* 原本Add Task從input file紀錄資料，但input本身在既有task為空白，故既有資料的更新需取自file_data textContent
  updateTask.file = currentTask.querySelector('.file_data .upload_fileName').textContent;
  updateTask.fileUpload = currentTask.querySelector('.file_data .upload_dateMillisecond').textContent;
  console.log(updateTask.fileUpload);

  //* 先將原先的task data刪除，再插入updateTask
  tasksArray.splice(taskIndex, 1, updateTask);
  setLocalStorage(tasksArray);

  //* 提交表單後恢復顯示所有任務清單
  const allTasksInList = taskList.querySelectorAll('.task');
  doneEditCurrentTask(allTasksInList);

  currentTask.classList.remove('editing');
  //* 不使用event.preventDefault()，讓提交表單時刷新畫面並更新資料
}

taskList.addEventListener('change', modifyTaskTitle);
taskList.addEventListener('click', toggleEditArea);
//! cancel既有的task：代表不儲存本次修改的結果
taskList.addEventListener('click', cancelReloadTask);
taskList.addEventListener('submit', saveTask);

export { modifyTaskTitle, toggleEditArea, saveTask, cancelReloadTask };