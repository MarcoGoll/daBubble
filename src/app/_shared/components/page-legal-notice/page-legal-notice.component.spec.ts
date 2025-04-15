import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageLegalNoticeComponent } from './page-legal-notice.component';

describe('PageLegalNoticeComponent', () => {
  let component: PageLegalNoticeComponent;
  let fixture: ComponentFixture<PageLegalNoticeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageLegalNoticeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PageLegalNoticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
