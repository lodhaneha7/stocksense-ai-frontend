import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent, 
    children: [
      {
        path: 'home',
        loadChildren: () => import('./homepage/homepage.module').then(m => m.HomepageModule)
      },
      {
        path: 'company/:companyCode',
        loadChildren: () => import('./company/company.module').then(m => m.CompanyModule)
      },
      { path: '', redirectTo: 'home', pathMatch: 'full' }, 
    ]
  },
  { path: '**', redirectTo: '' } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
