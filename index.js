(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"), require("prop-types"), require("lodash"));
	else if(typeof define === 'function' && define.amd)
		define(["react", "prop-types", "lodash"], factory);
	else if(typeof exports === 'object')
		exports["index"] = factory(require("react"), require("prop-types"), require("lodash"));
	else
		root["index"] = factory(root["React"], root["PropTypes"], root["_"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.fieldValidatorCore = exports.Validation = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _propTypes = __webpack_require__(2);

	var _propTypes2 = _interopRequireDefault(_propTypes);

	var _lodash = __webpack_require__(3);

	var _lodash2 = _interopRequireDefault(_lodash);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	function generateUUID() {
	  var basex = 16;
	  var d = new Date().getTime();
	  if (window.performance && typeof window.performance.now === "function") {
	    d += performance.now(); //use high-precision timer if available
	  }
	  var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
	    var r = (d + Math.random() * basex) % basex | 0;
	    d = Math.floor(d / basex);
	    var sr = 0x3;
	    var srx = r & sr;
	    var srx1 = 0x8;
	    return (c === "x" ? r : srx | srx1).toString(basex);
	  });
	  return uuid;
	}

	var groups = {};
	var userAddedComponents = {};

	var internalSupportedComponents = {
	  TextField: {
	    getValueFromChangeEvent: function getValueFromChangeEvent(args) {
	      return args[0].target.value;
	    },
	    changeCallBackCaller: function changeCallBackCaller(callback, args) {
	      callback(args[0]);
	    },
	    errorPropName: "errorText"
	  },
	  SelectField: {
	    getValueFromChangeEvent: function getValueFromChangeEvent(args) {
	      return args[1];
	    },
	    changeCallBackCaller: function changeCallBackCaller(callback, args) {
	      callback(args[0], args[1], args[2]);
	    },
	    errorPropName: "errorText"
	  },
	  DateRangePicker: {
	    getValueFromChangeEvent: function getValueFromChangeEvent(args) {
	      return args[0];
	    },
	    changeCallBackCaller: function changeCallBackCaller(callback, args) {
	      callback(args[0]);
	    },
	    errorPropName: "errorText"
	  },
	  DatePicker: {
	    getValueFromChangeEvent: function getValueFromChangeEvent(args) {
	      return args[1];
	    },
	    changeCallBackCaller: function changeCallBackCaller(callback, args) {
	      callback(args, args[1]);
	    }
	  },
	  Select: {
	    getValueFromChangeEvent: function getValueFromChangeEvent(args) {
	      return args[0];
	    },
	    changeCallBackCaller: function changeCallBackCaller(callback, args) {
	      callback(args[0]);
	    }
	  }
	};

	function getAllSupportedComponent() {
	  return Object.assign({}, internalSupportedComponents, userAddedComponents);
	}

	var fieldValidatorCore = {
	  addSupport: function addSupport(name, getValueFromChangeEvent, changeCallBackCaller, errorPropName) {
	    userAddedComponents[name] = {
	      getValueFromChangeEvent: getValueFromChangeEvent,
	      changeCallBackCaller: changeCallBackCaller,
	      errorPropName: errorPropName
	    };
	  },
	  removeSupport: function removeSupport(name) {
	    if (userAddedComponents[name] !== undefined) {
	      delete userAddedComponents.name;
	    } else {
	      console.info("Field-Validator", "removeComponent: didn't find the component");
	    }
	  },
	  getAllCurrentlySupported: function getAllCurrentlySupported() {
	    return getAllSupportedComponent();
	  },
	  checkGroup: function checkGroup(groupName) {
	    var valid = true;
	    var validityRes = {
	      isValid: true,
	      validCompponents: [],
	      inValidComponents: []
	    };
	    var allCompsInGroup = groups[groupName];
	    if (allCompsInGroup === undefined) {
	      valid = true;
	    } else {
	      allCompsInGroup.forEach(function (v1) {
	        var v = v1.component;
	        if (v.isValid === false) {
	          valid = false;
	          validityRes.inValidComponents.push(v.props.children);
	        } else {
	          validityRes.validCompponents.push(v.props.children);
	        }
	      });
	    }
	    validityRes.isValid = valid;
	    return validityRes;
	  }
	};

	var Validation = function (_Component) {
	  _inherits(Validation, _Component);

	  function Validation(props) {
	    _classCallCheck(this, Validation);

	    var _this = _possibleConstructorReturn(this, (Validation.__proto__ || Object.getPrototypeOf(Validation)).call(this, props));

	    _this.state = {
	      childComponentToRender: null,
	      unControlledChild: true,
	      isValid: true,
	      id: generateUUID()
	    };
	    _this.typeOfCompnent = _this.props.componentTag ? _this.props.componentTag : _this.props.children.type.displayName ? _this.props.children.type.displayName : _this.props.children.type.name;
	    _this.testValidity = _this.testValidity.bind(_this);
	    return _this;
	  }

	  _createClass(Validation, [{
	    key: "componentWillReceiveProps",
	    value: function componentWillReceiveProps(props) {
	      var freshRendered = false;
	      if (this.state.unsupported !== true) {
	        if (this.state.unControlledChild === false) {
	          var isDerivedValueComing = false;
	          if (!_lodash2.default.isEqual(this.originalVal, props.children.props[this.props.valueProp])) {
	            isDerivedValueComing = true;
	          }
	          if (this.childModified === true || isDerivedValueComing) {
	            if (!_lodash2.default.isEqual(this.currentChildValue, props.children.props[this.props.valueProp])) {
	              this.baseProps[this.props.valueProp] = props.children.props[this.props.valueProp];
	              this.currentChildValue = props.children.props[this.props.valueProp];
	              freshRendered = true;
	              this.testValidity(this.currentChildValue);
	            }
	          }
	        }
	      }
	      if (Object.keys(this.closureValues).length > 0 && freshRendered === false) {
	        //match closures
	        var requireRender = false;
	        _lodash2.default.forOwn(this.closureValues, function (cVariableValue, cVariable) {
	          if (!_lodash2.default.isEqual(cVariableValue, props.closures[cVariable])) {
	            requireRender = true;
	          }
	        });
	        if (requireRender) {
	          this.mountingSetup(getAllSupportedComponent()[this.typeOfCompnent].getValueFromChangeEvent, getAllSupportedComponent()[this.typeOfCompnent].changeCallBackCaller, false, props);
	          //also test validity if closure changes -- added if any validation dependes on closure values
	          this.testValidity(this.currentChildValue);
	        }
	      }
	    }
	  }, {
	    key: "componentDidMount",
	    value: function componentDidMount() {
	      if (userAddedComponents[this.typeOfCompnent] !== undefined) {
	        this.mountingSetup(userAddedComponents[this.typeOfCompnent].getValueFromChangeEvent, userAddedComponents[this.typeOfCompnent].changeCallBackCaller);
	      } else {
	        if (internalSupportedComponents[this.typeOfCompnent] !== undefined) {
	          this.mountingSetup(internalSupportedComponents[this.typeOfCompnent].getValueFromChangeEvent, internalSupportedComponents[this.typeOfCompnent].changeCallBackCaller);
	        } else {
	          console.error("Field-Validator", this.typeOfCompnent + " is currently not supported by field-validator,\n          Please use fieldValidatorCore.addSupport to add support for the component, For more information please refer to docs");
	          console.info("Field-Validator", "Ignoring " + this.typeOfCompnent + ", and it will work as if it was not wraped with Validation tag");
	          this.mountingSetup(null, null, true);
	        }
	      }
	      if (this.props.group && this.state.unsupported !== true) {
	        if (groups[this.props.group] === undefined) {
	          groups[this.props.group] = [];
	        }
	        groups[this.props.group].push({
	          id: this.state.id,
	          component: this
	        });
	      }
	    }
	  }, {
	    key: "mountingSetup",
	    value: function mountingSetup(valueFromArgs, argsToPassToActualHandler, unsupportedFlag, nextProps) {
	      var _this2 = this;

	      var toUseProps = nextProps ? nextProps : this.props;
	      if (unsupportedFlag === true) {
	        this.setState({
	          childComponentToRender: toUseProps.children,
	          unsupported: unsupportedFlag
	        });
	      } else {
	        this.closureValues = {};
	        if (Object.keys(toUseProps.closures).length > 0) {
	          _lodash2.default.forOwn(toUseProps.closures, function (cVariableValue, cVariable) {
	            _this2.closureValues[cVariable] = cVariableValue;
	          });
	        }
	        this.baseProps = _lodash2.default.cloneDeep(toUseProps.children.props);
	        var isUncontrolled = true;
	        if (this.baseProps.hasOwnProperty(toUseProps.valueProp)) {
	          isUncontrolled = false;
	          if (nextProps !== true) {
	            this.originalVal = this.baseProps[toUseProps.valueProp];
	          }
	          this.currentChildValue = this.baseProps[toUseProps.valueProp];
	        } else {
	          //try with default prop
	          if (this.baseProps.hasOwnProperty(toUseProps.defaultValueProp)) {
	            if (nextProps !== true) {
	              this.originalVal = this.baseProps[toUseProps.defaultValueProp];
	            }
	            this.currentChildValue = this.baseProps[toUseProps.defaultValueProp];
	          }
	        }

	        var oldOnChange = this.baseProps[toUseProps.onChangeCallback];
	        this.baseProps[toUseProps.onChangeCallback] = function () {
	          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	            args[_key] = arguments[_key];
	          }

	          var rArgs = valueFromArgs(args);
	          _this2.childModified = true;
	          if (!_this2.absorbing) {
	            _this2.absorbing = true;
	            try {
	              _this2.baseProps[toUseProps.valueProp] = rArgs;
	              _this2.currentChildValue = rArgs;
	              _this2.testValidity(rArgs);
	              if (oldOnChange) {
	                argsToPassToActualHandler(oldOnChange, args);
	              }
	            } catch (er) {
	              _this2.absorbing = false;
	            }
	            _this2.absorbing = false;
	          }
	        };
	        var theComponent = _react2.default.cloneElement(toUseProps.children, this.baseProps);
	        this.setState({
	          childComponentToRender: theComponent,
	          unControlledChild: isUncontrolled
	        });
	      }
	    }
	  }, {
	    key: "testValidity",
	    value: function testValidity(val) {
	      var res = {
	        isValid: true,
	        errorMessage: null,
	        errorPropValue: null
	      };
	      try {
	        this.props.validators.every(function (v) {
	          if (v.validator(val) === false) {
	            res.isValid = false;
	            res.errorMessage = v.errorMessage;
	            res.errorPropValue = v.errorPropValue ? v.errorPropValue : v.errorMessage;
	            return false;
	          } else {
	            return true;
	          }
	        });
	      } catch (err) {
	        console.error(err);
	      }
	      if (res.isValid === false) {
	        if (getAllSupportedComponent()[this.typeOfCompnent].errorPropName) {
	          this.baseProps[getAllSupportedComponent()[this.typeOfCompnent].errorPropName] = res.errorPropValue;
	        }
	        this.setState({
	          childComponentToRender: _react2.default.cloneElement(this.props.children, this.baseProps),
	          isValid: false,
	          errorText: res.errorMessage
	        });
	      } else {
	        if (getAllSupportedComponent()[this.typeOfCompnent].errorPropName) {
	          this.baseProps[getAllSupportedComponent()[this.typeOfCompnent].errorPropName] = null;
	        }
	        this.setState({
	          childComponentToRender: _react2.default.cloneElement(this.props.children, this.baseProps),
	          isValid: true,
	          errorText: null
	        });
	      }
	      return res;
	    }
	  }, {
	    key: "componentWillUnmount",
	    value: function componentWillUnmount() {
	      var _this3 = this;

	      if (this.props.group) {
	        _lodash2.default.remove(groups[this.props.group], function (v) {
	          return v.id === _this3.state.id;
	        });
	      }
	    }
	  }, {
	    key: "render",
	    value: function render() {
	      if (this.state.unsupported === true) {
	        return this.props.children;
	      } else {
	        return _react2.default.createElement(
	          "span",
	          null,
	          this.state.childComponentToRender ? this.state.childComponentToRender : "",
	          !getAllSupportedComponent()[this.typeOfCompnent].errorPropName && this.state.isValid === false ? _react2.default.createElement(
	            "div",
	            { style: Object.assign({}, { color: "red", fontSize: "12px", position: "absolute" }, this.props.errorStyle) },
	            this.state.errorText
	          ) : ""
	        );
	      }
	    }
	  }, {
	    key: "isValid",
	    get: function get() {
	      return this.testValidity(this.currentChildValue).isValid;
	    }
	  }, {
	    key: "errorMessage",
	    get: function get() {
	      return this.testValidity(this.currentChildValue).errorMessage;
	    }
	  }, {
	    key: "errorPropValue",
	    get: function get() {
	      return this.testValidity(this.currentChildValue).errorPropValue;
	    }
	  }, {
	    key: "isModified",
	    get: function get() {
	      return this.childModified;
	    }
	  }]);

	  return Validation;
	}(_react.Component);

	Validation.propTypes = {
	  children: _propTypes2.default.oneOfType([_propTypes2.default.element]),
	  validators: _propTypes2.default.array.isRequired,
	  onChangeCallback: _propTypes2.default.string,
	  group: _propTypes2.default.string,
	  valueProp: _propTypes2.default.string,
	  defaultValueProp: _propTypes2.default.string,
	  errorStyle: _propTypes2.default.object,
	  closures: _propTypes2.default.object,
	  componentTag: _propTypes2.default.string
	};

	Validation.defaultProps = {
	  onChangeCallback: "onChange",
	  valueProp: "value",
	  defaultValueProp: "defaultValue",
	  errorStyle: {},
	  closures: {}
	};

	exports.Validation = Validation;
	exports.fieldValidatorCore = fieldValidatorCore;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ })
/******/ ])
});
;