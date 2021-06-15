// MAIN：Add Task
const main = document.querySelector('main');

// taskList：exist tasks
const taskList = document.querySelector('.task_list');

// JSON.parse：將字串轉回原本陣列格式
// 初始值為空陣列，或者若Storage已有紀錄則呈現先前保留的資料
// If the key of getItem() doesn't exist, null is returned. => null為falsy值
const tasksArray = JSON.parse(localStorage.getItem('lists')) || [];


function updateLocalStorage(storageArray) {
  localStorage.setItem('lists', JSON.stringify(tasksArray));
}


export { main, taskList, tasksArray, updateLocalStorage };