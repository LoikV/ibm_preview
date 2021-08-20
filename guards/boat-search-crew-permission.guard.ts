import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree} from '@angular/router';
import {AppRouterService} from '@core/services';
import {PermissionsService} from '@shared/modules/permissions';
import {Observable} from 'rxjs';

@Injectable()
export class BoatSearchCrewPermissionGuard implements CanActivate {
  constructor(
    private readonly permissionsService: PermissionsService,
    private readonly appRouterService: AppRouterService,
  ) { }

  canActivate(
    snapshot: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const {data} = snapshot;
    const permission = data && data.permission;
    const id = this.getParentId(snapshot);
    if (!id || !permission) {
      return true;
    }


    const isHavePermissions = this.permissionsService.checkPermissions(id, permission);
    if (!isHavePermissions) {
      const redirectPermission = data.redirectPermission;
      const redirectUrl = data.redirectUrl;
      if (!redirectUrl || !redirectPermission) {
        this.appRouterService.navigateToBoatsList();
        return false;
      }

      const isHaveRedirectPermission = this.permissionsService.checkPermissions(id, redirectPermission);
      if (!isHaveRedirectPermission) {
        this.appRouterService.navigateToBoatsList();
        return false;
      }

      this.appRouterService.navigateToSearchByType(`${id}`, redirectUrl);
      return false;
    }
    return true;
  }

  private getParentId(snapshot: ActivatedRouteSnapshot): number | null {
    let parent = snapshot.parent;
    while (parent && !parent.params.id) {
      parent = parent.parent;
    }
    return parent ? +parent.params.id : null;
  }
}
