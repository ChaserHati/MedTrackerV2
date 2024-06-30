import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Inicio', url: '/inicio', icon: 'home' },
    { title: 'Nuevo', url: '/nuevo', icon: 'add-circle' },
    { title: 'Registros', url: '/lista', icon: 'list' },
    { title: 'Visualizar', url: '/chart', icon: 'stats-chart' },
    { title: 'Perfil', url: '/perfil', icon: 'person' },
  ];
  constructor() {}
}
