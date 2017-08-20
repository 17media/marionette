const cachedDisplayNames = new WeakMap();

const getDisplayName = (component) => {
  const type = component._currentElement && component._currentElement.type;

  if (!type) {
    return null;
  } else if (typeof type === 'string') {
    return type;
  }

  if (cachedDisplayNames.has(type)) {
    return cachedDisplayNames.get(type);
  }

  if (typeof type.displayName === 'string') {
    return type.displayName;
  }

  return type.name;
};

const traverseComponentTree = (component, filter, result = []) => {
  if (!component || !component._currentElement) {
    return result;
  }

  const ret = [...result];

  if (filter(component)) {
    ret.push(component);
  }

  if (component._renderedChildren && typeof component._renderedChildren === 'object') {
    return [].concat(...Object.values(component._renderedChildren)
      .map(com => traverseComponentTree(com, filter, ret)));
  }

  return traverseComponentTree(component._renderedComponent, filter, ret);
};

module.exports = {
  traverseComponentTree,
  getDisplayName,
};
