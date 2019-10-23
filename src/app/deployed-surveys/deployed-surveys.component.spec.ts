import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeployedSurveysComponent } from './deployed-surveys.component';

describe('DeployedSurveysComponent', () => {
  let component: DeployedSurveysComponent;
  let fixture: ComponentFixture<DeployedSurveysComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeployedSurveysComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeployedSurveysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
