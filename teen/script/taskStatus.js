// navbar
const nav = document.querySelector('nav');
const navLinks = nav.querySelectorAll('.nav_link');
// taskList
const taskList = document.querySelector('.task_list');
const allTasksCount = taskList.querySelectorAll('.task').length;
const completedTasksCount = taskList.querySelectorAll('.task.completed').length;
// footer
const footerStatus = document.querySelector('.task_status');

// Listener function
function chooseTaskCategory(event) {
  navLinks.forEach(navLink => event.target.dataset.link === navLink.dataset.link ? navLink.classList.add('select') : navLink.classList.remove('select'));
  event.target.dataset.link === 'completed' ? completedStatus(completedTasksCount) : generalStatus(allTasksCount, completedTasksCount);
}

function generalStatus(allTasksCount, completedTasksCount) {
  const leftTaskCount = allTasksCount - completedTasksCount;
  return footerStatus.innerHTML = `
    <em>${leftTaskCount} ${checkPluralTasks(leftTaskCount)} left</em>
  `;
}

function completedStatus(completedTasksCount) {
  return footerStatus.innerHTML = `
    <em>${completedTasksCount} ${checkPluralTasks(completedTasksCount)} completed</em>
  `;
}

function checkPluralTasks(number) {
  return (number > 1) ? 'tasks' : 'task';
}


generalStatus(allTasksCount, completedTasksCount);
nav.addEventListener('click', chooseTaskCategory);
export { chooseTaskCategory };