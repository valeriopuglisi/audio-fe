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
    'Voice Activity Detection': []
  };

  Datasets : DeepLearningAudioFeatures = {
    'Automatic Speech Recognition': [],
    'Language Identification': [],
    'Language Identification + Automatic Speech Recognition': [],
    'Speech Separation': [],
    'Speech Enhancement': [],
    'Emotion Recognition': [],
    'Voice Activity Detection': []
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
  process : boolean = false;
  processing : boolean = false;
  processError : boolean = false;
  analysisTitle: string = "";
  analysisResult: string = "";
  separatedFilenames :any = [];
  separatedFileBlobs: any = [];
  separatedFileWavesurfer: any = [];  

  staticAlertClosed5:boolean=true;
  staticAlertClosed6:boolean=true;
  succesMsg: string =" Success"
  errorMsg: string = "Error"
  
  image:Blob
  imageURL:SafeUrl


  constructor(private http: HttpClient, 
    private deepLearningFeaturesService: DeepLearningFeaturesService,  
    private datasetsService: DatasetsService,
    private domSanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.getDLFeatures();
    this.getDatasets();
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


  selectFeature(feature){
    console.log(feature)
  }

  selectDataset(dataset){
    console.log(dataset)
  }

  runEvaluation(){
    
  }

  onSelectTask(task:string){
  console.log("==> task: ", task);
  this.selectedTask = task
  }

  


}
