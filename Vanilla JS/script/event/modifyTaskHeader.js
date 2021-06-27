// import { focusEditCurrentTask, doneEditCurrentTask } from '../modules/focusTask.js';
import sortTaskRule from '../modules/sortTaskOrder.js';
import { renderTaskList, saveToLocalStorage } from '../modules/updateLocalStorage.js';

const taskList = document.querySelector('.task_list');

//~ General function
function sortTaskListByStatus(taskDataName, currentTask) {
  const tasksDataArray = JSON.parse(localStorage.getItem('lists')) || [];
  const taskIndex = Number(currentTask.dataset.index);  // string
  const currentTaskData = tasksDataArray[taskIndex];

  //* 先將原本的taskData刪除，排序時再將更新後的Data插入指定位置
  tasksDataArray.splice(taskIndex, 1);
  currentTaskData[taskDataName] = !currentTaskData[taskDataName];
  sortTaskRule(currentTask, currentTaskData, tasksDataArray);
}

//~ Listener function
function toggleTaskStatus(event) {
  const currentTask = event.target.closest('.task');
  const isDoneIcon = event.target.classList.contains('done_task');
  const isStarIcon = event.target.classList.contains('star_task');
  const isEditingTask = currentTask.classList.contains('editing');

  if (isDoneIcon) {
    currentTask.classList.toggle('completed');
    (!isEditingTask) ? sortTaskListByStatus('done', currentTask) : '';
  }

  if (isStarIcon) {
    currentTask.classList.toggle('star');
    (!isEditingTask) ? sortTaskListByStatus('star', currentTask) : '';
  }
}

function openEditArea(event) {
  const isEditIcon = event.target.classList.contains('edit_task');
  const currentTask = event.target.closest('.task');

  if (isEditIcon) {
    currentTask.classList.add('editing');
    currentTask.classList.remove('drag');

    //todo 展開編輯區塊後，即focus在當前任務
    //* 因聚焦任務的index計算另包含AddTask，故在taskList中的index需加1
    // focusEditCurrentTask(Number(taskIndex) + 1);
  }
}

function changeTaskTitle(event) {
  if (event.target.className !== 'task_title') {
    return;
  }

  const tasksDataArray = JSON.parse(localStorage.getItem('lists')) || [];
  const modifyTitle = event.target.value;

  if (modifyTitle === '') {
    alert('標題不能空白');
    //* 渲染畫面：恢復到編輯title之前的原始狀態與內容
    renderTaskList(tasksDataArray);
    return;
  }

  const currentTask = event.target.closest('.task');
  const taskIndex = Number(currentTask.dataset.index);  // string
  tasksDataArray[taskIndex].title = modifyTitle;
  saveToLocalStorage(tasksDataArray);
}


function modifyTaskHeader() {
  const main = document.querySelector('main');
  main.addEventListener('click', toggleTaskStatus);

  taskList.addEventListener('click', openEditArea);
  taskList.addEventListener('change', changeTaskTitle);
}

export default modifyTaskHeader;