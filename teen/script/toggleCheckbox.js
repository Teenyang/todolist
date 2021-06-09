const tasksArray = JSON.parse(localStorage.getItem('lists')) || [];
const taskList = document.querySelector('.task_list');
const tasks = taskList.querySelectorAll('.task');

function checkTask(event) {
  // Element.matches(selectorString)：若元素不相符則結束函式
  if (!event.target.matches('input')) {
    return;
  }

  const checkInput = event.target;

  const checkStatus = checkInput.checked;
  if (checkStatus) {
    this.classList.add('completed');
  }
  else {
    this.classList.remove('completed');
  }

  // 觸發click事件時，將done狀態進行取反後，更新存至Storage
  const taskIndex = checkInput.dataset.index;
  tasksArray[taskIndex].done = !tasksArray[taskIndex].done;
  localStorage.setItem('lists', JSON.stringify(tasksArray));
}

export default tasks.forEach(task => task.addEventListener('click', checkTask));