  import { HttpClient } from '@angular/common/http';
  import { Component, OnInit } from '@angular/core';
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

  interface AudioAnalysisStep {
    task:	string;
    dataset: string; 
    system: string;
    performance: string;
    api:string;
  }


  interface Pipeline {
    name: string;
    author: string;
    creationTime: string;
    notes: string;
    steps: PipelineStepToStore[],
  }

  interface PipelineStep {
      file: File | null,
      fileName: string,
      task:string,
      api:string,
      dataset:string,
      performance:string,
      system:string,
      analysisResult:string,
      separatedFilenames :string[],
      separatedFileBlobs: Blob[],
      separatedFileWavesurfer: any[], 
      processing: boolean,
      processing_error: string | null,
      processed: boolean,
  }


  interface PipelineStepToStore {
    task:string,
    api:string,
    dataset:string,
    performance:string,
    system:string,
    inputFilename: string,
    outputFilenames :string[],
  }


  @Component({
    selector: 'app-stored-pipelines',
    templateUrl: './stored-pipelines.component.html',
    styleUrls: ['./stored-pipelines.component.scss']
  })
  export class StoredPipelinesComponent implements OnInit {

    title = 'micRecorder';
    //Lets declare Record OBJ
    record;
    //Will use this flag for toggeling recording
    recording = false;
    //URL of Blob
    url;
    error;

    public canvas : any;
    public ctx;
    public datasets: any;
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
    inputFiles: FileList;
    inputFilesForm: FormData;
    fileName: string;
    fileToUpload: File | null = null;
    filesList: FileList = new DataTransfer().files;
    resultsArr: any[] = [];
    public formData : FormData;
    report : Blob = null;
    report_id: string | null = null;
    pipelines: any;
    pipeline: Pipeline;
    preprocessTitle: string = "";
    process : boolean = false;
    processError : boolean = false;
    processedFiles: number = 0;
    processPercentage: string = "0";
    staticAlertClosed5:boolean=true;
    staticAlertClosed6:boolean=true;
    succesMsg: string =" Success"
    errorMsg: string = "Error"

    processing:boolean = false;
    selectedPipeline :any ;
    separatedFilenames :any;
    separatedFileBlobs: any = [];
    separatedFileWavesurfer: any = [];  
    image:Blob
    imageURL:SafeUrl;

    showPipelineCard:boolean= true;
    showPipelineDetailCard:boolean= true;
    showResultCard:boolean= true;

    constructor(private http: HttpClient, private domSanitizer: DomSanitizer) { }

    ngOnInit(): void {

      this.getPipelines();
    }

    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    getPipelines(){
      this.http.get('/api/stored-pipelines').subscribe(
        response => {
          console.log("==> getPipelines(): response = ", response); 
          this.pipelines = response;
        },
        error => {

        }
      )
    }

    getPipeline(pipeline:any ){
      console.log("==> getPipeline(pipeline:any): ", pipeline)
      this.selectedPipeline = pipeline
      this.http.get<Pipeline>('/api/stored-pipelines/'+ pipeline.key).subscribe(
        response => {
          this.pipeline = response;
          this.togglePipelineCard();
          console.log("==> getPipeline(id): ", this.selectedPipeline);
        }
      )
    }

    onFileSelected(event) {
      this.filesList = event.target.files
      const file:File = this.filesList[0];
      if (file) {
          this.fileToUpload = file
          this.fileName = file.name;
          console.log(file.type)
          this.initWaveSurfer(this.fileToUpload)
      }
    }

    deleteSelectedFile(file){
      var dt = new DataTransfer();

      for (let i = 0; i < this.filesList.length; i++) {
        const _file = this.filesList.item(i);
        if(_file != file){
          dt.items.add(_file);
        }
      }

      this.filesList = dt.files; 
    }

    initWaveSurfer(file){
      this.fileToUpload = file
      this.fileName = file.name;
      console.log("==> initWaveSurfer(file) : file = ", file)
      document.getElementById("waveform").innerHTML = ""
      this.fileName = file.name;
      this.wavesurfer = WaveSurfer.create({
        container: '#waveform',
        backgroundColor:'black',
        progressColor: '#3B8686',
        // backend: 'MediaElement',
        scrollParent: true,
        plugins: [
          Regions.create({
            regions: [
            
          ]
          }),
          TimelinePlugin.create({
            container: '#wave-timeline',
            // formatTimeCallback: this.formatTimeCallback,
            timeInterval: 0.05,
            // primaryLabelInterval: this.primaryLabelInterval,
            // secondaryLabelInterval: this.secondaryLabelInterval,
            // ... other timeline options
          }),
          
        ]
      });


      // this.wavesurfer = this.wavesurfer.addPlugin(this.spectogram).initPlugin("spectogram");
      console.log(this.wavesurfer.getActivePlugins());
      
      // this.wavesurfer.load(fileName);
      this.wavesurfer.loadBlob(file)
    }

    setZoom(event){
      this.slider = event
      console.log("==>event: ", event);
      this.wavesurfer.zoom(Number(event));
    }

    runPipelineMultipleFile(selectedPipeline, filesList){
      this.processedFiles = 0;
      this.resultsArr = [];
        for (let i = 0; i < filesList.length; i++) {
          let fileToUpload = filesList.item(i);
          this.runPipeline(selectedPipeline, fileToUpload) 
        }
    }

    runPipeline(selectedPipeline, fileToUpload){
      console.log("-------------------------------RUN PIPELINE")
      this.showPipelineDetailCard = false;
      this.processing = true;
      console.log("==> runPipeline > this.selectedPipeline", this.selectedPipeline);
      console.log("==> runPipeline > selectedPipeline", selectedPipeline);
      console.log("==> runPipeline >   fileToUpload", fileToUpload);
      this.formData = new FormData();
      this.formData.append("title", fileToUpload.name); 
      this.formData.append("audiofile", fileToUpload);
      let api = '/api/stored-pipelines/'+ selectedPipeline.key;
      this.http.post(api, this.formData).subscribe(
        response => {
          this.processing=false;
          this.selectedPipeline = response[0];
          this.report_id = response[1];
          this.resultsArr.push([this.selectedPipeline, this.report_id, fileToUpload.name]);
          this.process =true;
          this.processedFiles += 1;
          this.processPercentage = ((this.processedFiles / this.filesList.length) * 100).toString();
          console.log("==> this.processPercentage ", this.processPercentage );
          for (let i = 0; i < this.selectedPipeline['steps'].length; i++) {          
            this.selectedPipeline['steps'][i].separatedFileWavesurfer = [];
            this.selectedPipeline['steps'][i].separatedFileBlobs =[]; 
            
            console.log("==> this.selectedPipeline['steps'][i]",this.selectedPipeline['steps'][i])
            this.selectedPipeline['steps'][i]['inputFilename'] = this.selectedPipeline['steps'][i]['inputFilename'].replace(/^.*[\\\/]/, '');
            
            for (let j = 0; j < this.selectedPipeline['steps'][i]['outputFilenames'].length; j++) {
              const element = this.selectedPipeline['steps'][i]['outputFilenames'][j];
              this.selectedPipeline['steps'][i]['outputFilenames'][j] = element.replace(/^.*[\\\/]/, '');
              console.log("==> this.selectedPipeline['steps'][i][j]", element);
              this.downloadSeparatedFile(
                this.selectedPipeline['steps'][i], 
                this.selectedPipeline['steps'][i].api, 
                this.selectedPipeline['steps'][i]['outputFilenames'][j],
                i, j); 
            }
          }

        },
        error => {
          console.error(error);
          this.processing =false;
          // step.processing_error = error;  
          this.processError = true;
        }
      );
    }

    downloadSeparatedFile(step: any, api:string, filename:string, step_index, file_index:number){
      this.http.get(api + "/"+ filename, { responseType: 'blob' }).subscribe(
        data => {
          document.getElementById('waveform-' + step_index+'-'+file_index).innerHTML = ""
          let wavesurfer = WaveSurfer.create({
            container: '#waveform-' + step_index+'-'+file_index,
            backgroundColor:'black',
          });
          step.separatedFileWavesurfer.push(wavesurfer)  ;
          step.separatedFileWavesurfer[file_index].loadBlob(data);
          step.separatedFileBlobs.push(data); 
          step.outputFileIds.push("output_"+ step_index + "_" + file_index);
        },
        error => {
          console.error(error);
        }
      )
    }

    loadResult(pipelineResult){
      this.selectedPipeline = pipelineResult[0];
      this.report_id = pipelineResult[1];

      for (let i = 0; i < this.selectedPipeline['steps'].length; i++) {          
      
        this.selectedPipeline['steps'][i].separatedFileWavesurfer = []; 
        console.log("==> this.selectedPipeline['steps'][i]",this.selectedPipeline['steps'][i])
        
        for (let j = 0; j < this.selectedPipeline['steps'][i]['outputFilenames'].length; j++) {

          document.getElementById('waveform-' + i +'-'+ j).innerHTML = ""
          let blob = this.selectedPipeline['steps'][i].separatedFileBlobs[j];
          const element = this.selectedPipeline['steps'][i]['outputFilenames'][j];
          let wavesurfer = WaveSurfer.create({container: '#waveform-' + i+'-'+ j, backgroundColor:'black'});
          this.selectedPipeline['steps'][i].separatedFileWavesurfer.push(wavesurfer)  ;
          this.selectedPipeline['steps'][i].separatedFileWavesurfer[j].loadBlob(blob);

          console.log("==> this.selectedPipeline['steps'][i][j] >> blob: ", blob);
          console.log("==> this.selectedPipeline['steps'][i][j]", element);
        }
      }

    }

    getReport(reportId: string){
      this.http.get("/api/report/"+ reportId, { responseType: 'blob' }).subscribe(
        data => {
          this.report = data;
          saveAs(this.report, this.report_id);
        }
      )
    }

    getReports(){
      for (let i = 0; i < this.resultsArr.length; i++) {
        const reportId = this.resultsArr[i][1];
        this.http.get("/api/report/"+ reportId, { responseType: 'blob' }).subscribe(
          data => {
            this.report = data;
            saveAs(data, reportId);
          }
        )
      }
    }

 
    sanitize(url: string) {
    return this.domSanitizer.bypassSecurityTrustUrl(url);
    }
    /**
    * Start recording.
    */
    initiateRecording() {
      
      this.recording = true;
      let mediaConstraints = {
      video: false,
      audio: true
      };
      
      navigator.mediaDevices.getUserMedia(mediaConstraints).then(this.successCallback.bind(this), this.errorCallback.bind(this));
    }
    /**
    * Will be called automatically.
    */
    successCallback(stream) {
    var options = {
    mimeType: "audio/wav",
    numberOfAudioChannels: 2,
    sampleRate: 44000,
    };
    //Start Actuall Recording
    var StereoAudioRecorder = RecordRTC.StereoAudioRecorder;
    this.record = new StereoAudioRecorder(stream);
    this.record.record();
    }
    /**
    * Stop recording.
    */
    stopRecording() {
    this.recording = false;
    this.record.stop(this.processRecording.bind(this));
    }
    /**
    * processRecording Do what ever you want with blob
    * @param  {any} blob Blog
    */
    processRecording(blob) {
    this.url = URL.createObjectURL(blob);
    // this.sanitize(this.url)
    console.log("blob", blob);
    console.log("url", this.url);
    const file:File = new File([blob], "prova_live.wav");
      if (file) {
          this.fileToUpload = file
          this.fileName = file.name;
          console.log(file.type)
          this.initWaveSurfer(this.fileToUpload)
      }

    var dt = new DataTransfer();
    for (let i = 0; i < this.filesList.length; i++) {
      const element = this.filesList.item(i);
        dt.items.add(element);
    }
    dt.items.add(file);
    this.filesList = dt.files;
    }
    /**
    * Process Error.
    */
    errorCallback(error) {
    this.error = 'Can not play audio in your browser';
    }

    togglePipelineCard(){
      this.showPipelineCard = !this.showPipelineCard;
    }

    togglePipelineDetailCard(){
      this.showPipelineDetailCard = !this.showPipelineDetailCard;
    }

  }
