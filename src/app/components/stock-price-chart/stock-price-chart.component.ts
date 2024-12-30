import { JsonPipe } from '@angular/common';
import { Component, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import * as HighchartStock from 'highcharts/highstock';

@Component({
  selector: 'app-stock-price-chart',
  standalone: true,
  imports: [HighchartsChartModule],
  templateUrl: './stock-price-chart.component.html',
  styleUrl: './stock-price-chart.component.scss',
})
export class StockPriceChartComponent implements OnInit,OnChanges {
  @Input('data') data :any = []
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions!: HighchartStock.Options;
  companyCode:string | null=''

  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && changes['data'].currentValue) {
      this.initializeStockChart();
    }
  }

  

  private initializeStockChart(){
    if (!this.data || this.data.length === 0) {
      return; 
    }
   this.chartOptions = ({
      rangeSelector: {
        selected: 1
      },
      title: {
        text: 'Annual Stock Price', 
      },
      xAxis: {
        type: 'datetime', 
        title: {
          text: 'Date', 
        },
      },
      yAxis: {
        title: {
          text: 'Price (₹)', 
        },
        labels: {
          formatter: function () {
            return `₹${this.value}`; 
          },
        },
      },
      series: [{
        tooltip: {
          valueDecimals: 2
        },
        type:'line',
        name: 'Price on NSE',
        data: this.data
     } ]
    });
  }

 
}
