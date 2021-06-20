import { taskList, tasksArray, setLocalStorage } from './modules.js';

const allTasksInList = taskList.querySelectorAll('.task');


//~ General function
//* 排序置於前項最末index之後、本項第一個
function sortTask(arr, moveTaskIndex, destinationIndex) {
  // moveTask取得刪除的元素
  const moveTask = arr.splice(moveTaskIndex, 1)[0];
  //* 重新將刪除的元素插入目標位置
  arr.splice(destinationIndex, 0, moveTask);
  return arr;
}


//~ Listener function
function checkCompletion(event) {
  if (event.target.className !== 'done_task') {
    return;
  }

  const checkboxStatus = event.target.checked;
  const taskIndex = event.target.dataset['done'];
  const currentTask = allTasksInList[taskIndex];
  const generalTaskEndIndex = (allTasksInList.length - document.querySelectorAll('.task.completed').length) - 1;
  const completedTaskStartIndex = allTasksInList.length - document.querySelectorAll('.task.completed').length;

  if (checkboxStatus) {
    //! 已完成任務：無法設為重要
    currentTask.classList.add('completed');
    tasksArray[taskIndex]['done'] = !tasksArray[taskIndex]['done'];
    currentTask.classList.remove('major', 'progress');
    tasksArray[taskIndex]['major'] = false;

    //* 置於general最末、completed最前
    sortTask(tasksArray, taskIndex, generalTaskEndIndex);
  }
  else {
    currentTask.classList.remove('completed');
    tasksArray[taskIndex]['done'] = !tasksArray[taskIndex]['done'];

    //* 置於general最末、completed最前
    sortTask(tasksArray, taskIndex, completedTaskStartIndex);
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
  const majorTaskStartIndex = 0;
  const majorTaskEndIndex = document.querySelectorAll('.task.major').length - 1;

  currentTask.classList.toggle('major', checkboxStatus);
  tasksArray[taskIndex]['major'] = !tasksArray[taskIndex]['major'];
  //* true：置於major最前
  //* false：置於major最末、general最前
  checkboxStatus ? sortTask(tasksArray, taskIndex, majorTaskStartIndex) : sortTask(tasksArray, taskIndex, majorTaskEndIndex);

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