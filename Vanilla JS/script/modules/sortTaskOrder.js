import { renderTaskList, saveToLocalStorage } from './updateLocalStorage.js';

function sortTaskRule(currentTask, currentTaskData, tasksDataArray) {
  const taskList = document.querySelector('.task_list');

  //* all task
  const tasks = taskList.querySelectorAll('.task');
  const tasksCount = tasks.length;
  //* completed task
  const allCompletedTasksCount = taskList.querySelectorAll('.task.completed').length;
  const starCompletedTaskStartIndex = tasksCount - allCompletedTasksCount;
  const starCompletedTasksCount = taskList.querySelectorAll('.task.completed.star').length;
  const otherCompletedTaskStartIndex = starCompletedTaskStartIndex + starCompletedTasksCount;
  //* star task
  const starTaskStartIndex = 0;
  const starTasksCount = taskList.querySelectorAll('.task.star').length - starCompletedTasksCount;
  //* general task
  const generalTasksStartIndex = starTasksCount;

  if (currentTask.classList.contains('star') && currentTask.classList.contains('completed')) {
    tasksDataArray.splice(starCompletedTaskStartIndex, 0, currentTaskData);
  }
  else if (currentTask.classList.contains('star')) {
    tasksDataArray.splice(starTaskStartIndex, 0, currentTaskData);
  }
  else if (currentTask.classList.contains('completed')) {
    tasksDataArray.splice(otherCompletedTaskStartIndex, 0, currentTaskData);
  }
  else {
    tasksDataArray.splice(generalTasksStartIndex, 0, currentTaskData);
  }

  // return tasksDataArray;
  saveToLocalStorage(tasksDataArray);
  renderTaskList(tasksDataArray);
}

export default sortTaskRule;
