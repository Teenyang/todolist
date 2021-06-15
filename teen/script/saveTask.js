import { taskList, tasksArray, recordTaskData, updateTaskData, setLocalStorage } from './modules.js';

function saveTask(event) {
  const taskIndex = event.target.dataset['form'];
  const currentTask = this.querySelectorAll('.task')[taskIndex];
  const updateTask = recordTaskData(currentTask);

  // 先將原先的task data刪除，再插入updateTask
  tasksArray.splice(taskIndex, 1, updateTask);
  setLocalStorage(tasksArray);

  currentTask.classList.remove('editing');
  // 不使用event.preventDefault()，讓提交表單時刷新畫面並更新資料
}

function modifyTaskTitle(event) {
  if (event.target.className !== 'task_title') {
    return;
  }
  const modifyTitle = event.target.value;
  const taskIndex = event.target.dataset.title;

  // 觸發click事件時，將done狀態進行取反後，更新存至Storage
  tasksArray[taskIndex].title = modifyTitle;
  setLocalStorage(tasksArray);
}


taskList.addEventListener('input', modifyTaskTitle);
taskList.addEventListener('submit', saveTask);
// cancel既有的task：代表不儲存本次修改的結果

export { saveTask, modifyTaskTitle };