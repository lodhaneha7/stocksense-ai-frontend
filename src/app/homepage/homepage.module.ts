import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './homepage.component';
import { HomepageService } from '../services/homepage.service';


const routes: Routes = [
  {
    path: '',
    component: HomePageComponent 
  }
];

@NgModule({
  imports: [CommonModule, HomePageComponent, RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers:[HomepageService]
})
export class HomepageModule { }
