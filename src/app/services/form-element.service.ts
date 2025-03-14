import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormElementService {
  private availableElements = [
    { type: 'text', name: 'Single Line Text', label: 'Single textarea',  image: '../../../assets/single.svg' },
    { type: 'textarea', name: 'Multi Line Text', label: 'Multi textarea', image: '../../../assets/multiline.svg' },
    { type: 'number', name: 'Integer', label: 'Integer type area', image: '../../../assets/integer.svg' },
    { type: 'date', name: 'Date', label: 'Select date from datepicker', image: '../../../assets/date.svg' },
    { type: 'time', name: 'Time', label: 'Select time from timepicker', image: '../../../assets/time.svg' },
    { type: 'datetime', name: 'Date & Time', label: 'Select date&time from picker', image: '../../../assets/datetime.svg' },
    { type: 'dropdown', name: 'Dropdown', label: 'Select single option', image: '../../../assets/dropdown.svg' },
    { type: 'radio', name: 'Single Selection', label: 'Select multiple options', image: '../../../assets/radio.svg' },
    { type: 'checkbox', name: 'Multi Selection', label: 'Select an option from dropdown', image: '../../../assets/checkbox.svg' },
    { type: 'file', name: 'File Upload', label: 'Upload documents/media files', image: '../../../assets/upload.svg' }
  ];

  private storageKey = 'formElements';

  getAvailableElements() {
    return this.availableElements;
  }

  getFieldElements(groupId: number): any[] {
    const allElements = JSON.parse(localStorage.getItem(this.storageKey) || '{}');
    return allElements[groupId] || [];
  }

  addElementToGroup(groupId: number, element: any) {
    const allElements = JSON.parse(localStorage.getItem(this.storageKey) || '{}');
    if (!allElements[groupId]) allElements[groupId] = [];
    allElements[groupId].push({ id: Date.now(), ...element });

    this.saveElements(allElements);
  }

  // updateElement(groupId: number, updatedElement: any) {
  //   const allElements = JSON.parse(localStorage.getItem(this.storageKey) || '{}');
  //   if (!allElements[groupId]) return;

  //   const index = allElements[groupId].findIndex((el: any) => el.id === updatedElement.id);
  //   if (index !== -1) {
  //     allElements[groupId][index] = { ...updatedElement };
  //     this.saveElements(allElements);
  //   }
  // }

  updateElement(groupId: number, updatedElement: any) {
    const allElements = JSON.parse(localStorage.getItem(this.storageKey) || '{}');
    if (!allElements[groupId]) return;
  
    const index = allElements[groupId].findIndex((el: any) => el.id === updatedElement.id);
    if (index !== -1) {
      allElements[groupId][index] = { ...updatedElement };
      this.saveElements(allElements);
    }
  }
  
  reorderElements(groupId: number, elements: any[]) {
    const allElements = JSON.parse(localStorage.getItem(this.storageKey) || '{}');
    allElements[groupId] = elements;
    this.saveElements(allElements);
  }

  saveElements(allElements: any) {
    localStorage.setItem(this.storageKey, JSON.stringify(allElements));
  }

  deleteElement(groupId: number, elementId: number) {
    const allElements = JSON.parse(localStorage.getItem(this.storageKey) || '{}');
    allElements[groupId] = allElements[groupId].filter((e: any) => e.id !== elementId);

    this.saveElements(allElements);
  }
}