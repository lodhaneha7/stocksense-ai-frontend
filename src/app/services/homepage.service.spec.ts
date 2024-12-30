import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HomepageService } from './homepage.service';
import { environment } from '../../environments/environment';
import { CompanyListData } from '../interfaces/interface';

describe('HomepageService', () => {
  let service: HomepageService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HomepageService],
    });

    service = TestBed.inject(HomepageService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify(); // Ensure no outstanding HTTP requests
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch company list based on the given keyword', () => {
    const mockKeyword = 'RELIANCE';
    const mockResponse: CompanyListData[] = [
      { _id: '1', issuerName: 'Reliance Industries', securityId: 'RELIANCE' },
      { _id: '2', issuerName: 'Reliance Retail', securityId: 'RETAIL' },
    ];

    service.getCompanies(mockKeyword).subscribe((data) => {
      expect(data).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(
      `${environment.baseUrl}/stock-api/search?keyword=${mockKeyword}`
    );
    expect(req.request.method).toBe('GET');

    req.flush(mockResponse); // Respond with mock data
  });

  it('should handle empty responses gracefully', () => {
    const mockKeyword = 'UNKNOWN';
    const mockResponse: CompanyListData[] = [];

    service.getCompanies(mockKeyword).subscribe((data) => {
      expect(data).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(
      `${environment.baseUrl}/stock-api/search?keyword=${mockKeyword}`
    );
    expect(req.request.method).toBe('GET');

    req.flush(mockResponse); // Respond with empty data
  });

  it('should handle HTTP errors gracefully', () => {
    const mockKeyword = 'INVALID';
    const mockError = { status: 404, statusText: 'Not Found' };

    service.getCompanies(mockKeyword).subscribe(
      () => fail('Expected an error, not companies'),
      (error) => {
        expect(error.status).toBe(404);
        expect(error.statusText).toBe('Not Found');
      }
    );

    const req = httpTestingController.expectOne(
      `${environment.baseUrl}/stock-api/search?keyword=${mockKeyword}`
    );
    expect(req.request.method).toBe('GET');

    req.flush(null, mockError); // Simulate HTTP error
  });
});
