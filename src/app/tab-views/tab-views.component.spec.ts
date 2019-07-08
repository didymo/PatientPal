import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabViewsComponent } from './tab-views.component';

describe('TabViewsComponent', () => {
  let component: TabViewsComponent;
  let fixture: ComponentFixture<TabViewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabViewsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabViewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
