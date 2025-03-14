import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FieldGroupService } from '../../services/field-group.service';
import { CommonModule } from '@angular/common';
import { FormElementPropertiesService } from '../../services/form-element-properties.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-left-pane',
  templateUrl: './left-pane.component.html',
  imports: [CommonModule, FormsModule],
  standalone: true
})
export class LeftPaneComponent implements OnInit {
  @Input() selectedGroupId: number | null = null;
  @Input() fieldGroups: any[] = [];
  @Output() groupSelected = new EventEmitter<number>();
  @Output() groupAdded = new EventEmitter<number>();
  isNewGroup: boolean = false;
  newGroupName: string = '';

  constructor(private fieldGroupService: FieldGroupService, private propertiesService: FormElementPropertiesService) {}

  ngOnInit() {
  }

  selectGroup(groupId: number) {
    this.selectedGroupId = groupId;
    this.groupSelected.emit(groupId);
    this.propertiesService.clearSelectedElement();
  }

  addGroup() {
    // const name = prompt('Enter group name:');
    if (this.newGroupName) {
      this.fieldGroupService.addFieldGroup(this.newGroupName, '');
      this.groupAdded.emit();
      this.newGroupName = '';
      this.isNewGroup = false;
    }
  }

  cancel(){
    this.isNewGroup = false;
    this.newGroupName = '';
  }

}