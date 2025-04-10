import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectSaleDataComponent } from './select-sale-data.component';

describe('SelectSaleDataComponent', () => {
  let component: SelectSaleDataComponent;
  let fixture: ComponentFixture<SelectSaleDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectSaleDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectSaleDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
