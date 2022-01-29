import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadAudioFileComponent } from './upload-audio-file.component';

describe('UploadAudioFileComponent', () => {
  let component: UploadAudioFileComponent;
  let fixture: ComponentFixture<UploadAudioFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadAudioFileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadAudioFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
