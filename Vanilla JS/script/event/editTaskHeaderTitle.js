// import { focusEditCurrentTask, doneEditCurrentTask } from '../modules/focusTask.js';
import { renderTaskList, saveToLocalStorage } from '../modules/updateLocalStorage.js';

const main = document.querySelector('main');
const newTask = main.querySelector('main > .task');
// const newTaskTitleCheckbox = newTask.querySelector('.title_group');

const taskList = document.querySelector('.task_list');

//~ Listener function
function toggleNewTaskCheckbox(event) {
  if (event.target.classList.contains('done_task')) {
    newTask.classList.toggle('completed', event.target.checked);
  }
  else if (event.target.classList.contains('star_task')) {
    console.log(event.target);
    newTask.classList.toggle('star', event.target.checked);
  }
}

function toggleTaskStatus(event) {
  if (!event.target.classList.contains('done_task') && !event.target.classList.contains('star_task')) {
    return;
  }

  const tasksDataArray = JSON.parse(localStorage.getItem('lists')) || [];
  const currentTask = event.target.closest('.task');
  const taskIndex = Number(currentTask.dataset.index);  // string
  const currentTaskData = tasksDataArray[taskIndex];

  if (event.target.classList.contains('done_task')) {
    currentTask.classList.toggle('completed');
    currentTaskData['done'] = !currentTaskData['done'];
  }
  if (event.target.classList.contains('star_task')) {
    currentTask.classList.toggle('star');
    currentTaskData['star'] = !currentTaskData['star'];
  }

  saveToLocalStorage(tasksDataArray);
  renderTaskList();
}


function toggleEditArea(event) {
  if (!event.target.classList.contains('edit_task')) {
    return;
  }

  const currentTask = event.target.closest('.task');
  currentTask.classList.add('editing');
  currentTask.classList.remove('drag');

  //todo 展開編輯區塊後，即focus在當前任務
  //* 因聚焦任務的index計算另包含AddTask，故在taskList中的index需加1
  // focusEditCurrentTask(Number(taskIndex) + 1);
}


function modifyTaskTitle(event) {
  if (event.target.className !== 'task_title') {
    return;
  }

  const tasksDataArray = JSON.parse(localStorage.getItem('lists')) || [];
  const modifyTitle = event.target.value;

  if (modifyTitle === '') {
    alert('標題不能空白');
    //* 渲染畫面：恢復到編輯title之前的原始狀態與內容
    renderTaskList();
    return;
  }

  const currentTask = event.target.closest('.task');
  const taskIndex = Number(currentTask.dataset.index);  // string
  tasksDataArray[taskIndex].title = modifyTitle;
  saveToLocalStorage(tasksDataArray);
}


function editTaskHeaderTitle() {
  // newTaskTitleCheckbox.addEventListener('click', toggleNewTaskCheckbox);
  // newTask.addEventListener('click', toggleNewTaskCheckbox);
  main.addEventListener('click', toggleTaskStatus);

  // renderTaskList();
  taskList.addEventListener('click', toggleEditArea);
  taskList.addEventListener('change', modifyTaskTitle);
}

export default editTaskHeaderTitle;