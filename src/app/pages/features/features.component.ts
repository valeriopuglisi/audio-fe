import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import WaveSurfer from 'wavesurfer.js';
import SpectrogramPlugin from 'wavesurfer.js/src/plugin/spectrogram';
import TimelinePlugin from 'wavesurfer.js/src/plugin/timeline';
import Regions from 'wavesurfer.js/src/plugin/regions';
import * as saveAs from 'file-saver';
import { ThrowStmt } from '@angular/compiler';

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
  
  // AudioAnalysisSteps = [
  //   // {
  //   //   task:	"Automatic Speech Recognition",
  //   //   dataset: "LibriSpeech", 
  //   //   system: "wav2vec2",
  //   //   performance: "WER=1.90% (test-clean)"
  //   // },
  //   // {
  //   //   task:	"Automatic Speech Recognition	", 
  //   //   dataset: "LibriSpeech", 
  //   //   system: "CNN + Transformer", 
  //   //   performance:"WER=2.46% (test-clean)"
  //   // },
  //   // {
  //   //   task:	"Automatic Speech Recognition	",
  //   //   dataset: "TIMIT", 
  //   //   system: "CRDNN + distillation",
  //   //   performance: "PER=13.1% (test)"
  //   // },
  //   // {
  //   //   task:	"Automatic Speech Recognition	",
  //   //   dataset: "TIMIT", 
  //   //   system:"wav2vec2 + CTC/Att.",
  //   //   performance:	"PER=8.04% (test)"
  //   // },
  //   {
  //     task: "Automatic Speech Recognition",	
  //     dataset: "CommonVoice (English)", 
  //     system: "wav2vec2 + CTC",
  //     performance:	"WER=15.69% (test)",
  //     api: '/api/automatic_speech_recognition/asr_wav2vec2_commonvoice_en'
  //   },
  //   {
  //     task: "Automatic Speech Recognition",	
  //     dataset: "CommonVoice (French)", 
  //     system:"wav2vec2 + CTC", 
  //     performance: "WER=9.96% (test)",
  //     api : '/api/automatic_speech_recognition/asr_wav2vec2_commonvoice_fr'
  //   },
  //   {
  //     task: "	Automatic Speech Recognition",
  //     dataset: "CommonVoice (Italian)", 
  //     system:	"wav2vec2 + seq2seq",
  //     performance: "WER=9.86% (test)",
  //     api: '/api/automatic_speech_recognition/asr_wav2vec2_commonvoice_it'
  //   },
  //   {
  //     task: "Automatic Speech Recognition",
  //     dataset: "CommonVoice (Kinyarwanda)" , 
  //     system:	"wav2vec2 + seq2seq", 
  //     performance:	"WER=18.91% (test)",
  //     api: '/api/automatic_speech_recognition/asr_wav2vec2_commonvoice_rw'
  //   },
  //   {
  //     task: "Automatic Speech Recognition",
  //     dataset: "AISHELL (Mandarin)", 
  //     system:	"wav2vec2 + seq2seq", 
  //     performance:	"CER=5.58% (test)",
  //     api: '/api/automatic_speech_recognition/asr_wav2vec2_transformer_aishell_mandarin_chinese'
      
  //   },
  //   // {
  //   //   task:	"Speech translation",
  //   //   dataset: "Fisher-callhome (spanish)", 
  //   //   system:	"conformer (ST + ASR)", 
  //   //   performance: "BLEU=48.04 (test)"
  //   // },
  //   // {
  //   //   task:	"Speaker Verification	",
  //   //   dataset: "VoxCeleb2", 
  //   //   system: "ECAPA-TDNN",
  //   //   performance:	"EER=0.69% (vox1-test)"
  //   // },
  //   // {
  //   //   task:	"Speaker Diarization	",
  //   //   dataset: "AMI", 
  //   //   system:"ECAPA-TDNN",
  //   //   performance:	"DER=3.01% (eval)"
  //   // },
  //   {
  //     task:	"Speech Enhancement", 
  //     dataset: "VoiceBank",
  //     system: "MetricGAN+",
  //     performance: "PESQ=3.08 (test)",
  //     api: '/api/speech_enhancement/enhancement_metricganplus_voicebank'
  //   },
  //   {
  //     task:	"Speech Separation", 
  //     dataset: "WSJ2MIX", 
  //     system: "SepFormer",
  //     performance: "SDRi=22.6 dB (test)",
  //     api: '/api/audioseparation/speech_separation_sepformer_wsj02mix'
  //   },
  //   {
  //     task:	"Speech Separation", 
  //     dataset: "WSJ3MIX", 
  //     system: "SepFormer",
  //     performance: "SDRi=20.0 dB (test)",
  //     api: '/api/audioseparation/speech_separation_sepformer_wsj02mix'

  //   },
  //   {
  //     task:	"Speech Separation", 
  //     dataset: "WHAM!", 
  //     system: "SepFormer",
  //     performance: "SDRi= 16.4 dB (test)",
  //     api: '/api/audioseparation/speech_separation_sepformer_wham'
  //   },
  //   {
  //     task:	"Speech Separation", 
  //     dataset: "WHAMR!", 
  //     system: "SepFormer",
  //     performance: "SDRi= 14.0 dB (test)",
  //     api: '/api/audioseparation/speech_separation_sepformer_whamr'
  //   },
  //   // {
  //   //   task:	"Speech Separation", 
  //   //   dataset: "Libri2Mix", 
  //   //   system: "SepFormer",
  //   //   performance: "SDRi= 20.6 dB (test-clean)",
     
  //   // },
  //   // {
  //   //   task:	"Speech Separation", 
  //   //   dataset: "Libri3Mix", 
  //   //   system: "SepFormer",
  //   //   performance: "SDRi= 18.7 dB (test-clean)",
  //   // },
  //   {
  //     task:	"Voice Activity Detection",
  //     dataset: "LibryParty", 
  //     system: "CRDNN",
  //     performance:	"F-score=0.9477 (test)",
  //     api: '/api/voice_activity_detection/vad_crdnn_libriparty'
  //   },
  //   {
  //     task:	"Emotion Recognition", 
  //     dataset: "IEMOCAP", 
  //     system: "wav2vec", 
  //     performance:	"Accuracy=79.8% (test)",
  //     api: '/api/emotion_recognition/wav2vec2_IEMOCAP'
  //   },
  //   {
  //     task:	"Language Identification", 
  //     dataset: "CommonLanguage", 
  //     system: "ECAPA-TDNN",	
  //     performance: "Accuracy=84.9% (test)",
  //     api: '/api/language_id/langid_commonlanguage_ecapa'
  //   },
  //   // {
  //   //   task:	"Spoken, Language Understanding",
  //   //   dataset: "Timers and Such", 
  //   //   system:	"CRDNN Intent",
  //   //   performance: "Accuracy=89.2% (test)"
  //   // },
  //   // {
  //   //   task:"Spoken, Language Understanding", 
  //   //   dataset: "SLURP", 
  //   //   system:	"CRDNN	Intent", 
  //   //   performance:"Accuracy=87.54% (test)"
  //   // },
  //   {
  //     task:"Language Identification",
  //     dataset: "VoxLingua 107", 
  //     system:"ECAPA-TDNN Sentence", 
  //     performance: "Accuracy=93.3% (test)",
  //     api: '/api/language_id/langid_voxlingua107_ecapa'
  //   },
  // ]
  
  
  AudioAnalysisSteps1 = {
    "Automatic Speech Recognition": [
    {
      task:	"Automatic Speech Recognition",
      dataset: "LibriSpeech (English)", 
      system: "wav2vec2",
      performance: "WER=1.90% (test-clean)"
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
      performance:"WER=2.46% (test-clean)"
    },
    {
      task:	"Automatic Speech Recognition	",
      dataset: "TIMIT", 
      system: "CRDNN + distillation",
      performance: "PER=13.1% (test)"
    },
    {
      task:	"Automatic Speech Recognition	",
      dataset: "TIMIT", 
      system:"wav2vec2 + CTC/Att.",
      performance:	"PER=8.04% (test)"
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
        task:	"Speech translation",
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
        api:""
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
        api: null
       
      },
      {
        task:	"Speech Separation", 
        dataset: "Libri3Mix", 
        system: "SepFormer",
        performance: "SDRi= 18.7 dB (test-clean)",
        api: null
      },
    ],
    "Voice Activity Detection":[
      {
        task:	"Voice Activity Detection",
        dataset: "LibryParty", 
        system: "CRDNN",
        performance:	"F-score=0.9477 (test)",
        api: '/api/voice_activity_detection/vad_crdnn_libriparty'
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
    "Spoken Language Understanding":[
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


  constructor(private http: HttpClient, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {

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
      },
      error => {
        console.error(error);
        this.process =false;
        this.processError = true;

      }
    );
  }

  separateFile(api:string){
    this.formData = new FormData();
    this.formData.append("title", this.fileName); 
    this.formData.append("audiofile", this.fileToUpload);
    this.http.post(api , this.formData).subscribe(
      response => {
        this.process =true;
        this.processError =false;
        this.separatedFilenames = response;
        console.log(this.separatedFilenames);
        for (let i = 0; i < this.separatedFilenames.length; i++) {
          const separatedFilename = this.separatedFilenames[i];
          this.downloadSeparatedFile(api, separatedFilename, i) 
        }
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



}
