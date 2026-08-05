import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsVisualizerComponent } from './reports-visualizer.component';

describe('ReportsVisualizerComponent', () => {
  let component: ReportsVisualizerComponent;
  let fixture: ComponentFixture<ReportsVisualizerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportsVisualizerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportsVisualizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
