import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchSalesComponent } from './search-sales.component';

describe('SearchSalesComponent', () => {
  let component: SearchSalesComponent;
  let fixture: ComponentFixture<SearchSalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchSalesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
