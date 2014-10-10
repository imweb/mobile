/**
 * Created by chriscai on 2014/10/10.
 */
(function (){

    var isObject = function(obj) {
        var type = typeof obj;
        return type === 'function' || type === 'object' && !!obj;
    };

    var extend = function(obj) {

        if (!isObject(obj)) return obj;
        var source, prop;
        for (var i = 1, length = arguments.length; i < length; i++) {
            source = arguments[i];
            for (prop in source) {
                if (hasOwnProperty.call(source, prop)) {
                    obj[prop] = source[prop];
                }
            }
        }
        return obj;
    };

    var inherit = function(protoProps, staticProps) {
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
        extend(child, parent, staticProps);

        // Set the prototype chain to inherit from `parent`, without calling
        // `parent`'s constructor function.
        var Surrogate = function(){ this.constructor = child; };
        Surrogate.prototype = parent.prototype;
        child.prototype = new Surrogate;

        // Add prototype properties (instance properties) to the subclass,
        // if supplied.
        if (protoProps) extend(child.prototype, protoProps);

        // Set a convenience property in case the parent's prototype is needed
        // later.
        child.__super__ = parent.prototype;

        return child;
    };


    window.tools.inherit = {

        extend : inherit

    }
}());