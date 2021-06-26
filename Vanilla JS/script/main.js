import { switchNavTab } from './event/switchNavTab.js';
import createTask from './event/createTask.js';
import handleExistTask from './event/handleTask.js';
import editTaskHeaderTitle from './event/editTaskHeaderTitle.js';
import editTaskBodyContent from './event/editTaskBodyContent.js';
import updateTaskStatus from './event/updateTaskStatus.js';

import { renderTaskList } from './modules/updateLocalStorage.js';
import { countGeneralTasks } from './modules/calculateTasksCount.js';


//~ 註冊事件
switchNavTab();
createTask();
handleExistTask();
editTaskHeaderTitle();
editTaskBodyContent();
updateTaskStatus();

//~ 渲染畫面
renderTaskList();
countGeneralTasks();
