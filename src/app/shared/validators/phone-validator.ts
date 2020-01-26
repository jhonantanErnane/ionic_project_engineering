import { AbstractControl, ValidatorFn } from '@angular/forms';
import * as libphonenumber from 'google-libphonenumber';

export class PhoneValidator {

  static validCountryPhone = (): ValidatorFn => {
    return (phoneControl: AbstractControl): { [key: string]: boolean } => {

      if (phoneControl.value !== '') {
        try {

          const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();
          const phoneNumber = '+55' + phoneControl.value + '';
          // const region = countryControl.value;
          const pNumber = phoneUtil.parseAndKeepRawInput(phoneNumber, 'pt-br');
          const isValidNumber = phoneUtil.isValidNumber(pNumber);

          if (isValidNumber) {
            return undefined;
          }
        } catch (e) {
          // console.log(e);
          return {
            validCountryPhone: true
          };
        }

        return {
          validCountryPhone: true
        };
      } else {
        return undefined;
      }
    };
  }
}
