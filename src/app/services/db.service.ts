import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { AlertController, Platform, ToastController } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { Resultado } from '../classes/resultado';
import { Examen } from '../classes/examen';

@Injectable({
  providedIn: 'root'
})
export class DBService {

  public database!: SQLiteObject;

  tablaResultados: string = "CREATE TABLE IF NOT EXISTS resultados(id INTEGER PRIMARY KEY autoincrement,tipo TEXT NOT NULL,fecha TEXT NOT NULL, valor NUMERIC NOT NULL);"
  tablaExamenes: string = "CREATE TABLE IF NOT EXISTS examenes(id INTEGER PRIMARY KEY autoincrement, nombre TEXT NOT NULL, min NUMERIC, max NUMERIC, alert INTEGER NOT NULL);"

  registroResultados: string = "INSERT or IGNORE INTO resultados(id,tipo,fecha,valor) VALUES (1,'vcm','2019-01-04',79.2),(2,'vcm','2019-04-06',78.6),(3,'vcm','2019-08-20',79.6),(4,'vcm','2021-01-02',76.7),(5,'vcm','2023-03-18',77.6),(6,'vcm','2023-05-20',77.9),(7,'vcm','2024-01-09',78.2);"

  registro2: string = "INSERT or IGNORE INTO resultados(id,tipo,fecha,valor) VALUES (8,'hemoglobina','2019-01-04',12.7), (9,'hemoglobina','2019-04-06',13.0),(10,'hemoglobina','2019-08-20',13.0),(11,'hemoglobina','2021-01-02',12.3),(12,'hemoglobina','2023-03-18',12.2),(13,'hemoglobina','2023-05-20',12.5),(14,'hemoglobina','2024-01-09',11.4);"

  registroEx: string = "INSERT or IGNORE INTO examenes(id,nombre,min,max,alert) VALUES(1,'eritrocitos',3.99,5.27,0),(2,'hematocritos',37.1,46.7,0),(3,'hemoglobina',12.1,15.5,1),(4, 'vcm',80,100,1),(5,'hcm',26.0,34.0,0),(6,'chcm',31.0,36.0,0),(7,'rdw',12.4,15.3,0);"

  listaResultados = new BehaviorSubject([]);

  listaExamenes = new BehaviorSubject([]);

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
      await this.database.executeSql(this.tablaExamenes,[]);
      await this.database.executeSql(this.registroResultados, []);
      await this.database.executeSql(this.registro2,[]);
      await this.database.executeSql(this.registroEx,[]);
      this.buscarResultados();
      this.buscarExamenes();
      this.isDBReady.next(true);
    } catch (e){
      this.presentToast("Error tablas: "+JSON.stringify(e));
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

  buscarExamenes(){
    return this.database.executeSql('SELECT * FROM examenes', []).then(res=>{
      let items: Examen[] = [];
      if(res.rows.length > 0){
        for (var i=0; i<res.rows.length; i++){
          items.push({
            id: res.rows.item(i).id,
            nombre: res.rows.item(i).nombre,
            min: res.rows.item(i).min,
            max: res.rows.item(i).max,
            alert: res.rows.item(i).alert
          })
        }
      }
      this.listaExamenes.next(items as any);
    })
  }

  dbState(){
    return this.isDBReady.asObservable();
  }

  fetchResultados(): Observable<Resultado[]> {
    return this.listaResultados.asObservable();
  }

  fetchExamenes(): Observable<Examen[]> {
    return this.listaExamenes.asObservable();
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

  modificarExamenes(id: any, alert: any){
    let data = [alert, id];
    return this.database.executeSql('UPDATE examenes SET alert = ? WHERE id = ?;',data).then(res=>{
      this.buscarExamenes();
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
