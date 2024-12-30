
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { StockDetails, StockPriceData } from '../interfaces/interface';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private _http = inject(HttpClient);

  fetchStockDetails(companyCode: string): Observable<StockDetails> {
    const params = {
      name: companyCode, // e.g., "RELIANCE"
    };
    const headers = {
      'x-api-key': environment.indianStockAPiKey,
    };
  
    return this._http.get<any>(`${environment.indianStockAPiEndpoint}/stock`, {
      params,
      headers,
    });
  }

  fetchHistoricalData(companyCode: string): Observable<StockPriceData> {
    const params = {
      stock_name: companyCode,
      period: '1yr',
      filter:'price' 
    };
    const headers = {
      'x-api-key': environment.indianStockAPiKey,
    };
  
    return this._http.get<any>(`${environment.indianStockAPiEndpoint}/historical_data`, {
      params,
      headers,
    });
  }
  sendCompanyDetailsToModel(companyName:string,latestNewsUrls: string): Observable<{aiInsight:string}> {
    const payload = {
      companyName:companyName,
      latestNewsUrls:latestNewsUrls
    }
    return this._http.post<any>(
            `${environment.baseUrl}/stock-api/analyze`,payload
          );
        }
}
