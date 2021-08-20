import {Injectable} from '@angular/core';
import {
  AddJobOfferPayload,
  JobOfferFormMode,
  JobOfferInputFormDto,
  JobOffersDirectories,
  JobOffersListItemI,
  JobOffersPayloadFormI,
  ResponseDto, UnpublishReason, UpdateCrewStatus,
} from '@models';
import {BoatDetailsService, DirectoriesService, JobOfferDirectoriesService} from '@services';
import {JobOffersApiService} from '@services/job-offers/job-offers-list/job-offers-api.service';
import {loader} from '@shared/modules/custom-loader/models/decorators';
import {Observable} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';

@Injectable()
export class JobOfferManagerService {

  public get directories$(): Observable<JobOffersDirectories> {
    return this.jobOffersDirectoriesService.getDirectories();
  }

  constructor(
    private readonly directoriesService: DirectoriesService,
    private readonly boatDetailsService: BoatDetailsService,
    private readonly jobOffersService: JobOffersApiService,
    private readonly jobOffersDirectoriesService: JobOfferDirectoriesService,
  ) {
  }


  public saveJobOffer(data: JobOffersPayloadFormI, mode: JobOfferFormMode, updateCrew: UpdateCrewStatus | null = null, reason: UnpublishReason | null = null): Observable<JobOffersListItemI> {
    if (mode === 'edit') {
      return this.editJobOffer(data, updateCrew, reason);
    }
    return this.addJobOffer(data);
  }

  @loader()
  public getJobOfferFormData(id: number): Observable<JobOfferInputFormDto> {
    return this.jobOffersService.getJobOfferFormData(id).pipe(
      map(data => new JobOfferInputFormDto(data)),
    );
  }


  @loader()
  public addJobOffer(data: JobOffersPayloadFormI): Observable<JobOffersListItemI> {
    return this.boatDetailsService.boatId$.pipe(
      switchMap(id => {
        const payload = new AddJobOfferPayload(id, data);
        return this.jobOffersService.addJobOffer(payload);
      })
    );
  }

  @loader()
  public editJobOffer(data: JobOffersPayloadFormI, updateCrew: UpdateCrewStatus | null, reason: UnpublishReason | null): Observable<JobOffersListItemI> {
    return this.boatDetailsService.boatId$.pipe(
      switchMap(id => {
        const payload = new AddJobOfferPayload(id, data, updateCrew, reason);
        return this.jobOffersService.updateJobOffer(payload);
      })
    );
  }

  @loader()
  public removeOffer(id: number): Observable<ResponseDto> {
    return this.jobOffersService.removeJobOffer(id);
  }
}
