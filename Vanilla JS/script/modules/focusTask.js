const main = document.querySelector('main');
const addTaskButton = main.querySelector('.add_button');

//! 展開編輯區塊時，將專注在編輯該任務，其他任務則先消失，待任務被cancel或save後才恢復顯示所有任務清單
function focusEditCurrentTask(taskIndex) {
  const tasks = main.querySelectorAll('.task');
  tasks.forEach((task, index) => {
    if (index !== taskIndex) {
      task.style.display = 'none';
    }
  })
  tasks[taskIndex].style.display = 'block';

  // addTaskButton.classList.add('hide_button');
}

//! 提交表單後恢復顯示所有任務清單
function doneEditCurrentTask() {
  const tasks = main.querySelectorAll('.task');
  tasks.forEach(task => task.style.display = 'block');

  addTaskButton.classList.remove('hide_button');
}

export { focusEditCurrentTask, doneEditCurrentTask };