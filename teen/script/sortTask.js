import { taskList, tasksArray, sortTaskOrder, setLocalStorage } from './modules.js';

//~ Listener function
function toggleCheckboxToSortTask(event) {
  if (event.target.className !== 'done_task' && event.target.className !== 'major_task') {
    return;
  }

  const checkboxStatus = event.target.checked;
  const taskIndex = event.target.dataset['index'];
  const allTasksInList = taskList.querySelectorAll('.task');
  const currentTask = allTasksInList[taskIndex];
  const currentTaskData = tasksArray[taskIndex];

  if (event.target.className === 'done_task') {
    currentTask.classList.toggle('completed', checkboxStatus);
    tasksArray[taskIndex]['done'] = !tasksArray[taskIndex]['done'];
  }
  else if (event.target.className === 'major_task') {
    currentTask.classList.toggle('major', checkboxStatus);
    tasksArray[taskIndex]['major'] = !tasksArray[taskIndex]['major'];
  }

  tasksArray.splice(taskIndex, 1);
  sortTaskOrder(currentTask, currentTaskData);

  setLocalStorage(tasksArray);
  window.location.reload();
}

function deleteTask(event) {
  if (!event.target.classList.contains('delete_task')) {
    return;
  }

  const taskIndex = event.target.dataset.delete;
  tasksArray.splice(taskIndex, 1)
  setLocalStorage(tasksArray);
  window.location.reload();
}

taskList.addEventListener('click', toggleCheckboxToSortTask);
taskList.addEventListener('dblclick', deleteTask);

export { toggleCheckboxToSortTask, deleteTask };