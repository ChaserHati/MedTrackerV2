import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Examen } from 'src/app/classes/examen';
import { DBService } from 'src/app/services/db.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit {

  arregloEx: Examen[]=[];

  inputID : any;
  inputTipo : any;
  inputFecha: any;
  inputValor: any;
  fechaFormateada: any;

  constructor(private db: DBService, private router:Router, private activeroute:ActivatedRoute) { 
    this.activeroute.queryParams.subscribe(param=>{
      if(this.router.getCurrentNavigation()?.extras.state){
        this.inputID = this.router.getCurrentNavigation()?.extras.state?.['sentID'];
        this.inputTipo = this.router.getCurrentNavigation()?.extras.state?.['sentTipo'];
        this.inputFecha = this.router.getCurrentNavigation()?.extras.state?.['sentFecha'];
        this.inputValor = this.router.getCurrentNavigation()?.extras.state?.['sentValor'];
      }
    })
  }

  ngOnInit() {
  }
  
  formatoFecha(){
    this.fechaFormateada = this.inputFecha.split('T')[0];
  }

  modificar(){
    this.db.modificarResultados(this.inputID,this.inputTipo,this.fechaFormateada,this.inputValor);
    this.db.presentToast("Resultado modificado");
    this.router.navigate(['/lista']);
  }

}
