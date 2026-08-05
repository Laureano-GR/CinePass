import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {
  selectedCard: string | null = null;

  constructor(private router: Router) {}

  selectCard(card: string) {
    this.selectedCard = this.selectedCard === card ? null : card;
  }

  navigateTo(endpoint: string) {
    this.router.navigate([endpoint]);
  }
}