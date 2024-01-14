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
  // 处理type
  const dom =
    el.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(el.type);
  // 处理props
  Object.keys(el.props).forEach((key) => {
    if (key !== "children") {
      dom[key] = el.props[key];
    }
  });
  const children = el.props.children;
  children.forEach((child) => {
    render(child, dom);
  });
  console.log("dom---", dom);
  //append
  container.append(dom);
}

const textEl = createTextNode("app");
const App = createElement(
  "div",
  {
    id: "app",
  },
  "hi",
  "react"
);

const React = {
  render,
  createElement,
};

export default React;
