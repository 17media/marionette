const { traverseComponentTree, getDisplayName } = require('./utils');

// Keep a reference to the real devtools
const devtools = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;

class Marionette {
  constructor(renderer) {
    this.renderer = renderer;
  }

  findComponents(names) {
    const components = names
      .reduce((flatten, name) => [...flatten, ...name.split(' ')], [])
      .reduce((nodes, name) => [].concat(...nodes.map(node => (
        traverseComponentTree(node, n => getDisplayName(n) === name)
      ))), Object.values(this.renderer.Mount._instancesByReactRootID));

    return Array.from(new Set(components));
  }

  findAll(names) {
    const components = this.findComponents(names);

    const doms = components
      .map(component => traverseComponentTree(
        component,
        n => typeof n._currentElement.type === 'string'
      )[0]);

    return doms;
  }

  findNodeAll(...names) {
    const doms = this.findAll(names);

    if (!doms || !doms.length) {
      return null;
    }

    return doms.map(this.renderer.ComponentTree.getNodeFromInstance);
  }

  findNode(...names) {
    const dom = this.findAll(names)[0];

    if (!dom) {
      return null;
    }

    return this.renderer.ComponentTree.getNodeFromInstance(dom);
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
