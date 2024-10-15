import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private openDropdowns = new Subject<any>();

  constructor() { }


  closeAllDropdowns(currentDropdown: any) {
    this.openDropdowns.next(currentDropdown);
  }

  getDropdownState() {
    return this.openDropdowns.asObservable();
  }

  sortByKey(array: any[], key: string, order: 'asc' | 'desc' = 'asc'): any[] {
    if (!array || !Array.isArray(array)) return []; // Ensure the input is valid

    return array.sort((a, b) => {
      const aValue = String(a[key]); // Convert to string
      const bValue = String(b[key]); // Convert to string

      // Determine the comparison result based on the order
      const comparison = aValue.localeCompare(bValue);

      // Return comparison based on the desired order
      return order === 'asc' ? comparison : -comparison;
    });
  }


}
