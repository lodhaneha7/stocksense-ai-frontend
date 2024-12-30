import { TestBed } from '@angular/core/testing';
import { CurrencyPipe } from '@angular/common';
import { CompanyDetailsComponent } from './company-details.component';
import { SanitizeNumberPipe } from '../../pipes/sanitize-number.pipe';
import { PrimeMgModule } from '../../shared/primeng-module';
import { CompanyData } from '../../interfaces/interface';

describe('CompanyDetailsComponent', () => {
  let component: CompanyDetailsComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrencyPipe, PrimeMgModule, SanitizeNumberPipe, CompanyDetailsComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(CompanyDetailsComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle `isExpanded` state when `toggleText` is called', () => {
    expect(component.isExpanded).toBe(false);
    component.toggleText();
    expect(component.isExpanded).toBe(true);
    component.toggleText();
    expect(component.isExpanded).toBe(false);
  });

  it('should return true for a negative value in `isNegative`', () => {
    expect(component.isNegative('-10')).toBe(true);
  });

  it('should return false for a positive value in `isNegative`', () => {
    expect(component.isNegative('10')).toBe(false);
  });

  it('should set input data correctly', () => {
    const mockData: CompanyData = {
      companyName: 'Test Company',
      currentPrice: { BSE: '100', NSE: '200' },
      percentChange: '-5',
      yearHigh: '300',
      yearLow: '50',
      valuation: {
        priceToBookValueRatio: 1.5,
        priceToEarningsValueRatio: 20,
        marketCap: 100000,
      },
      profitability: {
        returnOnEquity: 15,
        netProfitMargin: 10,
      },
      dividend: { yield: 2 },
      debt: { debtToEquity: 0.5 },
    };

    component.data = mockData;
    expect(component.data?.companyName).toBe('Test Company');
    expect(component.data?.percentChange).toBe('-5');
  });
});
