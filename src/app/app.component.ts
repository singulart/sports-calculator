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
    { field: 'off', headerName: 'Offensive', minWidth: 40, maxWidth: 100},
    { field: 'avgPoints', headerName: "Avg. Points", minWidth: 40, maxWidth: 120, 
      valueFormatter: params => params.value.toFixed(2), 
      valueGetter: p => this.averagePoints(p.data.fgm, p.data.threepm)
    }, 
    { field: 'fgm', headerName: 'FGM', type: 'numericColumn', editable: true, maxWidth: 70, resizable: false },
    { field: 'fga', headerName: 'FGA', type: 'numericColumn', editable: true, maxWidth: 70, resizable: false },
    { field: 'threepm', headerName: '3PM', type: 'numericColumn', editable: true, maxWidth: 70, resizable: false },
    { field: 'threepa', headerName: '3PA', type: 'numericColumn', editable: true, maxWidth: 70, resizable: false },
    { field: 'fgPct', headerName: 'FG %', type: 'numericColumn', maxWidth: 90, resizable: false, 
      valueFormatter: params => params.value.toFixed(2), 
      valueGetter: p => this.fgPercentage(p.data.fgm, p.data.fga) },
    { field: 'psm', headerName: 'PSM', type: 'numericColumn', maxWidth: 90, resizable: false, 
      valueFormatter: params => params.value.toFixed(2), 
      valueGetter: p => this.psm(p.data.fgm, p.data.threepm) },
    { field: 'ftm', headerName: 'Free Throws Made', type: 'numericColumn', editable: true, maxWidth: 170, resizable: false }
  ];

  columnDefsDefensive: ColDef[] = [
    { field: 'def', headerName: 'Defensive', minWidth: 40, maxWidth: 120 },
    { field: 'avgPoints', headerName: "Avg. Points", minWidth: 40, maxWidth: 120, 
      valueFormatter: params => params.value.toFixed(2), 
      valueGetter: p => this.averagePoints(p.data.fgm, p.data.threepm)}, 
    { field: 'fgm', headerName: 'FGM', type: 'numericColumn', editable: true, maxWidth: 70, resizable: false },
    { field: 'fga', headerName: 'FGA', type: 'numericColumn', editable: true, maxWidth: 70, resizable: false },
    { field: 'threepm', headerName: '3PM', type: 'numericColumn', editable: true, maxWidth: 70, resizable: false },
    { field: 'threepa', headerName: '3PA', type: 'numericColumn', editable: true, maxWidth: 70, resizable: false },
    { field: 'fgPct', headerName: 'FG %', type: 'numericColumn', maxWidth: 90, resizable: false, 
      valueFormatter: params => params.value.toFixed(2), 
      valueGetter: p => this.fgPercentage(p.data.fgm, p.data.fga) },
    { field: 'psm', headerName: 'PSM', type: 'numericColumn', maxWidth: 90, resizable: false, 
      valueFormatter: params => params.value.toFixed(2), 
      valueGetter: p => this.psm(p.data.fgm, p.data.threepm) }
  ];

  rowDataOffensive = [
    { off: 'Team 1', fgm: 47, fga: 92.7, threepm: 13.2, threepa: 35.3, ftm: 16.1 },
    { off: 'Team 2', fgm: 41.3, fga: 88.7, threepm: 13.2, threepa: 35.8, ftm: 17.0 }
  ];

  rowDataDefensive = [
    { def: 'Team 1', fgm: 44.5, fga: 89.8, threepm: 10.7, threepa: 29.3 },
    { def: 'Team 2', fgm: 40.3, fga: 85.7, threepm: 12.5, threepa: 34.3 }
  ];

  psm = (fgm: number, threepm: number) => this.averagePoints(fgm, threepm) / fgm
  averagePoints = (fgm: number, threepm: number) => 2 * (fgm - threepm) + 3*threepm
  fgPercentage = (fgm: number, fga: number) => fga > 0 ? 100 * (fgm / fga) : 0;

}
