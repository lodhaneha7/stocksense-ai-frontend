import { Component, inject, OnInit } from '@angular/core';
import { CompanyDetailsComponent } from '../components/company-details/company-details.component';
import { CompanyService } from '../services/company.service';
import { ActivatedRoute } from '@angular/router';
import { catchError, concatMap, EMPTY, map, Observable, of } from 'rxjs';
import { AsyncPipe } from '@angular/common';

import { FinancialItem, FiscalData, StockAnalysisModel, StockDetails, StockPriceData } from '../interfaces/interface';
import { PrimeMgModule } from '../shared/primeng-module';
import { marked } from 'marked';
import { FinancialChartComponent } from '../components/financial-chart/financial-chart.component';
import { StockPriceChartComponent } from '../components/stock-price-chart/stock-price-chart.component';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';


@Component({
  selector: 'app-company',
  standalone: true,
  imports: [CompanyDetailsComponent,AsyncPipe,FinancialChartComponent,PrimeMgModule,StockPriceChartComponent],
  templateUrl: './company.component.html',
  styleUrl: './company.component.scss'
})
export class CompanyComponent implements OnInit {
  private _companyService = inject(CompanyService);
  private _activatedRoute = inject(ActivatedRoute);
  stockPriceChartData$: Observable<any[]> | undefined;

  showNoRecordFound:boolean = false;
  loader:boolean = true;
  aiInsightResponse :string = ''

  ngOnInit(): void {
    this._activatedRoute.params.subscribe((params) => {
      const companyCode = params['companyCode']; 
      if (companyCode) {
        this.stockPriceChartData$ = this.fetchHistoricalData(companyCode).pipe();
      }
    });
  }
  companyDetails$ = this._activatedRoute.params.pipe(
    concatMap(params => {
      return this._companyService.fetchStockDetails(params['companyCode']).pipe(
        map(res => {
         if((res as any).error === "Stock not found"){
          this.loader = false;
          this.showNoRecordFound =true;
          return null; 
         }
         const companyDetails = this.prepareStockAnalysisPayload(res);
         const financialData = this.prepareFinancialChartData(res.financials);
         const latestNewsUrls = (companyDetails.latestNewsUrls).map((urls)=> urls.url).join(', ');
         this.sendCompanyDetailsToModel(companyDetails.companyName,latestNewsUrls);
         this.loader = false;
          return {
            companyData: companyDetails,
            financialData:financialData
          }
          
        }),
        catchError(() => {
          console.error('Error fetching company details');
          this.loader = false;
          this.showNoRecordFound = true;
          return EMPTY;
        })
      );
    })
  );

  private fetchHistoricalData(companyCode: string): Observable<any[]> {
    return this._companyService.fetchHistoricalData(companyCode).pipe(
      map((data: StockPriceData) => {
        const priceDataset = data.datasets.find((history) => history.metric === "Price");
        if (priceDataset) {
          return priceDataset.values.map((item) => [
            new Date(item[0] as string).getTime(), 
            parseFloat(item[1] as string) 
          ]);
        }
        return [];
      }),
      catchError((error) => {
        console.error("Error fetching historical data:", error);
        return of([]); 
      })
    );
  }
  
  
  
  
  private prepareStockAnalysisPayload(data: StockDetails): StockAnalysisModel {
    const valuation = data.companyProfile.peerCompanyList.find((peer) => 
      data.companyName.startsWith(peer.companyName.split(' ')[0])
    );
    return {
      companyName: data.companyName,
      currentPrice: data.currentPrice,
      percentChange: data.percentChange,
      yearHigh: data.yearHigh,
      yearLow: data.yearLow,
      valuation: {
        priceToBookValueRatio: valuation?.priceToBookValueRatio || 0,
        priceToEarningsValueRatio: valuation?.priceToEarningsValueRatio || 0,
        marketCap: valuation?.marketCap || 0,
      },
      profitability: {
        returnOnEquity: valuation?.returnOnAverageEquityTrailing12Month || 0,
        netProfitMargin: valuation?.netProfitMarginPercentTrailing12Month || 0,
      },
      dividend: {
        yield: valuation?.dividendYieldIndicatedAnnualDividend || 0,
      },
      debt: {
        debtToEquity: valuation?.ltDebtPerEquityMostRecentFiscalYear || 0,
      },
      latestNewsUrls: data.recentNews.map((item) => ({ url: item?.url })),
      companyDescription:data.companyProfile.companyDescription
    };
  }


  private prepareFinancialChartData(financialData: FiscalData[]): {
    yearly: { year: string; revenue: number; profit: number; debt: number }[];
  } {
    // Helper function to extract value safely
    const getValueByKey = (items: FinancialItem[] | undefined, key: string): number =>
      items?.find((item) => item.key === key)?.value ? parseFloat(items.find((item) => item.key === key)?.value || '0') : 0;
  
    // Process financial data
    const chartData = financialData.reduce(
      (yearlyData, data) => {
        const { INC, BAL } = data.stockFinancialMap || {};
        const revenue = getValueByKey(INC, 'Revenue');
        const profit = getValueByKey(INC, 'NetIncome');
        const debt = getValueByKey(BAL, 'TotalDebt');
  
        if (data.Type === 'Annual') {
          yearlyData.push({ year: data.FiscalYear, revenue, profit, debt });
        }
  
        return yearlyData;
      },
      [] as { year: string; revenue: number; profit: number; debt: number }[]
    );
  
    chartData.sort((a, b) => parseInt(a.year) - parseInt(b.year));
  
    return { yearly: chartData };
  }
  
  private sendCompanyDetailsToModel(companyName:string,latestNewsUrls: string): void {
    this._companyService.sendCompanyDetailsToModel(companyName,latestNewsUrls).subscribe( (res: {aiInsight:string}) =>{
       this.aiInsightResponse = res.aiInsight.replace(/\n/g, '<br>');
    },
    (error) => {
      console.error('Error getting AI response:', error);
    }
  );
  }
  getHtmlContent() {
    return marked(this.aiInsightResponse);
  }
  
  public captureScreen(companyName:string) {
    const element = document.getElementById('contentToConvert');
    if (!element) {
      console.error('Element not found');
      return;
    }

    html2canvas(element).then((canvas) => {
      // Set PDF options
      const imgWidth = 208;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const contentDataURL = canvas.toDataURL('image/png');

      const pdf = new jsPDF('p', 'mm', 'a4'); 
      let position = 0;

      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      pdf.save(`${companyName}.pdf`); 
    }).catch((error) => {
      console.error('Error generating PDF:', error);
    });
  }
}
