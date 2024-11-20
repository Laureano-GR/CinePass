import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectSubsidiaryComponent } from './select-subsidiary.component';

describe('SelectSubsidiaryComponent', () => {
  let component: SelectSubsidiaryComponent;
  let fixture: ComponentFixture<SelectSubsidiaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectSubsidiaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectSubsidiaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
