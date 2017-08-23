module.exports = {
  findNode: function findNode(...args) {
    return this.marionette.findNode(...args);
  },
  findNodeAll: function findNodeAll(...args) {
    return this.marionette.findNodeAll(...args);
  },
};
