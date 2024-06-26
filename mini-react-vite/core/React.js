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
  nextFiberOfUnit = {
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

// const textEl = createTextNode("app");
// const App = createElement(
//   "div",
//   {
//     id: "app",
//   },
//   "hi",
//   "react"
// );

function createDom(type) {
  return type === "TEXT_ELEMENT"
    ? document.createTextNode("")
    : document.createElement(type);
}

function updataProps(dom, props) {
  Object.keys(props).forEach((key) => {
    if (key !== "children") {
      dom[key] = props[key];
    }
  });
}

function initChildren(fiber){
  let children = fiber.props.children;
  let prevChild = null;
  children.forEach((child, index) => {
    let newFiber = {
      type: child.type,
      props: child.props,
      child: null,
      sibling: null,
      parent: fiber,
    };
    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevChild.sibling = newFiber;
    }
    prevChild = newFiber;
  });
}

// 执行任务
function performWorkofUnit(fiber) {
  // 1.创建dom
  if (!fiber.dom) {
    const dom = (fiber.dom = createDom(fiber.type));
    fiber.parent.dom.append(dom);
    // 2.处理props
    updataProps(dom, fiber.props);
  }

  // 3.创建链表
  initChildren(fiber)

  // 4.返回下一任务
  if (fiber.child) return fiber.child;
  if (fiber.sibling) return fiber.sibling;
  return fiber.parent?.sibling;
}

let nextFiberOfUnit = null;
function workLoop(deadline) {
  let shouldYield = false;
  while (!shouldYield && nextFiberOfUnit) {
    // 执行任务
    nextFiberOfUnit = performWorkofUnit(nextFiberOfUnit);

    shouldYield = deadline.timeRemaining() < 1;
  }
}

requestIdleCallback(workLoop);

const React = {
  render,
  createElement,
};

export default React;
