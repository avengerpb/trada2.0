import { Injectable } from '@angular/core';

@Injectable()
export class ValidateService {

  constructor() { }

  validateRegister(user){
    if(user.fullname == undefined || user.username == undefined ||
       user.email == undefined || user.password == undefined ||
       user.cpassword == undefined)
    {
       return false;
    } else {
      return true;
    }
  }

  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email.toLowerCase());  //retrun true or false
  }

  isConfirmedPassword(password, cpassword){
    if(password == cpassword) return true;
    else return false;
  }

  validateLogin(user){
    if(user.email_uname == undefined || user.password == undefined) return false;
    else return true;
  }
}
