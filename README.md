**

React Validation Framework
==========================

**

***

***Purpose ***
To make task of validation fields on UI a lot simple.

***Install ***
npm i react-validation-framework --save

***Background***

Validating fields in React is not simple because of one-way binding. Hence, validation task is complex, and stores often has be burdened.
With this, you just need to wrap you field component that needs to be validated. This also supports material-ui components.

***Features***
- Supports components that have specific errorText prop like in case of material-ui components
- Supports consolidated validation of a group of fields. This is acheived by specifying the group name as prop to the Validation component.
Ofcourse using ref validity of a paritcular filed at any point can be found.
- If a component is not supported out of box, the support for your new/custom component can be added easily
- Error Text style can be customized

***Basic usage ***


    <Validation
      group={<optional>}
      validator={<array of validators>}
      onChangeCallback={<optional, default is 'onChange'>}
      valueProp={<optional, default is 'value'>}
      defaultValueProp={<optional, default is 'onChange'>}
      errorStyle={<optional>} >
        <YourComponent />
    </Validation>


***Real Code Example***

    <Validation group="myGroup1"
		validators={[
				{
		         validator: (val) => !validator.isEmpty(val),
		         errorMessage: "Cannot be left empty"
		        }, {
	             validator: (val) => validator.isNumeric(val),
	             errorMessage: "Should be a numeric number"
	            }, {
	             validator: (val) => {
	               if (parseInt(val) > 100){
	                   return false;
	               } else {
	                   return true;
	               }
	             errorMessage: "Must be any number less than 100"
                }
            }]}>
                <TextField value={this.state.value}
                           className={styles.inputStyles}
                           style={{width: "100%"}}
                           onChange={
                            (evt)=>{
                              console.log("you have typed: ", evt.target.value);
                            }
                           }/>
    </Validation>


***Notes***
1- Validation accepts an array of validators functions, each with their respective error messages.
The order is important and the field is validated as per the order. For validator function we can use third-party library - validator,
as like above, which has whole bunch of well tested regex, like isEmpty, isEmail,
etc or we can supply our own function for specific case to validate.

2- we can add “group” prop (attribute) and define the group in which the filed belongs.
Later we can use the group name to find whether a group of filed is valid like this :

    handleSubmit(){
        let checkFieldTestResult = fieldValidatorCore.checkGroup("myGroup1");
        if (checkFieldTestResult.isValid){
          console.log("All fields with Gropu prop value as myGroup1 is valid"
        } else {
          console.log("Some of fields with group as "myGroup1" are invalid");
          console.log("Field which are invalid are ", checkFieldTestResult.inValidComponents);
          console.log("Fields which are valid are ", checkFieldTestResult.validComponents
        }
      }


  or we can simple add a ref to the Validation tag and call the isValid method to find if the field is valid.