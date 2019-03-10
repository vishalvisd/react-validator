import React, {Component} from "react";
import MyCustomHighOrderComponent from "../MyCustomHighOrderComponent";
import {Validation, fieldValidatorCore} from "react-validation-framework";

//support for MyCustomHighOrderComponent is needs just once, better place for it would be at the start of your app
fieldValidatorCore.addSupport(
  "MyCustomHighOrderComponent",
  (args) => {
    return args[1].suggestion;
  },
  (callback, args) => {
    return callback(...args);
  },
  "error"
);


class MyCustomHighOrderComponentExample extends Component {
  constructor(props, context){
    super(props, context);
  }

  onSumbit(){
    if (fieldValidatorCore.checkGroup("somegroup").isValid === true){
      //proceed
    }
    //or to check a specific field
    if (this.refs.MyCustomHighOrderComponentREF.isValid === true){
      //proceed
    }
  }

  render(){
    return (<div>
      <Validation
        group="somegroup"
        ref="MyCustomHighOrderComponentREF"
        onChangeCallback="onSelect"
        componentTag="MyCustomHighOrderComponent" // Should specify component tag manually here
        validators={[
          {
            validator: (val) => {
              return !validator.isEmpty(val);
            },
            errorPropValue: true,
            errorMessage: "Please enter a value"
          }
        ]}>
        <MyCustomHighOrderComponent
          value="..."
          label="Some Label"
          onSelect={(event, {value})=>{
            console.log(value);
          }}
        />
      </Validation>
    </div>)
  }
}


MyCustomHighOrderComponentExample.propTypes = {};

export default MyCustomHighOrderComponentExample;
