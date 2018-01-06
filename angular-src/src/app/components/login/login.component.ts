import { Component, OnInit } from '@angular/core';
import {ValidateService} from '../../services/validate.service'
import {FlashMessagesService} from 'angular2-flash-messages'
import {AuthService} from '../../services/auth.service'
import {Router} from '@angular/router'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email_uname: String;
  password: String;

  constructor(
    private validateService: ValidateService,
    private _flashMessages: FlashMessagesService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  onLoginSubmit() {
    let user = {
      email_uname: this.email_uname,
      password: this.password
    }

    if(!this.validateService.validateLogin(user)){
      this._flashMessages.show('Please fill in all fields', {cssClass: 'alert-danger', timeout: 3000});
    }

    this.authService.loginUser(user).subscribe(data => {
      if(data.success){
        console.log(data);
        this.authService.storeUserData(data.token, data.user);
        this._flashMessages.show(data.msg, {cssClass: 'alert-success'});
        this.router.navigate(['/']);
      } else {
        this._flashMessages.show(data.msg, {cssClass: 'alert-danger'});
      }
    });
  }

}
