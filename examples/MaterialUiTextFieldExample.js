import React, {Component} from "react";
import TextField from "material-ui/TextField";
import {Validation, fieldValidatorCore} from "react-validation-framework";

//support for material-ui textfield is needs just once, better place for it would be at the start of your app
fieldValidatorCore.addSupport(
  "TextField",
  (event) => event[0].target.value,
  (callback, args) => callback(args[0], undefined, args[0].target.value),
  "error"
);

class UserDetailsFormComponent extends Component {
  constructor(props, context){
    super(props, context);
  }

  onSumbit(){
    if (fieldValidatorCore.checkGroup("userdetails").isValid === true){
      //proceed
    }
    //or to check a specific field
    if (this.refs.TextFieldREF.isValid === true){
      //proceed
    }
  }

  render(){
    return (<div>
      <Validation
        group="userdetails"
        ref="TextFieldREF"
        onChangeCallback="onChange"
        validators={[
          {
            validator: (val) => !val === false ,
            errorPropValue: true,
            errorMessage: "Please enter a value"
          },
          {
            validator: (val) => {
              return new RegExp(/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*\\.?$/).test(val);
            },
            errorPropValue: true,
            errorMessage: ""
          }]}>
        <TextField
          label="Name"
          className={classes.textField}
          value={v.value}
          fullWidth={true}
          disabled={v.disabled}
          type={v.type}
          onChange={(event, index, value) => {
            dispatcher.publish(Actions.Action, value);
          }}
          SelectProps={{
            MenuProps: {
              className: classes.menu,
            },
          }}
          helperText=""
          margin="normal">
        </TextField>
      </Validation>
    </div>)
  }
}


UserDetailsFormComponent.propTypes = {};

export default UserDetailsFormComponent;
