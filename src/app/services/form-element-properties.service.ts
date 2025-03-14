import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FormElementService } from './form-element.service';

@Injectable({
  providedIn: 'root'
})
export class FormElementPropertiesService {
  private selectedElementSubject = new BehaviorSubject<any>(null);
  selectedElement$ = this.selectedElementSubject.asObservable();

  constructor(private formElementService: FormElementService) {} // Inject the FormElementService

  setSelectedElement(element: any, groupId: number) {
    element.groupId = groupId;
    this.selectedElementSubject.next(element);
  }

  updateElementProperty(property: string, value: any) {
    let currentElement = this.selectedElementSubject.value;
    if (currentElement) {
      currentElement[property] = value;
      this.selectedElementSubject.next(currentElement); // Notify all subscribers
  
      // Save the updated element to localStorage
      const groupId = currentElement.groupId;
      this.formElementService.updateElement(groupId, currentElement);
    }
  }

  clearSelectedElement() {
    this.selectedElementSubject.next(null);
  }
  
}