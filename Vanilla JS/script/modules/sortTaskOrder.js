function sortTaskOrder(currentTask, currentTaskData, currentTaskIndex, removeItem) {
  const taskList = document.querySelector('.task_list');
  const tasksDataArray = JSON.parse(localStorage.getItem('lists')) || [];

  //* all task
  const tasks = taskList.querySelectorAll('.task');
  const tasksCount = tasks.length;
  //* completed task
  const allCompletedTasksCount = taskList.querySelectorAll('.task.completed').length;
  const majorCompletedTaskStartIndex = tasksCount - allCompletedTasksCount;
  const majorCompletedTasksCount = taskList.querySelectorAll('.task.completed.major').length;
  const otherCompletedTaskStartIndex = majorCompletedTaskStartIndex + majorCompletedTasksCount;
  //* major task
  const majorTaskStartIndex = 0;
  const majorTasksCount = taskList.querySelectorAll('.task.major').length - majorCompletedTasksCount;
  //* general task
  const generalTasksStartIndex = majorTasksCount;

  //* 移動existTask位置：先把自己所處位置的舊資料刪除，再將更新後的currentTaskData插入新位置
  tasksDataArray.splice(currentTaskIndex, removeItem);

  if (currentTask.classList.contains('major') && currentTask.classList.contains('completed')) {
    tasksDataArray.splice(majorCompletedTaskStartIndex, 0, currentTaskData);
  }
  else if (currentTask.classList.contains('major')) {
    tasksDataArray.splice(majorTaskStartIndex, 0, currentTaskData);
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
