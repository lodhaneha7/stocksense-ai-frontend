import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HomePageComponent } from './homepage.component';
import { HomepageService } from '../services/homepage.service';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { PrimeMgModule } from '../shared/primeng-module';
import { NO_ERRORS_SCHEMA, ViewEncapsulation } from '@angular/core';

describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let mockHomepageService: jest.Mocked<HomepageService>;
  let mockRouter: jest.Mocked<Router>;

  beforeEach(async () => {
    mockHomepageService = {
      getCompanies: jest.fn(),
    } as unknown as jest.Mocked<HomepageService>;

    mockRouter = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;



    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, PrimeMgModule],
      providers: [
        { provide: HomepageService, useValue: mockHomepageService },
        { provide: Router, useValue: mockRouter },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    

    const fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
    component.showAutocomplate = false;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form and filteredOptions$', () => {
    expect(component.companyFormGroup).toBeDefined();
    expect(component.filteredOptions$).toBeDefined();
  });

  it('should fetch companies when keyword changes', () => {
    const mockCompanies = [
      { _id: '1', issuerName: 'Company A', securityId: 'COMPANY_A' },
      { _id: '2', issuerName: 'Company B', securityId: 'COMPANY_B' },
    ];

    mockHomepageService.getCompanies.mockReturnValue(of(mockCompanies));

    component.companyFormGroup?.get('keyword')?.setValue('Company');
    component.filteredOptions$?.subscribe((options) => {
      expect(mockHomepageService.getCompanies).toHaveBeenCalledWith('Company');
      expect(options).toEqual(mockCompanies);
     
    });
  });

  it('should return an empty array on error while fetching companies', () => {
    mockHomepageService.getCompanies.mockReturnValue(
      throwError(() => new Error('Error fetching companies'))
    );

    component.companyFormGroup?.get('keyword')?.setValue('Invalid');
    component.filteredOptions$?.subscribe((options) => {
      expect(mockHomepageService.getCompanies).toHaveBeenCalledWith('Invalid');
      expect(options).toEqual([]);
    });
  });

  it('should navigate to the correct route on search', () => {
    const mockEvent = {
      value: { securityId: 'COMPANY_A' },
    };

    component.search(mockEvent);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/company/COMPANY_A']);
  });

  it('should handle empty keyword gracefully', () => {
    mockHomepageService.getCompanies.mockReturnValue(of([]));

    component.companyFormGroup?.get('keyword')?.setValue('');
    component.filteredOptions$?.subscribe((options) => {
      expect(mockHomepageService.getCompanies).not.toHaveBeenCalled();
      expect(options).toEqual([]);
    });
  });
});
