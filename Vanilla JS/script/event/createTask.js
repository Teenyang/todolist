// import { focusEditCurrentTask, doneEditCurrentTask } from '../modules/focusTask.js';
import { renderNewTask, renderTaskList, saveToLocalStorage } from '../modules/updateLocalStorage.js';
import recordTaskData from '../modules/dealTaskData.js';
import sortTaskOrder from '../modules/sortTaskOrder.js';

const main = document.querySelector('main');
const addTaskButton = main.querySelector('.add_button');

//~ General function
function reappearAddTaskButton() {
  const newTask = main.querySelector('.new_task');
  main.removeChild(newTask);
  addTaskButton.classList.remove('hide_button');
}

//~ Listener function
function quitNewTask(event) {
  if (event.target.className === 'task_cancel') {
    reappearAddTaskButton();
  }
}

function submitNewTask(event) {
  event.preventDefault();

  const newTask = this;
  const taskIndex = Number(newTask.dataset.index);

  const eachTaskData = recordTaskData(newTask);

  //* 因為新增任務不包含在taskList中，所以不會有移動項目
  const moveItem = 0;
  const sortTasksDataArray = sortTaskOrder(newTask, eachTaskData, taskIndex, moveItem);
  saveToLocalStorage(sortTasksDataArray);

  reappearAddTaskButton();
  renderTaskList();
}

function addTask() {
  addTaskButton.classList.add('hide_button');
  renderNewTask();

  //todo 編輯時focus在單一任務
  //* add task為第一個task，其index=0，其他既有task則列入taskLists中 
  // focusEditCurrentTask(0);

  const newTask = main.querySelector('.new_task');
  newTask.addEventListener('click', quitNewTask);
  newTask.addEventListener('submit', submitNewTask);
}

function createTask() {
  addTaskButton.addEventListener('focus', addTask);
}

export default createTask;