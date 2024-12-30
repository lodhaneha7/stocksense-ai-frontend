import { TestBed } from '@angular/core/testing';
import { CompanyComponent } from './company.component';
import { CompanyService } from '../services/company.service';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { marked } from 'marked';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StockDetails } from '../interfaces/interface';

describe('CompanyComponent', () => {
  let component: CompanyComponent;
  let fixture: any;
  let companyServiceMock: any;
  let activatedRouteMock: any;

  beforeEach(() => {
    companyServiceMock = {
      fetchStockDetails: jest.fn(),
      fetchHistoricalData: jest.fn(),
      sendCompanyDetailsToModel: jest.fn(),
    };

    activatedRouteMock = {
      params: of({ companyCode: 'TCS' }), 
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: CompanyService, useValue: companyServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CompanyComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch company details on init', () => {
    const stockDetailsMock :StockDetails = {
      companyName: 'TCS',
      currentPrice: { NSE: '2000', BSE: '2005' },
      percentChange: '1.2%',
      yearHigh: '2200',
      yearLow: '1800',
      financials: [],
      recentNews: [{
        url: 'https://example.com/news',
        id: '',
        headline: '',
        date: '',
        timeToRead: '',
        listimage: '',
        thumbnailimage: ''
      }],
      companyProfile: {
        peerCompanyList: [{
          companyName: 'TCS', priceToBookValueRatio: 3.5,
          tickerId: '',
          priceToEarningsValueRatio: 0,
          marketCap: 0,
          price: 0,
          percentChange: 0,
          netChange: 0,
          returnOnAverageEquity5YearAverage: 0,
          returnOnAverageEquityTrailing12Month: 0,
          ltDebtPerEquityMostRecentFiscalYear: 0,
          netProfitMargin5YearAverage: 0,
          netProfitMarginPercentTrailing12Month: 0,
          dividendYieldIndicatedAnnualDividend: 0,
          totalSharesOutstanding: 0,
          languageSupport: '',
          imageUrl: '',
          overallRating: '',
          ylow: 0,
          yhigh: 0
        }],
        companyDescription: 'A leading IT company',
        mgIndustry: '',
        isInId: '',
        officers: undefined,
        exchangeCodeBse: '',
        exchangeCodeNse: ''
      },
      data: undefined,
      tickerId: '',
      industry: '',
      stockTechnicalData: undefined,
      keyMetrics: {},
      futureExpiryDates: [],
      futureOverviewData: {},
      initialStockFinancialData: {},
      analystView: [],
      recosBar: {
        stockAnalyst: [],
        tickerRatingValue: 0,
        isDataPresent: false,
        noOfRecommendations: 0,
        meanValue: 0,
        tickerPercentage: 0
      },
      riskMeter: {
        categoryName: '',
        stdDev: 0
      },
      shareholding: {
        categoryName: '',
        categories: []
      },
      stockCorporateActionData: undefined,
      stockDetailsReusableData: {
        close: '',
        date: '',
        time: '',
        price: '',
        percentChange: '',
        marketCap: '',
        yhigh: '',
        ylow: '',
        high: '',
        low: '',
        pPerEBasicExcludingExtraordinaryItemsTTM: '',
        currentDividendYieldCommonStockPrimaryIssueLTM: '',
        totalDebtPerTotalEquityMostRecentQuarter: '',
        priceYTDPricePercentChange: '',
        price5DayPercentChange: '',
        NetIncome: '',
        FiscalYear: '',
        interimNetIncome: '',
        stockAnalyst: [],
        peerCompanyList: [],
        sectorPriceToEarningsValueRatio: '',
        averageRating: ''
      },
      stockFinancialData: []
    };

    const expectedResult = {
      companyData: component['prepareStockAnalysisPayload'](stockDetailsMock),
      financialData: component['prepareFinancialChartData']([]),
    };

    companyServiceMock.fetchStockDetails.mockReturnValue(of(stockDetailsMock));

    fixture.detectChanges();

    component.companyDetails$.subscribe((result) => {
      expect(result).toEqual(expectedResult);
      expect(companyServiceMock.fetchStockDetails).toHaveBeenCalledWith('TCS');
    });
  });

  it('should handle errors while fetching company details', () => {
    companyServiceMock.fetchStockDetails.mockReturnValue(throwError('Error fetching details'));

    fixture.detectChanges();

    component.companyDetails$.subscribe({
      error: (err) => {
        expect(err).toBe('Error fetching details');
      },
    });

    expect(component.showNoRecordFound).toBeTruthy();
    expect(component.loader).toBeFalsy();
  });

  it('should fetch historical data for the stock', () => {
    const historicalDataMock = {
      datasets: [
        {
          metric: 'Price',
          values: [
            ['2024-01-01', '1000'],
            ['2024-01-02', '1010'],
          ],
        },
      ],
    };

    const expectedHistoricalData = [
      [new Date('2024-01-01').getTime(), 1000],
      [new Date('2024-01-02').getTime(), 1010],
    ];

    companyServiceMock.fetchHistoricalData.mockReturnValue(of(historicalDataMock));

    fixture.detectChanges();

   component['fetchHistoricalData']('TCS').subscribe((result) => {
      expect(result).toEqual(expectedHistoricalData);
      expect(companyServiceMock.fetchHistoricalData).toHaveBeenCalledWith('TCS');
    });
  });

  it('should send company details to the model and set AI insights', () => {
    const aiResponseMock = { aiInsight: 'This is a test insight.' };

    companyServiceMock.sendCompanyDetailsToModel.mockReturnValue(of(aiResponseMock));

    component['sendCompanyDetailsToModel']('TCS', 'https://example.com/news');

    expect(companyServiceMock.sendCompanyDetailsToModel).toHaveBeenCalledWith(
      'TCS',
      'https://example.com/news'
    );
    expect(component.aiInsightResponse).toBe(
      aiResponseMock.aiInsight.replace(/\n/g, '<br>')
    );
  });

  it('should convert AI insights to HTML content using marked', () => {
    component.aiInsightResponse = 'Test insight with **bold text**.';
    const htmlContent = component.getHtmlContent();

    expect(htmlContent).toBe(marked('Test insight with **bold text**.'));
  });
});
