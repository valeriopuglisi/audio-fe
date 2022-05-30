import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.scss']
})
export class FeaturesComponent implements OnInit {

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


  constructor(private http: HttpClient, private deepLearningFeaturesService: DeepLearningFeaturesService,  private domSanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.getDLFeatures();
  }

  getDLFeatures(){
    this.deepLearningFeaturesService.getDeepLearningFeatures().subscribe(
      response => {
        console.log("getDLFeatures: ", response)
        let apiList = JSON.parse(response.toString());
        for (var key in apiList) {
          this.AudioFeatures[apiList[key].task].push(apiList[key])    
        }
      }
    )
  }



  onFileSelected(event) {
    const file:File = event.target.files[0];
    if (file) {
        this.fileToUpload = file
        this.fileName = file.name;
        console.log(file.type)
        this.initWaveSurfer(this.fileToUpload)
    }
  }

  initWaveSurfer(file){
    document.getElementById("waveform").innerHTML = ""
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

  processFile(processApi, description:string){
    this.analysisStep = processApi;
    this.analysisTitle = description; 
    console.log("==> processFile : processApi = ");
    console.log(processApi)

    switch (processApi.task) {
      case "Language Identification + Automatic Speech Recognition":
        this.analyzeFile(processApi.api);
        break;

      case "Automatic Speech Recognition":
        this.analyzeFile(processApi.api);
        break;

      case "Language Identification":
        this.analyzeFile(processApi.api);
        break;
      
      case "Voice Activity Detection":
        this.separateFile(processApi.api);
        break;

      case "Emotion Recognition":
          this.analyzeFile(processApi.api);
        break;
  
      case "Speech Enhancement":
        this.separateFile(processApi.api);
        break;

      case "Speech Separation":
        this.separateFile(processApi.api);
        break;
    
      default:
        break;
    }    
  }

  setZoom(event){
    this.slider = event
    console.log("==>event: ", event);
    this.wavesurfer.zoom(Number(event));
  }


  analyzeFile(api:string){
    this.processing = true;
    console.log("==> analyzeApi : ", api)
    this.formData = new FormData();
    this.formData.append("title", this.fileName); 
    this.formData.append("audiofile", this.fileToUpload);
    this.http.post(api, this.formData).subscribe(
      response => {
        this.process =true;
        this.processError =false;
        console.log(response)  
        this.analysisResult = response.toString();
        this.processing = false;         
      },
      error => {
        console.error(error);
        this.process =false;
        this.processError = true;
        this.processing = false;
      }
    );
  }

  separateFile(api:string){
    this.processing = true;
    this.formData = new FormData();
    this.formData.append("title", this.fileName); 
    this.formData.append("audiofile", this.fileToUpload);
    this.http.post(api , this.formData).subscribe(
      response => {
       
        this.separatedFilenames = response;
        console.log(this.separatedFilenames);
        for (let i = 0; i < this.separatedFilenames.length; i++) {
          const separatedFilename = this.separatedFilenames[i];
          this.downloadSeparatedFile(api, separatedFilename, i) 
        }
        this.process =true;
        this.processError =false;
        this.processing = false;
      },
      error => {
        console.error(error);
        this.process =false;
        this.processError = true;
        
      }
    );
  }

  downloadSeparatedFile(api:string, filename:string, index:number){
    this.http.get(api + "/"+ filename, { responseType: 'blob' }).subscribe(
      data => {
        let wavesurfer = WaveSurfer.create({
          container: '#waveform-' + index,
          backgroundColor:'black',
        });
        this.separatedFileWavesurfer.push(wavesurfer)  
        this.separatedFileWavesurfer[index].loadBlob(data);
        this.separatedFileBlobs.push(data); 
      }
    )
  }

  saveSeparatedFile(index:number){
    console.log(this.separatedFileBlobs)
    console.log(this.separatedFilenames)
    saveAs(this.separatedFileBlobs[index], this.separatedFilenames[index]);
  }

  onSelectTask(task:string){
  console.log("==> task: ", task);
  this.selectedTask = task
  }

  title = 'micRecorder';
  //Lets declare Record OBJ
  record;
  //Will use this flag for toggeling recording
  recording = false;
  //URL of Blob
  url;
  error;
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
    console.log("blob", blob);
    console.log("url", this.url);
    const file:File = new File([blob], "prova_live.wav");
      if (file) {
          this.fileToUpload = file
          this.fileName = file.name;
          console.log(file.type)
          this.initWaveSurfer(this.fileToUpload)
      }

  }
  /**
  * Process Error.
  */
  errorCallback(error) {
  this.error = 'Can not play audio in your browser';
  }




}
