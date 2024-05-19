import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef, GridApi, GridOptions, ValueFormatterParams } from 'ag-grid-community';

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

  gridOptions: GridOptions = {
    // Data to be displayed
    // rowData: [] as IRow[],
    // Configurations applied to all columns
    defaultColDef: {
      resizable: false, 
      maxWidth: 100
    } as ColDef,
  }

  columnDefsOffensive: ColDef[] = [
    { field: 'off', headerName: 'Offensive', minWidth: 40 },
    {
      field: 'avgPoints', headerName: "Avg. Points", minWidth: 40,
      valueFormatter: params => params.value.toFixed(2),
      valueGetter: p => this.averagePoints(p.data.fgm, p.data.threepm)
    },
    { field: 'fgm', headerName: 'FGM', type: 'numericColumn', editable: true, maxWidth: 70 },
    { field: 'fga', headerName: 'FGA', type: 'numericColumn', editable: true, maxWidth: 70 },
    { field: 'threepm', headerName: '3PM', type: 'numericColumn', editable: true, maxWidth: 70 },
    { field: 'threepa', headerName: '3PA', type: 'numericColumn', editable: true, maxWidth: 70 },
    {
      field: 'fgPct', headerName: 'FG %', type: 'numericColumn', maxWidth: 90,
      valueFormatter: this.percent,
      valueGetter: p => this.fgPercentage(p.data.fgm, p.data.fga)
    },
    {
      field: 'psm', headerName: 'PSM', type: 'numericColumn', maxWidth: 90,
      valueFormatter: params => params.value.toFixed(2),
      valueGetter: p => this.psm(p.data.fgm, p.data.threepm)
    },
    { field: 'ftm', headerName: 'Free Throws Made', type: 'numericColumn', editable: true, maxWidth: 170 }
  ];

  columnDefsDefensive: ColDef[] = [
    { field: 'def', headerName: 'Defensive', minWidth: 40, maxWidth: 120 },
    {
      field: 'avgPoints', headerName: "Avg. Points", minWidth: 40,
      valueFormatter: params => params.value.toFixed(2),
      valueGetter: p => this.averagePoints(p.data.fgm, p.data.threepm)
    },
    { field: 'fgm', headerName: 'FGM', type: 'numericColumn', editable: true, maxWidth: 70 },
    { field: 'fga', headerName: 'FGA', type: 'numericColumn', editable: true, maxWidth: 70 },
    { field: 'threepm', headerName: '3PM', type: 'numericColumn', editable: true, maxWidth: 70 },
    { field: 'threepa', headerName: '3PA', type: 'numericColumn', editable: true, maxWidth: 70 },
    {
      field: 'fgPct', headerName: 'FG %', type: 'numericColumn', maxWidth: 90,
      valueFormatter: this.percent,
      valueGetter: p => this.fgPercentage(p.data.fgm, p.data.fga)
    },
    {
      field: 'psm', headerName: 'PSM', type: 'numericColumn', maxWidth: 90,
      valueFormatter: params => params.value.toFixed(2),
      valueGetter: p => this.psm(p.data.fgm, p.data.threepm)
    }
  ]

  rowDataOffensive = [
    { off: 'HOME', fgm: 47, fga: 92.7, threepm: 13.2, threepa: 35.3, ftm: 16.1 },
    { off: 'AWAY', fgm: 41.3, fga: 88.7, threepm: 13.2, threepa: 35.8, ftm: 17.0 }
  ];

  rowDataDefensive = [
    { def: 'HOME', fgm: 44.5, fga: 89.8, threepm: 10.7, threepa: 29.3 },
    { def: 'AWAY', fgm: 40.3, fga: 85.7, threepm: 12.5, threepa: 34.3 }
  ]

  //////////////////////// RESULT TABLES ///////////////////////////////////

  resultColumnDefsOffensiveShotsMade: ColDef[] = [
    { field: 'off', minWidth: 100, maxWidth: 180 },
    { field: 'value', valueFormatter: params => params.value.toFixed(3) },
    {
      field: 'pct',
      valueFormatter: this.percent,
    },
  ]

  resultRowDataOffensiveShotsMade = [
    { off: 'Offensive Shots Made', value: 0.042, pct: 99.96 },
    { off: 'HOME', value: 0.780, pct: 81.37 },
    { off: 'AWAY', value: 0.178, pct: 18.63 }
  ]

  resultColumnDefsDefensiveShotsAllowed: ColDef[] = [
    { field: 'def', minWidth: 100, maxWidth: 180 },
    { field: 'value', valueFormatter: params => params.value.toFixed(3) },
    {
      field: 'pct',
      valueFormatter: this.percent
    }
  ]

  resultRowDataDefensiveShotsAllowed = [
    { def: 'Defensive Shots Allowed', value: 0.042, pct: 99.96 },
    { def: 'HOME', value: 0.780, pct: 81.37 },
    { def: 'AWAY', value: 0.178, pct: 18.63 }
  ]

  resultColumnDefsTotals: ColDef[] = [
    { field: 'tot', headerName: 'Total Points', minWidth: 100, maxWidth: 180 },
    { field: 'value', headerName: 'OFF', valueFormatter: this.percent },
    { field: 'pct', headerName: 'DEF', valueFormatter: this.percent },
  ]

  resultRowDataTotals = [
    { tot: 'HOME', value: 73.34, pct: 29.67 },
    { tot: 'AWAY', value: 26.62, pct: 70.29 }
  ]

  resultColumnDefsOffensiveOverTotal: ColDef[] = [
    { field: 'offOver', valueFormatter: this.percent },
    { field: 'offUnder',valueFormatter: this.percent },
    { field: 'defOver', valueFormatter: this.percent},
    { field: 'defUnder', valueFormatter: this.percent},
    { field: 'lastCol', headerName: 'TOTAL', valueFormatter: params => params.value.toFixed(1)}
  ]
  resultColumnDefsOffensiveOverHome: ColDef[] = [
    { field: 'offOver', valueFormatter: this.percent },
    { field: 'offUnder',valueFormatter: this.percent },
    { field: 'defOver', valueFormatter: this.percent},
    { field: 'defUnder', valueFormatter: this.percent},
    { field: 'lastCol', headerName: 'HOME', valueFormatter: params => params.value.toFixed(1)}
  ]
  resultColumnDefsOffensiveOverAway: ColDef[] = [
    { field: 'offOver', valueFormatter: this.percent },
    { field: 'offUnder',valueFormatter: this.percent },
    { field: 'defOver', valueFormatter: this.percent},
    { field: 'defUnder', valueFormatter: this.percent},
    { field: 'lastCol', headerName: 'AWAY', valueFormatter: params => params.value.toFixed(1)}
  ]
  resultColumnDefsOffensiveOverSpreadAway: ColDef[] = [
    { field: 'offOver', valueFormatter: this.percent },
    { field: 'offUnder',valueFormatter: this.percent },
    { field: 'defOver', valueFormatter: this.percent},
    { field: 'defUnder', valueFormatter: this.percent},
    { field: 'lastCol', headerName: 'SPR.AWAY', valueFormatter: params => params.value.toFixed(1)}
  ]
  resultColumnDefsOffensiveOverSpreadHome : ColDef[] = [
    { field: 'offOver', valueFormatter: this.percent },
    { field: 'offUnder',valueFormatter: this.percent },
    { field: 'defOver', valueFormatter: this.percent},
    { field: 'defUnder', valueFormatter: this.percent},
    { field: 'lastCol', headerName: 'SPR. HOME', maxWidth: 120, valueFormatter: params => params.value.toFixed(1)}
  ]

  resultRowDataOverUnderTemplate = [
    { offOver: 0.0, defOver: 0.0, offUnder: 0.0, defUnder: 0.0, lastCol: 0.0 }
  ]
  resultRowDataOverUnderTotal = [
    { offOver: 0.0, defOver: 0.0, offUnder: 0.0, defUnder: 0.0, lastCol: 0.0 }
  ]
  resultRowDataOverUnderHome = [
    { offOver: 0.0, defOver: 0.0, offUnder: 0.0, defUnder: 0.0, lastCol: 0.0 }
  ]
  resultRowDataOverUnderAway = [
    { offOver: 0.0, defOver: 0.0, offUnder: 0.0, defUnder: 0.0, lastCol: 0.0 }
  ]
  resultRowDataOverUnderSpreadAway = [
    { offOver: 0.0, defOver: 0.0, offUnder: 0.0, defUnder: 0.0, lastCol: 0.0 }
  ]
  resultRowDataOverUnderSpreadHome = [
    { offOver: 0.0, defOver: 0.0, offUnder: 0.0, defUnder: 0.0, lastCol: 0.0 }
  ]
  //////////////////////// END OF RESULT TABLES ///////////////////////////////////

  calculateBtnPressed = false
  dataTablesReady = false

  offensiveTable:  number[][] = []
  offensiveHome:   number[][] = []
  offensiveAway:   number[][] = []
  offensiveTotal:  number[][] = []
  offensiveSpread: number[][] = []

  defensiveTable:  number[][] = []
  defensiveHome:   number[][] = []
  defensiveAway:   number[][] = []
  defensiveTotal:  number[][] = []
  defensiveSpread: number[][] = []
  

  calculate = () => {
    this.calculateBtnPressed = true
    this.prepareDataTables()
    this.calculateBtnPressed = false
    this.dataTablesReady = true
  }

  private percent(params: ValueFormatterParams<any, any>): string {
    return (params.value * 100).toFixed(2);
  }

  prepareDataTables() {

    const from = 22
    const to = 62

    for (let i = from; i <= to; i++) {

      this.offensiveTable [i - from] = []
      this.offensiveHome  [i - from] = []
      this.offensiveAway  [i - from] = []
      this.offensiveTotal [i - from] = []
      this.offensiveSpread[i - from] = []

      this.defensiveTable [i - from] = []
      this.defensiveHome  [i - from] = []
      this.defensiveAway  [i - from] = []
      this.defensiveTotal [i - from] = []
      this.defensiveSpread[i - from] = []

      for (let j = from; j <= to; j++) {

        this.offensiveTable[i - from][j - from] =
          this.binomialProbability(this.getCellValue(this.gridApiOffensive, 0, 'fga'), j, this.getCellValue(this.gridApiOffensive, 0, 'fgPct')) *
          this.binomialProbability(this.getCellValue(this.gridApiOffensive, 1, 'fga'), i, this.getCellValue(this.gridApiOffensive, 1, 'fgPct'))
        this.offensiveHome[i - from][j - from] = this.getCellValue(this.gridApiOffensive, 0, 'psm') * j + this.getCellValue(this.gridApiOffensive, 0, 'ftm')
        this.offensiveAway[i - from][j - from] = this.getCellValue(this.gridApiOffensive, 1, 'psm') * i + this.getCellValue(this.gridApiOffensive, 1, 'ftm')
        this.offensiveTotal[i - from][j - from] = this.offensiveHome[i - from][j - from] + this.offensiveAway[i - from][j - from]
        this.offensiveSpread[i - from][j - from] = this.offensiveHome[i - from][j - from] - this.offensiveAway[i - from][j - from]

        this.defensiveTable[i - from][j - from] =
          this.binomialProbability(this.getCellValue(this.gridApiDefensive, 1, 'fga'), i, this.getCellValue(this.gridApiDefensive, 1, 'fgPct')) *
          this.binomialProbability(this.getCellValue(this.gridApiDefensive, 0, 'fga'), j, this.getCellValue(this.gridApiDefensive, 0, 'fgPct'))
        this.defensiveHome[i - from][j - from] = this.getCellValue(this.gridApiDefensive, 1, 'psm') * i + this.getCellValue(this.gridApiOffensive, 0, 'ftm')
        this.defensiveAway[i - from][j - from] = this.getCellValue(this.gridApiDefensive, 0, 'psm') * j + this.getCellValue(this.gridApiOffensive, 1, 'ftm')
        this.defensiveTotal[i - from][j - from] = this.defensiveHome[i - from][j - from] + this.defensiveAway[i - from][j - from]
        this.defensiveSpread[i - from][j - from] = this.defensiveHome[i - from][j - from] - this.defensiveAway[i - from][j - from]
      }
    }

    let sumOff = 0
    let sumDef = 0
    let sumOffBottom = 0
    let sumOffDiagonal = 0
    let sumDefBottom = 0
    let sumDefDiagonal = 0

    for (let i = 0; i <= to - from; i++) {
      for (let j = 0; j <= to - from; j++) {
        sumOff += this.offensiveTable[i][j]
        sumDef += this.defensiveTable[i][j]
        if (i > j) {
          sumOffBottom += this.offensiveTable[i][j]
          sumDefBottom += this.defensiveTable[i][j]
        }
        if (i === j) {
          sumOffDiagonal += this.offensiveTable[i][j]
          sumDefDiagonal += this.defensiveTable[i][j]
        }
      }
    }

    this.resultRowDataOffensiveShotsMade =
      [
        { off: 'Offensive Shots Made', value: sumOffDiagonal, pct: sumOff },
        { off: 'HOME', value: sumOff - sumOffBottom - sumOffDiagonal, pct: (sumOff - sumOffBottom - sumOffDiagonal) / (sumOff - sumOffDiagonal) },
        { off: 'AWAY', value: sumOffBottom, pct: sumOffBottom / (sumOff - sumOffDiagonal) }
      ]

    this.resultRowDataDefensiveShotsAllowed =
      [
        { def: 'Defensive Shots Allowed', value: sumDefDiagonal, pct: sumDef },
        { def: 'HOME', value: sumDefBottom, pct: sumDefBottom / (sumDef - sumDefDiagonal) },
        { def: 'AWAY', value: sumDef - sumDefBottom - sumDefDiagonal, pct: (sumDef - sumDefBottom - sumDefDiagonal) / (sumDef - sumDefDiagonal) }
      ]

    let a4 = this.sumIfGreaterThan(this.offensiveSpread, 0, this.offensiveTable, from, to)
    let c4 = this.sumIfGreaterThan(this.defensiveSpread, 0, this.defensiveTable, from, to)
    this.resultRowDataTotals = [
      { tot: 'HOME', value: a4, pct: c4 },
      { tot: 'AWAY', value: sumOff - a4, pct: sumOff - c4 }
    ];


    //////////////////////// START OF OVER_UNDER CALCULATIONS ///////////////////////////////////

    let max = 240.5
    let min = 200.5
    let ind = 0
    for (let t=max; t>=min; t-=1) {
      let oOver = this.sumIfGreaterThan(this.offensiveTotal, t, this.offensiveTable, from, to)
      let dOver = this.sumIfGreaterThan(this.defensiveTotal, t, this.defensiveTable, from, to) 
      this.resultRowDataOverUnderTotal[ind] = {
        offOver: oOver,
        offUnder: 1 - oOver,
        defOver: dOver,
        defUnder: 1 - dOver,
        lastCol: t
      }
      ind++    
    }

    max = 133.5
    min = 93.5
    ind = 0
    for (let t = max; t >= min; t-=1) {
      let oOver = this.sumIfGreaterThan(this.offensiveHome, t, this.offensiveTable, from, to)
      let dOver = this.sumIfGreaterThan(this.defensiveAway , t, this.defensiveTable, from, to)
      this.resultRowDataOverUnderHome[ind] = {
        offOver: oOver,
        offUnder: 1 - oOver,
        defOver: dOver,
        defUnder: 1 - dOver,
        lastCol: t
      }
      ind++    
    }

    max = 133.5
    min = 93.5
    ind = 0
    for (let t = max; t >= min; t-=1) {
      let oOver = this.sumIfGreaterThan(this.offensiveAway, t, this.offensiveTable, from, to)
      let dOver = this.sumIfGreaterThan(this.defensiveHome, t, this.defensiveTable, from, to)
      this.resultRowDataOverUnderAway[ind] = {
        offOver: oOver,
        offUnder: 1 - oOver,
        defOver: dOver,
        defUnder: 1 - dOver,
        lastCol: t
      }
      ind++    
    }


    min = .5
    max = 20.5
    ind = 0
    for (let t = min; t <= max; t+=1) {
      let oOver = this.sumIfLessThan(this.offensiveSpread, t === .5 ? t : -t /* TODO this may be a bug in excel. */, this.offensiveTable, from, to)
      let dOver = this.sumIfLessThan(this.defensiveSpread, t === .5 ? t : -t /* TODO this may be a bug in excel. */, this.defensiveTable, from, to)
      this.resultRowDataOverUnderSpreadAway[ind] = {
        offOver: oOver,
        offUnder: 1 - oOver,
        defOver: dOver,
        defUnder: 1 - dOver,
        lastCol: t
      }

      oOver = this.sumIfGreaterThan(this.offensiveSpread, t, this.offensiveTable, from, to)
      dOver = this.sumIfGreaterThan(this.defensiveSpread, t, this.defensiveTable, from, to)
      this.resultRowDataOverUnderSpreadHome[ind] = {
        offOver: oOver,
        offUnder: 1 - oOver,
        defOver: dOver,
        defUnder: 1 - dOver,
        lastCol: t
      }
      ind++    
    }

        //////////////////////// END OF OVER_UNDER CALCULATIONS ///////////////////////////////////
  }

  sumIfGreaterThan = (range: number[][], gt: number, values: number[][], from: number, to: number): number => {
    let sum = 0
    for (let i = 0; i < to - from; i++) {
      for (let j = 0; j < to - from; j++) {
        if (range[i][j] > gt) {
          sum += values[i][j]
        }
      }
    }
    return sum
  }

  sumIfLessThan = (range: number[][], gt: number, values: number[][], from: number, to: number): number => {
    let sum = 0
    for (let i = 0; i < to - from; i++) {
      for (let j = 0; j < to - from; j++) {
        if (range[i][j] < gt) {
          sum += values[i][j]
        }
      }
    }
    return sum
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


  /**
   * Calculates the probability of achieving exactly `k` successes in `n` trials, given the probability of success `p` on a single trial.
   * 
   * @param n trials
   * @param k successes
   * @param p probability of a success on single trial
   * @returns 
   */
  binomialProbability = (n: number, k: number, p: number): number => {
    n = Math.floor(n)
    k = Math.floor(k)

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

  getCellValue = (api: GridApi, rowIndex: number, colId: string) => {
    const rowNode = api.getDisplayedRowAtIndex(rowIndex);
    if (rowNode) {
      const column = api.getColumn(colId);
      if (column) {
        return api.getCellValue({ rowNode: rowNode, colKey: colId, useFormatter: false });
      }
    }
    return null;
  }

  onGridReadyOffensive(params: { api: GridApi<any>; }) {
    this.gridApiOffensive = params.api;
  }
  onGridReadyDefensive(params: { api: GridApi<any>; }) {
    this.gridApiDefensive = params.api;
  }

  onGridReadyResultOffensiveShotsMade(params: { api: GridApi<any>; }) {
    params.api!.setGridOption("rowData", this.resultRowDataOffensiveShotsMade)
  }

  onGridReadyResultDefensiveShotsAllowed(params: { api: GridApi<any>; }) {
    params.api!.setGridOption("rowData", this.resultRowDataDefensiveShotsAllowed)
  }

  onGridReadyResultTotalPoints(params: { api: GridApi<any>; }) {
    params.api!.setGridOption("rowData", this.resultRowDataTotals)
  }

  onGridReadyResultOverUnderSpreadHome(params: { api: GridApi<any>; }) {
    params.api!.setGridOption("rowData", this.resultRowDataOverUnderSpreadHome)
  }

  onGridReadyResultOverUnderSpreadAway(params: { api: GridApi<any>; }) {
    params.api!.setGridOption("rowData", this.resultRowDataOverUnderSpreadAway)
  }

  onGridReadyResultOverUnderTotals(params: { api: GridApi<any>; }) {
    params.api!.setGridOption("rowData", this.resultRowDataOverUnderTotal)
  }

  onGridReadyResultOverUnderHome(params: { api: GridApi<any>; }) {
    params.api!.setGridOption("rowData", this.resultRowDataOverUnderHome)
  }

  onGridReadyResultOverUnderAway(params: { api: GridApi<any>; }) {
    params.api!.setGridOption("rowData", this.resultRowDataOverUnderAway)
  }
}
