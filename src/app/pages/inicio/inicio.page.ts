import { Component, OnInit } from '@angular/core';
import { Examen } from 'src/app/classes/examen';
import { DBService } from 'src/app/services/db.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  arregloEx: Examen[]=[];

  constructor(private db: DBService) { }

  ngOnInit() {
    this.db.dbState().subscribe((res)=>{
      if(res){
        this.db.fetchExamenes().subscribe(item=>{
          this.arregloEx=item;
        })
      }
    })
  }

}
