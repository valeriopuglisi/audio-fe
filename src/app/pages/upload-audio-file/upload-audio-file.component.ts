import { HttpClient, HttpHeaders, } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js';
import * as saveAs from 'file-saver';
import { throwIfEmpty } from 'rxjs';
import { DeepLearningAudioFeatures } from 'src/app/interfaces/deep-learning-audio-features';
import { Pipeline } from 'src/app/interfaces/pipeline';
import { PipelineStep } from 'src/app/interfaces/pipeline-step';
import { PipelineStepToStore } from 'src/app/interfaces/pipeline-step-to-store';
import { DeepLearningFeaturesService } from 'src/app/services/deep-learning-features.service';
import { FileDownloadService } from 'src/app/services/file-download.service';
import { isElementAccessChain } from 'typescript';
import WaveSurfer from 'wavesurfer.js';
import SpectrogramPlugin from 'wavesurfer.js/src/plugin/spectrogram';
import TimelinePlugin from 'wavesurfer.js/src/plugin/timeline';


interface AudioAnalysisStep {
  task:	string;
  dataset: string; 
  system: string;
  performance: string;
  api:string;
}






@Component({
  selector: 'app-upload-audio-file',
  templateUrl: './upload-audio-file.component.html',
  styleUrls: ['./upload-audio-file.component.scss']
})
export class UploadAudioFileComponent implements OnInit {
  
  public canvas : any;
  public ctx;
  public datasets: any;
  public data: any;
  public myChartData;
  public clicked: boolean = true;
  public clicked1: boolean = false;
  public clicked2: boolean = false;
  
  public wavesurfer: any = null;
  public spectogram: any = null;
  public colorMap: any =null;
  // Define a default variable for selected file.
  
  fileName: string;
  fileToUpload: File | null = null;
  filesList: any;
  public formData = new FormData();
  
  staticAlertClosed5:boolean=true;
  staticAlertClosed6:boolean=true;
  succesMsg: string =" Success"
  errorMsg: string = "Error"
  process : boolean =false;
  processError : boolean =false;
  
  AudioFeatures: DeepLearningAudioFeatures =  {
    'Automatic Speech Recognition': [],
    'Language Identification': [],
    'Language Identification + Automatic Speech Recognition': [],
    'Speech Separation': [],
    'Speech Enhancement': [],
    'Emotion Recognition': [],
    'Voice Activity Detection': []
  };
  

  pipeline : PipelineStep [] = [];
  savingPipeline:boolean=false;
  savedPilpeline:boolean=false;
  pipelineToStore: Pipeline = {
    author:"Valerio Francesco Puglisi",
    creationTime: new Date().toISOString(),
    name:"",
    notes:"",
    steps:[]
    
  };
  pipelineFiles: any[] = []
  separatedFilenames :any;
  separatedFileBlobs: any = [];
  separatedFileWavesurfer: any = []; 
  public files: any[] = [];
  
  constructor(private http: HttpClient, 
    private deepLearningFeaturesService: DeepLearningFeaturesService,
    private downloadService: FileDownloadService ){}
  
  ngOnInit() {
    this.getFiles();
    this.getDLFeatures();
  }

  getDLFeatures(){
    this.deepLearningFeaturesService.getDeepLearningFeatures().subscribe(
      response => {
        let apiList = JSON.parse(response.toString());
        for (var key in apiList) {
          this.AudioFeatures[apiList[key].task].push(apiList[key])    
        }
        console.log("getDLFeatures: ", this.AudioFeatures)
      }
    )
  }

  openSavePipeline(){
    this.savingPipeline =true; 
  }

  savePipeline(){

    for (let i = 0; i < this.pipeline.length; i++) {
      let element = this.pipeline[i];
      let pipelineElement : PipelineStepToStore = {
        task : element.task,
        system : element.system,
        dataset: element.dataset,
        performance: element.performance,
        api: element.api,
        inputFilename: element.fileName,
        inputFileId: element.inputFileId,
        outputFileIds : element.outputFileIds,
        outputFilenames: element.separatedFilenames,
      }
      this.pipelineToStore.steps[i] = pipelineElement;
      console.log("==> savePipeline(): this.pipelineToStore = ", this.pipelineToStore);
    }

    this.http.post('/api/utils/save-pipeline', this.pipelineToStore).subscribe(
      response => {
        console.log("==> savePipeline: response = ", response)
        this.savingPipeline = false;
        this.savedPilpeline = true;
      },
      error => {
        console.error(error);
              
      
      }
    );
  }

  closeSavePipeline(){
    this.savingPipeline = false;
  }
  
  onFileSelected(event) {
    const file:File = event.target.files[0];
    if (file) {
      this.fileToUpload = file
      this.fileName = file.name;
      let pipelineFile = {
        file :this.fileToUpload,
        file_id : "input_0_0",
      }
      this.pipelineFiles.push(pipelineFile);
      console.log("==> onFileSelected: this.pipelineFiles = ", this.pipelineFiles)
      console.log(file.type)
      this.formData.append("title", this.fileName); 
      this.formData.append("audiofile", file);
      WaveSurfer.util.fetchFile({ 
        url: '../../assets/hot-colormap.json', 
        responseType: 'json' }).on('success', colorMap => {
          this.initWaveSurfer(colorMap, this.fileToUpload)
        })
      }
  }
    
  getFiles(){
    this.http.get("/api/audiofiles").subscribe(
      response => {
        this.filesList = response;
        console.log(this.filesList)
        
      },
      error => {
        console.error(error)
      }
      
      )
  }
          
  uploadFile(){
    this.http.post("/api/audiofiles", this.formData).subscribe(
      response => {
        console.log(response)
      },
      error => {
        console.error(error);
        
      }
      );
  }

  selectPipelineFile(step:any, pipelineFile){
    console.log("selectPipelineFile(file): ", pipelineFile.file);
    this.pipeline[this.pipeline.length -1].file = pipelineFile.file;
    this.pipeline[this.pipeline.length -1].fileName = pipelineFile.file.name;
    this.pipeline[this.pipeline.length -1].inputFileId = pipelineFile.file_id;
    console.log(this.pipeline);

  }
      
  downloadStartFile(filename:string){
    this.http.get("/api/audiofiles/"+ filename, { responseType: 'blob' }).subscribe(
      data => {
        this.fileToUpload = new File([data], filename)
        this.fileName = filename;
        let pipelineFile = {
          file :this.fileToUpload,
          file_id : "input_0_0",
        }
        this.pipelineFiles.push(pipelineFile);
        console.log(this.fileToUpload.type)
        this.formData.append("title", this.fileName); 
        this.formData.append("audiofile", this.fileToUpload);
        WaveSurfer.util.fetchFile({ 
          url: '../../assets/hot-colormap.json', 
          responseType: 'json' }).on('success', colorMap => {
            this.initWaveSurfer(colorMap, this.fileToUpload)
        })
      }
    )
  }
  
  deleteFile(f){
    this.files = this.files.filter(function(w){ return w.name != f.name });
    
  }
  
  addStep(){
    if(this.pipeline.length == 0 || this.pipeline[this.pipeline.length-1].api !== ""){
      this.pipeline.push(
        {
          file: null,
          fileName: null,
          inputFileId: null,
          outputFileIds: [],
          task:"",
          api:"",
          dataset:"",
          performance:"",
          system:"", analysisResult: "",
          separatedFilenames : [],
          separatedFileBlobs: [],
          separatedFileWavesurfer: [],  
          processing: false,
          processing_error: null,
          processed: false,

        }
      )
    }
  }
  
  onSelectTask(task:string){
    this.pipeline[this.pipeline.length-1].task = task;    
    console.log("==> selectTask: this.pipeline = ", this.pipeline)
    console.log("==> onSelectTask: task = ", task)
  }

  onSelectTaskMethod(step:any){
    this.pipeline[this.pipeline.length-1].task = step.task;
    this.pipeline[this.pipeline.length-1].api = step.api;
    this.pipeline[this.pipeline.length-1].dataset = step.dataset;
    this.pipeline[this.pipeline.length-1].system = step.system;  
    this.pipeline[this.pipeline.length-1].performance = step.performance; 
    console.log("==> selectTask: this.pipeline = ", this.pipeline)
    console.log("==> onSelectTask: step = ", step)
  }

  onRunTask(step: any, step_index){
    console.log("==> step: ", step)
    switch (step.task) {
      case "Automatic Speech Recognition":
        this.analyzeFile(step);
        break;

      case "Language Identification":
        this.analyzeFile(step);
        break;

      case "Language Identification + Automatic Speech Recognition":
        this.analyzeFile(step);
        break;
      
      case "Voice Activity Detection":
        this.processFile(step, step_index);
        break;

      case "Emotion Recognition":
          this.analyzeFile(step);
        break;
  
      case "Speech Enhancement":
        this.processFile(step, step_index);
        break;

      case "Speech Separation":
        this.processFile(step, step_index);
        break;
    
      default:
        break;
    }
    console.log("==> onRunTask : this.pipeline = ", this.pipeline);

  }

  deletePipelineStep(step){
    this.pipeline = this.pipeline.filter( element => element !== step)
    console.log("deletePipelineStep(step) => pipeline:", this.pipeline);
  }

  analyzeFile(step:PipelineStep){
    console.log("==> analyzeFile(step:PipelineStep) => step.api : ", step.api)
    step.processing =true;
    this.formData = new FormData();
    this.formData.append("title", step.fileName); 
    this.formData.append("audiofile", step.file);
    this.http.post(step.api, this.formData).subscribe(
      response => {
        step.processing =false;
        step.processing_error = null;  
        step.analysisResult = response.toString();    
        step.processed = true;     
      },
      error => {
        console.error(error);
        step.processing =false;
        step.processing_error = error;  
        step.processed = true;
      }
    );
    console.log("==> Analyze File: ", this.pipeline);
  }

  processFile(step:PipelineStep,step_index){
    step.processing = true;
    this.formData = new FormData();
    this.formData.append("title", step.fileName); 
    this.formData.append("audiofile", step.file);
    this.http.post(step.api , this.formData).subscribe( 
      (response: string[]) => {
        step.separatedFilenames = response;
        console.log("processFile() => step.separatedFilenames: ", step.separatedFilenames);
        for (let i = 0; i < step.separatedFilenames.length; i++) {
          const separatedFilename = step.separatedFilenames[i];
          this.downloadFile(step, step.api, separatedFilename, step_index, i) 
    }
    step.processing =false;
    step.processing_error = null; 
    step.processed = true;
      },
      error => {
        console.error(error);
        step.processing =false;
        step.processing_error = error; 
        step.processed = true;
      }
    
    );
    
  }

  downloadFile(step: PipelineStep, api:string, filename:string, step_index, file_index:number){

    // this.downloadService.downloadFile(api, filename).subscribe(
    //   data => {
    //     let wavesurfer = WaveSurfer.create({
    //       container: '#waveform-' + step_index+'-'+file_index,
    //       backgroundColor:'black',
    //     });
    //     step.separatedFileWavesurfer.push(wavesurfer)  
    //     step.separatedFileWavesurfer[file_index].loadBlob(data);
    //     step.separatedFileBlobs.push(data); 
    //     let pipelineFile = {
    //       file: new File([data], filename),
    //       file_id : "output_"+ step_index + "_" + file_index
    //     }
    //     step.outputFileIds.push("output_"+ step_index + "_" + file_index)
    //     this.pipelineFiles.push(pipelineFile)
    //     console.log("==> this.pipelineFiles: ",this.pipelineFiles)
    //   }
    //   )

    this.http.get(api + "/"+ filename, { responseType: 'blob' }).subscribe(
      data => {
        let wavesurfer = WaveSurfer.create({
          container: '#waveform-' + step_index+'-'+file_index,
          backgroundColor:'black',
        });
        step.separatedFileWavesurfer.push(wavesurfer)  
        step.separatedFileWavesurfer[file_index].loadBlob(data);
        step.separatedFileBlobs.push(data); 
        let pipelineFile = {
          file: new File([data], filename),
          file_id : "output_"+ step_index + "_" + file_index
        }
        step.outputFileIds.push("output_"+ step_index + "_" + file_index)
        this.pipelineFiles.push(pipelineFile)
        console.log("==> this.pipelineFiles: ",this.pipelineFiles)
      },
      error =>{
        console.error(error)
      }
    )
  }

  saveSeparatedFile(step:PipelineStep, index:number){
    console.log(step.separatedFileBlobs)
    console.log(step.separatedFilenames)
    saveAs(step.separatedFileBlobs[index], step.separatedFilenames[index]);
  }
   
  initWaveSurfer(colorMap, fileName){
    this.wavesurfer = WaveSurfer.create({
      container: '#waveform',
      backgroundColor:'black',
     });
     this.wavesurfer.loadBlob(fileName)
  }
                
}
                
                
                
                
                