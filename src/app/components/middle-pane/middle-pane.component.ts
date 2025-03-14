import { Component, Input, OnChanges, OnInit, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FormElementService } from '../../services/form-element.service';
import { CommonModule } from '@angular/common';
import { FormElementPropertiesService } from '../../services/form-element-properties.service';
import { FieldGroupService } from '../../services/field-group.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-middle-pane',
  templateUrl: './middle-pane.component.html',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  standalone: true
})
export class MiddlePaneComponent implements OnChanges {
  @Input() selectedGroupId: number | null = null;
  @Output() groupCleared = new EventEmitter<void>();
  
  elements: any[] = [];
  form!: FormGroup;
  fieldGroup: any;
  isGroupEdit: boolean = false;
  showPreview: boolean = false;

  constructor(private formElementService: FormElementService, private propertiesService: FormElementPropertiesService, private fieldGroupService: FieldGroupService, private fb: FormBuilder) {}

  ngOnInit() {
    this.propertiesService.selectedElement$.subscribe(updatedElement => {
      if (updatedElement) {
        // Find the element and update it
        const index = this.elements.findIndex(el => el.id === updatedElement.id);
        if (index !== -1) {
          this.elements[index] = { ...updatedElement }; // Update the card instantly
        }
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedGroupId'] && this.selectedGroupId !== null) {
      this.fieldGroup = this.fieldGroupService.getFieldGroupById(this.selectedGroupId);
      this.elements = this.formElementService.getFieldElements(this.selectedGroupId);
      this.createForm();
    }
  }

  createForm() {
    this.form = this.fb.group({});
    this.elements.forEach(element => {
      const control = this.fb.control(element.value || '', this.getValidators(element));
      this.form.addControl(element.name, control);
    });
  }

  getValidators(element: any) {
    const validators = [];
    console.log('Element', element);
    if (element.required) {
      validators.push(Validators.required);
    }
    // Add more validators based on element properties
    return validators;
  }

  deleteGroup(id: number) {
    this.fieldGroupService.deleteFieldGroup(id);
    if (this.selectedGroupId === id) {
      this.selectedGroupId = null; // Reset selection if deleted
      this.groupCleared.emit();
    }
    this.fieldGroup = null;
    this.elements = [];
  }

  updateGroupById(id: number, group: any) {
    this.fieldGroupService.updateFieldGroup(id, group);
    this.groupCleared.emit();
    this.isGroupEdit = false;
  }

  allowDrop(event: DragEvent) {
    event.preventDefault();
  }

  drop(event: DragEvent) {
    event.preventDefault();
    const elementData = event.dataTransfer?.getData('text/plain');
    if (elementData && this.selectedGroupId !== null) {
      const element = JSON.parse(elementData);
      this.formElementService.addElementToGroup(this.selectedGroupId, element);
      this.elements = this.formElementService.getFieldElements(this.selectedGroupId); // Update UI
    }
  }

  deleteElement(elementId: number) {
    if (this.selectedGroupId) {
      this.formElementService.deleteElement(this.selectedGroupId, elementId);
      this.elements = this.formElementService.getFieldElements(this.selectedGroupId); // Update UI
    }
  }

  editElement(element: any) {
    if (this.selectedGroupId !== null) {
      this.propertiesService.setSelectedElement(element, this.selectedGroupId);
    }
  }

  dragStart(event: DragEvent, element: any) {
    event.dataTransfer?.setData('application/json', JSON.stringify(element));
  }

  dropReorder(event: DragEvent, targetElement: any) {
    event.preventDefault();
    const draggedData = event.dataTransfer?.getData('application/json');
  
    if (draggedData) {
      const draggedElement = JSON.parse(draggedData);
  
      // Find the index of the dragged element
      const draggedIndex = this.elements.findIndex(el => el.id === draggedElement.id);
      const targetIndex = this.elements.findIndex(el => el.id === targetElement.id);
  
      if (draggedIndex !== -1 && targetIndex !== -1 && draggedIndex !== targetIndex) {
        // Remove the dragged element
        const [movedElement] = this.elements.splice(draggedIndex, 1);
  
        // Insert it at the target position
        this.elements.splice(targetIndex, 0, movedElement);
  
        // Save the reordered elements to localStorage
        if (this.selectedGroupId !== null) {
          this.formElementService.reorderElements(this.selectedGroupId, this.elements);
        }
      }
    }
  }
  
  copyElement(element: any) { console.log('Copy element', element); }

  previewForm() {
    this.showPreview = !this.showPreview;
  }
  
  onSubmit(){
    console.log(this.form.value, this.form.valid, this.form);
  }

  exportConfig() {
    const dataStr = JSON.stringify(this.elements, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileDefaultName = 'form-config.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }

  // importConfig() {
  //   const inputElement = document.createElement('input');
  //   inputElement.type = 'file';
  //   inputElement.accept = 'application/json';
  //   inputElement.onchange = (event: any) => {
  //     const file = event.target.files[0];
  //     if (file) {
  //       const reader = new FileReader();
  //       reader.onload = (e: any) => {
  //         const content = e.target.result;
  //         this.elements = JSON.parse(content);
  //         this.createForm();
  //       };
  //       reader.readAsText(file);
  //     }
  //   };
  //   inputElement.click();
  // }

  importConfig() {
    const inputElement = document.createElement('input');
    inputElement.type = 'file';
    inputElement.accept = 'application/json';
  
    inputElement.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file && this.selectedGroupId) { // Ensure a group is selected
        const reader = new FileReader();
  
        reader.onload = (e: any) => {
          const content = e.target.result;
          const importedElements = JSON.parse(content);
  
          // Update the elements array
          this.elements = importedElements;
  
          // Persist imported config in localStorage
          this.saveConfigToLocalStorage();
  
          // Rebuild the form after importing
          this.createForm();
        };
  
        reader.readAsText(file);
      }
    };
  
    inputElement.click();
  }
  
  saveConfigToLocalStorage() {
    if (this.selectedGroupId) {
      // Get existing form elements from localStorage
      const storedData = JSON.parse(localStorage.getItem("formElements") || "{}");
  
      // Update only the current group
      storedData[this.selectedGroupId] = this.elements;
  
      // Save back to localStorage
      localStorage.setItem("formElements", JSON.stringify(storedData));
    }
  }
  
  getFieldElementsFromStorage() {
    if (this.selectedGroupId) {
      // Retrieve stored form elements from localStorage
      const storedData = JSON.parse(localStorage.getItem("formElements") || "{}");
  
      // Load elements for the selected group
      this.elements = storedData[this.selectedGroupId] || [];
    }
  }

}