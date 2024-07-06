import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  username:string="";
  constructor(private router: Router) {   }

  ngOnInit() {
    if(localStorage.getItem('user')!=null){
      this.router.navigate(['/inicio'])
    }
  }

  enviarDatos(){
    let navigationExtras: NavigationExtras = {
      state: {
        username: this.username,
      }
    }
    localStorage.setItem('user', this.username);
    this.router.navigate(['/inicio'], navigationExtras);
  }
}
