module.exports = function(key, value) {
    if (window.t) {
        return window.t(key, value);
    }
    console.log('polyglto not loaded');
    return key;
  };