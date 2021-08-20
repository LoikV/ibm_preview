import {Component, OnInit} from '@angular/core';
import {StubImages} from '@shared/directives/image-stub/image-stub.directive';

@Component({
  selector: 'app-offered-users-matching',
  templateUrl: './offered-users-matching.component.html',
  styleUrls: ['./offered-users-matching.component.scss']
})
export class OfferedUsersMatchingComponent implements OnInit {

  public stubImages = StubImages;
  constructor() { }

  ngOnInit() {
  }

}
