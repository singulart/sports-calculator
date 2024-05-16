import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    AgGridModule,
    NgIf
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  columnDefsOffensive: ColDef[] = [
    { field: 'off', headerName: 'Offensive', minWidth: 40, maxWidth: 100 },
    {
      field: 'avgPoints', headerName: "Avg. Points", minWidth: 40, maxWidth: 120,
      valueFormatter: params => params.value.toFixed(2),
      valueGetter: p => this.averagePoints(p.data.fgm, p.data.threepm)
    },
    { field: 'fgm', headerName: 'FGM', type: 'numericColumn', editable: true, maxWidth: 70, resizable: false },
    { field: 'fga', headerName: 'FGA', type: 'numericColumn', editable: true, maxWidth: 70, resizable: false },
    { field: 'threepm', headerName: '3PM', type: 'numericColumn', editable: true, maxWidth: 70, resizable: false },
    { field: 'threepa', headerName: '3PA', type: 'numericColumn', editable: true, maxWidth: 70, resizable: false },
    {
      field: 'fgPct', headerName: 'FG %', type: 'numericColumn', maxWidth: 90, resizable: false,
      valueFormatter: params => params.value.toFixed(2),
      valueGetter: p => this.fgPercentage(p.data.fgm, p.data.fga)
    },
    {
      field: 'psm', headerName: 'PSM', type: 'numericColumn', maxWidth: 90, resizable: false,
      valueFormatter: params => params.value.toFixed(2),
      valueGetter: p => this.psm(p.data.fgm, p.data.threepm)
    },
    { field: 'ftm', headerName: 'Free Throws Made', type: 'numericColumn', editable: true, maxWidth: 170, resizable: false }
  ];

  columnDefsDefensive: ColDef[] = [
    { field: 'def', headerName: 'Defensive', minWidth: 40, maxWidth: 120 },
    {
      field: 'avgPoints', headerName: "Avg. Points", minWidth: 40, maxWidth: 120,
      valueFormatter: params => params.value.toFixed(2),
      valueGetter: p => this.averagePoints(p.data.fgm, p.data.threepm)
    },
    { field: 'fgm', headerName: 'FGM', type: 'numericColumn', editable: true, maxWidth: 70, resizable: false },
    { field: 'fga', headerName: 'FGA', type: 'numericColumn', editable: true, maxWidth: 70, resizable: false },
    { field: 'threepm', headerName: '3PM', type: 'numericColumn', editable: true, maxWidth: 70, resizable: false },
    { field: 'threepa', headerName: '3PA', type: 'numericColumn', editable: true, maxWidth: 70, resizable: false },
    {
      field: 'fgPct', headerName: 'FG %', type: 'numericColumn', maxWidth: 90, resizable: false,
      valueFormatter: params => params.value.toFixed(2),
      valueGetter: p => this.fgPercentage(p.data.fgm, p.data.fga)
    },
    {
      field: 'psm', headerName: 'PSM', type: 'numericColumn', maxWidth: 90, resizable: false,
      valueFormatter: params => params.value.toFixed(2),
      valueGetter: p => this.psm(p.data.fgm, p.data.threepm)
    }
  ];

  rowDataOffensive = [
    { off: 'Team 1', fgm: 47, fga: 92.7, threepm: 13.2, threepa: 35.3, ftm: 16.1 },
    { off: 'Team 2', fgm: 41.3, fga: 88.7, threepm: 13.2, threepa: 35.8, ftm: 17.0 }
  ];

  rowDataDefensive = [
    { def: 'Team 1', fgm: 44.5, fga: 89.8, threepm: 10.7, threepa: 29.3 },
    { def: 'Team 2', fgm: 40.3, fga: 85.7, threepm: 12.5, threepa: 34.3 }
  ];

   //////////////////////// RESULT TABLES ///////////////////////////////////

   resultColumnDefsOffensiveShotsMade: ColDef[] = [
    { field: 'off', minWidth: 100, maxWidth: 180, resizable: false },
    { field: 'value', maxWidth: 100, resizable: false },
    { field: 'pct', maxWidth: 100, resizable: false },
  ];

  resultRowDataOffensiveShotsMade = [
    { off: 'Offensive Shots Made', value: 0.042, pct: 99.96 },
    { off: 'Team 1', value: 0.780, pct: 81.37 },
    { off: 'Team 2', value: 0.178, pct: 18.63 }
  ];

  resultColumnDefsDefensiveShotsAllowed: ColDef[] = [
    { field: 'def', minWidth: 100, maxWidth: 180, resizable: false },
    { field: 'value', maxWidth: 100, resizable: false },
    { field: 'pct', maxWidth: 100, resizable: false },
  ];

  resultRowDataDefensiveShotsAllowed = [
    { def: 'Defensive Shots Allowed', value: 0.042, pct: 99.96 },
    { def: 'Team 1', value: 0.780, pct: 81.37 },
    { def: 'Team 2', value: 0.178, pct: 18.63 }
  ];

  resultColumnDefsTotals: ColDef[] = [
    { field: 'tot', minWidth: 100, maxWidth: 180, resizable: false },
    { field: 'value', maxWidth: 100, resizable: false },
    { field: 'pct', maxWidth: 100, resizable: false },
  ];

  resultRowDataTotals = [
    { tot: 'Total Points', value: "OFF", pct: "DEF" },
    { tot: 'Team 1', value: 73.34, pct: 29.67 },
    { tot: 'Team 2', value: 26.62, pct: 70.29 }
  ];

  //////////////////////// END OF RESULT TABLES ///////////////////////////////////
 
  calculateBtnPressed = false
  bigTablesReady = false

  calculate = () => {
    console.log('Calculate started')
    this.calculateBtnPressed = true
    this.prepareBigTables()
      .then(result1 => {
        this.calculateBtnPressed = false
        this.bigTablesReady = true
      })
      .catch(error => {
        this.calculateBtnPressed = false        
        console.error('An error occurred:', error);
      });    
  }


  prepareBigTables(): Promise<string> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve('Slow function complete');
      }, 2000); // Simulates a 2-second task
    });
  }


  psm = (fgm: number, threepm: number) => {
    return this.averagePoints(fgm, threepm) / fgm
  }

  averagePoints = (fgm: number, threepm: number) => {
    return 2 * (fgm - threepm) + 3 * threepm
  }

  fgPercentage = (fgm: number, fga: number) => {
    return fga > 0 ? 100 * (fgm / fga) : 0;
  }

  factorial = (n: number): number => {
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  }

  binomialCoefficient = (n: number, k: number): number => {
    if (k > n) {
      return 0;
    }
    if (k === 0 || k === n) {
      return 1;
    }
    k = Math.min(k, n - k); // Take advantage of symmetry
    let coeff = 1;
    for (let i = 0; i < k; i++) {
      coeff *= (n - i) / (i + 1);
    }
    return coeff;
  }

  /**
   * Calculates the probability of achieving exactly `k` successes in `n` trials, given the probability of success `p` on a single trial.
   * 
   * @param n trials
   * @param k successes
   * @param p probability of a success on single trial
   * @returns 
   */
  binomialProbability = (n: number, k: number, p: number): number => {
    const binCoeff = this.binomialCoefficient(n, k);
    return binCoeff * Math.pow(p, k) * Math.pow(1 - p, n - k);
  }
}
