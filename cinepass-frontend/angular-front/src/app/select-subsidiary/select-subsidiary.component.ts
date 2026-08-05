import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
  selectedSubsidiaryName: string = '';
  returnUrl: string = '';

  constructor(
    private subsidiaryService: SubsidiaryService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.fetchSubsidiaries();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onSubsidiarySelect(subsidiary: any) {
    this.selectedSubsidiaryCode = subsidiary.subsidiaryCode;
    this.selectedSubsidiaryName = subsidiary.name;
    if (this.selectedSubsidiaryCode) {
      this.subsidiaryService.setSubsidiary(subsidiary);
      const subsidiaryId = this.subsidiaryService.getSubsidiaryId();
      sessionStorage.setItem('subsidiaryId', subsidiaryId.toString()); // Guardar en sessionStorage
      this.router.navigate([this.returnUrl]);
    }
  }

  async fetchSubsidiaries(){
    this.subsidiaries = await this.subsidiaryService.getSubsidiaries();
  }
}