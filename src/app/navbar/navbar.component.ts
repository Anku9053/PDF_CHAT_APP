import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  @Output() componentChange = new EventEmitter<string>();

  showComponent(componentName: string) {
    this.componentChange.emit(componentName);
  }
}
