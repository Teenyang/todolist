import { taskList, tasksArray, setLocalStorage } from './modules.js';

const allTasksInList = taskList.querySelectorAll('.task');
const allTasksInListCount = allTasksInList.length;

const majorCompletedTasksCount = taskList.querySelectorAll('.task.completed.major').length;
const generalTasksCount = (allTasksInListCount - document.querySelectorAll('.task.completed').length);

const majorTaskStartIndex = 0;
const majorTasksCount = taskList.querySelectorAll('.task.major').length - majorCompletedTasksCount;

//~ General function
function sortTask(moveTaskIndex, destinationIndex) {
  //* moveTask取得刪除的元素
  const moveTask = tasksArray.splice(moveTaskIndex, 1)[0];
  //* 重新將刪除的元素插入目標位置
  tasksArray.splice(destinationIndex, 0, moveTask);
  return tasksArray;
}


//~ Listener function
function checkCompletion(event) {
  if (event.target.className !== 'done_task') {
    return;
  }
  const checkboxStatus = event.target.checked;
  const taskIndex = event.target.dataset['done'];
  const currentTask = allTasksInList[taskIndex];

  currentTask.classList.toggle('completed', checkboxStatus);
  tasksArray[taskIndex]['done'] = !tasksArray[taskIndex]['done'];

  if (checkboxStatus) {
    if (currentTask.classList.contains('major')) {
      sortTask(taskIndex, generalTasksCount - 1);
    }
    else {
      sortTask(taskIndex, generalTasksCount - 1 + majorCompletedTasksCount);
    }
  }
  else {
    if (currentTask.classList.contains('major')) {
      sortTask(taskIndex, majorTaskStartIndex);
    }
    else {
      sortTask(taskIndex, majorTasksCount);
    }
  }

  setLocalStorage(tasksArray);
  window.location.reload();
}

function markupTask(event) {
  if (event.target.className !== 'major_task') {
    return;
  }

  const checkboxStatus = event.target.checked;
  const taskIndex = event.target.dataset['major'];
  const currentTask = allTasksInList[taskIndex];

  currentTask.classList.toggle('major', checkboxStatus);
  tasksArray[taskIndex]['major'] = !tasksArray[taskIndex]['major'];

  if (checkboxStatus) {
    if (currentTask.classList.contains('completed')) {
      sortTask(taskIndex, generalTasksCount - 1);
    }
    else {
      sortTask(taskIndex, majorTaskStartIndex);
    }
  }
  else {
    if (currentTask.classList.contains('completed')) {
      sortTask(taskIndex, generalTasksCount - 1 + majorCompletedTasksCount);
    }
    else {
      sortTask(taskIndex, majorTasksCount - 1);
    }
  }

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


taskList.addEventListener('click', checkCompletion);
taskList.addEventListener('click', markupTask);
taskList.addEventListener('dblclick', deleteTask);

export { checkCompletion, markupTask, deleteTask };