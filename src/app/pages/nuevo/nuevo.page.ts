import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Examen } from 'src/app/classes/examen';
import { DBService } from 'src/app/services/db.service';

@Component({
  selector: 'app-nuevo',
  templateUrl: './nuevo.page.html',
  styleUrls: ['./nuevo.page.scss'],
})
export class NuevoPage implements OnInit {

  arregloEx: Examen[] = [];
  selectedEx!: Examen;

  inputID : any;
  inputTipo!: string;
  inputFecha: any;
  inputValor!: number;
  fechaFormateada: any;

  constructor(private db: DBService, private router:Router) { }

  ngOnInit() {
    this.db.dbState().subscribe((res)=>{
      if(res){
        this.db.fetchExamenes().subscribe(item=>{
          this.arregloEx=item;
        })
      }
    })
  }

  formatoFecha(){
    this.fechaFormateada = this.inputFecha.split('T')[0];
  }

  selectEx(){
      this.arregloEx.forEach((x)=>{
        if(x.nombre==this.inputTipo){
          this.selectedEx = x;
        }
      })
  }

  triggerAlert(){
    if(this.selectedEx?.min==null&&this.selectedEx?.max==null){
      return false;
    } else if(this.selectedEx?.min!=null&&this.selectedEx?.max==null){
      return (this.selectedEx?.min>this.inputValor);
    } else if(this.selectedEx?.min==null&&this.selectedEx?.max!=null){
      return (this.selectedEx?.max<this.inputValor);
    } else if (this.selectedEx?.min!=null&&this.selectedEx?.max!=null){
      return (this.inputValor<this.selectedEx?.min||this.inputValor>this.selectedEx?.max);
    } else {
      return false;
    }
  }

  guardar(){
    this.db.insertarResultados(this.inputTipo,this.fechaFormateada,this.inputValor);
    try{
      if(this.triggerAlert()){
        this.db.modificarExamenes(this.selectedEx?.id,1)
      } else{
        this.db.modificarExamenes(this.selectedEx?.id,0)
      }
      this.db.presentToast("Resultado insertado");
      this.router.navigate(['/lista']);
    } catch(e){
      this.db.presentAlert(String(e))
    }
    
  }

}
