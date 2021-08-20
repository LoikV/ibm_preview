import {Injectable} from '@angular/core';
import {BoatDetailsService} from '@shared/services';

@Injectable()
export class BoatSearchCrewService {

  public get boatShortInfo$() {
    return this.boatDetailsService.boatShortInfo$;
  }

  constructor(
    private readonly boatDetailsService: BoatDetailsService,
  ) {
  }
}
