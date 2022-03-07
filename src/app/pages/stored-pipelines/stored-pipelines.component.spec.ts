import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoredPipelinesComponent } from './stored-pipelines.component';

describe('StoredPipelinesComponent', () => {
  let component: StoredPipelinesComponent;
  let fixture: ComponentFixture<StoredPipelinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoredPipelinesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoredPipelinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
