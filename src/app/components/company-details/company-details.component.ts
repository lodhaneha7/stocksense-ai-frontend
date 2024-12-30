import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CompanyData } from '../../interfaces/interface';
import { CurrencyPipe } from '@angular/common';
import { PrimeMgModule } from '../../shared/primeng-module';
import { SanitizeNumberPipe } from '../../pipes/sanitize-number.pipe';

@Component({
  selector: 'app-company-details',
  standalone: true,
  imports: [CurrencyPipe,PrimeMgModule,SanitizeNumberPipe],
  templateUrl: './company-details.component.html',
  styleUrl: './company-details.component.scss'
})
export class CompanyDetailsComponent {
  @Input('data') data : CompanyData | undefined;
  @Output('generatePdf') generatePdf: EventEmitter<boolean> = new EventEmitter<boolean>();
  isExpanded: boolean = false;
  toggleText() {
    this.isExpanded = !this.isExpanded;
  }

  isNegative(value: string): boolean {
    return parseFloat(value) < 0; 
  }
}
