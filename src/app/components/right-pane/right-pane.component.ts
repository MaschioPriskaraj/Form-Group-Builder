import { Component } from '@angular/core';
import { FormElementService } from '../../services/form-element.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-right-pane',
  templateUrl: './right-pane.component.html',
  imports: [CommonModule, FormsModule],
  standalone: true
})
export class RightPaneComponent {
  elements: any = [];
  searchTerm: string = '';
  filteredElements: any = [];

  constructor(private formElementService: FormElementService) {}

  ngOnInit() {
    this.elements = this.formElementService.getAvailableElements();
    this.filteredElements = this.elements;
  }

  filterElements(): void {
    this.filteredElements = this.elements.filter((element: any) =>
      element.name.toLowerCase().includes(this.searchTerm.toLowerCase()) || element.label.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  dragStart(event: DragEvent, element: any) {
    event.dataTransfer?.setData('text/plain', JSON.stringify(element));
  }
}
