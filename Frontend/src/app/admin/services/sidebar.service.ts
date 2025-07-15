import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  private sidebarState = new BehaviorSubject<boolean>(false);
  private dropdownStates: {[key: string]: boolean} = {};

  sidebarState$ = this.sidebarState.asObservable();

  toggleSidebar() {
    this.sidebarState.next(!this.sidebarState.value);
  }

  toggleDropdown(menuId: string) {
    this.dropdownStates[menuId] = !this.dropdownStates[menuId];
  }

  isDropdownOpen(menuId: string): boolean {
    return this.dropdownStates[menuId] || false;
  }

  closeAllDropdowns() {
    Object.keys(this.dropdownStates).forEach(key => {
      this.dropdownStates[key] = false;
    });
  }}
