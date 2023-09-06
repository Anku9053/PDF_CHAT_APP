import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfChatComponent } from './pdf-chat.component';

describe('PdfChatComponent', () => {
  let component: PdfChatComponent;
  let fixture: ComponentFixture<PdfChatComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PdfChatComponent]
    });
    fixture = TestBed.createComponent(PdfChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
