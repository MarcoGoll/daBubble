import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagePrivacyPolicyComponent } from './page-privacy-policy.component';

describe('PagePrivacyPolicyComponent', () => {
  let component: PagePrivacyPolicyComponent;
  let fixture: ComponentFixture<PagePrivacyPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagePrivacyPolicyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PagePrivacyPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
