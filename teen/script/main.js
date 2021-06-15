import { taskList, tasksArray, updateTaskData } from './modules.js';

// 自動載入已保存在LocalStorage中的tasks
export default updateTaskData(tasksArray, taskList);