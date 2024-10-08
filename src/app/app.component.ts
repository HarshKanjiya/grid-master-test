import { ScrollingModule } from "@angular/cdk/scrolling";
import { Component } from '@angular/core';
import { IRow } from '../../projects/ngx-grid-master/src/lib/types/interfaces';
import { GridMaster } from '../../projects/ngx-grid-master/src/public-api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [GridMaster, ScrollingModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  // demo column
  column = [
    { label: 'Sample', field: 'sampleID', sortIndicator: true, style: 'width: 100px;', readOnly: true },
    { label: 'Date', field: 'sourceDate', sortIndicator: true, style: 'width: 100px', type: 'date', dateFormat: 'MM/DD/YYYY' },
    { label: 'Lot No.', field: 'lotNumber', style: 'width: 100px' },
    { label: 'Sample Description', field: 'sampleDesc', style: 'width: 192px' },

    { label: 'Hold', field: 'holds', style: 'width: 100px' },
    {
      label: 'Result', field: 'results', style: 'width: 100px', type: 'numeric'
    },
    {
      label: 'Result Text', field: 'resultText', style: 'width: 130px', type: 'dropdown', source: [],
      allowInvalid: false
    },
    {
      label: 'Analyzed By', field: 'analyzedBy', style: 'width: 100px', type: 'dropdown', source: [],
      allowInvalid: false
    },
    {
      label: 'FinalTech By', field: 'finalTechBy', style: 'width: 100px', type: 'dropdown', source: [],
      allowInvalid: false
    },
    { label: 'Billable', field: 'billingStatus', style: 'width: 100px', type: 'checkbox', className: 'htCenter' },
    { label: 'Report', field: 'reportingStatus', style: 'width: 100px', type: 'checkbox', className: 'htCenter' },
  ];
  sampleData = [
    { sampleID: 1, sourceDate: new Date('01-01-2024'), lotNumber: 5, sampleDesc: 'Loerm text...', holds: '1,2,3,5', results: 5, label: 'Result Text field', analyzedBy: 9, finalTechBy: 56, billingStatus: false, reportingStatus: true },
    { sampleID: 2, sourceDate: new Date('01-02-2024'), lotNumber: 8, sampleDesc: 'Loerm text field...', holds: '9,8,5', results: 9, label: 'Result Text field', analyzedBy: 48, finalTechBy: 8, billingStatus: true, reportingStatus: false },
  ];

  data: IRow[] = [];

  ngOnInit() {
    // for (let rowIndex = 0; rowIndex < 20; rowIndex++) {
    //   this.data.push({
    //     cells: [
    //       {
    //         type: "TEXT",
    //         value: `Person ${rowIndex + 1}`,
    //         readonly: false,
    //         style: {

    //         }
    //       },
    //       {
    //         type: "NUMBER",
    //         value: (10000 + rowIndex).toString(),
    //         readonly: true,
    //         style: {
    //         },
    //         format: "0,0" // Format as number with commas
    //       },
    //       {
    //         type: "DATE",
    //         value: `2024-10-${String(1 + rowIndex).padStart(2, "0")}`,
    //         readonly: false,
    //         style: {

    //         },
    //         format: "MM/dd/yyyy" // Date format
    //       },
    //       {
    //         type: "TIME",
    //         value: `0${8 + rowIndex}:30`,
    //         readonly: false,
    //         style: {

    //         },
    //         format: "HH:mm" // Time format
    //       },
    //       {
    //         type: "DATETIME",
    //         value: `2024-10-${String(1 + rowIndex).padStart(2, "0")}T${String(8 + rowIndex).padStart(2, "0")}:30:00`,
    //         readonly: false,
    //         style: {

    //         },
    //         format: "MM/dd/yyyy HH:mm:ss" // Datetime format
    //       },
    //       {
    //         type: "RADIO",
    //         value: "Option1",
    //         readonly: false,
    //         style: {

    //         },
    //         options: [
    //           { value: "Option1", label: "Option 1" },
    //           { value: "Option2", label: "Option 2" }
    //         ]
    //       },
    //       {
    //         type: "SELECT",
    //         value: `Choice${(rowIndex % 8) + 1}`,
    //         readonly: true,
    //         style: {

    //         },
    //         options: [
    //           { value: "Choice1", label: "Choice 1" },
    //           { value: "Choice2", label: "Choice 2" },
    //           { value: "Choice3", label: "Choice 3" },
    //           { value: "Choice4", label: "Choice 4" },
    //           { value: "Choice5", label: "Choice 5" },
    //           { value: "Choice6", label: "Choice 6" },
    //           { value: "Choice7", label: "Choice 7" },
    //           { value: "Choice8", label: "Choice 8" }
    //         ]
    //       },
    //       {
    //         type: "CHECKBOX",
    //         value: rowIndex % 2 ? true : false,
    //         readonly: true,
    //       }
    //     ]
    //   })

    // }
  }


  onDataChange(event: any) {
    console.log('event :>> ', event);
  }
}
