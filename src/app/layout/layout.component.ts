import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { PrimeMgModule } from '../shared/primeng-module';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { catchError, debounceTime, filter, map, Observable, of, startWith, switchMap, Subject, takeUntil } from 'rxjs';
import { HomepageService } from '../services/homepage.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CompanyListData } from '../interfaces/interface';
import { AutoCompleteSelectEvent } from 'primeng/autocomplete';
import { CompanyService } from '../services/company.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [PrimeMgModule, ReactiveFormsModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  providers: [HomepageService]
})
export class LayoutComponent implements OnInit, OnDestroy {
  private _homepageService = inject(HomepageService);
  private _activatedRoute = inject(ActivatedRoute);
  private _router = inject(Router);
  showAutocomplate:boolean =true;
  companyFormGroup: FormGroup | undefined;
  filteredOptions$: Observable<CompanyListData[]> | undefined;
  showSearchCompany: boolean = false;

  private destroy$ = new Subject<void>(); 

  ngOnInit(): void {
    this._router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.destroy$) 
      )
      .subscribe(() => {
        this.checkRouteForCompanyCode();
      });

    this._activatedRoute.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.checkRouteForCompanyCode();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete(); 
  }

   checkRouteForCompanyCode(): void {
    const companyCode =
      this._activatedRoute.snapshot.firstChild?.params['companyCode'] ||
      this._activatedRoute.snapshot.params['companyCode'];

    if (companyCode) {
      this.showSearchCompany = true;
      this.initForm();
      this.setupFilteredOptions();
    } else {
      this.showSearchCompany = false;
    }
  }

  private initForm(): void {
    this.companyFormGroup = new FormGroup({
      keyword: new FormControl(''),
    });
  }

  private setupFilteredOptions(): void {
    this.filteredOptions$ = this.companyFormGroup?.get('keyword')?.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      map((value: string) => (typeof value === 'string' ? value.trim() : '')),
      switchMap((value: string) =>
        value
          ? this._homepageService.getCompanies(value).pipe(
              catchError(() => of([]))
            )
          : of([]) 
      )
    );
  }

  search(event: AutoCompleteSelectEvent): void {
    this._router.navigate([`/company/${event.value.securityId}`]);
  }
}
