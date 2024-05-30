function createTextNode(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

function createElement(type, props, ...children) {
  //…abc->剩余运算符，把其剩余参数转化为数组abc
  return {
    type,
    props: {
      ...props,
      children: children.map((child) => {
        return typeof child == "string" ? createTextNode(child) : child;
      }),
    },
  };
}

//v3 vdom挂载到dom上
function render(el, container) {
  nextWorkerOfUnit = {
    dom: container,
    props: {
      children: [el],
    },
  };
  // 处理type
  // const dom =
  //   el.type === "TEXT_ELEMENT"
  //     ? document.createTextNode("")
  //     : document.createElement(el.type);
  // // 处理props
  // Object.keys(el.props).forEach((key) => {
  //   if (key !== "children") {
  //     dom[key] = el.props[key];
  //   }
  // });
  // const children = el.props.children;
  // children.forEach((child) => {
  //   render(child, dom);
  // });
  // console.log("dom---", dom);
  // //append
  // container.append(dom);
}

function performWorkerofUnit(work) {
  // 创建dom
  if (!work.dom) {
    const dom = (work.dom =
      work.type === "TEXT_ELEMENT"
        ? document.createTextNode("")
        : document.createElement(work.type));
    work.parent.dom.append(dom);
    // 处理props
    Object.keys(work.props).forEach((key) => {
      if (key !== "children") {
        dom[key] = work.props[key];
      }
    });
  }
  // 创建链表关系
  let children = work.props.children;
  let prevChild = null;
  children.forEach((child, index) => {
    let newChild = {
      type: child.type,
      props: child.props,
      child: null,
      sibling: null,
      parent: work,
    };
    if (index === 0) {
      work.child = newChild;
    } else {
      prevChild.sibling = newChild;
    }
    prevChild = newChild;
  });
  // 返回下一个任务
  if (work.child) return work.child;
  if (work.sibling) return work.sibling;
  return work.parent?.sibling;
}

let nextWorkerOfUnit = null;
function workLoop(deadline) {
  let shouldYield = false;
  while (!shouldYield && nextWorkerOfUnit) {
    nextWorkerOfUnit = performWorkerofUnit(nextWorkerOfUnit);

    shouldYield = deadline.timeRemaining() < 1;
  }
}

requestIdleCallback(workLoop);

const React = {
  render,
  createElement,
};

export default React;
