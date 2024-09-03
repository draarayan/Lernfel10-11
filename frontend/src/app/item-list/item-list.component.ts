import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ItemService } from '../item.service';
import { Item } from '../item.model';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit {
  items: Item[] = []; // Deklaration der 'items'-Eigenschaft
  itemForm!: FormGroup; // Deklaration der 'itemForm'-Eigenschaft mit `!` zur Initialisierungssicherheit

  constructor(private fb: FormBuilder, private itemService: ItemService) {
    // Initialisiere das Formular im Konstruktor
    this.itemForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getItems();
  }

  getItems(): void {
    this.itemService.getItems().subscribe(data => this.items = data);
  }

  addItem(): void {
    if (this.itemForm.valid) {
      const newItem = this.itemForm.value;
      this.itemService.createItem(newItem).subscribe(item => {
        this.items.push(item);
        this.itemForm.reset();
      });
    }
  }

  deleteItem(id: number): void { // Stelle sicher, dass die Methode definiert ist
    this.itemService.deleteItem(id).subscribe(() => {
      this.items = this.items.filter(item => item.id !== id);
    });
  }
}
