// import { focusEditCurrentTask, doneEditCurrentTask } from '../modules/focusTask.js';
import { renderTaskList } from '../modules/updateLocalStorage.js';
import sortTaskRule from '../modules/sortTaskOrder.js';
import recordTaskData from '../modules/recordTaskData.js';

const taskList = document.querySelector('.task_list');

//~ General function
function quitExistTask(currentTask) {
  currentTask.classList.remove('editing');
}

//~ Listener function
function saveExistTask(event) {
  event.preventDefault();

  const currentTask = event.target.closest('.task');
  const taskIndex = Number(currentTask.dataset.index);

  const updateTaskData = recordTaskData(currentTask);

  const tasksDataArray = JSON.parse(localStorage.getItem('lists')) || [];
  //* 先將原本的taskData刪除，排序時再將更新後的updateTask插入指定位置
  tasksDataArray.splice(taskIndex, 1);
  sortTaskRule(currentTask, updateTaskData, tasksDataArray);

  quitExistTask(currentTask);

  //todo 編輯完成後恢復顯示所有任務
  // doneEditCurrentTask(tasks);
}

function cancelExistTask(event) {
  if (event.target.className === 'task_cancel') {
    const currentTask = event.target.closest('.task');
    quitExistTask(currentTask);

    const tasksDataArray = JSON.parse(localStorage.getItem('lists')) || [];
    renderTaskList(tasksDataArray);
  }
}

function updateExistTask() {
  taskList.addEventListener('click', cancelExistTask);
  taskList.addEventListener('submit', saveExistTask);
}

export default updateExistTask;