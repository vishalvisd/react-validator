# react-validation-framework
Component to validate fields, supports all components including material-ui components


*React Validation framework* -
I have worked on a validation framework, that will make validation work on UI lot simpler. Validating fields in React is not simple because of one-way binding. Hence, validation task is complex, time consuming, error prone and stores often has be burdened. I tried to find some framework which makes this task simple but couldn’t find one. The best that I found doesn’t supported material-ui and doesn’t supported multiple validation messages.
> This is how the implementation works

```import {Validation, Groupings} from "../../common/Field-Validator/Field-Validator";
import validator from "validator";```
```<Validation group="evaluateGroupDescription" validators={[{
          validator: (v) => validator.isEmpty(v),
          errorMessage: "Please enter a rate"
      }, {
         validator: (v) => validator.isNumeric(v),
         errorMessage: "Enter numeric value"
}]}>

<TextField
           className={styles.inputStyles}
           onChange={(evt)=>{
                      this.gdlocaldata[`af${area.roomType}${area.type}`] = evt.target.value;
                  }}
                   onKeyUp={(evt)=>{
                        if (evt.keyCode === enterKeyCode){
           dispatcher.publish(Actions.GROUP_DISPLACEMENT_AUTOFILL, area, evt.target.value);}>
</TextField>

</Validation>```

We can now wrap fields inside Validation tag. Validation accepts an array of validators functions, each with their respective error messages. The order is important and the field is validated as per the order. For validator function we can use third-party library - validator, like I have used above, which has whole bunch of well tested regex, like isEmpty, isEmail, etc or we can supply our own function for specific case to validate.

Further we can add “group” prop (attribute) and define the group in which the filed belongs. Later we can use the group name to find whether a group of filed is valid like this : -

```handleGroupDescriptionSubmit(){
    if (Groupings.isGroupValid("groupDescription")){
      dispatcher.publish(Actions.GROUP_DISPLACEMENT_GROUP_DESCRIPTION_SUBMIT);
    }
  }```

or we can simple add a ref to the Validation tag and call the isValid method to find if the field is valid.
This work with both material-ui and non-material ui components.and for both Uncontrolled, controlled and derived valued components
