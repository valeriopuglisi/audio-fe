import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pipelines',
  templateUrl: './pipelines.component.html',
  styleUrls: ['./pipelines.component.scss']
})
export class PipelinesComponent implements OnInit {

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
      system:"ECAPA-TDNN Sentence", 
      performance: "Accuracy=93.3% (test)"
    },
  ] 

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
  
  
  
  constructor() { }




  ngOnInit(): void {
  }

}
