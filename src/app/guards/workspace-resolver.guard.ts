import {
  ActivatedRouteSnapshot,
  MaybeAsync,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { WorkspaceService } from '../dashboard/workspace.service';
import { map, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WorkspaceResolver implements Resolve<Observable<string>> {
  constructor(private workspaceService: WorkspaceService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<string> {
    const workspaceId = route.paramMap.get('workspaceId');
    return this.workspaceService
      .getWorkspaceById(workspaceId!)
      .pipe(map((res) => res.data.name));
  }
}
