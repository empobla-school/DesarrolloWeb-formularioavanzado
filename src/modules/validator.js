class Validator {
    async validate(text, type) {
      if (type === 'country') return await this.country(text);
      if (type === 'zip') return await this.zip(text)
  
      const router = {
        name: this.name(text),
        last_name: this.lastName(text),
        birthday: this.birthday(text),
        birthplace: this.birthplace(text),
        state: undefined,
        municipality: undefined,
        neighborhood: undefined,
        clabe: undefined,
        bank: undefined,
        id: undefined,
        phone: undefined
      }
  
      if (router[type] === undefined) throw new ReferenceError('ReferenceError: No such type.');
      return router[type];
    }
  
    name(name) {
      const regex = /^[a-z]+$/i;
  
      if (name.length < 3) return 'Tu nombre está muy corto';
      if (name.length > 40) return 'Tu nombre está muy largo';
      if (!name.match(regex)) return 'Tu nombre sólo puede contener letras';
      return 1;
    }
  
    lastName(last_name) {
      const regex = /^[a-z\s']+$/i;
  
      if (last_name.length < 3) return 'Tus apellidos están muy cortos';
      if (last_name.length > 64) return 'Tus apellidos están muy largos';
      if (!last_name.match(regex)) return 'Tus apellidos sólo pueden contener letras, espacios y comillas simples';
      return 1;
    }
  
    birthday(birthday) {
      const date = new Date(birthday);
  
      if (!(date.getTime() === date.getTime())) return 'Fecha inválida';
      return 1;
    }
  
    birthplace(birthplace) {
      const regex = /^[a-z\s'-]+$/i;
  
      if (birthplace.length < 3) return 'Tu lugar de nacimiento está muy corto';
      if (birthplace.length > 64) return 'Tu lugar de nacimiento está muy largo';
      if (!birthplace.match(regex)) return 'Tu lugar de nacimiento sólo puede contener: letras, " ", "\'", "-"';
      return 1;
    }
  
    async country(country) {
      if (country.length < 4) return 'El nombre de tu país está muy corto';
  
      try {
        var api = await fetch(`http://api.geonames.org/searchJSON?q=${country}&lang=es&maxRows=5&username=empoblawork`);
      } catch (error) {
        console.error(error);
        return 'Error de Servidor';
      }
  
      const data = await api.json();
      if (!data.geonames.length) return 'País inválido';
      
      let matchFlag = false;
      data.geonames.forEach(result => {
        if ( result.countryName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() === country.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()) matchFlag = true;
      });
  
      if (!matchFlag) return 'País inválido';
      return 1;
    }
  
    async zip([zip, country]) {
      if (zip.length < 5) return 'Código Postal inválido';
  
      // Get Country Code (inefficient)
      try {
        var apiC = await fetch(`http://api.geonames.org/searchJSON?q=${country}&lang=es&maxRows=5&username=empoblawork`);
      } catch (error) {
        console.error(error);
        return 'Error de Servidor';
      }
  
      const dataC = await apiC.json();
      if (!dataC.geonames.length) return 'País inválido';
      
      let matchFlag = false;
      let countryCode = undefined;
      dataC.geonames.every(result => {
        if ( result.countryName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() === country.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()) {
          matchFlag = true;
          countryCode = result.countryCode;
          return false;
        }
  
        return true;
      });
  
      if (!matchFlag || countryCode === undefined) return 'País inválido';
  
      // Validate zip
      try {
        var api = await fetch(`http://api.geonames.org/postalCodeLookupJSON?postalcode=${zip}&country=${countryCode}&username=empoblawork`);
      } catch (error) {
        console.error(error);
        return 'Error de Servidor';
      }
  
      const data = await api.json();
      if (!data.postalcodes.length) return 'Código Postal inválido';
      return 1;
    }
};

export default Validator;