import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../core/account/account.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  private retorno;

  @ViewChild('userNameInput') userNameInput: ElementRef<HTMLInputElement>;

  constructor(
    private formBuilder: FormBuilder,
    private account: AccountService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      user: ['', Validators.email],
      password: ['', Validators.required]
    })
   }

  ngOnInit(): void {
  }

  login(){
    console.log("Chamei o login")
    const user = this.loginForm.get('user').value;
    const password = this.loginForm.get('password').value;
    this.account.authenticate(user, password)
    if(this.account){
      this.router.navigate(['Tasks/'])
    }

  }

}
