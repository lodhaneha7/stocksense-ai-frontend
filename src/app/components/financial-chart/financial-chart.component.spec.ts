import { TestBed } from '@angular/core/testing';
import { FinancialChartComponent } from './financial-chart.component';
import { YAxisOptions } from 'highcharts';

describe('FinancialChartComponent', () => {
  let component: FinancialChartComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinancialChartComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(FinancialChartComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the chart with correct data', () => {
    const mockData = {
      yearly: [
        { year: '2021', revenue: 500, profit: 100, debt: 200 },
        { year: '2022', revenue: 600, profit: 150, debt: 250 },
      ],
    };

    component.data = mockData;
    component.ngOnInit();

    expect(component.yearlyChartOptions).toBeDefined();
    expect((component.yearlyChartOptions.series?.[0] as any).data).toEqual([500, 600]); 
    expect((component.yearlyChartOptions.series?.[1]  as any).data).toEqual([100, 150]); 
    expect((component.yearlyChartOptions.series?.[2]  as any).data).toEqual([200, 250]); 
    expect((component.yearlyChartOptions.xAxis as any)?.categories).toEqual(['2021', '2022']); 
  });

  it('should set chart options correctly', () => {
    const mockData = {
      yearly: [
        { year: '2021', revenue: 400, profit: 50, debt: 100 },
      ],
    };

    component.data = mockData;
    component.ngOnInit();

    expect(component.yearlyChartOptions?.title?.text).toBe('Annual Performance');
    expect((component.yearlyChartOptions?.yAxis as YAxisOptions).title?.text).toBe('Values (in millions)');
    expect(component.yearlyChartOptions?.series?.[0].type).toBe('column'); 
    expect((component.yearlyChartOptions?.series?.[1] as any).color).toBe('#58D68D'); 
    expect((component.yearlyChartOptions?.series?.[2] as any).color).toBe('#F1948A'); 
  });

  it('should not initialize the chart if no data is provided', () => {
    component.data = undefined;
    component.ngOnInit();

    expect(component.yearlyChartOptions).toBeUndefined();
  });
});
