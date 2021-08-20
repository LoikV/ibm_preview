import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl} from '@angular/forms';
import {DestroySubscription} from '@helpers';
import {debounceTime, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-job-offers-list-header',
  templateUrl: './job-offers-list-header.component.html',
  styleUrls: ['./job-offers-list-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JobOffersListHeaderComponent extends DestroySubscription implements OnInit {

  public searchControl = new FormControl(null);

  @Input() set initialSearch(value: string | null) {
    if (value) {
      this.searchControl.setValue(value, {emitEvent: false});
    }
  }

  @Input() canAddCrew: boolean;
  @Output() search = new EventEmitter<string>();
  @Output() addJobOffer = new EventEmitter<void>();
  @Output() goToAddCrew = new EventEmitter<void>();

  constructor() {
    super();
  }

  ngOnInit() {
    this.onSearch();
  }

  public onSearch(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(350),
      takeUntil(this.destroyStream$)
    ).subscribe(value => {
      this.search.emit(value);
    });
  }
  public onAddCrew(): void {
    this.goToAddCrew.emit();
  }
  public onAddJobOffer(): void {
    this.addJobOffer.emit();
  }
}
