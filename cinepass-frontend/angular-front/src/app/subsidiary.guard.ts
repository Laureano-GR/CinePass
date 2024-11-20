import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SubsidiaryService } from './subsidiary.service';

@Injectable({
  providedIn: 'root'
})
export class SubsidiaryGuard implements CanActivate {
  constructor(private subsidiaryService: SubsidiaryService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.subsidiaryService.getSubsidiaryCode()) {
      return true;
    } else {
      return this.router.createUrlTree(['/select-subsidiary']);
    }
  }
}