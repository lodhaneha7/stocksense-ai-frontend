import { PrimeMgModule } from '../shared/primeng-module';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { catchError, debounceTime, map, Observable, of, startWith, switchMap } from 'rxjs';
import { AutoCompleteSelectEvent } from 'primeng/autocomplete';
import { HomepageService } from '../services/homepage.service';
import { CompanyListData } from '../interfaces/interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss',
  standalone: true,
  imports:[PrimeMgModule,ReactiveFormsModule]
})
export class HomePageComponent {
  companyFormGroup :FormGroup | undefined ;
  filteredOptions$: Observable<CompanyListData[]> | undefined; 
  private _homepageService = inject(HomepageService);
  private _router = inject(Router);
  showAutocomplate:boolean = true;

  ngOnInit(): void {
    this.companyFormGroup = new FormGroup(
      {
        keyword: new FormControl('')
      }
    )
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

  search(event:Partial<AutoCompleteSelectEvent>){
    this._router.navigate([`/company/${event.value.securityId}`]);
  }

}
