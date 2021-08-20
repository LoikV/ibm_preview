import {Component, Input, OnInit} from '@angular/core';
import {BoatShortInfoDto} from '@models';

@Component({
  selector: 'app-boat-search-info',
  templateUrl: './boat-search-info.component.html',
  styleUrls: ['./boat-search-info.component.scss']
})
export class BoatSearchInfoComponent implements OnInit {

  @Input() info: BoatShortInfoDto;

  constructor() { }

  ngOnInit() {
  }

}
