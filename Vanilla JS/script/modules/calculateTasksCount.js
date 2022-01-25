const taskList = document.querySelector('.task_list');
const taskStatus = document.querySelector('.task_status');
const completedTasksCount = taskList.querySelectorAll('.task.completed').length;

function countGeneralTasks() {
  const tasksCount = taskList.querySelectorAll('.task').length;
  const completedTasksCount = taskList.querySelectorAll('.task.completed').length;
  const leftTaskCount = tasksCount - completedTasksCount;

  return taskStatus.innerHTML = `
    <em>${leftTaskCount} ${checkPluralTasks(leftTaskCount)} left</em>
  `
}

function countCompletedTasks() {
  const completedTasksCount = taskList.querySelectorAll('.task.completed').length;

  return taskStatus.innerHTML = `
    <em>${completedTasksCount} ${checkPluralTasks(completedTasksCount)} completed</em>
  `
}

function checkPluralTasks(number) {
  return (number > 1) ? 'tasks' : 'task';
}

export { countGeneralTasks, countCompletedTasks };