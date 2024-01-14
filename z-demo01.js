// 备份:第一课时的代码
// v1 dom挂载

// 1.创建div并挂载
// let dom = document.createElement("div");
// dom.id = "app";
// document.querySelector("#root").append(dom); //1.需要挂载到根容器中

// // 2.创建文本节点并挂载
// let textNode = document.createTextNode("");
// textNode.nodeValue = "app";
// dom.appendChild(textNode);

// v2 vdom静态挂载  vdom->js object

function createTextNode(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

// const textEl = {
//   type: "TEXT_ELEMENT",
//   props: {
//     nodeValue: "app",
//     children: [],
//   },
// };

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

// const el = {
//   type: "div",
//   props: {
//     id: "app",
//     children: [createTextNode("app")],
//   },
// };

// const textEl = createTextNode("app");
// const App = createElement(
//     "div", {
//         id: "app",
//     },
//     textEl
// );

// const dom = document.createElement(App.type);
// dom.id = App.props.id;
// document.querySelector("#root").append(dom);

// const textNode = document.createTextNode("");
// textNode.nodeValue = createTextNode("app").props.nodeValue;
// dom.append(textNode);

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
// render(App, document.querySelector("#root"));

const ReactDOM = {
  createRoot(container) {
    return {
      render(App) {
        render(App, container);
      },
    };
  },
};

ReactDOM.createRoot(document.querySelector("#root")).render(App);
