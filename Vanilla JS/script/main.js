import { switchNavTab } from './event/switchNavTab.js';
import createTask from './event/createTask.js';
import updateExistTask from './event/updateTask.js';
import modifyTaskHeader from './event/modifyTaskHeader.js';
import editTaskBodyContent from './event/editTaskBodyContent.js';
import deleteTask from './event/deleteTask.js';

import { renderTaskList } from './modules/updateLocalStorage.js';
import { countGeneralTasks } from './modules/calculateTasksCount.js';

//? 任務順序：
//? 建立/點擊任務 -> 編輯(建立/更新data) -> 排序(存入localStorage) -> 渲染畫面 -> 提交

//~ 註冊事件
switchNavTab();
createTask();
updateExistTask();
modifyTaskHeader();
editTaskBodyContent();
deleteTask();

//~ 渲染畫面
const tasksDataArray = JSON.parse(localStorage.getItem('lists')) || [];
renderTaskList(tasksDataArray);
countGeneralTasks();
