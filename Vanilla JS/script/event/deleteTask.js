import { renderTaskList } from '../modules/updateLocalStorage.js';
import { saveToLocalStorage } from '../modules/updateLocalStorage.js';

//~ Listener function
function removeTask(event) {
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


function deleteTask() {
  const taskList = document.querySelector('.task_list');
  taskList.addEventListener('click', removeTask);
}

export default deleteTask;