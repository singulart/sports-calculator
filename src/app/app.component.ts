import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    AgGridModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  columnDefsOffensive: ColDef[] = [
    { field: 'fgm', headerName: 'FGM', type: 'numericColumn', editable: true },
    { field: 'fga', headerName: 'FGA', type: 'numericColumn', editable: true },
    { field: 'threepm', headerName: '3PM', type: 'numericColumn', editable: true },
    { field: 'threepa', headerName: '3PA', type: 'numericColumn', editable: true },
    { field: 'ftm', headerName: 'Free Throws Made', type: 'numericColumn', editable: true }
  ];

  columnDefsDefensive: ColDef[] = [
    { field: 'fgm', headerName: 'FGM', type: 'numericColumn', editable: true },
    { field: 'fga', headerName: 'FGA', type: 'numericColumn', editable: true },
    { field: 'threepm', headerName: '3PM', type: 'numericColumn', editable: true },
    { field: 'threepa', headerName: '3PA', type: 'numericColumn', editable: true }
  ];

  rowDataOffensive = [
    { fgm: 0, fga: 0, threepm: 0, threepa: 0, ftm: 0 },
    { fgm: 0, fga: 0, threepm: 0, threepa: 0, ftm: 0 }
  ];

  rowDataDefensive = [
    { fgm: 0, fga: 0, threepm: 0, threepa: 0 },
    { fgm: 0, fga: 0, threepm: 0, threepa: 0 }
  ];
}
