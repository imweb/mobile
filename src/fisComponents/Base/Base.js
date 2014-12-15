/**
 * authorized by aaronou
 *
 * 抄自underscore, 用于处理继承
 *
 * 子类
 *
 * var Person = Base.extend({
 *     // 初始化的方法
 *     initialize: function(opts){
 *         // 使用父类的方法
 *         Person.__super__.initialize.apply(this, arguments);
 *     }
 * });
 * var person = new Person({});
 */

// Helper function to correctly set up the prototype chain, for subclasses.
// Similar to `goog.inherits`, but uses a hash of prototype properties and
// class properties to be extended.
var _ = window._ || {};
_.extend = function(obj){
    for(var i= 1, len=arguments.length; i<len; i++){
        var source = arguments[i];
        for(var prop in source){
            obj[prop] = source[prop];
        }
    }
    return obj;
};

_.has = function(obj, key) {
    return hasOwnProperty.call(obj, key);
};

var idCounter = 0;
_.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
};

var extend = function(protoProps, staticProps) {
    var parent = this;
    var child;

    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call the parent's constructor.
    if (protoProps && _.has(protoProps, 'constructor')) {
        child = protoProps.constructor;
    } else {
        child = function(){ return parent.apply(this, arguments); };
    }

    // Add static properties to the constructor function, if supplied.
    _.extend(child, parent, staticProps);

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    var Surrogate = function(){ this.constructor = child; };
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate;

    // Add prototype properties (instance properties) to the subclass,
    // if supplied.
    if (protoProps) _.extend(child.prototype, protoProps);

    // Set a convenience property in case the parent's prototype is needed
    // later.
    child.__super__ = parent.prototype;

    return child;
};

var Base = function(attributes, options) {
    this.bid = _.uniqueId('b');
    this.initialize.apply(this, arguments);
};

_.extend(Base.prototype, {
    initialize: function(){}
});

Base.extend = extend;

module.exports = Base;