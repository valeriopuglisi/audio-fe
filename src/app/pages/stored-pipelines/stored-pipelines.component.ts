import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import WaveSurfer from 'wavesurfer.js';
import SpectrogramPlugin from 'wavesurfer.js/src/plugin/spectrogram';
import TimelinePlugin from 'wavesurfer.js/src/plugin/timeline';
import Regions from 'wavesurfer.js/src/plugin/regions';
import * as saveAs from 'file-saver';
import { toJSDate } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-calendar';


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
  report : Blob = null;
  report_id: string | null = null;
  pipelines: any;
  pipeline: Pipeline;
  preprocessTitle: string = "";
  process : boolean = false;
  processError : boolean = false;
  
  staticAlertClosed5:boolean=true;
  staticAlertClosed6:boolean=true;
  succesMsg: string =" Success"
  errorMsg: string = "Error"


  PreprocessingSteps = [
    {
      library: "Librosa",
      preprocess : "Linear-frequency power spectrogram",
      description: "Represents the time on the x-axis, the frequency in Hz on a linear scale on the y-axis, and the power in dB.",
      api: "/api/preprocess/linear_frequency_power_spectrogram"
    },
    {
      library: "Librosa",
      preprocess : "Log-frequency power spectrogram",
      description: "Such features can be obtained from a spectrogram by converting the linear frequency axis (measured in Hertz) into a logarithmic axis (measured in pitches). The resulting representation is also called log-frequency spectrogram.",
      api: "/api/preprocess/log_frequency_power_spectrogram"
    },
    {
      library: "librosa.feature.chroma_stft",
      preprocess : "Chroma STFT",
      description: "Compute a chromagram from a waveform or power spectrogram. This implementation is derived from chromagram_E (Ellis, Daniel P.W. “Chroma feature analysis and synthesis” 2007/04/21 http://labrosa.ee.columbia.edu/matlab/chroma-ansyn/)",
      api: '/api/preprocess/chroma_stft'
    },
    {
      library: "librosa.feature.chroma_cqt",
      preprocess : "Chroma CQT",
      description: "Constant-Q chromagram",
      api: '/api/preprocess/chroma_cqt'
    },
    {
      library: "librosa.feature.chroma_cens      ",
      preprocess : "Chroma CENS",
      description: "Computes the chroma variant “Chroma Energy Normalized” (CENS)" +
      "To compute CENS features, following steps are taken after obtaining chroma vectors using chroma_cqt:\n"+
      "1) L-1 normalization of each chroma vector, "+
      '2) Quantization of amplitude based on “log-like” amplitude thresholds,'+
      "3) (optional) Smoothing with sliding window."+ 
      "4) Default window length = 41 frames."+      
      " CENS features are robust to dynamics, timbre and articulation, thus these are commonly used in audio matching and retrieval applications."+
      "Meinard Müller and Sebastian Ewert “Chroma Toolbox: MATLAB implementations for extracting variants of chroma-based audio features”" +
      "In Proceedings of the International Conference on Music Information Retrieval (ISMIR), 2011.",
      api: '/api/preprocess/chroma_cens'
    },
    {
      library: "librosa.feature.melspectrogram",
      preprocess : "Melspectrogram",
      description: "Compute a mel-scaled spectrogram. If a spectrogram input S is provided, then it is mapped directly onto the mel basis by mel_f.dot(S)."+
      "If a time-series input y, sr is provided, then its magnitude spectrogram S is first computed, and then mapped onto the mel scale by mel_f.dot(S**power)."+
      "By default, power=2 operates on a power spectrum.",
      api: '/api/preprocess/melspectrogram'
    },
    {
      library: "librosa.feature.melspectrogram",
      preprocess : "Mel-frequency spectrogram",
      description: "Display of mel-frequency spectrogram coefficients, with custom arguments for mel filterbank construction (default is fmax=sr/2)",
      api: '/api/preprocess/melfrequencyspectrogram'
    },
    {
      library: "librosa.feature.mfcc",
      preprocess : "Mel-frequency cepstral coefficients (MFCCs)",
      description: "Mel-frequency cepstral coefficients (MFCCs)",
      api: '/api/preprocess/mfcc'
    },
    {
      library: "librosa.feature.mfcc",
      preprocess : "Compare different DCT bases",
      description: "Compare different DCT bases",
      api: '/api/preprocess/comparedct'
    },
    {
      library: "librosa.feature.rms",
      preprocess : "Root-Mean-Square (RMS) ",
      description: "Compute root-mean-square (RMS) value for each frame, either from the audio samples y or from a spectrogram S."+
      "Computing the RMS value from audio samples is faster as it doesn’t require a STFT calculation." +
      "However, using a spectrogram will give a more accurate representation of energy over time because its frames can be windowed,"+
      "thus prefer using S if it’s already available.",
      api: '/api/preprocess/rms'
    },
    {
      library: "librosa.feature.spectral_centroid",
      preprocess : "Spectral Centroid",
      description: "Compute the spectral centroid."+
      "Each frame of a magnitude spectrogram is normalized and treated as a distribution over frequency bins,"+
      "from which the mean (centroid) is extracted per frame."+
      "More precisely, the centroid at frame t is defined as centroid[t] = sum_k S[k, t] * freq[k] / (sum_j S[j, t]).",
      api: '/api/preprocess/spectral_centroid'
    },
    {
      library: "librosa.feature.spectral_bandwidth",
      preprocess : "Spectral Bandwidth",
      description: "Compute p’th-order spectral bandwidth. "+
      "The spectral bandwidth 1 at frame t is computed by [1]: "+
      "(sum_k S[k, t] * (freq[k, t] - centroid[t])**p)**(1/p). "+
      "[1] Klapuri, A., & Davy, M. (Eds.). (2007). Signal processing methods for music transcription, chapter 5. Springer Science & Business Media.",
      api: '/api/preprocess/spectral_bandwidth'
    },
    {
      library: "librosa.feature.spectral_contrast",
      preprocess : "Spectral Contrast",
      description: "Compute spectral contrast. "+
      "Each frame of a spectrogram S is divided into sub-bands."+
      "For each sub-band, the energy contrast is estimated by comparing the mean energy in the top quantile (peak energy) to that of the bottom quantile (valley energy)." +
      "High contrast values generally correspond to clear, narrow-band signals, while low contrast values correspond to broad-band noise. 1",
      api: '/api/preprocess/spectral_contrast'
    },
  ]
  processing:boolean = false;
  selectedPipeline :any ;
  separatedFilenames :any;
  separatedFileBlobs: any = [];
  separatedFileWavesurfer: any = [];  
  image:Blob
  imageURL:SafeUrl


  constructor(private http: HttpClient, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {

    this.getPipelines();
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
        console.log("==> getPipeline(id): ", this.selectedPipeline);
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

  runPipeline(){
    console.log("-------------------------------RUN PIPELINE")
    this.processing = true;
    console.log("==> runPipeline ", this.selectedPipeline);
    this.formData = new FormData();
    this.formData.append("title", this.fileToUpload.name); 
    this.formData.append("audiofile", this.fileToUpload);
    let api = '/api/stored-pipelines/'+this.selectedPipeline.key;
    this.http.post(api, this.formData).subscribe(
      response => {
        this.processing=false;
        this.selectedPipeline = response[0];
        this.report_id = response[1];
        this.process =true;
        console.log("==> this.selectedPipeline ", this.selectedPipeline );

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

  getReport(){
    this.http.get("/api/report/"+ this.report_id, { responseType: 'blob' }).subscribe(
      data => {
        this.report = data;
        saveAs(this.report, this.report_id);
      }
    )
  }

}
