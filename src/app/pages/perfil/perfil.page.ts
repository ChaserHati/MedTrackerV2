import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  public fechnac!: string;
  fechnacFormateada!: string;
  nowDate= new Date();
  username!: string;
  height!: number;
  weight!: number;
  bmi!: number;

  constructor(private activerouter: ActivatedRoute,private router: Router) {
    this.activerouter.queryParams.subscribe(params =>{
      if(this.router.getCurrentNavigation()?.extras?.state){
        this.username= this.router.getCurrentNavigation()?.extras?.state?.['username'];
   }
  })
}
  
  ngOnInit() {
    this.username=String(localStorage.getItem('user'));
    this.height=Number(localStorage.getItem('height'));
    this.weight=Number(localStorage.getItem('weight'));
    this.bmi = Number(localStorage.getItem('bmi'));
    if(localStorage.getItem('fechnac')!=null){
      this.fechnac=String(localStorage.getItem('fechnac'));
    } else {
      this.fechnac= this.nowDate.toISOString();
    }
  }

  calcularBMI(){
    this.bmi = Number((this.weight/(this.height**2)).toFixed(2));
  }

  processFecha(){
    this.fechnacFormateada = this.fechnac.split('T')[0];
  }
  guardarStorage(){
    localStorage.setItem('weight',String(this.weight));
    localStorage.setItem('height',String(this.height));
    localStorage.setItem('bmi',String(this.bmi));
    localStorage.setItem('fechnac',this.fechnacFormateada);
  }
  cerrarSesion(){
    this.height=0;
    this.weight=0;
    this.bmi=0;
    this.fechnac=this.nowDate.toISOString();
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
