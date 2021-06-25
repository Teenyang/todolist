import { countGeneralTasks, countCompletedTasks } from '../modules/calculateTasksCount.js';

const nav = document.querySelector('nav');
const navLinks = nav.querySelectorAll('.nav_link');
const taskList = document.querySelector('.task_list');

function showAllTasks() {
  const tasks = taskList.querySelectorAll('.task');
  tasks.forEach(task => task.style.display = 'block');
}
function showInProgressTasks() {
  const tasks = taskList.querySelectorAll('.task');
  tasks.forEach(task => {
    !task.classList.contains('completed') ? task.style.display = 'block' : task.style.display = 'none';
  })
}
function showCompletedTasks() {
  const tasks = taskList.querySelectorAll('.task');
  tasks.forEach(task => {
    task.classList.contains('completed') ? task.style.display = 'block' : task.style.display = 'none';
  })
}


//~ Listener function
function chooseTaskCategory(event) {
  console.log(event.target);
  navLinks.forEach(navLink => navLink.classList.remove('select'));
  event.target.classList.add('select');

  if (event.target.classList.contains('all_task')) {
    countGeneralTasks();
    showAllTasks();
  }
  else if (event.target.classList.contains('in_progress_task')) {
    countGeneralTasks();
    showInProgressTasks();
  }
  else if (event.target.classList.contains('completed_task')) {
    countCompletedTasks();
    showCompletedTasks();
  }
}

function switchNavTab() {
  nav.addEventListener('click', chooseTaskCategory);
}

export { switchNavTab };