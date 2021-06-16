import { taskList, tasksArray, recordTaskData, setLocalStorage } from './modules.js';

// Listener function
function modifyTaskTitle(event) {
  if (event.target.className !== 'task_title') {
    return;
  }

  const modifyTitle = event.target.value;
  if (modifyTitle === '') {
    alert('內容不得為空');
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
  // 原本Add Task從input file紀錄資料，但input本身在既有task為空白，故既有資料的更新需取自file_data textContent
  updateTask.file = currentTask.querySelector('.file_data p').textContent;
  updateTask.fileUpload = currentTask.querySelector('.file_data span').textContent;

  // 先將原先的task data刪除，再插入updateTask
  tasksArray.splice(taskIndex, 1, updateTask);
  setLocalStorage(tasksArray);

  currentTask.classList.remove('editing');
  // 不使用event.preventDefault()，讓提交表單時刷新畫面並更新資料
}

taskList.addEventListener('change', modifyTaskTitle);
// cancel既有的task：代表不儲存本次修改的結果
taskList.addEventListener('click', cancelReloadTask);
taskList.addEventListener('submit', saveTask);

export { modifyTaskTitle, saveTask, cancelReloadTask };