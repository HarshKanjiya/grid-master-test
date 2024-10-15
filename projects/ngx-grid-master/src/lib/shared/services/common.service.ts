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

}
