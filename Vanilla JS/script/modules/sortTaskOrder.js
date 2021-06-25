function sortTaskOrder(currentTask, currentTaskData, currentTaskIndex, removeItem) {
  const taskList = document.querySelector('.task_list');
  const tasksDataArray = JSON.parse(localStorage.getItem('lists')) || [];

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

  //* 移動existTask位置：先把自己所處位置的舊資料刪除，再將更新後的currentTaskData插入新位置
  tasksDataArray.splice(currentTaskIndex, removeItem);

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

  return tasksDataArray;
}

export default sortTaskOrder;
