import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import WaveSurfer from 'wavesurfer.js';
import SpectrogramPlugin from 'wavesurfer.js/src/plugin/spectrogram';
import TimelinePlugin from 'wavesurfer.js/src/plugin/timeline';
import Regions from 'wavesurfer.js/src/plugin/regions';
import * as saveAs from 'file-saver';

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

  preprocessTitle: string = "";
  preprocess : boolean = false;
  preprocessError : boolean = false;
  
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
  
  separatedFilenames :any;
  separatedFileBlobs: any = [];
  separatedFileWavesurfer: any = [];  
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

  preprocessFile(preprocessApi: string, description:string){
    this.preprocessTitle = description; 
    this.formData = new FormData();
    this.formData.append("title", this.fileName); 
    this.formData.append("audiofile", this.fileToUpload);
    this.http.post(preprocessApi, this.formData, {responseType: 'blob'}).subscribe(
      response => {
        this.preprocess =true;
        this.preprocessError =false;
        console.log(response)
        this.image = response
        this.imageURL = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(this.image))
        
      },
      error => {
        console.error(error);
        this.preprocess =true;
        this.preprocessError = true;

      }
    );
  }

  setZoom(event){
    this.slider = event
    console.log("==>event: ", event);
    this.wavesurfer.zoom(Number(event));
  }


}
