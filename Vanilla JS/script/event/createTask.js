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

  const newTask = this;
  const taskIndex = Number(newTask.dataset.index);  // string
  const eachTaskData = recordTaskData(newTask);
  const sortTasksDataArray = sortTaskOrder(newTask, eachTaskData, taskIndex, 0);
  saveToLocalStorage(sortTasksDataArray);

  reappearAddTaskButton();
  renderTaskList();
}

function resetNewTask(event) {
  if (event.target.className === 'task_cancel') {
    reappearAddTaskButton();
  }
}

function createTask() {
  addTaskButton.addEventListener('focus', addTask);
}

export default createTask;