import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class RouteService {

  constructor() { }

  private routeChangedSource = new Subject<string>();

  // Observable string streams
  routeChanged$ = this.routeChangedSource.asObservable();

  // Service message commands
  changeRoute(mission: string) {
    this.routeChangedSource.next(mission);
  }
}
