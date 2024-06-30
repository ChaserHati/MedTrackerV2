import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DBService } from 'src/app/services/db.service';

@Component({
  selector: 'app-nuevo',
  templateUrl: './nuevo.page.html',
  styleUrls: ['./nuevo.page.scss'],
})
export class NuevoPage implements OnInit {

  inputID : any;
  inputTipo : any;
  inputFecha: any;
  inputValor: any;
  fechaFormateada: any;

  constructor(private db: DBService, private router:Router) { }

  ngOnInit() {
  }

  formatoFecha(){
    this.fechaFormateada = this.inputFecha.split('T')[0];
  }

  modificar(){
    this.db.insertarResultados(this.inputTipo,this.fechaFormateada,this.inputValor);
    this.db.presentToast("Resultado insertado");
    this.router.navigate(['/lista']);
  }

}
