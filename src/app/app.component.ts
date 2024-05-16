import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef, GridApi } from 'ag-grid-community';

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

  private gridApiOffensive!: GridApi
  private gridApiDefensive!: GridApi

  columnDefsOffensive: ColDef[] = [
    { field: 'off', headerName: 'Offensive', minWidth: 40, maxWidth: 100 },
    {
      field: 'avgPoints', headerName: "Avg. Points", minWidth: 40, maxWidth: 100,
      valueFormatter: params => params.value.toFixed(2),
      valueGetter: p => this.averagePoints(p.data.fgm, p.data.threepm)
    },
    { field: 'fgm', headerName: 'FGM', type: 'numericColumn', editable: true, maxWidth: 70, resizable: false },
    { field: 'fga', headerName: 'FGA', type: 'numericColumn', editable: true, maxWidth: 70, resizable: false },
    { field: 'threepm', headerName: '3PM', type: 'numericColumn', editable: true, maxWidth: 70, resizable: false },
    { field: 'threepa', headerName: '3PA', type: 'numericColumn', editable: true, maxWidth: 70, resizable: false },
    {
      field: 'fgPct', headerName: 'FG %', type: 'numericColumn', maxWidth: 90, resizable: false,
      valueFormatter: params => (params.value * 100).toFixed(2),
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
      field: 'avgPoints', headerName: "Avg. Points", minWidth: 40, maxWidth: 100,
      valueFormatter: params => params.value.toFixed(2),
      valueGetter: p => this.averagePoints(p.data.fgm, p.data.threepm)
    },
    { field: 'fgm', headerName: 'FGM', type: 'numericColumn', editable: true, maxWidth: 70, resizable: false },
    { field: 'fga', headerName: 'FGA', type: 'numericColumn', editable: true, maxWidth: 70, resizable: false },
    { field: 'threepm', headerName: '3PM', type: 'numericColumn', editable: true, maxWidth: 70, resizable: false },
    { field: 'threepa', headerName: '3PA', type: 'numericColumn', editable: true, maxWidth: 70, resizable: false },
    {
      field: 'fgPct', headerName: 'FG %', type: 'numericColumn', maxWidth: 90, resizable: false,
      valueFormatter: params => (params.value * 100).toFixed(2),
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

  offensiveTable: number[][] = []
  offensiveHome: number[][] = []
  offensiveAway: number[][] = []
  offensiveTotal: number[][] = []
  offensiveSpread: number[][] = []
  
  defensiveTable: number[][] = []
  defensiveHome: number[][] = []
  defensiveAway: number[][] = []
  defensiveTotal: number[][] = []
  defensiveSpread: number[][] = []

  calculate = () => {
    console.log('Calculate started')
    this.calculateBtnPressed = true
    this.prepareBigTables()
      .then(res => {
        this.calculateBtnPressed = false
        this.bigTablesReady = true
        //console.log(this.table2)
      })
      .catch(error => {
        this.calculateBtnPressed = false        
        console.error('An error occurred:', error);
      });    
  }


  prepareBigTables(): Promise<any> {
    return new Promise(resolve => {
      
      let beginNumber = 22
      let endNumber = 62

      for (let i = beginNumber; i <= endNumber; i++) {
        this.offensiveTable[i - beginNumber] = []
        for (let j = beginNumber; j <= endNumber; j++) {
          this.offensiveTable[i - beginNumber][j - beginNumber] = 
            this.binomialProbability(this.getCellValue(this.gridApiOffensive, 0, 'fga'), i, this.getCellValue(this.gridApiOffensive, 0, 'fgPct')) * 
            this.binomialProbability(this.getCellValue(this.gridApiOffensive, 1, 'fga'), j, this.getCellValue(this.gridApiOffensive, 1, 'fgPct'))
        }  
      }
      for (let i = beginNumber; i <= endNumber; i++) {
        this.defensiveTable[i - beginNumber] = []
        for (let j = beginNumber; j <= endNumber; j++) {
          this.defensiveTable[i - beginNumber][j - beginNumber] = 
            this.binomialProbability(this.getCellValue(this.gridApiDefensive, 0, 'fga'), i, this.getCellValue(this.gridApiDefensive, 0, 'fgPct')) * 
            this.binomialProbability(this.getCellValue(this.gridApiDefensive, 1, 'fga'), j, this.getCellValue(this.gridApiDefensive, 1, 'fgPct'))
        }  
      }


      for (let i = beginNumber; i <= endNumber; i++) {
        this.offensiveHome[i - beginNumber] = []
        for (let j = beginNumber; j <= endNumber; j++) {
          this.offensiveHome[i - beginNumber][j - beginNumber] = 
            this.getCellValue(this.gridApiOffensive, 0, 'psm') * i + this.getCellValue(this.gridApiOffensive, 0, 'ftm')
        }  
      }
      for (let i = beginNumber; i <= endNumber; i++) {
        this.defensiveHome[i - beginNumber] = []
        for (let j = beginNumber; j <= endNumber; j++) {
          this.defensiveHome[i - beginNumber][j - beginNumber] = 
            this.getCellValue(this.gridApiDefensive, 0, 'psm') * j + this.getCellValue(this.gridApiOffensive, 0, 'ftm')
        }  
      }
      for (let i = beginNumber; i <= endNumber; i++) {
        this.offensiveAway[i - beginNumber] = []
        for (let j = beginNumber; j <= endNumber; j++) {
          this.offensiveAway[i - beginNumber][j - beginNumber] = 
            this.getCellValue(this.gridApiOffensive, 1, 'psm') * j + this.getCellValue(this.gridApiOffensive, 1, 'ftm')
        }  
      }
      for (let i = beginNumber; i <= endNumber; i++) {
        this.defensiveAway[i - beginNumber] = []
        for (let j = beginNumber; j <= endNumber; j++) {
          this.defensiveAway[i - beginNumber][j - beginNumber] = 
            this.getCellValue(this.gridApiDefensive, 1, 'psm') * i + this.getCellValue(this.gridApiDefensive, 1, 'ftm')
        }  
      }
      for (let i = beginNumber; i <= endNumber; i++) {
        this.offensiveTotal[i - beginNumber] = []
        this.offensiveSpread[i - beginNumber] = []
        this.defensiveTotal[i - beginNumber] = []
        this.defensiveSpread[i - beginNumber] = []
        for (let j = beginNumber; j <= endNumber; j++) {
          this.offensiveTotal[i - beginNumber][j - beginNumber]  = this.offensiveHome[i - beginNumber][j - beginNumber] + this.offensiveAway[i - beginNumber][j - beginNumber]
          this.offensiveSpread[i - beginNumber][j - beginNumber] = this.offensiveHome[i - beginNumber][j - beginNumber] - this.offensiveAway[i - beginNumber][j - beginNumber]
          this.defensiveTotal[i - beginNumber][j - beginNumber]  = this.defensiveHome[i - beginNumber][j - beginNumber] + this.defensiveAway[i - beginNumber][j - beginNumber]
          this.defensiveSpread[i - beginNumber][j - beginNumber] = this.defensiveHome[i - beginNumber][j - beginNumber] - this.defensiveAway[i - beginNumber][j - beginNumber]
        }  
      }
      resolve('Done')
    });
  }

  getCellValue = (api: GridApi, rowIndex: number, colId: string) => {
    const rowNode = api.getDisplayedRowAtIndex(rowIndex);
    if (rowNode) {
      const column = api.getColumn(colId);
      if (column) {
        return api.getCellValue({rowNode: rowNode, colKey: colId, useFormatter: false});
      }
    }
    return null;    
  }

  psm = (fgm: number, threepm: number) => {
    return this.averagePoints(fgm, threepm) / fgm
  }

  averagePoints = (fgm: number, threepm: number) => {
    return 2 * (fgm - threepm) + 3 * threepm
  }

  fgPercentage = (fgm: number, fga: number) => {
    return fga > 0 ? (fgm / fga) : 0;
  }

  // factorial = (n: number): number => {
  //   let result = 1;
  //   for (let i = 2; i <= n; i++) {
  //     result *= i;
  //   }
  //   return result;
  // }

  // binomialCoefficient = (n: number, k: number): number => {
  //   if (k > n) {
  //     return 0;
  //   }
  //   if (k === 0 || k === n) {
  //     return 1;
  //   }
  //   k = Math.min(k, n - k); // Take advantage of symmetry
  //   let coeff = 1;
  //   for (let i = 0; i < k; i++) {
  //     coeff *= (n - i) / (i + 1);
  //   }
  //   return coeff;
  // }

  /**
   * Calculates the probability of achieving exactly `k` successes in `n` trials, given the probability of success `p` on a single trial.
   * 
   * @param n trials
   * @param k successes
   * @param p probability of a success on single trial
   * @returns 
   */
  binomialProbability = (n: number, k: number, p: number): number => {
    if (k < 0 || k > n) {
      return 0;
    }

    let pmf = new Array(k + 1).fill(0);
    pmf[0] = Math.pow(1 - p, n);

    for (let i = 1; i <= k; i++) {
        pmf[i] = pmf[i - 1] * (n - i + 1) * p / (i * (1 - p));
    }

    return pmf[k];
  }

  onGridReadyOffensive(params: { api: GridApi<any>; }) {
    console.log('onGridReadyOffensive')
    this.gridApiOffensive = params.api;
  }
  onGridReadyDefensive(params: { api: GridApi<any>; }) {
    console.log('onGridReadyDefensive')
    this.gridApiDefensive = params.api;
  }
}
