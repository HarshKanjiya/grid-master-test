import { ScrollingModule } from "@angular/cdk/scrolling";
import { HttpClient, HttpHeaders } from "@angular/common/http";
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
  dropdownMenu = [
    "SYSA",
    "wa",
    "cel",
    "JBO",
    "WAL",
    "VR",
    "BV",
    "JNP",
    "RLB",
    "FOP",
    "FMI",
    "DB",
    "SH",
    "EI",
    "TB",
    "KM",
    "MF",
    "KW",
    "MR",
    "AA",
    "CCFO",
    "UP",
    "JRS",
    "LAB",
    "IMB",
    "BR",
    "BR",
    "RPL",
    "BXB",
    "SAC",
    "MFP",
    "JXF",
    "TXA",
    "ASV",
    "DP",
    "ON",
    "str",
    "strd",
    "jb",
    "abcs",
    "abcr",
    "add2",
    "te14",
    "t111",
    "te",
    "ds",
    "44",
    "mr.",
    "abss",
    "GNR",
    "asd",
    "sdfd",
    "bnc",
    "HRP",
    "sada",
    "kj",
    "nl",
    "IR",
    "IRB",
    "ini",
    "rrr",
    "MRR",
    "init",
    "tttt",
    "DU",
    "GR91",
    "GR92",
    "Gr93",
    "ADP",
    "sss",
    "OP",
    "s",
    "Gr",
    "bca",
    "int",
    "JME",
    "Meht",
    "IS",
    "abcd",
    "rr",
    "tt",
    "TIN",
    "vv",
    "jk",
    "bhat",
    "LP",
    "Jm",
    "Shs",
    "a",
    "test",
    "etes",
    "EE",
    "vb"
  ]
  column = [
    { label: 'Checked', field: 'isSelected', isShow: true, style: 'width: 56px;', type: 'checkbox', className: 'alignCenter' },
    { label: 'Sample', field: 'sampleID', sortIndicator: true, isShow: true, isEdit: false, style: 'width: 100px;', readOnly: true },
    { label: 'Date', field: 'sourceDate', sortIndicator: true, isShow: true, isEdit: true, style: 'width: 100px', type: 'date', dateFormat: 'MM/DD/YYYY', correctFormat: true, allowInvalid: false },
    { label: 'Lot No.', field: 'lotNumber', isShow: true, isEdit: true, style: 'width: 100px' },
    { label: 'Sample Description', field: 'sampleDesc', isShow: true, isEdit: true, style: 'width: 192px' },

    { label: 'Hold', field: 'holds', isShow: true, isEdit: true, style: 'width: 100px' },
    { label: 'Test Description', field: 'testDesc', isShow: true, isEdit: false, style: 'width: 100px', readOnly: true },
    {
      label: 'Result', field: 'results', isShow: true, isEdit: true, style: 'width: 100px', type: 'numeric'
    },
    {
      label: 'Result Text', field: 'resultText', isShow: true, isEdit: true, style: 'width: 130px', type: 'dropdown', options: [
        "Analytical Error",
        "Instrument Out of Service",
        "Refinery Down",
        "TBD",
        "No Sample Collected",
        "Trucks Cancelled",
        "Instrument Not in Use",
        "N/A",
        "Refinery in Turnaround",
        "Barn Maintenance",
        "No Trucking Scheduled",
        "Under Maintenance",
        "Bright Yellow"
      ],
      allowInvalid: false
    },
    { label: 'Duplicate', field: 'dupeResults', isShow: true, isEdit: true, style: 'width: 100px' },

    {
      label: 'Analyzed By', field: 'analyzedBy', isShow: true, isEdit: true, style: 'width: 100px', type: 'dropdown', options: this.dropdownMenu,
      allowInvalid: false
    },
    {
      label: 'FinalTech By', field: 'finalTechBy', isShow: true, isEdit: true, style: 'width: 100px', type: 'dropdown', options: this.dropdownMenu,
      allowInvalid: false
    },
    { label: 'Analyzed On', field: 'analyzedOn', isShow: true, isEdit: true, style: 'width: 100px', type: 'date', dateFormat: 'MM/DD/YYYY', correctFormat: true, allowInvalid: false },
    { label: 'Billable', field: 'billingStatus', isShow: true, isEdit: true, style: 'width: 100px', type: 'checkbox', className: 'htCenter' },
    { label: 'Report', field: 'reportingStatus', isShow: true, isEdit: true, style: 'width: 100px', type: 'checkbox', className: 'htCenter' },
    { label: 'Split Bill', field: 'splitBilling', isShow: true, isEdit: true, style: 'width: 100px', type: 'checkbox', className: 'htCenter' },
    { label: 'Updated', field: 'updated', isShow: true, isEdit: true, style: 'width: 100px', type: 'checkbox', className: 'htCenter' },
    { label: 'Portal Sync', field: 'portalSyn', isShow: true, isEdit: true, style: 'width: 100px', type: 'checkbox', className: 'htCenter' },
    {
      label: 'Explanation', field: 'explanationForUpdate', isShow: true, isEdit: true, style: 'width: 100px', type: 'dropdown', options: [
        "Typographic Error",
        "Transposition Error",
        "Danger Averted",
        "Other",
        "Rerun - Internal - NC",
        "repeatability",
        "Reproducibility",
        "Recut - External - NC",
        "Recut - Internal - NC",
        "Client Request as per Third Party Contract",
        "Rerun - External - NC",
        "Rerun - Internal - C",
        "Rerun - External - C",
        "Recut - Internal - C",
        "Recut - External - C",
        "Hourly",
        "Hourly - R",
        "Hourly - r",
        "Recalculation"
      ],
      allowInvalid: false
    },
    {
      label: 'EquipID', field: 'equipID', isShow: true, isEdit: true, style: 'width: 100px', type: 'dropdown', options: [
        "CC001",
        "CC002",
        "CC003",
        "CC004",
        "CC005",
        "CC006",
        "CC007",
        "CC008",
        "CC009",
        "CC010",
        "CC011",
        "CC012",
        "CC013",
        "CC014",
        "CC015",
        "CC016",
        "CC017",
        "CC018",
        "CC019",
        "CC020",
        "CC021",
        "CC023",
        "CC024",
        "CC025",
        "CC026",
        "CC027",
        "CC028",
        "CC029",
        "CC030",
        "CC031",
        "CC032",
        "CC033",
        "CC034",
        "CC035",
        "CC036",
        "CC037",
        "CC038",
        "CC039",
        "CC040",
        "CC041",
        "CC042",
        "CC043",
        "CC044",
        "CC045",
        "CC046",
        "LB001",
        "LB002",
        "LB003",
        "LB004",
        "LB005",
        "LB006",
        "LB007",
        "LB008",
        "LB009",
        "LB010",
        "LB011",
        "LB012",
        "LB013",
        "LB014",
        "LB015",
        "LB016",
        "LB017",
        "LB018",
        "LB019",
        "LB020",
        "LB021",
        "LB022",
        "LB023",
        "LB024",
        "LB025",
        "LB026",
        "LB027",
        "LB028",
        "LB029",
        "LB030",
        "LB031",
        "LB032",
        "LB033",
        "LB035",
        "LB036",
        "LB037",
        "LB038",
        "LB039",
        "LB040",
        "LB041",
        "LB042",
        "LB043",
        "LB044",
        "LB045",
        "LB046",
        "LB047",
        "LB048",
        "LB049",
        "LB050",
        "LB051",
        "LB052",
        "LB053",
        "LB054",
        "LB055",
        "LB056",
        "LB057",
        "LB058",
        "LB059",
        "LB060",
        "LB062",
        "LB063",
        "LB064",
        "LB065",
        "LB066",
        "LB067",
        "LB068",
        "LB069",
        "LB070",
        "LB071",
        "LB072",
        "LB073",
        "LB074",
        "LB075",
        "LB076",
        "LB077",
        "LB078",
        "LB079",
        "LB080",
        "LB081",
        "LB082",
        "LB083",
        "LB084",
        "LB085",
        "LB086",
        "LB087",
        "LB088",
        "LB089",
        "LB090",
        "LB091",
        "LB092",
        "LB093",
        "LB094",
        "LB095",
        "LB096",
        "LB097",
        "LB098",
        "LB099",
        "LB100",
        "LB101",
        "LB102",
        "LB103",
        "LB104",
        "LB105",
        "LB106",
        "LB107",
        "LB108",
        "LB109",
        "LB110",
        "LB111",
        "LB112",
        "LB113",
        "LB114",
        "LB115",
        "LB116",
        "LB117",
        "LB118",
        "LB119",
        "LB120",
        "LB121",
        "LB122",
        "LB123",
        "LB124",
        "LB125",
        "LB126",
        "LB127",
        "LB128",
        "LB129",
        "LB130",
        "LB131",
        "LB132",
        "LB133",
        "LB134",
        "LB135",
        "LB136",
        "LB137",
        "LB138",
        "LB139",
        "LB140",
        "LB141",
        "LB142",
        "LB143",
        "LB144",
        "LB145",
        "LB146",
        "LB147",
        "LB148",
        "LB149",
        "LB150",
        "LB151",
        "LB152",
        "LB153",
        "LB154",
        "LB155",
        "LB156",
        "LB157",
        "LB158",
        "LB159",
        "LB160",
        "LB161",
        "LB162",
        "LB163",
        "LB164",
        "LB165",
        "LB166",
        "LB167",
        "LB168",
        "LB169",
        "LB170",
        "LB171",
        "LB172",
        "LB173",
        "LB174",
        "LB175",
        "LB176",
        "LB177",
        "LB178",
        "LB179",
        "LB180",
        "LB181",
        "LB182",
        "LB183",
        "LB184",
        "LB185",
        "LB186",
        "LB187",
        "LB188",
        "LB189",
        "LB190",
        "LB191",
        "LB192",
        "LB193",
        "LB194",
        "LB195",
        "LB196",
        "LB197",
        "LB198",
        "LB199",
        "LB200",
        "LB201",
        "LB202",
        "LB203",
        "LB204",
        "LB205",
        "LB206",
        "LB207",
        "LB208",
        "LB209",
        "LB210",
        "LB211",
        "LB212",
        "LB213",
        "LB214",
        "LB215",
        "LB216",
        "LB217",
        "LB218",
        "LB219",
        "LB220",
        "LB221",
        "LB222",
        "LB223",
        "LB224",
        "LB225",
        "LB226",
        "LB227",
        "LB228",
        "LB229",
        "LB230",
        "LB231",
        "LB232",
        "LB233",
        "LB234",
        "LB235",
        "LB236",
        "LB237",
        "LB238",
        "LB239",
        "LB240",
        "LB241",
        "LB242",
        "LB243",
        "LB244",
        "LB245",
        "LB246",
        "LB247",
        "LB248",
        "LB249",
        "LB250",
        "LB251",
        "LB252",
        "LB253",
        "LB254",
        "LB255",
        "LB256",
        "LB257",
        "LB258",
        "LB259",
        "LB260",
        "LB261",
        "LB262",
        "LB263",
        "LB264",
        "LB265",
        "LB266",
        "LV001",
        "LV002",
        "LV003",
        "LV004",
        "LV005",
        "LV006",
        "LV007",
        "LV008",
        "LV009",
        "ME010",
        "ME012",
        "ME013",
        "ME015",
        "ME018",
        "ME037",
        "ME040",
        "ME064",
        "ME074",
        "SS001",
        "SS002",
        "SS003",
        "SS004",
        "SS005",
        "SS006",
        "SS007",
        "SS008",
        "SS009",
        "SS010",
        "SS011",
        "SS012",
        "SS013",
        "SS014",
        "SS015",
        "SS016",
        "SS017",
        "SS018",
        "SS019",
        "SS020",
        "SS021",
        "SS022",
        "SS023",
        "SS024",
        "SS025",
        "SS026",
        "SS027",
        "SS028",
        "SS029",
        "SS030",
        "SS031",
        "SS032",
        "SS033"
      ],
      allowInvalid: false
    },
    { label: 'Prep', field: 'isPrepLabProcessed', isShow: true, isEdit: true, style: 'width: 100px', type: 'checkbox', className: 'htCenter' },
    { label: 'Lab', field: 'isLabProcessed', isShow: true, isEdit: true, style: 'width: 100px', type: 'checkbox', className: 'htCenter' },
    { label: 'Outsourced', field: 'isOutSourced', isShow: true, isEdit: true, style: 'width: 100px', type: 'checkbox', className: 'htCenter' },
    {
      label: 'Lab of Record', field: 'labOfRecord', isShow: true, isEdit: true, style: 'width: 100px', type: 'dropdown', options: [
        "11155",
        "AHK - Holland",
        "AJE - CC",
        "AJE - LBC",
        "AJE - LVWA",
        "BP - HB",
        "eee",
        "eurofins",
        "fdsgdf",
        "ff",
        "G R Lab",
        "Geochemical Testing",
        "GeoTest",
        "gfhfg",
        "hg",
        "Intertek Allentown",
        "Jaymin Lab 1234 ok ok",
        "jbtest",
        "lab12379",
        "lab5",
        "labtest",
        "Lbs",
        "line ",
        "ltb",
        "Mccampbell Analytical",
        "McCreath Labs",
        "My lab",
        "N J Lab",
        "New lab",
        "newlab",
        "P66 Carbon Plant",
        "RAHUL",
        "Rain Carbon",
        "SAI Gulf - La Marqe",
        "SAI Gulf - Laplace",
        "Shree Lab",
        "sssss",
        "Standard Labs - IL",
        "test",
        "test lab",
        "testlab",
        "TestLAB1",
        "tlab",
        "ZoCal Thermal Analysis Laboratory"
      ],
      allowInvalid: false
    },
    { label: 'Data Sent', field: 'dataSent', isShow: true, isEdit: false, style: 'width: 100px', type: 'checkbox', className: 'htCenter', readOnly: true },
    { label: 'BP Data', field: 'dataSentToBP', isShow: true, isEdit: false, style: 'width: 100px', type: 'checkbox', className: 'htCenter', readOnly: true },
    { label: 'OrigData', field: 'origData', isShow: true, isEdit: false, style: 'width: 100px', readOnly: true },
    { label: 'Test Order', field: 'testOrder', isShow: true, isEdit: false, style: 'width: 100px', readOnly: true },
    { label: 'Test Method', field: 'testMethod', isShow: true, isEdit: false, style: 'width: 100px', readOnly: true },
    { label: 'Approved?', field: 'isApproved', isShow: true, isEdit: true, style: 'width: 100px', type: 'checkbox', className: 'htCenter' },
    { label: 'Approved By', field: 'approvedBy', isShow: true, isEdit: false, style: 'width: 100px', readOnly: true },
    { label: 'Approved On', field: 'approvedOn', isShow: true, isEdit: false, style: 'width: 100px', readOnly: true, type: 'date', dateFormat: 'MM/DD/YYYY', correctFormat: true, allowInvalid: false },
  ];

  sampleData = [
    // { sampleID: 1, sourceDate: '2024-06-24', lotNumber: 4, sampleDesc: 'Lorem text...', holds: '1,2,9,6', results: 9, resultlabel: "Refinery in Turnaround", analyzedBy: "wa", finalTechBy: 25, billingStatus: false, reportingStatus: false },
    // { sampleID: 2, sourceDate: '2022-12-01', lotNumber: 3, sampleDesc: 'Lorem text...', holds: '4,1,5,2,9', results: 6, resultlabel: 'Result Text field', analyzedBy: 39, finalTechBy: 96, billingStatus: true, reportingStatus: true },
    // { sampleID: 3, sourceDate: '2024-10-08', lotNumber: 4, sampleDesc: 'Lorem text...', holds: '6,9,1,3,5', results: 9, resultlabel: "Refinery in Turnaround", analyzedBy: 99, finalTechBy: "RLB", billingStatus: false, reportingStatus: false },
    // { sampleID: 4, sourceDate: '2024-10-06', lotNumber: 2, sampleDesc: 'Lorem text...', holds: '9,8,3', results: 10, resultlabel: 'Result Text field', analyzedBy: 16, finalTechBy: 31, billingStatus: true, reportingStatus: false },
    // { sampleID: 5, sourceDate: '2024-08-10', lotNumber: 8, sampleDesc: 'Lorem text...', holds: '8,6,4', results: 10, resultlabel: 'Result Text field', analyzedBy: 47, finalTechBy: 34, billingStatus: true, reportingStatus: false },
    // { sampleID: 6, sourceDate: '11-04-2024', lotNumber: 5, sampleDesc: 'Lorem text...', holds: '2,5,7', results: 5, resultlabel: 'Result Text field', analyzedBy: 45, finalTechBy: 98, billingStatus: true, reportingStatus: false },
    // { sampleID: 7, sourceDate: '04-24-2024', lotNumber: 4, sampleDesc: 'Lorem text...', holds: '3,2,1', results: 7, resultlabel: 'Result Text field', analyzedBy: 17, finalTechBy: 85, billingStatus: true, reportingStatus: false },
    // { sampleID: 8, sourceDate: '11-11-2024', lotNumber: 8, sampleDesc: 'Lorem text...', holds: '4,9,5,8,3', results: 8, resultlabel: 'Result Text field', analyzedBy: 70, finalTechBy: "RLB", billingStatus: false, reportingStatus: true },
    // { sampleID: 9, sourceDate: '01-27-2024', lotNumber: 9, sampleDesc: 'Lorem text...', holds: '6,1,5', results: 2, resultlabel: "Refinery in Turnaround", analyzedBy: "wa", finalTechBy: 19, billingStatus: true, reportingStatus: true },
    // { sampleID: 10, sourceDate: '08-03-2024', lotNumber: 10, sampleDesc: 'Lorem text...', holds: '4,7,3', results: 6, resultlabel: 'Result Text field', analyzedBy: 88, finalTechBy: 11, billingStatus: false, reportingStatus: false },
  ];

  data: IRow[] = [];
  isLoading: boolean = false;

  constructor(private readonly http: HttpClient) { }
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
    this.getAllItems();
  }

  async getAllItems() {
    try {
      this.isLoading = true;
      this.sampleData = [];
      var header = {
        headers: new HttpHeaders()
          .set('Authorization', `Bearer eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6IjQxIiwiVXNlck5hbWUiOiJPTiIsImV4cCI6MTc1NjQ0MTUwNCwiaXNzIjoiQUpFIiwiYXVkIjoiQUpFLUluZm8ifQ.dNMR28e3UklMv0qc1BupPt7jX0mcE8T1_wc0Tb-jPjY`)
      }

      const response = await this.http.get('http://dev.projecttree.in/aje-api/api/SampleResult?LabId=LB', header).toPromise();
      this.isLoading = false;
      if (response['success']) {
        this.sampleData = response['data']
      }
    } catch (err) {
      console.error(err)
    }
  }


  onDataChange(event: any) {
    console.log('event :>> ', event);
  }
}
