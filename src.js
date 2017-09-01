import React, { Component } from "react";
import PropTypes from 'prop-types';
import _ from "lodash";

function generateUUID() {
  var basex = 16;
  var d = new Date().getTime();
  if (window.performance && typeof window.performance.now === "function"){
    d += performance.now(); //use high-precision timer if available
  }
  var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    var r = (d + Math.random()*basex)%basex | 0;
    d = Math.floor(d/basex);
    var sr = 0x3;
    var srx = r&sr;
    var srx1 = 0x8;
    return (c==="x" ? r : (srx|srx1)).toString(basex);
  });
  return uuid;
}

let groups = {};
let userAddedComponents = {};

let internalSupportedComponents = {
  TextField: {
    getValueFromChangeEvent: (args)=>{
      return args[0].target.value;
    },
    changeCallBackCaller: (callback, args)=>{
      callback(args[0]);
    },
    errorPropName: "errorText"
  },
  SelectField: {
    getValueFromChangeEvent: (args)=>{
      return args[1];
    },
    changeCallBackCaller: (callback, args)=>{
      callback(args[0], args[1], args[2]);
    },
    errorPropName: "errorText"
  },
  DateRangePicker: {
    getValueFromChangeEvent: (args)=>{
      return args[0];
    },
    changeCallBackCaller: (callback, args)=>{
      callback(args[0]);
    },
    errorPropName: "errorText"
  },
  DatePicker: {
    getValueFromChangeEvent: (args)=>{
      return args[1];
    },
    changeCallBackCaller: (callback, args)=>{
      callback(args, args[1]);
    }
  },
  Select: {
    getValueFromChangeEvent: (args)=>{
      return args[0];
    },
    changeCallBackCaller: (callback, args)=>{
      callback(args[0]);
    }
  }
};

function getAllSupportedComponent(){
  return Object.assign({}, internalSupportedComponents, userAddedComponents);
}

let fieldValidatorCore = {
  addSupport: (name, getValueFromChangeEvent, changeCallBackCaller, errorPropName) => {
    userAddedComponents[name] = {
      getValueFromChangeEvent: getValueFromChangeEvent,
      changeCallBackCaller: changeCallBackCaller,
      errorPropName: errorPropName
    };
  },
  removeSupport: (name) => {
    if (userAddedComponents[name] !== undefined){
      delete userAddedComponents.name;
    } else {
      console.info("Field-Validator", "removeComponent: didn't find the component");
    }
  },
  getAllCurrentlySupported: ()=>{
    return getAllSupportedComponent();
  },
  checkGroup: (groupName) => {
    let valid = true;
    let validityRes = {
      isValid: true,
      validCompponents: [],
      inValidComponents: []
    };
    let allCompsInGroup = groups[groupName];
    if (allCompsInGroup === undefined) {
      valid = true;
    } else {
      allCompsInGroup.forEach((v1) => {
        let v = v1.component;
        if (v.isValid === false){
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

class Validation extends Component {

  constructor(props) {
    super(props);

    this.state = {
      childCompoentToRender: null,
      unControlledChild: true,
      isValid: true,
      id: generateUUID()
    };
    this.testValidity = this.testValidity.bind(this);
  }

  get isValid() {
    return this.testValidity(this.currentChildValue);
  }

  componentWillReceiveProps(props){
    let freshRendered = false;
    if (this.state.unsupported !== true){
      if (this.state.unControlledChild === false){
        let isDerivedValueComing = false;
        if (!(_.isEqual(this.originalVal, props.children.props[this.props.valueProp]))){
          this.originalVal = props.children.props[this.props.valueProp];
          isDerivedValueComing = true;
        }
        if (this.childModified === true || isDerivedValueComing){
          if (!(_.isEqual(this.currentChildValue, props.children.props[this.props.valueProp]))){
            this.baseProps[this.props.valueProp] = props.children.props[this.props.valueProp];
            this.currentChildValue = props.children.props[this.props.valueProp];
            freshRendered = true;
            this.testValidity(this.currentChildValue);
          }
        }
      }
    }
    if (Object.keys(this.closureValues).length > 0 && freshRendered === false){
      //match closures
      let requireRender = false;
      _.forOwn(this.closureValues, (cVariableValue, cVariable)=>{
        if (!(_.isEqual(cVariableValue, props.closures[cVariable]))){
          requireRender = true;
        }
      });
      if (requireRender){
        this.mountingSetup(getAllSupportedComponent()[this.typeOfCompnent].getValueFromChangeEvent,
          getAllSupportedComponent()[this.typeOfCompnent].changeCallBackCaller, false, props);
      }
    }
  }

  componentWillMount() {
    this.typeOfCompnent = this.props.children.type.displayName ? this.props.children.type.displayName : this.props.children.type.name;
    if (userAddedComponents[this.typeOfCompnent] !== undefined){
      this.mountingSetup(userAddedComponents[this.typeOfCompnent].getValueFromChangeEvent, userAddedComponents[this.typeOfCompnent].changeCallBackCaller);
    } else {
      if (internalSupportedComponents[this.typeOfCompnent] !== undefined){
        this.mountingSetup(internalSupportedComponents[this.typeOfCompnent].getValueFromChangeEvent, internalSupportedComponents[this.typeOfCompnent].changeCallBackCaller);
      } else {
        console.error("Field-Validator",
          `${this.typeOfCompnent} is currently not supported by field-validator,
          Please use fieldValidatorCore.addSupport to add support for the component, For more information please refer to docs`);
        console.info("Field-Validator", `Ignoring ${this.typeOfCompnent}, and it will work as if it was not wraped with Validation tag`);
        this.mountingSetup(null, null, true);
      }
    }
  }

  componentDidMount(){
    if (this.props.group && this.state.unsupported !== true){
      if (groups[this.props.group] === undefined){
        groups[this.props.group] = [];
      }
      groups[this.props.group].push({
        id: this.state.id,
        component: this
      });
    }
  }

  mountingSetup(valueFromArgs, argsToPassToActualHandler, unsupportedFlag, nextProps){
    let toUseProps = nextProps ? nextProps : this.props;
    if (unsupportedFlag === true){
      this.setState({
        childCompoentToRender: toUseProps.children,
        unsupported: unsupportedFlag
      });
    } else {
      this.closureValues = {};
      if (Object.keys(toUseProps.closures).length > 0) {
        _.forOwn(toUseProps.closures, (cVariableValue, cVariable) => {
          this.closureValues[cVariable] = cVariableValue;
        });
      }
      this.baseProps = _.cloneDeep(toUseProps.children.props);
      let isUncontrolled = true;
      if (this.baseProps.hasOwnProperty(toUseProps.valueProp)){
        isUncontrolled = false;
        if (nextProps !== true){
          this.originalVal = this.baseProps[toUseProps.valueProp];
        }
        this.currentChildValue = this.baseProps[toUseProps.valueProp];
      } else {
        //try with default prop
        if (this.baseProps.hasOwnProperty(toUseProps.defaultValueProp)){
          if (nextProps !== true){
            this.originalVal = this.baseProps[toUseProps.defaultValueProp];
          }
          this.currentChildValue = this.baseProps[toUseProps.defaultValueProp];
        }
      }

      let oldOnChange = this.baseProps[toUseProps.onChangeCallback];
      this.baseProps[toUseProps.onChangeCallback] = (...args)=>{
        let rArgs = valueFromArgs(args);
        this.childModified = true;
        if (!this.absorbing){
          this.absorbing = true;
          this.baseProps[toUseProps.valueProp] = rArgs;
          this.currentChildValue = rArgs;
          this.testValidity(rArgs);
          if (oldOnChange) {
            argsToPassToActualHandler(oldOnChange, args);
          }
          this.absorbing = false;
        }
      };
      let theComponent = React.cloneElement(toUseProps.children, this.baseProps);
      this.setState({
        childCompoentToRender: theComponent,
        unControlledChild: isUncontrolled
      });
    }
  }

  testValidity(val){
    var self = this;
    try {
      return new Promise((resolve) => {
        let backToBucket = 0;
        self.props.validators.forEach(async (v, i) => {
          let validi = await v.validator(val);
          if (validi === false){
            resolve({
              isValid: false,
              errorMessage: v.errorMessage
            });
          }
          backToBucket++;
          if (backToBucket === self.props.validators.length){
            if (validi === false){
              resolve({
                isValid: false,
                errorMessage: v.errorMessage
              });
            } else {
              resolve({
                isValid: true
              });
            }
          }
        });
      }).then((res)=>{
        if (res.isValid === false){
          if (getAllSupportedComponent()[self.typeOfCompnent].errorPropName){
            self.baseProps[getAllSupportedComponent()[self.typeOfCompnent].errorPropName] = res.errorMessage;
          }
          self.setState({
            childCompoentToRender: React.cloneElement(self.props.children, self.baseProps),
            isValid: false,
            errorText: res.errorMessage
          });
        } else {
          if (getAllSupportedComponent()[self.typeOfCompnent].errorPropName){
            self.baseProps[getAllSupportedComponent()[self.typeOfCompnent].errorPropName] = null;
          }
          self.setState({
            childCompoentToRender: React.cloneElement(self.props.children, self.baseProps),
            isValid: true,
            errorText: null
          });
        }
        return res.isValid;
      });
    } catch (err) {
      console.error(err);
    }

  }

  componentWillUnmount(){
    if (this.props.group){
      _.remove(groups[this.props.group], (v)=>{
        return v.id === this.state.id;
      });
    }
  }

  render() {
    if (this.state.unsupported === true){
      return this.props.children;
    } else {
      return (
        <span>
        {
          this.state.childCompoentToRender ? this.state.childCompoentToRender : ""
        }{
          (!(getAllSupportedComponent()[this.typeOfCompnent].errorPropName)) && this.state.isValid === false ? <div style={Object.assign({}, {color: "red", fontSize: "12px", position: "absolute"}, this.props.errorStyle)}>
            {
              this.state.errorText
            }
          </div> : ""
        }
      </span>
      );
    }
  }
}

Validation.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element
  ]),
  validators: PropTypes.array.isRequired,
  onChangeCallback: PropTypes.string,
  group: PropTypes.string,
  valueProp: PropTypes.string,
  defaultValueProp: PropTypes.string,
  errorStyle: PropTypes.object,
  closures: PropTypes.object
};

Validation.defaultProps = {
  onChangeCallback: "onChange",
  valueProp: "value",
  defaultValueProp: "defaultValue",
  errorStyle: {},
  closures: {}
};

export {Validation, fieldValidatorCore};
