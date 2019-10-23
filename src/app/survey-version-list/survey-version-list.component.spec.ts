import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyVersionListComponent } from './survey-version-list.component';

describe('SurveyVersionListComponent', () => {
  let component: SurveyVersionListComponent;
  let fixture: ComponentFixture<SurveyVersionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SurveyVersionListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyVersionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
