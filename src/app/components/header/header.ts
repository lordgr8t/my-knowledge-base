import { Component, inject, Output, EventEmitter} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith, switchMap } from 'rxjs';
import { of } from 'rxjs';
import { Button } from '../button/button';


export type HeaderState = 'auth' | 'home';

@Component({
  selector: 'app-header',
  imports: [Button],
  templateUrl: './header.html',
  styleUrl: './header.less',
})
export class Header {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  headerState = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      startWith(null),
      map(() => {
        let child = this.route.firstChild;
        while (child?.firstChild) child = child.firstChild;
        return child?.snapshot.data['headerState'] ?? 'auth';
      })
    ),
    { initialValue: 'auth' }
  );

}
