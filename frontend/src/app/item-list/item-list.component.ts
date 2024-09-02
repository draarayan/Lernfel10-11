import { Component } from '@angular/core';
import { Item } from './item-list.module';
import { ItemService } from './item-list.service';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css'],
  standalone: true,
})
export class ItemListComponent {
  items: Item[] = [];
  newItem: Item = { id: 0, name: '', description: '' };

  constructor(private itemService: ItemService) {
    this.itemService.getItems().subscribe((items: Item[]) => this.items = items);
  }

  updateName(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.newItem.name = inputElement.value;
  }

  updateDescription(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.newItem.description = inputElement.value;
  }

  addItem(): void {
    if (this.newItem.name && this.newItem.description) {
      this.newItem.id = this.items.length + 1;
      this.itemService.addItem(this.newItem).subscribe((item: Item) => {
        this.items.push(item);
        this.newItem = { id: 0, name: '', description: '' }; // Formular zurücksetzen
      });
    }
  }

  deleteItem(id: number): void {
    this.itemService.deleteItem(id).subscribe(() => {
      this.items = this.items.filter(item => item.id !== id); // Liste aktualisieren
    });
  }
}
