import { Component, Input, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';


@Component({
  selector: 'app-financial-chart',
  standalone: true,
  imports: [HighchartsChartModule],
  templateUrl: './financial-chart.component.html',
  styleUrl: './financial-chart.component.scss'
})
export class FinancialChartComponent implements OnInit {
  @Input('data') data : { yearly: any[] } | undefined;
  Highcharts: typeof Highcharts = Highcharts;
  yearlyChartOptions!: Highcharts.Options;


  ngOnInit(): void {
    if (this.data) {
      this.initializeYearlyChart(this.data);
    }
  }

  
  private initializeYearlyChart(data: { yearly: any[] }): void {
    const yearlyData = data.yearly;
  
    this.yearlyChartOptions = {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Annual Performance'
      },
      xAxis: {
        categories: yearlyData.map((item: any) => item.year),
        title: { text: 'Year' }
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Values (in millions)'
        }
      },
      series: [
        {
          name: 'Revenue',
          data: yearlyData.map((item: any) => item.revenue),
          type: 'column',
          color: '#5DADE2' // Medium Blue for Revenue
        },
        {
          name: 'Profit',
          data: yearlyData.map((item: any) => item.profit),
          type: 'column',
          color: '#58D68D' // Medium Green for Profit
        },
        {
          name: 'Debt',
          data: yearlyData.map((item: any) => item.debt),
          type: 'column',
          color: '#F1948A' // Medium Red for Debt
        }
      ],
      credits: {
        enabled: false 
      }
    };
  }
 
}
