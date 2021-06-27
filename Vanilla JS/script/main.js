import { switchNavTab } from './event/switchNavTab.js';
import createTask from './event/createTask.js';
import updateExistTask from './event/updateTask.js';
import editTaskHeaderTitle from './event/editTaskHeaderTitle.js';
import editTaskBodyContent from './event/editTaskBodyContent.js';
import deleteTask from './event/deleteTask.js';

import { renderTaskList } from './modules/updateLocalStorage.js';
import { countGeneralTasks } from './modules/calculateTasksCount.js';


//~ 註冊事件
switchNavTab();
createTask();
updateExistTask();
editTaskHeaderTitle();
editTaskBodyContent();
deleteTask();

//~ 渲染畫面
renderTaskList();
countGeneralTasks();
