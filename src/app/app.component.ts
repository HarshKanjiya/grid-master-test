import { Component } from '@angular/core';
import { GridMaster } from '../../projects/ngx-grid-master/src/public-api';
import { IRow } from '../../projects/ngx-grid-master/src/lib/types/interfaces';
import { ScrollingModule } from "@angular/cdk/scrolling"

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [GridMaster, ScrollingModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  data: IRow[] = [];

  ngOnInit() {
    for (let rowIndex = 0; rowIndex < 20; rowIndex++) {
      this.data.push({
        cells: [
          {
            type: "TEXT",
            value: `Person ${rowIndex + 1}`,
            readonly: false,
            style: {

            }
          },
          {
            type: "NUMBER",
            value: (10000 + rowIndex).toString(),
            readonly: true,
            style: {
            },
            format: "0,0" // Format as number with commas
          },
          {
            type: "DATE",
            value: `2024-10-${String(1 + rowIndex).padStart(2, "0")}`,
            readonly: false,
            style: {

            },
            format: "MM/dd/yyyy" // Date format
          },
          {
            type: "TIME",
            value: `0${8 + rowIndex}:30`,
            readonly: false,
            style: {

            },
            format: "HH:mm" // Time format
          },
          {
            type: "DATETIME",
            value: `2024-10-${String(1 + rowIndex).padStart(2, "0")}T${String(8 + rowIndex).padStart(2, "0")}:30:00`,
            readonly: false,
            style: {

            },
            format: "MM/dd/yyyy HH:mm:ss" // Datetime format
          },
          {
            type: "RADIO",
            value: "Option1",
            readonly: false,
            style: {

            },
            options: [
              { value: "Option1", label: "Option 1" },
              { value: "Option2", label: "Option 2" }
            ]
          },
          {
            type: "SELECT",
            value: `Choice${(rowIndex % 3) + 1}`,
            readonly: true,
            style: {

            },
            options: [
              { value: "Choice1", label: "Choice 1" },
              { value: "Choice2", label: "Choice 2" },
              { value: "Choice3", label: "Choice 3" }
            ]
          }
        ]
      })

    }
  }


  onDataChange(event: any) {
    console.log('event :>> ', event);
  }
}
