const { traverseComponentTree, getDisplayName } = require('./utils');

// Keep a reference to the real devtools
const devtools = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;

class Marionette {
  constructor(renderer) {
    this.renderer = renderer;
  }

  findAll(...names) {
    const component = names
      .reduce((flatten, name) => [...flatten, ...name.split(' ')], [])
      .reduce((node, name) => (
        (traverseComponentTree(node, n => getDisplayName(n) === name) || [])[0]
      ), Object.values(this.renderer.Mount._instancesByReactRootID)[0]);

    const dom = traverseComponentTree(
      component,
      n => typeof n._currentElement.type === 'string'
    );

    if (!dom || !dom.length) {
      return null;
    }

    return dom;
  }

  findNodeAll(...names) {
    const dom = this.findAll(...names);

    if (!dom) {
      return [];
    }

    return dom.map(this.renderer.ComponentTree.getNodeFromInstance);
  }

  findNode(...names) {
    const dom = this.findAll(...names);

    if (!dom) {
      return null;
    }

    return this.renderer.ComponentTree.getNodeFromInstance(dom[0]);
  }
}

const inject = (renderer) => {
  window.marionette = new Marionette(renderer);
};

if (devtools) {
  if (!window.__retractor) {
    // monkey patching the original devtools inject method
    const _inject = devtools.inject;
    devtools.inject = function patchedInject(...args) {
      inject(...args);
      return _inject.apply(this, args);
    };
  }
} else {
  // Create a fake devtools hook
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
    inject,
  };
}
