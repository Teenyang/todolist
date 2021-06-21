import { taskList } from './modules.js';

// navbar
const nav = document.querySelector('nav');
const navLinks = nav.querySelectorAll('.nav_link');
// taskList
const allTasksInList = taskList.querySelectorAll('.task');
const allTasksInListCount = allTasksInList.length;
const completedTasks = taskList.querySelectorAll('.task.completed');
const completedTasksCount = completedTasks.length;
// footer
const footerStatus = document.querySelector('.task_status');


//~ General function
function countGeneralTasks(allCount, completedCount) {
  const leftTaskCount = allCount - completedCount;
  return footerStatus.innerHTML = `
    <em>${leftTaskCount} ${checkPluralTasks(leftTaskCount)} left</em>
  `
}
function countCompletedTasks(completedCount) {
  return footerStatus.innerHTML = `
    <em>${completedCount} ${checkPluralTasks(completedCount)} completed</em>
  `
}
function checkPluralTasks(number) {
  return (number > 1) ? 'tasks' : 'task';
}

function showAllTasksInList() {
  allTasksInList.forEach(allTask => allTask.style.display = 'block');
}
function showInProgressTasks() {
  allTasksInList.forEach(allTask => !allTask.classList.contains('completed') ? allTask.style.display = 'block' : allTask.style.display = 'none');
}
function showCompletedTasks() {
  allTasksInList.forEach(allTask => allTask.classList.contains('completed') ? allTask.style.display = 'block' : allTask.style.display = 'none');
}


//~ Listener function
function chooseTaskCategory(event) {
  navLinks.forEach(navLink => navLink.classList.toggle('select', navLink.dataset.link === event.target.dataset.link));
  if (event.target.dataset.link === 'completed') {
    countCompletedTasks(completedTasksCount);
    showCompletedTasks();
  }
  else if (event.target.dataset.link === 'progress') {
    countGeneralTasks(allTasksInListCount, completedTasksCount);
    showInProgressTasks();
  }
  else {
    showAllTasksInList();
  }
}

countGeneralTasks(allTasksInListCount, completedTasksCount);
nav.addEventListener('click', chooseTaskCategory);
export { chooseTaskCategory };