import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CompanyService } from './company.service';
import { environment } from '../../environments/environment';
import { StockDetails, StockPriceData } from '../interfaces/interface';

describe('CompanyService', () => {
  let service: CompanyService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CompanyService],
    });

    service = TestBed.inject(CompanyService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify(); // Ensure no outstanding HTTP requests
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });


  it('should fetch stock details for a given company code', () => {
    const mockStockDetails: Partial<StockDetails> = {
      companyName: 'RELIANCE',
     currentPrice: {
      BSE: "756",
      NSE: "755"
     }
    };

    service.fetchStockDetails('RELIANCE').subscribe((data) => {
      expect(data).toEqual(mockStockDetails);
    });

    const req = httpTestingController.expectOne(
      `${environment.indianStockAPiEndpoint}/stock?name=RELIANCE`
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('x-api-key')).toBe(environment.indianStockAPiKey);

    req.flush(mockStockDetails); // Respond with mock data
  });

  it('should fetch historical data for a given company code', () => {
    const mockHistoricalData: StockPriceData = {
        datasets: [{
            metric: "Price", 
            label: "Price on NSE", 
            values: [], 
            meta: {
                is_weekly:true
            } 
        }
        ]
    };

    service.fetchHistoricalData('RELIANCE').subscribe((data) => {
      expect(data).toEqual(mockHistoricalData);
    });

    const req = httpTestingController.expectOne(
      `${environment.indianStockAPiEndpoint}/historical_data?stock_name=RELIANCE&period=1yr&filter=price`
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('x-api-key')).toBe(environment.indianStockAPiKey);

    req.flush(mockHistoricalData); // Respond with mock data
  });

  it('should send company details to the model and return AI insight', () => {
    const mockResponse = { aiInsight: 'The company is performing well' };
    const companyName = 'RELIANCE';
    const latestNewsUrls = 'https://news.example.com/article1';

    service.sendCompanyDetailsToModel(companyName, latestNewsUrls).subscribe((data) => {
      expect(data).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(`${environment.baseUrl}/stock-api/analyze`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      companyName: companyName,
      latestNewsUrls: latestNewsUrls,
    });

    req.flush(mockResponse); // Respond with mock data
  });
});
