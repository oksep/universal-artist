import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiuxComponent } from './uiux.component';

describe('UiuxComponent', () => {
  let component: UiuxComponent;
  let fixture: ComponentFixture<UiuxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UiuxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiuxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
