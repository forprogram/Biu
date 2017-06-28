function Biu(options) {
  this.$options = options;
  var data = this._data = this.$options.data;
  var me = this;
  
  //this.xx -> this.data.xx
  Object.keys(data).forEach((key) => {
    this._proxy(key);
  });

  this.observerlist = {};
}

Biu.prototype = {
  _proxy: function(key) {
    var me = this;
    Object.defineProperty(me, key, {
      configurable: true,
      enumberable: true,
      get: function() {
        return me._data[key];
      },
      set: function(newVal) {
        me._data[key] = newVal;
        me.$emit(key, newVal);
      }
    });
  },
  $on: function(eventType, cb) {
    if (!(eventType in this.observerlist)) {
      this.observerlist[eventType] = [];
    }
    this.observerlist[eventType].push(cb);
    return this;
  },
  $emit: function(eventType) {
    var handlerArg = arguments[1];
    if (!this.observerlist[eventType]) {
      return;
    }
    for(var i = 0; i < this.observerlist[eventType].length; i++) {
      this.observerlist[eventType][i].call(this, handlerArg);
    }
    return this;
  },
}
let app = new Biu({
  data: {
    a: 1,
    b: '2'
  }
});
app.$on('a', function(newVal) {
  console.log(newVal);
});

setTimeout(function() {
  app.a = 2;
}, 2000);
