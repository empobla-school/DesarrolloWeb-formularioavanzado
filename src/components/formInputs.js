import React from 'react';
import './formInputs.css';

import Validator from '../modules/validator';

function FormInputs(props) {
    async function handleBlur() {
      const input = document.getElementById(props.id);
      const value = input.value.trim();
  
      const validator = new Validator();
      let validationResult;
      try {
        validationResult = await validator.validate(value, props.name);
      } catch (e) {
        console.error(e);
        input.value = 'ERROR';
        return input.style.cssText = 'background-color: #000; color: #fff;'
      }
      
      if (validationResult !== 1) {
        input.style.border = '2px solid #ff0000';
        input.value = '';
        input.placeholder = validationResult;
      } else {
        input.style.cssText = 'border: none; border-bottom: 1px solid #888888;';
        input.placeholder = props.placeholder;
      }
  
    }
  
    return (
      <input className="register-form__input" type="text" 
      name={props.name}
      id={props.id}
      placeholder={props.placeholder}
      onBlur={props.name !== 'zip' ? handleBlur : () => {}} />
    );
};

export default FormInputs;