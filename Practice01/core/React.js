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
//     nodeValue: "123",
//     children: [],
//   },
// };

function createElement(type, props, ...children) {
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
//     children: [textEl],
//   },
// };

// const textEl = createTextNode("app1");
// const App = createElement("div", { id: "app" }, "app");

// const dom = document.createElement(App.type);
// dom.id = App.props.id;
// document.querySelector("#root").append(dom);

// const textNode = document.createTextNode("");
// textNode.nodeValue = textEl.props.nodeValue;
// dom.append(textNode);

function render(el, container) {
  // type
  const dom =
    el.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(el.type);
  // props
  Object.keys(el.props).forEach((key) => {
    if (key != "children") {
      dom[key] = el.props[key];
    }
  });
  const children = el.props.children;
  children.forEach((child) => {
    render(child, dom);
  });
  // append
  container.append(dom);
}

const React = {
  createElement,
  render,
};
export default React;
