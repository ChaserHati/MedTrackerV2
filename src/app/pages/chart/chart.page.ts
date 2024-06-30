import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { DBService } from 'src/app/services/db.service';
import { Chart } from 'chart.js/auto';
import { Resultado } from 'src/app/classes/resultado';

@Component({
  selector: 'app-chart-page',
  templateUrl: './chart.page.html',
  styleUrls: ['./chart.page.scss'],
})
export class ChartPage implements OnInit, AfterViewInit {

  selectOptions = [
    {
      value: "vcm",
      name: "VCM",
      min: 80,
      max: 100
    },
    {
      value: "hemoglobina",
      name: "Hemoglobina",
      min: 12.1,
      max: 15.5
    }
  ];
  selected = "";

  @ViewChild('lineCanvas', {static: false}) private lineCanvas!: ElementRef;
  private lineChart!: Chart;

  fechas: string[] = [];
  valores: number[] = [];
  min: number[] = [];
  max: number[] = [];

  arregloResultados: Resultado[] = [
  ]

  constructor(private db: DBService, private router: Router) { }

  ngOnInit() {
    this.db.dbState().subscribe((res)=>{
      if(res){
        this.db.fetchResultados().subscribe((item)=>{
          this.arregloResultados=item;
        })
      }
    })
  }

  ngAfterViewInit(){
    this.getArrays();
    this.getMinMax();
    this.lineChartMethod();
  }

  getArrays(){
    var fechas: string[] = [];
    var valores: number[] = [];
    this.arregloResultados.forEach((x) => {
      if(x.tipo==this.selected){
        fechas.push(x.fecha);
        valores.push(x.valor);
      }
    });
    this.fechas = fechas;
    this.valores = valores;
  }

  lineChartMethod() {
    if(this.fechas){
      var nativeElement = this.lineCanvas?.nativeElement;
      if(nativeElement){
        this.lineChart = new Chart(nativeElement, {
          type: 'line',
          data: {
            labels: this.fechas,
            datasets: [
              {
                label: this.selected,
                fill: false,
                tension: 0.1,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: 'rgba(75,192,192,1)',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                pointHoverBorderColor: 'rgba(220,220,220,1)',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: this.valores,
                spanGaps: false,
              },
              {
                label: 'Minimo Saludable',
                fill: false,
                tension: 0.1,
                backgroundColor: 'rgba(200,50,50,0.4)',
                borderColor: 'rgba(200,50,50,1)',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: 'rgba(200,50,50,1)',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgba(200,50,50,1)',
                pointHoverBorderColor: 'rgba(220,220,220,1)',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                pointStyle: 'false',
                data: this.min,
                spanGaps: false,
              },
              {
                label: 'Maximo Saludable',
                fill: false,
                tension: 0.1,
                backgroundColor: 'rgba(200,50,50,0.4)',
                borderColor: 'rgba(200,50,50,1)',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: 'rgba(200,50,50,1)',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgba(200,50,50,1)',
                pointHoverBorderColor: 'rgba(220,220,220,1)',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                pointStyle: 'false',
                data: this.max,
                spanGaps: false,
              },
            ]
          },
        });
      } else {
        this.db.presentAlert("Error de native element")
      }
    } else{
      this.db.presentAlert("Arreglo vacio")
    }
  }

  updateDatasets(){
    this.lineChart.data.datasets[0].label = this.selected;
    this.lineChart.data.labels = this.fechas;
    this.lineChart.data.datasets[0].data = this.valores;
    this.lineChart.data.datasets[1].data = this.min;
    this.lineChart.data.datasets[2].data = this.max;
  }

  getMinMax(){
    this.selectOptions.forEach((x)=>{
      if(x.value==this.selected){
        this.min = Array.from(this.valores).fill(x.min)
        this.max = Array.from(this.valores).fill(x.max)
      }
    });
  }

  updateChart(){
    this.getArrays();
    this.getMinMax();
    this.updateDatasets();

    this.lineChart.reset();

    this.lineChart.update();
    this.db.presentToast("Gráfico actualizado")
  }
}