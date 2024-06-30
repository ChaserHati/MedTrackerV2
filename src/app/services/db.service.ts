import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { AlertController, Platform, ToastController } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { Resultado } from '../classes/resultado';

@Injectable({
  providedIn: 'root'
})
export class DBService {

  public database!: SQLiteObject;

  tablaResultados: string = "CREATE TABLE IF NOT EXISTS resultados(id INTEGER PRIMARY KEY autoincrement,tipo TEXT NOT NULL,fecha TEXT NOT NULL, valor NUMERIC NOT NULL);"

  registroResultados: string = "INSERT or IGNORE INTO resultados(id,tipo,fecha,valor) VALUES (1,'vcm','2019-01-04',79.2),(2,'vcm','2019-04-06',78.6),(3,'vcm','2019-08-20',79.6),(4,'vcm','2021-01-02',76.7),(5,'vcm','2023-03-18',77.6),(6,'vcm','2023-05-20',77.9),(7,'vcm','2024-01-09',78.2);"

  registro2: string = "INSERT or IGNORE INTO resultados(id,tipo,fecha,valor) VALUES (8,'hemoglobina','2019-01-04',12.7), (9,'hemoglobina','2019-04-06',13.0),(10,'hemoglobina','2019-08-20',13.0),(11,'hemoglobina','2021-01-02',12.3),(12,'hemoglobina','2023-03-18',12.2),(13,'hemoglobina','2023-05-20',12.5),(14,'hemoglobina','2024-01-09',11.4);"

  listaResultados = new BehaviorSubject([]);

  private isDBReady : BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private sqlite : SQLite, private platform : Platform, private toastController : ToastController, private alertController : AlertController) { 
    this.createDB();
  }

  async presentToast(msj:string){
    const toast = await this.toastController.create({
      message:msj,
      duration:3000,
      icon: 'globe'
    });
    await toast.present()
  }

  async presentAlert(msj:string){
    const alert = await this.alertController.create({
      header: 'Alert',
      message: msj,
      buttons: ['OK'],
    });
    await alert.present()
  }

  createDB(){
    this.platform.ready().then(()=>{
      this.sqlite.create({
        name: 'sqlite.db',
        location: 'default'
      }).then((db: SQLiteObject)=>{
        this.database = db;
        this.createTables();
      }).catch(e=>{
        this.presentToast("Error DB: "+e)
      })
    })
  }

  async createTables(){
    try {
      await this.database.executeSql(this.tablaResultados, []);
      await this.database.executeSql(this.registroResultados, []);
      await this.database.executeSql(this.registro2,[]);
      this.buscarResultados();
      this.isDBReady.next(true);
    } catch (e){
      this.presentToast("Error tablas: "+e);
    }
  }

  buscarResultados(){
    return this.database.executeSql('SELECT * FROM resultados ORDER BY fecha', []).then(res=>{
      let items: Resultado[] = [];
      if(res.rows.length > 0){
        for (var i=0; i<res.rows.length; i++){
          items.push({
            id: res.rows.item(i).id,
            tipo: res.rows.item(i).tipo,
            fecha: res.rows.item(i).fecha,
            valor: res.rows.item(i).valor
          })
        }
      }
      this.listaResultados.next(items as any);
    })
  }

  dbState(){
    return this.isDBReady.asObservable();
  }

  fetchResultados(): Observable<Resultado[]> {
    return this.listaResultados.asObservable();
  }

  insertarResultados(tipo:any, fecha: any, valor:any){
    let data = [tipo, fecha, valor];
    return this.database.executeSql('INSERT INTO resultados(tipo,fecha,valor) VALUES (?,?,?);',data).then(res=>{
      this.buscarResultados();
    }).catch(e=>{
      this.presentAlert("Error add: "+JSON.stringify(e))
    })
  }

  modificarResultados(id:any,tipo:any, fecha: any, valor:any){
    let data = [tipo, fecha, valor, id];
    return this.database.executeSql('UPDATE resultados SET tipo = ?, fecha = ?, valor = ? WHERE id = ?;',data).then(res=>{
      this.buscarResultados();
    }).catch(e=>{
      this.presentAlert("Error mod: "+JSON.stringify(e))
    })
  }

  eliminarResultados(id:any){
    return this.database.executeSql('DELETE FROM resultados WHERE id = ?',[id]).then(res=>{
      this.buscarResultados();
    })
  }
}
