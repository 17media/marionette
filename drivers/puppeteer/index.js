const marionette = selectors => ({
  func: function findNode(...args) {
    return this.marionette.findNode(...args);
  },
  args: typeof selectors === 'string'
    ? [selectors]
    : selectors,
});

exports.default = marionette;
module.exports = marionette;
