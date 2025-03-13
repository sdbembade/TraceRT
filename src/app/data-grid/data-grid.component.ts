import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridOptions } from 'ag-grid-community';

@Component({
  selector: 'app-data-grid', 
  templateUrl: './data-grid.component.html',
  styleUrls: ['./data-grid.component.scss']
})
export class DataGridComponent implements OnInit  {
  @ViewChild('agGrid') agGrid!: AgGridAngular;
  
  apiUrl = 'http://localhost:3000/rules';
  rowData: any[] = []; 

  columnDefs: ColDef[] = [
    { field: 'ruleName', headerName: 'Rule Name', sortable: true, filter: 'agTextColumnFilter', checkboxSelection: true },
    { field: 'type', headerName: 'Type', sortable: true, filter: 'agTextColumnFilter' },
    { field: 'subType', headerName: 'Sub Type', sortable: true, filter: 'agTextColumnFilter' },
    { field: 'active', headerName: 'Active', sortable: true, filter: 'agSetColumnFilter', cellRenderer: (params: any) => params.value ? '✔️' : '❌' },
    { field: 'impacted', headerName: 'Impact Level', sortable: true, filter: 'agTextColumnFilter' },
    { field: 'favourite', headerName: 'Favourite', sortable: true, filter: 'agSetColumnFilter', cellRenderer: (params:any) => params.value ? '⭐' : '' },
    { field: 'scheduled', headerName: 'Scheduled', sortable: true, filter: 'agSetColumnFilter' },
    { field: 'lastScheduledDate', headerName: 'Last Scheduled Date', sortable: true, filter: 'agDateColumnFilter' },
    { field: 'alert', headerName: 'Alert', sortable: true, filter: 'agTextColumnFilter' }
  ];

  gridOptions: GridOptions = {
    rowSelection: 'multiple',
  };

  formData = {
    ruleName: '',
    type: '',
    subType: '',
    active: false,
    impacted: '',
    favourite: false,
    scheduled: false,
    lastScheduledDate: '',
    alert: ''
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadRules();
  }

  // Fetch data from API
  loadRules() {
    this.http.get<any[]>(this.apiUrl).subscribe(
      data => this.rowData = data,
      error => console.error('Error fetching data:', error)
    );
  }

  // Save new data
  onFormSubmit() {
    this.http.post<any>(this.apiUrl, this.formData).subscribe(
      (newRule) => {
        this.rowData = [...this.rowData, newRule];
        console.log('New rule added:', newRule);
      },
      error => console.error('Error saving data:', error)
    );
  }
}
