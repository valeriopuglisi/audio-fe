import { Component, OnInit } from "@angular/core";
import Chart from 'chart.js';
import { HttpClient } from '@angular/common/http';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import WaveSurfer from 'wavesurfer.js';
import SpectrogramPlugin from 'wavesurfer.js/src/plugin/spectrogram';
import TimelinePlugin from 'wavesurfer.js/src/plugin/timeline';
import Regions from 'wavesurfer.js/src/plugin/regions';
import * as saveAs from 'file-saver';
import { toJSDate } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-calendar';
declare var $: any;
import * as RecordRTC from 'recordrtc';
import { Form } from '@angular/forms';
import { isThisTypeNode } from 'typescript';
import { ReportsService } from 'src/app/services/reports.service';
import { EvaluationService } from "src/app/services/evaluation.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "dashboard.component.html"
})
export class DashboardComponent implements OnInit {
  public canvas : any;
  public ctx;
  public datasets: any;
  public data: any;
  public myChartData;
  public clicked: boolean = true;
  public clicked1: boolean = false;
  public clicked2: boolean = false;

  gradientChartOptionsConfigurationWithTooltipBlue: any = {
    maintainAspectRatio: false,
    legend: {
      display: false
    },

    tooltips: {
      backgroundColor: '#f5f5f5',
      titleFontColor: '#333',
      bodyFontColor: '#666',
      bodySpacing: 4,
      xPadding: 12,
      mode: "nearest",
      intersect: 0,
      position: "nearest"
    },
    responsive: true,
    scales: {
      yAxes: [{
        barPercentage: 1.6,
        gridLines: {
          drawBorder: false,
          color: 'rgba(29,140,248,0.0)',
          zeroLineColor: "transparent",
        },
        ticks: {
          suggestedMin: 60,
          suggestedMax: 125,
          padding: 20,
          fontColor: "#2380f7"
        }
      }],

      xAxes: [{
        barPercentage: 1.6,
        gridLines: {
          drawBorder: false,
          color: 'rgba(29,140,248,0.1)',
          zeroLineColor: "transparent",
        },
        ticks: {
          padding: 20,
          fontColor: "#2380f7"
        }
      }]
    }
  };

  gradientChartOptionsConfigurationWithTooltipPurple: any = {
    maintainAspectRatio: false,
    legend: {
      display: false
    },

    tooltips: {
      backgroundColor: '#f5f5f5',
      titleFontColor: '#333',
      bodyFontColor: '#666',
      bodySpacing: 4,
      xPadding: 12,
      mode: "nearest",
      intersect: 0,
      position: "nearest"
    },
    responsive: true,
    scales: {
      yAxes: [{
        barPercentage: 1.6,
        gridLines: {
          drawBorder: false,
          color: 'rgba(29,140,248,0.0)',
          zeroLineColor: "transparent",
        },
        ticks: {
          suggestedMin: 60,
          suggestedMax: 125,
          padding: 20,
          fontColor: "#9a9a9a"
        }
      }],

      xAxes: [{
        barPercentage: 1.6,
        gridLines: {
          drawBorder: false,
          color: 'rgba(225,78,202,0.1)',
          zeroLineColor: "transparent",
        },
        ticks: {
          padding: 20,
          fontColor: "#9a9a9a"
        }
      }]
    }
  };

  gradientChartOptionsConfigurationWithTooltipRed: any = {
    maintainAspectRatio: false,
    legend: {
      display: false
    },

    tooltips: {
      backgroundColor: '#f5f5f5',
      titleFontColor: '#333',
      bodyFontColor: '#666',
      bodySpacing: 4,
      xPadding: 12,
      mode: "nearest",
      intersect: 0,
      position: "nearest"
    },
    responsive: true,
    scales: {
      yAxes: [{
        barPercentage: 1.6,
        gridLines: {
          drawBorder: false,
          color: 'rgba(29,140,248,0.0)',
          zeroLineColor: "transparent",
        },
        ticks: {
          suggestedMin: 60,
          suggestedMax: 125,
          padding: 20,
          fontColor: "#9a9a9a"
        }
      }],

      xAxes: [{
        barPercentage: 1.6,
        gridLines: {
          drawBorder: false,
          color: 'rgba(233,32,16,0.1)',
          zeroLineColor: "transparent",
        },
        ticks: {
          padding: 20,
          fontColor: "#9a9a9a"
        }
      }]
    }
  };
  
  gradientChartOptionsConfigurationWithTooltipOrange: any = {
    maintainAspectRatio: false,
    legend: {
      display: false
    },

    tooltips: {
      backgroundColor: '#f5f5f5',
      titleFontColor: '#333',
      bodyFontColor: '#666',
      bodySpacing: 4,
      xPadding: 12,
      mode: "nearest",
      intersect: 0,
      position: "nearest"
    },
    responsive: true,
    scales: {
      yAxes: [{
        barPercentage: 1.6,
        gridLines: {
          drawBorder: false,
          color: 'rgba(29,140,248,0.0)',
          zeroLineColor: "transparent",
        },
        ticks: {
          suggestedMin: 50,
          suggestedMax: 110,
          padding: 20,
          fontColor: "#ff8a76"
        }
      }],

      xAxes: [{
        barPercentage: 1.6,
        gridLines: {
          drawBorder: false,
          color: 'rgba(220,53,69,0.1)',
          zeroLineColor: "transparent",
        },
        ticks: {
          padding: 20,
          fontColor: "#ff8a76"
        }
      }]
    }
  };

  gradientChartOptionsConfigurationWithTooltipGreen: any = {
    maintainAspectRatio: false,
    legend: {
      display: false
    },

    tooltips: {
      backgroundColor: '#f5f5f5',
      titleFontColor: '#333',
      bodyFontColor: '#666',
      bodySpacing: 4,
      xPadding: 12,
      mode: "nearest",
      intersect: 0,
      position: "nearest"
    },
    responsive: true,
    scales: {
      yAxes: [{
        barPercentage: 1.6,
        gridLines: {
          drawBorder: false,
          color: 'rgba(29,140,248,0.0)',
          zeroLineColor: "transparent",
        },
        ticks: {
          suggestedMin: 50,
          suggestedMax: 125,
          padding: 20,
          fontColor: "#9e9e9e"
        }
      }],

      xAxes: [{
        barPercentage: 1.6,
        gridLines: {
          drawBorder: false,
          color: 'rgba(0,242,195,0.1)',
          zeroLineColor: "transparent",
        },
        ticks: {
          padding: 20,
          fontColor: "#9e9e9e"
        }
      }]
    }
  };


  gradientBarChartConfiguration: any = {
    maintainAspectRatio: false,
    legend: {
      display: false
    },

    tooltips: {
      backgroundColor: '#f5f5f5',
      titleFontColor: '#333',
      bodyFontColor: '#666',
      bodySpacing: 4,
      xPadding: 12,
      mode: "nearest",
      intersect: 0,
      position: "nearest"
    },
    responsive: true,
    scales: {
      yAxes: [{

        gridLines: {
          drawBorder: false,
          color: 'rgba(29,140,248,0.1)',
          zeroLineColor: "transparent",
        },
        ticks: {
          suggestedMin: 60,
          suggestedMax: 120,
          padding: 20,
          fontColor: "#9e9e9e"
        }
      }],

      xAxes: [{

        gridLines: {
          drawBorder: false,
          color: 'rgba(29,140,248,0.1)',
          zeroLineColor: "transparent",
        },
        ticks: {
          padding: 20,
          fontColor: "#9e9e9e"
        }
      }]
    }
  };

  constructor(
    private http: HttpClient, 
    private domSanitizer: DomSanitizer,
    private reportService: ReportsService,
    private evaluationService: EvaluationService) {}

  reports: any[] = [];
  evaluations:any [] = [];
  totalTask = this.reports.length + this.evaluations.length 
  completedTask :any [] = []
  inProcessingTask :any [] = []
  public formData : FormData;
  report : Blob = null;
  report_id: string | null = null;

  ngOnInit() {
    this.getReportList();
    this.getEvaluationsList();
    var month_labels = ['JAN','FEB','MAR','APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
    var n_completed_task_per_month = [90, 27, 60, 12, 80]
    var n_in_processing_task_per_month = [1, 2, 3, 4, 5, 1, 1, 1, 1, 1]
    var n_completed_pipelines_per_month = [90, 27, 60, 12, 80, 1, 1, 1, 1, 1]
    var n_in_progress_pipelines_per_month = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    
    this.createTaskGraph(
      "completedTaskGraph", 
      month_labels, 
      n_completed_task_per_month, 
      this.gradientChartOptionsConfigurationWithTooltipGreen
      );

    this.createTaskGraph("inProcessingTaskGraph", month_labels, n_in_processing_task_per_month, this.gradientChartOptionsConfigurationWithTooltipGreen);
    this.createTaskGraph("completedPipelines", month_labels, n_completed_pipelines_per_month, this.gradientChartOptionsConfigurationWithTooltipGreen);
    this.createTaskGraph("inProgressPipelines", month_labels, n_in_progress_pipelines_per_month, this.gradientChartOptionsConfigurationWithTooltipGreen);
    this.createTaskGraph("chartLineRed", month_labels, n_in_progress_pipelines_per_month, this.gradientChartOptionsConfigurationWithTooltipGreen);

  
    


  }

  public updateOptions() {
    this.myChartData.data.datasets[0].data = this.data;
    this.myChartData.update();
  }

  getReportList(){
    this.reportService.getDeepLearningReports().subscribe(
      data =>{
        this.reports = data;
        console.log("this.reports: ", this.reports)
        for (let i = 0; i < this.reports.length; i++) {
          this.reports[i].report_datetime = new Date(this.reports[i].report_datetime);
        }
        
      }
    )
  }

  getEvaluationsList(){
    this.evaluationService.getDeepLearningEvaluations().subscribe(
      data =>{
        this.evaluations = data;
        console.log("this.evaluations: ", this.evaluations)
        for (let i = 0; i < this.evaluations.length; i++) {
          // this.Evaluationss[i].Evaluations_datetime = new Date(this.Evaluationss[i].Evaluations_datetime);
        }
        
      }
    )
  }

  getReport(reportId: string){
    reportId = reportId + ".zip"
    this.reportService.getReport(reportId).subscribe(
      data => {
        this.report = data;
        saveAs(this.report, reportId );
      }
    )
  }

  getReports(){
    for (let i = 0; i < this.reports.length; i++) {
      const reportId = this.reports[i][1];
      this.reportService.getReport(reportId).subscribe(
        data => {
          this.report = data;
          saveAs(data, reportId);
        }
      )
    }
  }

  createTaskGraph(id:string, label_arr: string[], data_arr: number[], options){
    this.canvas = document.getElementById(id);
    this.ctx = this.canvas.getContext("2d");


    var gradientStroke = this.ctx.createLinearGradient(0, 230, 0, 50);

    gradientStroke.addColorStop(1, 'rgba(255,255,255,0.15)');
    gradientStroke.addColorStop(0.4, 'rgba(255,255,255,0.0)'); //green colors
    gradientStroke.addColorStop(0, 'rgba(255,255,255,0)'); //green colors

    var data = {
      labels: label_arr,
      datasets: [{
        label: id,
        fill: true,
        backgroundColor: gradientStroke,
        borderColor: '#FFFFFF',
        borderWidth: 2,
        borderDash: [],
        borderDashOffset: 0.0,
        pointBackgroundColor: '#FFFFFF',
        pointBorderColor: 'rgba(255,255,255,0)',
        pointHoverBackgroundColor: '#FFFFFF',
        pointBorderWidth: 20,
        pointHoverRadius: 4,
        pointHoverBorderWidth: 15,
        pointRadius: 4,
        data: data_arr,
      }]
    };

    var myChart = new Chart(this.ctx, {
      type: 'line',
      data: data,
      options: options

    });
  }
}
