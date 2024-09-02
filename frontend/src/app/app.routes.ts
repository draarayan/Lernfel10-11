import { Routes } from '@angular/router';
import { ItemListComponent } from './item-list/item-list.component';

export const routes: Routes = [
  { path: 'items', component: ItemListComponent },
  { path: '', redirectTo: '/items', pathMatch: 'full' }
];
