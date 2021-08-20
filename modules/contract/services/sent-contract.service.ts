import {Injectable} from '@angular/core';
import {ContractViewI} from '@models';
import {CrewService} from '@services/crew/crew.service';
import {Observable} from 'rxjs';

@Injectable()
export class SentContractService {

  constructor(
    private readonly crewService: CrewService,
  ) { }

  public getContract(id: number): Observable<ContractViewI> {
    return this.crewService.getSentCrewContract(id);
  }
}
