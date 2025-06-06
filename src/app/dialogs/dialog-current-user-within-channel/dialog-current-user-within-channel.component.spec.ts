import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCurrentUserWithinChannelComponent } from './dialog-current-user-within-channel.component';

describe('DialogCurrentUserWithinChannelComponent', () => {
  let component: DialogCurrentUserWithinChannelComponent;
  let fixture: ComponentFixture<DialogCurrentUserWithinChannelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogCurrentUserWithinChannelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogCurrentUserWithinChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
