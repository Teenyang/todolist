// import { focusEditCurrentTask, doneEditCurrentTask } from '../modules/focusTask.js';
import sortTaskOrder from '../modules/sortTaskOrder.js';
import recordTaskData from '../modules/dealTaskData.js';
import { renderNewTask, renderTaskList, saveToLocalStorage } from '../modules/updateLocalStorage.js';

const main = document.querySelector('main');
const addTaskButton = main.querySelector('.add_button');
const taskList = main.querySelector('.task_list');

//~ General function
function reappearAddTaskButton() {
  const newTask = main.querySelector('.new_task');
  main.removeChild(newTask);
  addTaskButton.classList.remove('hide_button');
}

function quitExistTask(currentTask) {
  currentTask.classList.remove('editing');
}

//~ Listener function

//! handleNewTask.js 
function addTask() {
  addTaskButton.classList.add('hide_button');
  renderNewTask();

  //todo 編輯時focus在單一任務
  //* add task為第一個task，其index=0，其他既有task則列入taskLists中 
  // focusEditCurrentTask(0);

  const newTask = main.querySelector('.new_task');
  newTask.addEventListener('submit', submitNewTask);
  newTask.addEventListener('click', resetNewTask);
}

function submitNewTask(event) {
  event.preventDefault();

  const currentTask = this;
  const taskIndex = Number(currentTask.dataset.index);  // string
  const eachTaskData = recordTaskData(currentTask);
  const sortTasksDataArray = sortTaskOrder(currentTask, eachTaskData, taskIndex, 0);
  saveToLocalStorage(sortTasksDataArray);

  reappearAddTaskButton();
  renderTaskList();
}

function resetNewTask(event) {
  if (event.target.className === 'task_cancel') {
    reappearAddTaskButton();
  }
}

function handleNewTask() {
  addTaskButton.addEventListener('focus', addTask);
}

//! handleExistTask.js 
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

export { handleNewTask, handleExistTask };