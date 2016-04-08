//events - a super-basic Javascript (publish subscribe) pattern
// the no data is passed with emit, as was the case in the original code
var events = {
  events: {},
  on: function (eventName, fn) {
    this.events[eventName] = this.events[eventName] || [];
    this.events[eventName].push(fn);
  },
  off: function(eventName, fn) {
    if (this.events[eventName]) {
      for (var i = 0; i < this.events[eventName].length; i++) {
        if (this.events[eventName][i] === fn) {
          this.events[eventName].splice(i, 1);
          break;
        }
      };
    }
  },
  emit: function (eventName) {
    if (this.events[eventName]) {
      this.events[eventName].forEach(function(fn) {
        fn();
      });
    }
  }
};
