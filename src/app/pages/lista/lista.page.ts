import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Examen } from 'src/app/classes/examen';
import { Resultado } from 'src/app/classes/resultado';
import { DBService } from 'src/app/services/db.service';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.page.html',
  styleUrls: ['./lista.page.scss'],
})
export class ListaPage implements OnInit {

  arregloEx: Examen[]=[];

  selected = "";

  arregloResultados: Resultado[] = []

  constructor(private db: DBService, private router: Router) { }

  ngOnInit() {
    this.db.dbState().subscribe((res)=>{
      if(res){
        this.db.fetchResultados().subscribe(item=>{
          this.arregloResultados=item;
        })
      }
    })
    this.db.dbState().subscribe((res)=>{
      if(res){
        this.db.fetchExamenes().subscribe(item=>{
          this.arregloEx=item;
        })
      }
    })
  }

  openEdit(x:any){
    let navigationextras: NavigationExtras = {
      state: {
        sentID: x.id,
        sentTipo: x.tipo,
        sentFecha: x.fecha,
        sentValor: x.valor
      }
    }
    this.router.navigate(['/edit'], navigationextras);
  }

  eliminar(x:any){
    this.db.eliminarResultados(x.id);
    this.db.presentToast("Resultado eliminado")
  }

}
