/*
* author Vishal Daga
* Email: vishaldaga10@gmail.com
* */

import React, { Component, PropTypes } from "react";
import _ from "lodash";

let groups = {};
let userAddedComponents = {};

let Groupings = {
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
      allCompsInGroup.forEach((v) => {
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
      callback(args[1]);
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

let SupportedComponentByFieldValidator = {
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
  }
};

class Validation extends Component {

  constructor(props) {
    super(props);

    this.state = {
      childCompoentToRender: null,
      unControlledChild: true,
      isValid: true
    };
    this.testValidity = this.testValidity.bind(this);
  }

  get isValid() {
    return this.testValidity(this.currentChildValue);
  }

  componentWillReceiveProps(props){
    if (this.state.unsupported !== true){
      if (this.state.unControlledChild === false){
        let isDerivedValueComing = false;
        if (!(_.isEqual(this.originalVal, props.children.props[this.props.valueProp]))){
          isDerivedValueComing = true;
        }
        if (this.childModified === true || isDerivedValueComing){
          if (!(_.isEqual(this.currentChildValue, props.children.props[this.props.valueProp]))){
            this.baseProps[this.props.valueProp] = props.children.props[this.props.valueProp];
            this.testValidity(props.children.props.value);
          }
        }
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
          Please use SupportedComponentByFieldValidator to add support for the component, For more information please refer to docs`);
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
      groups[this.props.group].push(this);
    }
  }

  mountingSetup(valueFromArgs, argsToPassToActualHandler, unsupportedFlag){
    if (unsupportedFlag === true){
      this.setState({
        childCompoentToRender: this.props.children,
        unsupported: unsupportedFlag
      });
    } else {
      this.baseProps = _.cloneDeep(this.props.children.props);
      let isUncontrolled = true;
      if (this.baseProps[this.props.valueProp] !== undefined){
        isUncontrolled = false;
        this.originalVal = this.baseProps[this.props.valueProp];
        this.currentChildValue = this.baseProps[this.props.valueProp];
      } else {
        //try with default prop
        if (this.baseProps[this.props.defaultValueProp] !== undefined){
          this.originalVal = this.baseProps[this.props.defaultValueProp];
          this.currentChildValue = this.baseProps[this.props.defaultValueProp];
        }
      }

      let oldOnChange = this.baseProps[this.props.onChangeCallback];
      this.baseProps[this.props.onChangeCallback] = (...args)=>{
        let rArgs = valueFromArgs(args);
        this.childModified = true;
        if (!this.absorbing){
          this.absorbing = true;
          this.baseProps[this.props.valueProp] = rArgs;
          this.currentChildValue = rArgs;
          this.testValidity(rArgs);
          if (oldOnChange) {
            argsToPassToActualHandler(oldOnChange, args);
          }
          this.absorbing = false;
        }
      };
      let theComponent = React.cloneElement(this.props.children, this.baseProps);
      this.setState({
        childCompoentToRender: theComponent,
        unControlledChild: isUncontrolled
      });
    }
  }

  testValidity(val){
    let res = {
      isValid: true,
      errorMessage: null
    };
    try {
      this.props.validators.every((v)=>{
        if (v.validator(val) === false){
          res.isValid = false;
          res.errorMessage = v.errorMessage;
          return false;
        } else {
          return true;
        }
      });
    } catch (err) {
      console.error(err);
    }
    if (res.isValid === false){
      if (getAllSupportedComponent()[this.typeOfCompnent].errorPropName){
        this.baseProps[getAllSupportedComponent()[this.typeOfCompnent].errorPropName] = res.errorMessage;
      }
      this.setState({
        childCompoentToRender: React.cloneElement(this.props.children, this.baseProps),
        isValid: false,
        errorText: res.errorMessage
      });
    } else {
      if (getAllSupportedComponent()[this.typeOfCompnent].errorPropName){
        this.baseProps[getAllSupportedComponent()[this.typeOfCompnent].errorPropName] = null;
      }
      this.setState({
        childCompoentToRender: React.cloneElement(this.props.children, this.baseProps),
        isValid: true,
        errorText: null
      });
    }
    return res.isValid;
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
          (!(getAllSupportedComponent()[this.typeOfCompnent].errorPropName)) && this.state.isValid === false ? <div style={{color: "red"}}>
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
  defaultValueProp: PropTypes.string
};

Validation.defaultProps = {
  onChangeCallback: "onChange",
  valueProp: "value",
  defaultValueProp: "defaultValue"
};

export {Validation, Groupings, SupportedComponentByFieldValidator};
