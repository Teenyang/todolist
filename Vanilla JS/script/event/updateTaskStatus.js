import { renderTaskList } from '../modules/updateLocalStorage.js';
import sortTaskOrder from '../modules/sortTaskOrder.js';
import { saveToLocalStorage } from '../modules/updateLocalStorage.js';

const taskList = document.querySelector('.task_list');

//~ Listener function
function toggleCheckboxToSortTask(event) {
  if (event.target.className !== 'done_task' && event.target.className !== 'major_task') {
    return;
  }

  const tasksDataArray = JSON.parse(localStorage.getItem('lists')) || [];
  const currentTask = event.target.closest('.task');
  const taskIndex = Number(currentTask.dataset.index);  // string
  const currentTaskData = tasksDataArray[taskIndex];
  const checkboxStatus = event.target.checked;

  if (event.target.className === 'done_task') {
    currentTask.classList.toggle('completed', checkboxStatus);
    currentTaskData['done'] = !currentTaskData['done'];
  }
  if (event.target.className === 'major_task') {
    currentTask.classList.toggle('major', checkboxStatus);
    currentTaskData['major'] = !currentTaskData['major'];
  }

  const sortTasksDataArray = sortTaskOrder(currentTask, currentTaskData, taskIndex, 1);
  saveToLocalStorage(sortTasksDataArray);
  renderTaskList();
}

function deleteTask(event) {
  if (!event.target.classList.contains('delete_task')) {
    return;
  }

  const tasksDataArray = JSON.parse(localStorage.getItem('lists')) || [];
  const currentTask = event.target.closest('.task');
  const taskIndex = Number(currentTask.dataset.index);  // string
  tasksDataArray.splice(taskIndex, 1)
  saveToLocalStorage(tasksDataArray);
  renderTaskList();
}


function updateTaskStatus() {
  taskList.addEventListener('click', toggleCheckboxToSortTask);
  taskList.addEventListener('dblclick', deleteTask);
}

export default updateTaskStatus;