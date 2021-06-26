// import { focusEditCurrentTask, doneEditCurrentTask } from '../modules/focusTask.js';
import sortTaskOrder from '../modules/sortTaskOrder.js';
import recordTaskData from '../modules/dealTaskData.js';
import { renderTaskList, saveToLocalStorage } from '../modules/updateLocalStorage.js';

const taskList = document.querySelector('.task_list');

//~ General function
function quitExistTask(currentTask) {
  currentTask.classList.remove('editing');
}

//~ Listener function
function saveExistTask(event) {
  event.preventDefault();

  const currentTask = event.target.closest('.task');
  const taskIndex = Number(currentTask.dataset.index);  // string

  const updateTaskData = recordTaskData(currentTask);
  //* 因取自<input>再賦值給fileData，故既有<input>並無內容，而資料更新則需取自fileData textContent
  updateTaskData.file = currentTask.querySelector('.file_data .upload_fileName').textContent;
  updateTaskData.fileUpload = currentTask.querySelector('.file_data .upload_dateMillisecond').textContent;

  //* 先將原本的taskData刪除，再原地插入更新後的updateTask
  const tasksDataArray = JSON.parse(localStorage.getItem('lists')) || [];
  tasksDataArray.splice(taskIndex, 1, updateTaskData);

  tasksDataArray[taskIndex] = updateTaskData;
  saveToLocalStorage(tasksDataArray);
  renderTaskList();

  quitExistTask(currentTask);

  //todo 編輯完成後恢復顯示所有任務
  // doneEditCurrentTask(tasks);
}

function cancelTask(event) {
  if (event.target.className === 'task_cancel') {
    const currentTask = event.target.closest('.task');
    const taskIndex = Number(currentTask.dataset.index);  // string
    quitExistTask(currentTask);
  }
}

function handleExistTask() {
  renderTaskList();
  taskList.addEventListener('submit', saveExistTask);
  taskList.addEventListener('click', cancelTask);
}

export default handleExistTask;