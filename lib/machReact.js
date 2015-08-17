'use strict';
Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

exports.createElement = createElement;
exports.addEvent = addEvent;
exports.removeEvent = removeEvent;
exports.attach = attach;
exports.detach = detach;
exports.create = create;
exports.fixProps = fixProps;
exports.render = render;
exports.resolve = resolve;
exports.walkVirtual = walkVirtual;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

require('./assignPolyfill');

var _setZeroTimeout2 = require('./setZeroTimeout');

var _setZeroTimeout3 = _interopRequireDefault(_setZeroTimeout2);

var _events = require('events');

var _virtualDom = require('virtual-dom');

var _setZeroTimeout4 = _interopRequireDefault(_setZeroTimeout2);

exports.setZeroTimeout = _setZeroTimeout4['default'];
Object.defineProperty(exports, 'EventEmitter', {
  enumerable: true,
  get: function get() {
    return _events.EventEmitter;
  }
});

function createElement(type, props) {
  for (var _len = arguments.length, children = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    children[_key - 2] = arguments[_key];
  }

  return create(type, props, children);
}

var BaseComponent = (function (_EventEmitter) {
  _inherits(BaseComponent, _EventEmitter);

  _createClass(BaseComponent, null, [{
    key: 'mixin',
    value: function mixin(constructor) {
      var prototype = constructor.prototype;
      if (prototype && constructor.mixins && !constructor.mixins.done) {
        constructor.assignObject.apply(constructor, [prototype].concat(_toConsumableArray(constructor.mixins)));
        constructor.mixins.done = true;
      }
    }
  }, {
    key: 'appendDOM',
    value: attach,
    enumerable: true
  }, {
    key: 'assignObject',
    value: Object.assign,
    enumerable: true
  }, {
    key: 'createElement',
    value: createElement,
    enumerable: true
  }, {
    key: 'removeDOM',
    value: detach,
    enumerable: true
  }, {
    key: 'resolveDOM',
    value: resolve,
    enumerable: true
  }]);

  function BaseComponent() {
    _classCallCheck(this, BaseComponent);

    _get(Object.getPrototypeOf(BaseComponent.prototype), 'constructor', this).call(this);
    this.assignObject = this.constructor.assignObject;
    this.resolveDOM = this.constructor.resolveDOM;
    this.childContext = {};
    this.context = {};
    this.props = {};
    this.state = {};
    this.isUpdating = false;
    this.constructor.mixin && this.constructor.mixin(this.constructor);
  }

  _createClass(BaseComponent, [{
    key: 'cancelUpdate',
    value: function cancelUpdate() {
      if (this.isUpdating) {
        unsetZeroTimeout(this.updateFunc);
        this.isUpdating = false;
        this.updateFunc = null;
      }
      return this;
    }
  }, {
    key: 'mergeObjectProperty',
    value: function mergeObjectProperty(property, value, callback) {
      this[property] = this.assignObject(this[property], value);
    }
  }, {
    key: 'mount',
    value: function mount(parent) {
      var _this = this;

      this.refs = {};
      this.componentWillMount && this.componentWillMount();
      this.update(true);
      var finishMount = function finishMount() {
        _this.componentDidMount && _this.componentDidMount();
        _this.emit('mount');
      };
      if (parent) {
        this.constructor.appendDOM(this.domNode, parent);
        return finishMount();
      }
      return finishMount;
    }
  }, {
    key: 'queueUpdate',
    value: function queueUpdate(callback) {
      if (callback) this.once('update', callback);
      if (this.isUpdating) return;
      this.updateFunc = this.update.bind(this);
      this.isUpdating = true;
      (0, _setZeroTimeout3['default'])(this.updateFunc);
    }
  }, {
    key: 'replaceObjectProperty',
    value: function replaceObjectProperty(property, value, callback) {
      this[property] = this.assignObject({}, value);
    }
  }, {
    key: 'safeRender',
    value: function safeRender() {
      return this.render(this.constructor);
    }
  }, {
    key: 'safeUpdate',
    value: function safeUpdate(force) {
      (force || !this.isUpdating) && this.cancelUpdate().update(force);
    }
  }, {
    key: 'setupContext',
    value: function setupContext(parentComponent, rootComponent) {
      this.mergeObjectProperty('context', rootComponent.context);
      this.mergeObjectProperty('context', rootComponent.getChildContext());
      if (parentComponent && rootComponent !== parentComponent) {
        this.mergeObjectProperty('context', parentComponent.getChildContext());
      }
    }
  }, {
    key: 'unmount',
    value: function unmount() {
      this.componentWillUnmount && his.componentWillUnmount();
      this.lastVirtualElement = this.virtualElement;
      this.virtualElement = null;
      this.domNode = this.resolveDOM(this);
      this.lastVirtualElement = null;
      var parent = this.domNode && this.domNode.parentNode;
      if (parent) this.constructor.removeDOM(this.domNode);
      this.componentDidUnmount && this.componentDidUnmount();
      this.emit('unmount');
      if (this.domNode) {
        this.domNode.component = null;
        this.domNode = null;
      }
    }
  }, {
    key: 'update',
    value: function update(force) {
      var _this2 = this;

      if (!force) {
        if (this.shouldComponentUpdate && !this.shouldComponentUpdate(this.props, this.state)) return;
        this.componentWillUpdate && this.componentWillUpdate(this.props, this.state);
      }
      this.refs = {};
      this.lastVirtualElement = this.virtualElement;
      this.virtualElement = this.safeRender();
      this.domNode = this.resolveDOM(this);
      var finishUpdate = function finishUpdate() {
        !force && _this2.componentDidUpdate && _this2.componentDidUpdate();
        _this2.emit('update');
        _this2.isUpdating = false;
        _this2.updateFunc = null;
      };
      (0, _setZeroTimeout3['default'])(finishUpdate);
    }
  }]);

  return BaseComponent;
})(_events.EventEmitter);

exports.BaseComponent = BaseComponent;

var ReactComponent = (function (_BaseComponent) {
  _inherits(ReactComponent, _BaseComponent);

  _createClass(ReactComponent, null, [{
    key: 'Component',
    value: ReactComponent,
    enumerable: true
  }]);

  // componentDidMount() {}
  // componentDidUnmount() {}
  // componentDidUpdate(prevProps, prevState) {}
  // componentWillMount() {}
  // componentWillReceiveProps(nextProps) {}
  // componentWillReceiveState(nextState) {}
  // componentWillUnmount() {}
  // componentWillUpdate(nextProps, nextState) {}

  function ReactComponent(props, context) {
    _classCallCheck(this, ReactComponent);

    _get(Object.getPrototypeOf(ReactComponent.prototype), 'constructor', this).call(this);
    this.autoUpdateWhenPropsChange = true;
    props && (this.props = this.assignObject(this.props, props));
    context && (this.context = this.assignObject(this.context, context));
  }

  _createClass(ReactComponent, [{
    key: 'forceUpdate',
    value: function forceUpdate() {
      this.update(true);
    }
  }, {
    key: 'getChildContext',
    value: function getChildContext() {
      return this.childContext;
    }
  }, {
    key: 'getDOMNode',
    value: function getDOMNode() {
      return this.domNode;
    }
  }, {
    key: 'isMounted',
    value: function isMounted() {
      return this.domNode && this.domNode.parentNode;
    }

    // render(React) { return null; }
  }, {
    key: 'replaceProps',
    value: function replaceProps(newProps, callback) {
      this.replaceObjectProperty('props', newProps);
      this.autoUpdateWhenPropsChange && this.queueUpdate(callback);
    }
  }, {
    key: 'replaceState',
    value: function replaceState(newState, callback) {
      this.replaceObjectProperty('state', newState);
      this.queueUpdate(callback);
    }
  }, {
    key: 'setProps',
    value: function setProps(nextProps, callback) {
      this.componentWillReceiveProps && this.componentWillReceiveProps(nextProps);
      this.mergeObjectProperty('props', nextProps);
      this.autoUpdateWhenPropsChange && this.queueUpdate(callback);
    }
  }, {
    key: 'setState',
    value: function setState(nextState, callback) {
      if (typeof nextState === 'function') nextState = nextState(this.state, this.props);
      this.componentWillReceiveState && this.componentWillReceiveState(nextState);
      this.mergeObjectProperty('state', nextState);
      this.queueUpdate(callback);
    }

    // shouldComponentUpdate(nextProps, nextState) { return true; }
  }, {
    key: 'displayName',
    get: function get() {
      return this.constructor.name;
    }
  }]);

  return ReactComponent;
})(BaseComponent);

exports['default'] = ReactComponent;
var Component = ReactComponent;

exports.Component = Component;

var ComponentThunk = (function () {
  function ComponentThunk(Component, props, children, context) {
    _classCallCheck(this, ComponentThunk);

    this.type = 'Thunk';
    this.isComponent = true;

    props = props || {};
    props.children = props.children ? [props.children, children] : children;
    this.component = new Component(props, context);
  }

  _createClass(ComponentThunk, [{
    key: 'render',
    value: function render(previous) {
      if (previous && previous.component) {
        if (previous.component.displayName !== this.component.displayName) {
          // TODO: leave this in to see if this ever happens.
          throw new Error('Component mismatch!');
        } else {
          previous.component.context = this.component.context;
          // previous.component.replaceState(this.component.state);
          previous.component.replaceProps(this.component.props);
          this.component = previous.component;
        }
      }
      return new ComponentWidget(this.component);
    }
  }]);

  return ComponentThunk;
})();

exports.ComponentThunk = ComponentThunk;

var ComponentWidget = (function () {
  function ComponentWidget(component) {
    _classCallCheck(this, ComponentWidget);

    this.type = 'Widget';

    this.component = component;
  }

  _createClass(ComponentWidget, [{
    key: 'init',
    value: function init() {
      var componentDidMount = this.component.mount();
      // HACK: To get componentDidMount to be called after it isMounted,
      //       since it isn't called when mount is not given a parent element.
      (0, _setZeroTimeout3['default'])(componentDidMount);
      // TODO: add check for domNode
      this.component.domNode.component = this.component;
      // NOTE: since this is using thunk and a widget to render, virtual-dom
      //       will not consider any props in the component automatically.
      //       This is why the hook is applied manually,
      if (this.component.props.refHook) {
        this.component.props.refHook.hook(this.component.domNode, 'ref');
      }
      return this.component.domNode;
    }
  }, {
    key: 'update',
    value: function update(previous, domNode) {
      this.component.safeUpdate();
      if (this.component.domNode) {
        this.component.domNode.component = this.component;
        if (this.component.props.refHook) {
          this.component.props.refHook.hook(this.component.domNode, 'ref', previous);
        }
      }
      return this.component.domNode;
    }
  }, {
    key: 'destroy',
    value: function destroy(domNode) {
      this.component.unmount();
    }
  }]);

  return ComponentWidget;
})();

exports.ComponentWidget = ComponentWidget;

var HtmlHook = (function () {
  function HtmlHook(value) {
    _classCallCheck(this, HtmlHook);

    this.value = value;
  }

  _createClass(HtmlHook, [{
    key: 'hook',
    value: function hook(domNode, propName, previousValue) {
      var html = this.value && this.value.__html || this.value;
      if (typeof html === 'string') domNode.innerHTML = html;
    }
  }]);

  return HtmlHook;
})();

exports.HtmlHook = HtmlHook;

var OnChangeHook = (function () {
  function OnChangeHook(handler) {
    _classCallCheck(this, OnChangeHook);

    this.onFocusHandler = this.onFocus.bind(this);
    this.onBlurHandler = this.onBlur.bind(this);
    this.handler = handler;
  }

  _createClass(OnChangeHook, [{
    key: 'onFocus',
    value: function onFocus(event) {
      this.changeInterval = setInterval(this.detectChange.bind(this, event), 100);
    }
  }, {
    key: 'onBlur',
    value: function onBlur(event) {
      this.detectChange(event);
      this.cancelInterval();
    }
  }, {
    key: 'detectChange',
    value: function detectChange(event) {
      if (event.target.value !== this.lastValue) {
        this.lastValue = event.target.value;
        this.handler(event);
      }
    }
  }, {
    key: 'cancelInterval',
    value: function cancelInterval() {
      clearInterval(this.changeInterval);
    }
  }, {
    key: 'hook',
    value: function hook(domNode, propName, previousValue) {
      this.lastValue = domNode.value;
      addEvent(domNode, 'focus', this.onFocusHandler);
      addEvent(domNode, 'blur', this.onBlurHandler);
    }
  }, {
    key: 'unhook',
    value: function unhook(domNode, propName) {
      this.cancelInterval();
      removeEvent(domNode, 'focus', this.onFocusHandler);
      removeEvent(domNode, 'blur', this.onBlurHandler);
    }
  }]);

  return OnChangeHook;
})();

exports.OnChangeHook = OnChangeHook;

var RefHook = (function () {
  function RefHook(name, component) {
    _classCallCheck(this, RefHook);

    this.name = name;
    this.component = component;
  }

  _createClass(RefHook, [{
    key: 'hook',
    value: function hook(domNode, propName, previousValue) {
      var refs = this.component.refs;
      if (this.name.charAt(0) === '$') {
        refs[this.name] = refs[this.name] || [];
        refs[this.name].push(domNode.component || domNode);
      } else refs[this.name] = domNode.component || domNode;
    }
  }]);

  return RefHook;
})();

exports.RefHook = RefHook;

function addEvent(elem, event, fn) {
  if (elem.addEventListener) elem.addEventListener(event, fn, false);else elem.attachEvent('on' + event, function () {
    return fn.call(elem, window.event);
  });
}

function removeEvent(elem, event, fn) {
  if (elem.addEventListener) elem.addEventListener(event, fn, false);else elem.attachEvent('on' + event, function () {
    return fn.call(elem, window.event);
  });
}

function attach(element, parent) {
  if (element && parent && parent.appendChild) return parent.appendChild(element);
  if (element) throw new Error('Failed to attach element.');
}

function detach(element) {
  if (element && element.parentNode) return element.parentNode.removeChild(element);
  if (element) throw new Error('Failed to detach element.');
}

function create(type, props, children, context) {
  var definition = undefined;
  props = fixProps(props || {});
  if (typeof type === 'string') {
    if (props.cssSelector) type += cssSelector;
    definition = (0, _virtualDom.h)(type, props, children);
    definition.context = context;
  } else {
    definition = new ComponentThunk(type, props, children, context);
  }
  return definition;
}

function fixProps(props) {
  var newProps = {};
  Object.keys(props).forEach(function (prop) {
    if (prop === 'dangerouslySetInnerHTML') {
      newProps.htmlHook = new HtmlHook(props[prop]);
    }
    if (prop === 'defaultValue') {
      newProps.value = props.value || props.defaultValue;
    }
    if (prop === 'defaultChecked') {
      newProps.checked = typeof props.checked === 'boolean' ? props.checked : props.defaultChecked;
    }
    if (prop === 'style') {
      // TODO: always merge into a fresh object
      var styles = props[prop];
      if (Array.isArray(styles)) styles = Object.assign.apply(Object, _toConsumableArray(styles));
      newProps[prop] = typeof styles === 'string' ? styles : fixProps.fixStyles(styles);
      return;
    }
    if (prop === 'onChange') {
      newProps.onChangeHook = new OnChangeHook(props.onChange);
      return;
    }
    if (prop.indexOf('on') === 0) {
      var handler = props[prop];
      prop = prop.toLowerCase();
      newProps[prop] = handler;
      return;
    }
    newProps[prop] = props[prop];
  });
  return newProps;
}

fixProps.fixStyles = function fixStyles(styles) {
  if (styles) Object.keys(styles).forEach(function (key) {
    if (typeof styles[key] === 'number') styles[key] += 'px';
  });
  return styles;
};

function render(virtualElement, parentDomNode, callback, delay) {
  var detacher = undefined;
  if (virtualElement.isComponent) {
    virtualElement.component.mount(parentDomNode);
    detacher = virtualElement.component.unmount.bind(virtualElement.component);
  } else {
    (function () {
      var domNode = (0, _virtualDom.create)(virtualElement);
      attach(domNode, parentDomNode);
      detacher = function () {
        (0, _virtualDom.diff)(virtualElement, null);
        domNode = (0, _virtualDom.patch)(domNode, changes);
        detach(domNode, parentDomNode);
      };
    })();
  }
  if (callback) setTimeout(callback, delay || 0);
  return detacher;
}

function resolve(component) {
  walkVirtual(component.virtualElement, function (def, parent, root, parentComponent) {
    if (def) {
      if (def.component) {
        if (def.component.props.ref) {
          def.component.props.refHook = new RefHook(def.component.props.ref, component);
        }
        def.component.setupContext(parentComponent, component);
      } else if (def.props && def.props.ref) {
        def.props.refHook = new RefHook(def.props.ref, component);
      }
    }
  });
  var domNode = component.domNode;
  var lastDomNode = domNode;
  if (!domNode) {
    domNode = (0, _virtualDom.create)(component.virtualElement);
    if (domNode) domNode.component = component;
  } else {
    var _changes = (0, _virtualDom.diff)(component.lastVirtualElement, component.virtualElement);
    domNode.component = component;
    domNode = (0, _virtualDom.patch)(domNode, _changes);
    if (domNode) domNode.component = component;
    if (component.domNode !== domNode && component.domNode.parentNode && !domNode.parentNode) {
      // TODO: leave this in to confirm that we ever get here. Then take it out.
      console.warn(new Error(component.displayName + ': will replace domNode.').stack);
      component.domNode.parentNode.replaceNode(domNode, component.domNode);
    }
  }
  if (lastDomNode && lastDomNode !== domNode) {
    if (lastDomNode.component && lastDomNode.component.domNode === lastDomNode) {
      lastDomNode.component.domNode = null;
    }
    lastDomNode.component = null;
  }
  return domNode;
}

function walkVirtual(definition, iterator, parent, root, parentComponent) {
  root = root || definition;
  var children = null;
  if (!definition || typeof definition !== 'object') return;
  if (definition.constructor.name === 'VirtualText') return;
  iterator(definition, parent, root);
  if (Array.isArray(definition)) children = definition;else if (definition.isComponent) {
    parentComponent = definition;
    children = definition.component.props.children;
  } else children = definition.children;
  if (Array.isArray(children)) {
    children.forEach(function (child) {
      return walkVirtual(child, iterator, definition, root, parentComponent);
    });
  }
}