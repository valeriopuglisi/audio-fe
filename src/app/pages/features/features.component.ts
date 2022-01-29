import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.scss']
})
export class FeaturesComponent implements OnInit {

  
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


  constructor() { }

  ngOnInit(): void {
  }

}
