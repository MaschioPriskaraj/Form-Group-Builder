import { Component, OnInit } from '@angular/core';
import { FormElementPropertiesService } from '../../services/form-element-properties.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-right-drawer',
  templateUrl: './right-drawer.component.html',
  imports: [FormsModule, CommonModule],
  standalone: true
})
export class RightDrawerComponent implements OnInit {
  selectedElement: any = null;
  newOption: string = '';

  constructor(private propertiesService: FormElementPropertiesService) {}

  ngOnInit() {
    this.propertiesService.selectedElement$.subscribe((element: any) => {
      this.selectedElement = element;
    });
  }

  updateProperty(property: string, value: any) {
    this.propertiesService.updateElementProperty(property, value);
  }

  addOption() {
    if (this.newOption.trim()) {
      this.selectedElement.options = this.selectedElement.options || [];
      this.selectedElement.options.push(this.newOption.trim());
      this.newOption = ''; // Clear input
      this.updateProperty('options', this.selectedElement.options);
    }
  }

  removeOption(index: number) {
    this.selectedElement.options.splice(index, 1);
    this.updateProperty('options', this.selectedElement.options);
  }

  closeDrawer(){
    this.propertiesService.clearSelectedElement();
  }

}