import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { of, Subject } from 'rxjs';
import { HomepageService } from '../services/homepage.service';
import { CompanyService } from '../services/company.service';
import { ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PrimeMgModule } from '../shared/primeng-module';


describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let mockHomepageService: jest.Mocked<HomepageService>;
  let mockCompanyService: jest.Mocked<CompanyService>;
  let mockRouter: jest.Mocked<Router>;
  let mockActivatedRoute: any;
  let routerEventsSubject: Subject<any>;

  beforeEach(async () => {
    routerEventsSubject = new Subject<any>();

    mockHomepageService = {
      getCompanies: jest.fn(),
    } as unknown as jest.Mocked<HomepageService>;

    mockCompanyService = {
      stateChanged: jest.fn(),
    } as unknown as jest.Mocked<CompanyService>;

    mockRouter = {
      events: routerEventsSubject.asObservable(),
      navigate: jest.fn(),
      createUrlTree: jest.fn(() => ({})), 
      serializeUrl: jest.fn(() => '/test-url'), 
    } as unknown as jest.Mocked<Router>;

    mockActivatedRoute = {
      snapshot: {
        firstChild: { params: { companyCode: null } },
        params: { companyCode: null },
      },
      params: of({}),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule,PrimeMgModule],
      providers: [
        { provide: HomepageService, useValue: mockHomepageService },
        { provide: CompanyService, useValue: mockCompanyService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    const fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    component.showSearchCompany = false;
    component.showAutocomplate = false;
    fixture.detectChanges();
  });

  afterEach(() => {
    routerEventsSubject.complete();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // it('should initialize the form and setup filtered options when a company code is present in the route', () => {
  //   mockActivatedRoute.snapshot.firstChild.params['companyCode'] = 'ABC123';

  //   component['checkRouteForCompanyCode']();

  //   expect(component.showSearchCompany).toBe(true);
  //   expect(component.companyFormGroup).toBeDefined();
  //   expect(component.filteredOptions$).toBeDefined();
  // });

  // it('should hide the search company field when no company code is in the route', () => {
  //   mockActivatedRoute.snapshot.firstChild.params['companyCode'] = null;

  //   component['checkRouteForCompanyCode']();

  //   expect(component.showSearchCompany).toBe(false);
  // });

  it('should set filtered options on keyword input changes', () => {
    mockHomepageService.getCompanies.mockReturnValue(of([{ _id: '1', issuerName: 'Test Company', securityId: 'ABC123' }]));

    component['initForm']();
    component['setupFilteredOptions']();

    const keywordControl = component.companyFormGroup?.get('keyword');
    keywordControl?.setValue('Test');

    component.filteredOptions$?.subscribe((options) => {
      expect(mockHomepageService.getCompanies).toHaveBeenCalledWith('Test');
      expect(options).toEqual([{ _id: '1', issuerName: 'Test Company', securityId: 'ABC123' }]);
    });
  });

  it('should unsubscribe from observables on destroy', () => {
    const destroySpy = jest.spyOn(component['destroy$'], 'next');
    const completeSpy = jest.spyOn(component['destroy$'], 'complete');

    component.ngOnDestroy();

    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should handle empty keyword input gracefully', () => {
    mockHomepageService.getCompanies.mockReturnValue(of([]));

    component['initForm']();
    component['setupFilteredOptions']();

    const keywordControl = component.companyFormGroup?.get('keyword');
    keywordControl?.setValue('');

    component.filteredOptions$?.subscribe((options) => {
      expect(mockHomepageService.getCompanies).not.toHaveBeenCalled();
      expect(options).toEqual([]);
    });
  });

  it('should react to NavigationEnd event', () => {
    const spy = jest.spyOn(component, 'checkRouteForCompanyCode');
    routerEventsSubject.next(new NavigationEnd(1, '/test', '/test'));

    expect(spy).toHaveBeenCalled();
  });
});
