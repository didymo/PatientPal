import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveysListComponent } from './surveys-list.component';

describe('SurveysListComponent', () => {
  let component: SurveysListComponent;
  let fixture: ComponentFixture<SurveysListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SurveysListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveysListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
