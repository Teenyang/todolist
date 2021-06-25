// import { focusEditCurrentTask, doneEditCurrentTask } from '../modules/focusTask.js';
import { renderTaskList, saveToLocalStorage } from '../modules/updateLocalStorage.js';

const main = document.querySelector('main');
const newTask = main.querySelector('main > .task');
const newTaskTitleCheckbox = newTask.querySelector('.title_group');

const taskList = document.querySelector('.task_list');

//~ Listener function
function toggleNewTaskCheckbox(event) {
  if (event.target.className === 'done_task') {
    newTask.classList.toggle('completed', event.target.checked);
  }
  else if (event.target.className === 'major_task') {
    newTask.classList.toggle('major', event.target.checked);
  }
}

function toggleEditArea(event) {
  if (event.target.className !== 'edit_task') {
    return;
  }

  //todo 展開編輯區塊後，即無法再點擊
  event.target.style.cursor = 'not-allowed';

  event.target.checked = true;
  const checkboxStatus = event.target.checked;
  const currentTask = event.target.closest('.task');
  const taskIndex = Number(currentTask.dataset.index);  // string

  //* edit狀態時無法拖曳task
  currentTask.classList.remove('drag');

  //todo 展開編輯區塊後，即focus在當前任務
  //* 因聚焦任務的index計算另包含AddTask，故在taskList中的index需加1
  // focusEditCurrentTask(Number(taskIndex) + 1);

  if (checkboxStatus) {
    currentTask.classList.add('editing');
  }
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
  newTaskTitleCheckbox.addEventListener('click', toggleNewTaskCheckbox);

  // renderTaskList();
  taskList.addEventListener('click', toggleEditArea);
  taskList.addEventListener('change', modifyTaskTitle);
}

export default editTaskHeaderTitle;