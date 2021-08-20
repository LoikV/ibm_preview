import {Component, OnInit} from '@angular/core';
import {JobOffersNewActionsI, NavItem} from '@models';
import {NewOffersActionsInfoService} from '@services/job-offers/new-actions-informations/new-offers-actions-info.service';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-job-offers-wrapper',
  templateUrl: './job-offers-wrapper.component.html',
  styleUrls: ['./job-offers-wrapper.component.scss']
})
export class JobOffersWrapperComponent implements OnInit {

  public newActions$: Observable<JobOffersNewActionsI>;
  public navItems$: Observable<NavItem[]>;

  public navItems: NavItem[] = [
    new NavItem('published', 'jobOffer.published', ''),
    new NavItem('unpublished', 'jobOffer.unpublished', '', 'favorites'),
  ];

  constructor(
    private readonly newOffersActionsInfoService: NewOffersActionsInfoService,
  ) {
    this.newOffersActionsInfoService.init();
  }

  ngOnInit() {
    this.navItems$ = this.newOffersActionsInfoService.countActions$.pipe(
      map((actions: JobOffersNewActionsI) => {
        return this.navItems.map(
          item => {
            if (item.url && actions[item.url]) {
              item.icon = 'warningCircle';
              return item;
            }
            item.icon = '';
            return item;
          });
      })
    );
  }

  ngOnDestroy() {
    this.newOffersActionsInfoService.destroy();
  }

}
