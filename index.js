// 浏览器内部方法,空闲时间执行任务
let task = 1;
function workLoop(deadline) {
  task++;
  let shouldYield = false;
  while (!shouldYield) {
    //run task
    console.log(`task${task},runing`);
    //dom

    shouldYield = deadline.timeRemaining() < 2;
  }
  if (task < 50) {
    requestIdleCallback(workLoop);
  }
}

requestIdleCallback(workLoop);
