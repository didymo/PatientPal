import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BetaEditorComponent } from './beta-editor.component';

describe('BetaEditorComponent', () => {
  let component: BetaEditorComponent;
  let fixture: ComponentFixture<BetaEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BetaEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BetaEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
