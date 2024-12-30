import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CompanyListData } from '../interfaces/interface';

@Injectable({
  providedIn: 'root'
})
export class HomepageService {
  private _http = inject(HttpClient);

  getCompanies(keyword:string): Observable<CompanyListData[]> {
    return this._http.get<CompanyListData[]>(
        `${environment.baseUrl}/stock-api/search?keyword=${keyword}`
      );
  }
}
