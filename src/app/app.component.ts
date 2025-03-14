import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LeftPaneComponent } from './components/left-pane/left-pane.component';
import { RightPaneComponent } from './components/right-pane/right-pane.component';
import { MiddlePaneComponent } from './components/middle-pane/middle-pane.component';
import { RightDrawerComponent } from './components/right-drawer/right-drawer.component';
import { FieldGroupService } from './services/field-group.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LeftPaneComponent, RightPaneComponent, MiddlePaneComponent, RightDrawerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'form-builder';
  selectedGroupId: any = null;
  fieldGroups: any[] = [];

  constructor(private fieldGroupService: FieldGroupService) {
    this.getFieldGroups();
  }
  
  getFieldGroups(){
    this.fieldGroups = this.fieldGroupService.getFieldGroups();
  }

  groupCleared(){
    this.selectedGroupId = null;
    this.getFieldGroups();
  }
  
}
