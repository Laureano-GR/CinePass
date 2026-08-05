import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessSaleComponent } from './process-sale.component';

describe('ProcessSaleComponent', () => {
  let component: ProcessSaleComponent;
  let fixture: ComponentFixture<ProcessSaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProcessSaleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcessSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
