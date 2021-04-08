import React from 'react';
import './registerForm.css';

import Validator from '../modules/validator';
import FormInputs from './formInputs';

class RegisterForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        page: 0,
        inputSets: [
          [
            { name: "name", placeholder: "Nombre", id: "name" },
            { name: "last_name", placeholder: "Apellidos", id: "last_name" },
            { name: "birthday", placeholder: "Fecha de Nacimiento (MM/DD/AAAA)", id: "birthday" }
          ],
          [
            { name: "birthplace", placeholder: "Lugar de Nacimiento", id: "birthplace" },
            { name: "country", placeholder: "País", id: "country" },
            { name: "zip", placeholder: "Código Postal", id: "zip" }
          ],
          [
            { name: "state", placeholder: "Estado", id: "state" },
            { name: "municipality", placeholder: "Municipio", id: "municipality" },
            { name: "neighborhood", placeholder: "Colonia", id: "neighborhood" }
          ],
          [
            { name: "clabe", placeholder: "CLABE", id: "clabe" },
            { name: "bank", placeholder: "Banco", id: "bank" },
            { name: "id", placeholder: "CURP", id: "id" }
          ],
          [
            { name: "phone", placeholder: "Teléfono de Emergencia", id: "phone" }
          ]
        ],
        formValues: {
          name: undefined,
          last_name: undefined,
          birthday: undefined,
          birthplace: undefined,
          country: undefined,
          state: undefined,
          municipality: undefined,
          neighborhood: undefined,
          zip: undefined,
          clabe: undefined,
          bank: undefined,
          id: undefined,
          phone: undefined
        }
      };
    }
  
    // Handlers
    async handleNextClick() {
      let page = this.state.page;
      const formValues = this.state.formValues;
  
      const validator = new Validator();
      let vErrorFlag = false;
      await this.state.inputSets[page].forEach(async (input) => {
        const elem = document.getElementById(input.id);
        const value = elem.value.trim();
  
        let validationResult;
        try {
          input.name === 'zip'
            ? validationResult = await validator.validate([value, document.getElementById('country').value], input.name)
            : validationResult = await validator.validate(value, input.name);
        } catch (e) {
          console.error(e);
          elem.value = 'ERROR';
          return elem.style.cssText = 'background-color: #000; color: #fff;'
        }
  
        if (validationResult !== 1) {
          elem.style.border = '2px solid #ff0000';
          elem.value = '';
          elem.placeholder = validationResult;
          vErrorFlag = true;
        } else {
          elem.style.cssText = 'border: none; border-bottom: 1px solid #888888;';
          elem.placeholder = input.placeholder;
          formValues[input.name] = value;
        }
      });
  
      if (vErrorFlag) return;
  
      // Change page
      page++;
      this.setState({ page: page, formValues: formValues});
    }
  
    handleSubmitClick() {
      console.log('Submitted!')
    }
  
    // Renderers
    renderInputs(i) {
      return this.state.inputSets[i].map((input, idx) => <FormInputs key={i + idx/10} name={input.name} id={input.id} placeholder={input.placeholder} />)
    }
  
    render() {
      return(
        <form className="register-form" onSubmit={event => event.preventDefault()}>
          { this.renderInputs(this.state.page) }
  
          { this.state.page !== 4 
            ? <button type="button" className="register-form__button" onClick={ _ => this.handleNextClick()}>Siguiente</button>
            : <button type="button" className="register-form__button" onClick={ _ => this.handleSubmitClick()}>Registrar</button>
          }
        </form>
      );
    }
};

export default RegisterForm;