import { HttpClient, HttpHeaders, } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js';
import * as saveAs from 'file-saver';
import { throwIfEmpty } from 'rxjs';
import { isElementAccessChain } from 'typescript';
import WaveSurfer from 'wavesurfer.js';
import SpectrogramPlugin from 'wavesurfer.js/src/plugin/spectrogram';
import TimelinePlugin from 'wavesurfer.js/src/plugin/timeline';


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


  AudioAnalysisSteps = [
  {
    dataset: "LibriSpeech", 
    task:	"Speech Recognition",
    system: "wav2vec2",
    performance: "WER=1.90% (test-clean)"
  },
  {
    dataset: "LibriSpeech", 
    task:	"Speech Recognition	", 
    system: "CNN + Transformer", 
    performance:"WER=2.46% (test-clean)"
  },
  {
    dataset: "TIMIT", 
    task:	"Speech Recognition	",
    system: "CRDNN + distillation",
    performance: "PER=13.1% (test)"
  },
  {
    dataset: "TIMIT", 
    task:	"Speech Recognition	",
    system:"wav2vec2 + CTC/Att.",
    performance:	"PER=8.04% (test)"
  },
  {
    dataset: "CommonVoice (English)", 
    task: "Speech Recognition",	
    system: "wav2vec2 + CTC",
    performance:	"WER=15.69% (test)"
  },
  {
    dataset: "CommonVoice (French)", 
    task: "Speech Recognition",	
    system:"wav2vec2 + CTC", 
    performance: "WER=9.96% (test)"
  },
  {
    dataset: "CommonVoice (Italian)", 
    task: "	Speech Recognition",
    system:	"wav2vec2 + seq2seq",
    performance: "WER=9.86% (test)"
  },
  {
    dataset: "CommonVoice (Kinyarwanda)" , 
    task: "Speech Recognition",
    system:	"wav2vec2 + seq2seq", 
    performance:	"WER=18.91% (test)",
  },
  {
    dataset: "AISHELL (Mandarin)", 
    task: "Speech Recognition",
    system:	"wav2vec2 + seq2seq", 
    performance:	"CER=5.58% (test)",
  },
  {
    dataset: "Fisher-callhome (spanish)", 
    task:	"Speech translation",
    system:	"conformer (ST + ASR)", 
    performance: "BLEU=48.04 (test)"
  },
  {
    dataset: "VoxCeleb2", 
    task:	"Speaker Verification	",
    system: "ECAPA-TDNN",
    performance:	"EER=0.69% (vox1-test)"
  },
  {
    dataset: "AMI", 
    task:	"Speaker Diarization	",
    system:"ECAPA-TDNN",
    performance:	"DER=3.01% (eval)"
  },
  {
    dataset: "VoiceBank",
    task:	"Speech Enhancement", 
    system: "MetricGAN+",
    performance: "PESQ=3.08 (test)"
  },
  {
    dataset: "WSJ2MIX", 
    task:	"Speech Separation", 
    system: "SepFormer",
    performance: "SDRi=22.6 dB (test)"
  },
  {
    dataset: "WSJ3MIX", 
    task:	"Speech Separation", 
    system: "SepFormer",
    performance: "SDRi=20.0 dB (test)"
  },
  {
    dataset: "WHAM!", 
    task:	"Speech Separation", 
    system: "SepFormer",
    performance: "SDRi= 16.4 dB (test)"
  },
  {
    dataset: "WHAMR!", 
    task:	"Speech Separation", 
    system: "SepFormer",
    performance: "SDRi= 14.0 dB (test)"
  },
  {
    dataset: "Libri2Mix", 
    task:	"Speech Separation", 
    system: "SepFormer",
    performance: "SDRi= 20.6 dB (test-clean)"
  },
  {
    dataset: "Libri3Mix", 
    task:	"Speech Separation", 
    system: "SepFormer",
    performance: "SDRi= 18.7 dB (test-clean)"
  },
  {
    dataset: "LibryParty", 
    task:	"Voice Activity Detection",
    system: "CRDNN",
    performance:	"F-score=0.9477 (test)"
  },
  {
    dataset: "IEMOCAP", 
    task:	"Emotion Recognition", 
    system: "wav2vec", 
    performance:	"Accuracy=79.8% (test)"
  },
  {
    dataset: "CommonLanguage", 
    task:	"Language Recognition	", 
    system: "ECAPA-TDNN",	
    performance: "Accuracy=84.9% (test)"
  },
  {
    dataset: "Timers and Such", 
    task:	"Spoken, Language Understanding",
    system:	"CRDNN Intent",
    performance: "Accuracy=89.2% (test)"
  },
  {
    dataset: "SLURP", 
    task:"Spoken, Language Understanding", 
    system:	"CRDNN	Intent", 
    performance:"Accuracy=87.54% (test)"
  },
  {
    dataset: "VoxLingua 107", 
    task:"Identification",
    system:"ECAPA-TDNN	Sentence Accuracy=93.3% (test)"
  },
  ]
  
  separatedFilenames :any;
  separatedFileBlobs: any = [];
  separatedFileWavesurfer: any = [];  


  


  

  public files: any[] = [];

  constructor(private http: HttpClient){}

  ngOnInit() {
      this.getFiles();
  }

  onFileSelected(event) {

    const file:File = event.target.files[0];
    if (file) {
        this.fileToUpload = file
        this.fileName = file.name;
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

  downloadFile(filename:string){
    this.http.get("/api/audiofiles/"+ filename, { responseType: 'blob' }).subscribe(
      data => {
        this.fileToUpload = new File([data], filename)
        this.fileName = filename;
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

  separateFile(){
    this.http.post("/api/audioseparation", this.formData).subscribe(
      response => {
        this.separatedFilenames = response;
        console.log(this.separatedFilenames);
        for (let i = 0; i < this.separatedFilenames.length; i++) {
          const separatedFilename = this.separatedFilenames[i];
          this.downloadSeparatedFile(separatedFilename, i) 
        }
      },
      error => {
        console.error(error);
        
      }
    );
  }


  downloadSeparatedFile(filename:string, index:number){
    this.http.get("/api/audioseparation/"+ filename, { responseType: 'blob' }).subscribe(
      data => {
        let wavesurfer = WaveSurfer.create({
          container: '#waveform-' + index,
          backgroundColor:'black',
          // waveColor: '#fb6340',
          // progressColor: '#f5365c',
          // loaderColor: 'purple',
          // cursorColor: 'navy',
          // barWidth: 2,
          // barHeight: 1, // the height of the wave
          // barGap: null, // the optional spacing between bars of the wave, if not provided will be calculated in legacy format
          // plugins: [
          //   TimelinePlugin.create({
          //       container: '#wave-timeline-' + index,
          //       // formatTimeCallback: this.formatTimeCallback,
          //       // timeInterval: this.timeInterval,
          //       // primaryLabelInterval: this.primaryLabelInterval,
          //       // secondaryLabelInterval: this.secondaryLabelInterval,
          //       // ... other timeline options
          //   }),
          //   SpectrogramPlugin.create({
          //     container: '#wave-spectrogram-' + index,
          //     labels: true,
          //     colorMap: colorMap
          //   })
          // ]
        });
        // this.wavesurfer = this.wavesurfer.addPlugin(this.spectogram).initPlugin("spectogram");
        console.log(wavesurfer.getActivePlugins());
        
        // this.wavesurfer.load(fileName);
        // wavesurfer.loadBlob(data);
        this.separatedFileWavesurfer.push(wavesurfer)  
        console.log("==>this.separatedFileWavesurfer[i]: ");
        console.log(this.separatedFileWavesurfer[index]);
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

  deleteFile(f){
    this.files = this.files.filter(function(w){ return w.name != f.name });
    
  }

  deleteFromArray(index) {
    console.log(this.files);
    this.files.splice(index, 1);
  }

 

  initWaveSurfer(colorMap, fileName){
    this.wavesurfer = WaveSurfer.create({
      container: '#waveform',
      backgroundColor:'black',
      // waveColor: '#fb6340',
      // progressColor: '#f5365c',
      // loaderColor: 'purple',
      // cursorColor: 'navy',
      // barWidth: 2,
      // barHeight: 1, // the height of the wave
      // barGap: null, // the optional spacing between bars of the wave, if not provided will be calculated in legacy format
      plugins: [
        TimelinePlugin.create({
            container: '#wave-timeline',
            // formatTimeCallback: this.formatTimeCallback,
            // timeInterval: this.timeInterval,
            // primaryLabelInterval: this.primaryLabelInterval,
            // secondaryLabelInterval: this.secondaryLabelInterval,
            // ... other timeline options
        }),
        SpectrogramPlugin.create({
          container: "#wave-spectrogram",
          labels: true,
          colorMap: colorMap
        })
      ]
    });
    // this.wavesurfer = this.wavesurfer.addPlugin(this.spectogram).initPlugin("spectogram");
    console.log(this.wavesurfer.getActivePlugins()  );
    
    // this.wavesurfer.load(fileName);
    this.wavesurfer.loadBlob(fileName)
  }


  /**
 * Use formatTimeCallback to style the notch labels as you wish, such
 * as with more detail as the number of pixels per second increases.
 *
 * Here we format as M:SS.frac, with M suppressed for times < 1 minute,
 * and frac having 0, 1, or 2 digits as the zoom increases.
 *
 * Note that if you override the default function, you'll almost
 * certainly want to override timeInterval, primaryLabelInterval and/or
 * secondaryLabelInterval so they all work together.
 *
 * @param: seconds
 * @param: pxPerSec
 */
formatTimeCallback(seconds, pxPerSec) {
  seconds = Number(seconds);
  var minutes = Math.floor(seconds / 60);
  seconds = seconds % 60;

  // fill up seconds with zeroes
  var secondsStr = Math.round(seconds).toString();
  if (pxPerSec >= 25 * 10) {
      secondsStr = seconds.toFixed(2);
  } else if (pxPerSec >= 25 * 1) {
      secondsStr = seconds.toFixed(1);
  }

  if (minutes > 0) {
      if (seconds < 10) {
          secondsStr = '0' + secondsStr;
      }
      return `${minutes}:${secondsStr}`;
  }
  return secondsStr;
}

/**
* Use timeInterval to set the period between notches, in seconds,
* adding notches as the number of pixels per second increases.
*
* Note that if you override the default function, you'll almost
* certainly want to override formatTimeCallback, primaryLabelInterval
* and/or secondaryLabelInterval so they all work together.
*
* @param: pxPerSec
*/
timeInterval(pxPerSec) {
  var retval = 1;
  if (pxPerSec >= 25 * 100) {
      retval = 0.01;
  } else if (pxPerSec >= 25 * 40) {
      retval = 0.025;
  } else if (pxPerSec >= 25 * 10) {
      retval = 0.1;
  } else if (pxPerSec >= 25 * 4) {
      retval = 0.25;
  } else if (pxPerSec >= 25) {
      retval = 1;
  } else if (pxPerSec * 5 >= 25) {
      retval = 5;
  } else if (pxPerSec * 15 >= 25) {
      retval = 15;
  } else {
      retval = Math.ceil(0.5 / pxPerSec) * 60;
  }
  return retval;
}

/**
* Return the cadence of notches that get labels in the primary color.
* EG, return 2 if every 2nd notch should be labeled,
* return 10 if every 10th notch should be labeled, etc.
*
* Note that if you override the default function, you'll almost
* certainly want to override formatTimeCallback, primaryLabelInterval
* and/or secondaryLabelInterval so they all work together.
*
* @param pxPerSec
*/
primaryLabelInterval(pxPerSec) {
  var retval = 1;
  if (pxPerSec >= 25 * 100) {
      retval = 10;
  } else if (pxPerSec >= 25 * 40) {
      retval = 4;
  } else if (pxPerSec >= 25 * 10) {
      retval = 10;
  } else if (pxPerSec >= 25 * 4) {
      retval = 4;
  } else if (pxPerSec >= 25) {
      retval = 1;
  } else if (pxPerSec * 5 >= 25) {
      retval = 5;
  } else if (pxPerSec * 15 >= 25) {
      retval = 15;
  } else {
      retval = Math.ceil(0.5 / pxPerSec) * 60;
  }
  return retval;
}

/**
* Return the cadence of notches to get labels in the secondary color.
* EG, return 2 if every 2nd notch should be labeled,
* return 10 if every 10th notch should be labeled, etc.
*
* Secondary labels are drawn after primary labels, so if
* you want to have labels every 10 seconds and another color labels
* every 60 seconds, the 60 second labels should be the secondaries.
*
* Note that if you override the default function, you'll almost
* certainly want to override formatTimeCallback, primaryLabelInterval
* and/or secondaryLabelInterval so they all work together.
*
* @param pxPerSec
*/
secondaryLabelInterval(pxPerSec) {
  // draw one every 10s as an example
  return Math.floor(10 / this.timeInterval(pxPerSec));
}



  // Create function which you use in (change)-event of your file input tag:
  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }

  public updateOptions() {
    this.myChartData.data.datasets[0].data = this.data;
    this.myChartData.update();
  }

}
function importedSaveAs(blob: any, fileName: string) {
  throw new Error('Function not implemented.');
}

