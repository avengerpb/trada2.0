import { Component, OnInit } from '@angular/core';
import {ValidateService} from '../../services/validate.service'
import {FlashMessagesService} from 'angular2-flash-messages'
import {AuthService} from '../../services/auth.service'
import {Router} from '@angular/router'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  fullname: String;
  username: String;
  email: String;
  password: String;
  cpassword: String;

  constructor(
    private ValidateService: ValidateService,
    private _flashMessages: FlashMessagesService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  onRegisterSubmit(){
    let user = {
      fullname: this.fullname,
      username: this.username,
      email: this.email,
      password: this.password,
      cpassword: this.cpassword
    }

    //required fields
    if(!this.ValidateService.validateRegister(user)){
      // console.log('Fill in all fields');
      this._flashMessages.show('Please fill in all fields', {cssClass: 'alert-danger', timeout: 3000});
      return false;
    } else {
      //validate email
      if(!this.ValidateService.validateEmail(user.email)){
        this._flashMessages.show('Please use a valid email address', {cssClass: 'alert-danger', timeout: 3000});
        return false;
      }

      //confirm password
      if(!this.ValidateService.isConfirmedPassword(user.password, user.cpassword)){
          this._flashMessages.show('Confrm password field is not the same', {cssClass: 'alert-danger', timeout: 3000});
        return false;
      }
    }

    //Register user
    this.authService.registerUser(user).subscribe(data => {
      if(data.success) {
        this._flashMessages.show('You are now registered. Please log in!', {cssClass: 'alert-success', timeout: 3000});
        this.router.navigate(['/login']);
      } else {
        this._flashMessages.show(data.msg, {cssClass: 'alert-danger', timeout: 3000});
        // console.log(data.msg);
      }
    });
  }

}
