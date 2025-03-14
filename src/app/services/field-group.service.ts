import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FieldGroupService {
  private storageKey = 'fieldGroups';

  getFieldGroups(): any[] {
    return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  }

  getFieldGroupById(id: any){
    return JSON.parse(localStorage.getItem(this.storageKey) ||`[]`).find((group: any) => group.id === id);
  }

  addFieldGroup(name: string, description: string) {
    const groups = this.getFieldGroups();
    groups.push({ id: Date.now(), name, description });
    localStorage.setItem(this.storageKey, JSON.stringify(groups));
  }

  updateFieldGroup(id: number, group: any) {
    const groups = this.getFieldGroups().map((g: any) => g.id === id ? group : g);
    localStorage.setItem(this.storageKey, JSON.stringify(groups));
  }

  deleteFieldGroup(id: number) {
    const groups = this.getFieldGroups().filter(group => group.id !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(groups));
  }
}