import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyComponent } from './company.component';
import { RouterModule, Routes } from '@angular/router';
import { CompanyService } from '../services/company.service';
import { FinancialChartComponent } from '../components/financial-chart/financial-chart.component';
import { StockPriceChartComponent } from '../components/stock-price-chart/stock-price-chart.component';


const routes: Routes = [
  {
    path: '',
    component: CompanyComponent 
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,RouterModule.forChild(routes),CompanyComponent,FinancialChartComponent,StockPriceChartComponent
  ],
  providers:[CompanyService ]
})
export class CompanyModule { }
