import { TestBed } from '@angular/core/testing';
import { StockPriceChartComponent } from './stock-price-chart.component';
import * as Highcharts from 'highcharts';

describe('StockPriceChartComponent', () => {
  let component: StockPriceChartComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockPriceChartComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(StockPriceChartComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the stock chart on data change', () => {
    const mockData = [
      [Date.UTC(2023, 0, 1), 500],
      [Date.UTC(2023, 0, 2), 550],
      [Date.UTC(2023, 0, 3), 530],
    ];

    component.data = mockData;
    component.ngOnChanges({
      data: {
        currentValue: mockData,
        previousValue: [],
        firstChange: true,
        isFirstChange: () => true,
      },
    });

    expect(component.chartOptions).toBeDefined();
    expect((component.chartOptions.series?.[0] as any).data).toEqual(mockData);
    expect(component.chartOptions.title?.text).toBe('Annual Stock Price');
  });

  it('should set the xAxis to datetime type', () => {
    const mockData = [
      [Date.UTC(2023, 0, 1), 500],
      [Date.UTC(2023, 0, 2), 550],
    ];

    component.data = mockData;
    component.ngOnChanges({
      data: {
        currentValue: mockData,
        previousValue: [],
        firstChange: true,
        isFirstChange: () => true,
      },
    });

    expect((component.chartOptions?.xAxis as any)?.type).toBe('datetime');
    expect((component.chartOptions?.xAxis as any)?.title?.text).toBe('Date');
  });

  it('should set the yAxis title and label formatter', () => {
    const mockData = [
      [Date.UTC(2023, 0, 1), 500],
      [Date.UTC(2023, 0, 2), 550],
    ];

    component.data = mockData;
    component.ngOnChanges({
      data: {
        currentValue: mockData,
        previousValue: [],
        firstChange: true,
        isFirstChange: () => true,
      },
    });

    expect((component.chartOptions?.yAxis as any)?.title?.text).toBe('Price (₹)');
    const yAxisLabelsFormatter = (component.chartOptions?.yAxis as any)?.labels?.formatter;
    expect(yAxisLabelsFormatter?.call({ value: 500 })).toBe('₹500');
  });

  it('should not initialize the chart if data is not provided', () => {
    component.data = [];
    component.ngOnChanges({
      data: {
        currentValue: [],
        previousValue: [],
        firstChange: true,
        isFirstChange: () => true,
      },
    });
  
    expect(component.chartOptions).toBeUndefined();
  });
  
});
