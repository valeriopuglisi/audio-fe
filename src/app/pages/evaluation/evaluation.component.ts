import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import WaveSurfer from 'wavesurfer.js';
import SpectrogramPlugin from 'wavesurfer.js/src/plugin/spectrogram';
import TimelinePlugin from 'wavesurfer.js/src/plugin/timeline';
import Regions from 'wavesurfer.js/src/plugin/regions';
import * as saveAs from 'file-saver';
import { DeepLearningFeaturesService } from 'src/app/services/deep-learning-features.service';
import { DeepLearningAudioFeatures } from 'src/app/interfaces/deep-learning-audio-features';

declare var $: any;
import * as RecordRTC from 'recordrtc';
import { DatasetsService } from 'src/app/services/datasets.service';
import { MetricsService } from 'src/app/services/metrics.service';
@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.scss']
})
export class EvaluationComponent implements OnInit {

  analysisStep ={
    task:	"",
    dataset: "", 
    system: "",
    performance: ""
  }
  
  AudioFeatures : DeepLearningAudioFeatures = {
    'Automatic Speech Recognition': [],
    'Language Identification': [],
    'Language Identification + Automatic Speech Recognition': [],
    'Speech Separation': [],
    'Speech Enhancement': [],
    'Emotion Recognition': [],
    'Voice Activity Detection': [],
    'Speaker Verification':[],
    
  };

  Datasets : DeepLearningAudioFeatures = {
    'Automatic Speech Recognition': [],
    'Language Identification': [],
    'Language Identification + Automatic Speech Recognition': [],
    'Speech Separation': [],
    'Speech Enhancement': [],
    'Emotion Recognition': [],
    'Voice Activity Detection': [],
    'Speaker Verification':[],
  };

  Metrics : DeepLearningAudioFeatures = {
    'Automatic Speech Recognition': [],
    'Language Identification': [],
    'Language Identification + Automatic Speech Recognition': [],
    'Speech Separation': [],
    'Speech Enhancement': [],
    'Emotion Recognition': [],
    'Voice Activity Detection': [],
    'Speaker Verification':[],
  };


  

  public canvas : any;
  public ctx;
  public datasets: any = {};
  public data: any;
  public myChartData;
  public clicked: boolean = true;
  public clicked1: boolean = false;
  public clicked2: boolean = false;

  public wavesurfer: WaveSurfer = null;
  public slider:number = 10 ;
  public spectogram: any = null;
  public colorMap: any =null;
  // Define a default variable for selected file.
  
  fileName: string;
  fileToUpload: File | null = null;
  filesList: any;
  public formData : FormData;
  selectedTask: string = "";
  selectedFeature: any = "";
  selectedDataset: any = "";
  selectedMetric: any = "";

  showTaskCard: boolean = true;
  showModelCard: boolean = false;
  showDatasetCard: boolean = false;
  showMetricCard: boolean = false;

  staticAlertClosed5:boolean=true;
  staticAlertClosed6:boolean=true;
  succesMsg: string =" Success"
  errorMsg: string = "Error"

  dataset_filter : string = "";
  models_filter : string = "";

  image:Blob
  imageURL:SafeUrl


  constructor(private http: HttpClient, 
    private deepLearningFeaturesService: DeepLearningFeaturesService,  
    private datasetsService: DatasetsService,
    private metricsService: MetricsService,
    private domSanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.getDLFeatures();
    this.getDatasets();
    this.getMetrics();
  }

  getDLFeatures(){
    this.deepLearningFeaturesService.getDeepLearningFeatures().subscribe(
      response => {
        let apiList = JSON.parse(response.toString());
        console.log("getDLFeatures: ", apiList)
        for (var key in apiList) {
          this.AudioFeatures[apiList[key].task].push(apiList[key])    
        }
        console.log("getDLFeatures: ", this.AudioFeatures)
      }
    )
  }

  getDatasets(){
    this.datasetsService.getDeepLearningDatasets().subscribe(
      response => {
        let datasets_json = JSON.parse(response.toString());
        console.log("getDatasets: ", datasets_json)
        for (var task in datasets_json) {
          for (var dataset in datasets_json[task]) {
            // console.log(dataset, datasets_json[task][dataset])
            this.Datasets[task].push(datasets_json[task][dataset])    
          }
          // console.log(task, datasets_json[task])
        }
        console.log("getDatasets: ", this.Datasets)
      }
    )
  }

  getMetrics(){
    this.metricsService.getDeepLearningMetrics().subscribe(
      response => {
        let datasets_json = JSON.parse(response.toString());
        console.log("getDatasets: ", datasets_json)
        for (var task in datasets_json) {
          for (var dataset in datasets_json[task]) {
            // console.log(dataset, datasets_json[task][dataset])
            this.Metrics[task].push(datasets_json[task][dataset])    
          }
          // console.log(task, datasets_json[task])
        }
        console.log("getDatasets: ", this.Metrics)
      }
    )
  }

  onSelectTask(task:string){
    console.log("this.selectedTask: ",this.selectedTask, "==> task: ", task);
    if(this.selectedTask  && this.selectedTask != task){

      this.selectedFeature = "";
      this.selectedDataset = "";
      this.selectedMetric = "";
    } 
    this.selectedTask = task;
    this.toggleTaskCard();
    this.toggleModelCard();
  }

  selectFeature(feature){
    console.log("selectFeature: ", feature)
    if(this.selectedMetric && this.selectedFeature != feature){
      this.selectedDataset = "";
      this.selectedMetric = ""; 
    }
    this.selectedFeature = feature; 
    this.toggleModelCard();
    this.toggleDatasetCard();
  }

  selectDataset(dataset){
    console.log("selectDataset: ", dataset)
    this.selectedDataset = dataset;
    this.toggleDatasetCard();
    this.toggleMetricsCard();
  }

  selectMetric(metric){
    console.log("selectMetric: ", metric)
    this.selectedMetric = metric;
    this.toggleMetricsCard();
  }

  runEvaluation(){
    
  }


  toggleTaskCard(){
    this.showTaskCard = !this.showTaskCard;
  }

  toggleModelCard(){
    this.showModelCard = !this.showModelCard;
  }

  toggleDatasetCard(){
    this.showDatasetCard = !this.showDatasetCard;
  }

  toggleMetricsCard(){
    this.showMetricCard = !this.showMetricCard;
  }

 

  


}
