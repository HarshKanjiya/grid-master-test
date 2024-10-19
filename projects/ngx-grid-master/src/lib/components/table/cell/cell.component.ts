import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-cell',
  standalone: true,
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.css']
})
export class CellComponent implements OnInit {

  constructor() { }
  @Input() data: any
  ngOnInit() {
    // debugger
  }

}
