import { HttpClient, HttpHeaders, } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js';
import * as saveAs from 'file-saver';
import { throwIfEmpty } from 'rxjs';
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


interface Pipeline {
  name: string;
  author: string;
  creationTime: string;
  notes: string;
  steps: PipelineStepToStore[],
}

interface PipelineStep {
    file: File | null,
    fileName: string | null,
    inputFileId: string | null,
    outputFileIds: string [],
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
  inputFileId : string,
  outputFileIds: string[],
  dataset:string,
  performance:string,
  system:string,
  inputFilename: string,
  outputFilenames :string[],
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
  
  
  AudioAnalysisSteps1 = {
    "Voice Activity Detection":[
      {
        task:	"Voice Activity Detection",
        dataset: "LibryParty", 
        system: "CRDNN",
        performance:	"F-score=0.9477 (test)",
        api: '/api/voice_activity_detection/vad_crdnn_libriparty'
      },
    ],
    "Automatic Speech Recognition": [
    {
      task:	"Automatic Speech Recognition",
      dataset: "LibriSpeech (English)", 
      system: "wav2vec2",
      performance: "WER=1.90% (test-clean)",
      api:""
    },
    {
      task:	"Automatic Speech Recognition",
      dataset: "LibriSpeech (English)", 
      system: "CRDNN + Transformer LM",
      performance: "WER=8.51% (test-clean)",
      api: '/api/automatic_speech_recognition/asr_crdnntransformerlm_librispeech_en'

    },
    {
      task:	"Automatic Speech Recognition",
      dataset: "LibriSpeech (English)", 
      system: "CRDNN + RNN +LM",
      performance: "WER=3.09% (test-clean)", 
      api: '/api/automatic_speech_recognition/asr_crdnnrnnlm_librispeech_en'
    },
    {
      task:	"Automatic Speech Recognition",
      dataset: "LibriSpeech (English)", 
      system: "Conformer + Transformer LM",
      performance: "WER=3.09% (test-clean)",
      api: '/api/automatic_speech_recognition/asr_conformer_transformerlm_librispeech_en'
    },

    {
      task:	"Automatic Speech Recognition	", 
      dataset: "LibriSpeech (English)", 
      system: "CNN + Transformer", 
      performance:"WER=2.46% (test-clean)",
      api:""
    },
    {
      task:	"Automatic Speech Recognition	",
      dataset: "TIMIT", 
      system: "CRDNN + distillation",
      performance: "PER=13.1% (test)",
      api:""
    },
    {
      task:	"Automatic Speech Recognition	",
      dataset: "TIMIT", 
      system:"wav2vec2 + CTC/Att.",
      performance:	"PER=8.04% (test)",
      api:""
    },
    {
      task: "Automatic Speech Recognition",	
      dataset: "CommonVoice (English)", 
      system: "wav2vec2 + CTC",
      performance:	"WER=15.69% (test)",
      api: '/api/automatic_speech_recognition/asr_wav2vec2_commonvoice_en'
    },
    {
      task: "Automatic Speech Recognition",	
      dataset: "CommonVoice (French)", 
      system:"wav2vec2 + CTC", 
      performance: "WER=9.96% (test)",
      api : '/api/automatic_speech_recognition/asr_wav2vec2_commonvoice_fr'
    },
    {
      task: "Automatic Speech Recognition",
      dataset: "CommonVoice (Italian)", 
      system:	"wav2vec2 + seq2seq",
      performance: "WER=9.86% (test)",
      api: '/api/automatic_speech_recognition/asr_wav2vec2_commonvoice_it'
    },
    {
      task: "Automatic Speech Recognition",
      dataset: "CommonVoice (Kinyarwanda)" , 
      system:	"wav2vec2 + seq2seq", 
      performance:	"WER=18.91% (test)",
      api: '/api/automatic_speech_recognition/asr_wav2vec2_commonvoice_rw'
    },
    {
      task: "Automatic Speech Recognition",
      dataset: "AISHELL (Mandarin)", 
      system:	"wav2vec2 + seq2seq", 
      performance:	"CER=5.58% (test)",
      api: '/api/automatic_speech_recognition/asr_wav2vec2_transformer_aishell_mandarin_chinese'
      
    },

    ],
    "Speech Translation":[
      {
        task:	"Speech Translation",
        dataset: "Fisher-callhome (spanish)", 
        system:	"conformer (ST + ASR)", 
        performance: "BLEU=48.04 (test)",
        api:""
      },
    ],
    "Speaker Verification": [
      {
        task:	"Speaker Verification	",
        dataset: "VoxCeleb2", 
        system: "ECAPA-TDNN",
        performance:	"EER=0.69% (vox1-test)",
        api:""
      },
    ],
    "Speaker Diarization": [
      {
        task:	"Speaker Diarization	",
        dataset: "AMI", 
        system:"ECAPA-TDNN",
        performance:	"DER=3.01% (eval)",
        api:"",
      },
    ],
    "Speech Enhancement":[
      {
        task:	"Speech Enhancement", 
        dataset: "VoiceBank",
        system: "MetricGAN+",
        performance: "PESQ=3.08 (test)",
        api: '/api/speech_enhancement/enhancement_metricganplus_voicebank'
      },
      {
        task:	"Speech Enhancement", 
        dataset: "WHAMR!",
        system: "SepFormer",
        performance: "PESQ=3.08 (test)",
        api: '/api/speech_enhancement/enhancement_sepformer_whamr'
      },
      {
        task:	"Speech Enhancement", 
        dataset: "WHAM!",
        system: "SepFormer",
        performance: "PESQ=3.08 (test)",
        api: '/api/speech_enhancement/enhancement_sepformer_wham'
      },
    ],
    "Speech Separation":[
      {
        task:	"Speech Separation", 
        dataset: "WSJ2MIX", 
        system: "SepFormer",
        performance: "SDRi=22.6 dB (test)",
        api: '/api/audioseparation/speech_separation_sepformer_wsj02mix'
      },
      {
        task:	"Speech Separation", 
        dataset: "WSJ3MIX", 
        system: "SepFormer",
        performance: "SDRi=20.0 dB (test)",
        api: '/api/audioseparation/speech_separation_sepformer_wsj03mix'
  
      },
      {
        task:	"Speech Separation", 
        dataset: "WHAM!", 
        system: "SepFormer",
        performance: "SDRi= 16.4 dB (test)",
        api: '/api/audioseparation/speech_separation_sepformer_wham'
      },
      {
        task:	"Speech Separation", 
        dataset: "WHAMR!", 
        system: "SepFormer",
        performance: "SDRi= 14.0 dB (test)",
        api: '/api/audioseparation/speech_separation_sepformer_whamr'
      },
      {
        task:	"Speech Separation", 
        dataset: "Libri2Mix", 
        system: "SepFormer",
        performance: "SDRi= 20.6 dB (test-clean)",
        api: ""
       
      },
      {
        task:	"Speech Separation", 
        dataset: "Libri3Mix", 
        system: "SepFormer",
        performance: "SDRi= 18.7 dB (test-clean)",
        api: ""
      },
    ],
       
    "Emotion Recognition":[
      {
        task:	"Emotion Recognition", 
        dataset: "IEMOCAP", 
        system: "wav2vec", 
        performance:	"Accuracy=79.8% (test)",
        api: '/api/emotion_recognition/wav2vec2_IEMOCAP'
      },
    ],
    "Language Identification": [
      {
        task:	"Language Identification", 
        dataset: "CommonLanguage", 
        system: "ECAPA-TDNN",	
        performance: "Accuracy=84.9% (test)",
        api: '/api/language_id/langid_commonlanguage_ecapa'
      },
      {
        task:"Language Identification",
        dataset: "VoxLingua 107", 
        system:"ECAPA-TDNN Sentence", 
        performance: "Accuracy=93.3% (test)",
        api: '/api/language_id/langid_voxlingua107_ecapa'
      },
    ],
    "Spoken, Language Understanding":[
      {
        task:	"Spoken, Language Understanding",
        dataset: "Timers and Such", 
        system:	"CRDNN Intent",
        performance: "Accuracy=89.2% (test)",
        api:""
      },
      {
        task:"Spoken, Language Understanding", 
        dataset: "SLURP", 
        system:	"CRDNN	Intent", 
        performance:"Accuracy=87.54% (test)",
        api:""
      },
    ]    
  }

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
  
  constructor(private http: HttpClient){}
  
  ngOnInit() {
    this.getFiles();
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
      
  downloadFile(step:any, filename:string){
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
      
      case "Voice Activity Detection":
        this.separateFile(step, step_index);
        break;

      case "Emotion Recognition":
          this.analyzeFile(step);
        break;
  
      case "Speech Enhancement":
        this.separateFile(step, step_index);
        break;

      case "Speech Separation":
        this.separateFile(step, step_index);
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

  separateFile(step:PipelineStep,step_index){
    step.processing = true;
    this.formData = new FormData();
    this.formData.append("title", step.fileName); 
    this.formData.append("audiofile", step.file);
    this.http.post(step.api , this.formData).subscribe(
      (response: string[]) => {
        step.separatedFilenames = response;
        console.log("separateFile() => step.separatedFilenames: ", step.separatedFilenames);
        for (let i = 0; i < step.separatedFilenames.length; i++) {
          const separatedFilename = step.separatedFilenames[i];
          this.downloadSeparatedFile(step, step.api, separatedFilename, step_index, i) 
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

  downloadSeparatedFile(step: PipelineStep, api:string, filename:string, step_index, file_index:number){
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
                
                
                
                
                