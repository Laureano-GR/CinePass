import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SubsidiaryService } from '../subsidiary.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-select-subsidiary',
  templateUrl: './select-subsidiary.component.html',
  styleUrls: ['./select-subsidiary.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class SelectSubsidiaryComponent implements OnInit {
  subsidiaries: any[] = [];
  selectedSubsidiaryCode: string = '';

  constructor(
    private subsidiaryService: SubsidiaryService,
    private router: Router
  ) {}

  ngOnInit() {
    this.fetchSubsidiaries();
  }

  onSubsidiarySelect(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedSubsidiaryCode = selectElement.value;
    if (this.selectedSubsidiaryCode) {
      const selectedSubsidiary = this.subsidiaries.find(sub => sub.subsidiaryCode === this.selectedSubsidiaryCode);
      if (selectedSubsidiary) {
        this.subsidiaryService.setSubsidiary(selectedSubsidiary);
        this.router.navigate(['/']);
      }
    }
  }

  async fetchSubsidiaries(){
    this.subsidiaries = await this.subsidiaryService.getSubsidiaries();
  }
}