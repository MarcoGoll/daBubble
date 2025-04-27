import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreadDetailComponent } from './tread-detail.component';

describe('TreadDetailComponent', () => {
  let component: TreadDetailComponent;
  let fixture: ComponentFixture<TreadDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TreadDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TreadDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
