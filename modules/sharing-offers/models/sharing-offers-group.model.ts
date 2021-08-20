import {
  BoatShortInfoDto, BoatShortViewDto, CrewCvContactsDto, CrewJobOfferDetailsViewDto,
  CrewPositionDto, CrewSearchMapLookingJobDto,
  ExpectedSalaryDto, JobOfferCardAdditionalInformation,
  JobOfferLocation, JobOffersListItemDto, JobOffersListItemI, JobOffersReadyType,
  JobOfferStatusType,
  JobOfferUserCardDto,
  PaginationDto, WatchContactsI
} from '@models';

export enum SharingCandidatesSourceType {
  JobOffer = 'job-offer',
  Favorite = 'favorite'
}

export class SharingOffersModalData {
  constructor(
    public readonly title: string,
    public readonly text: string,
    public readonly type: SharingCandidatesSourceType,
    public readonly id: number
  ) {}
}

export interface ChangeSelectedOfferActionI {
  value: boolean;
  id: number;
}

export class SharingCandidatesTokenData {
  constructor(
    public readonly expired: string,
    public readonly token: string
  ) {}
}

export class SharingOffersCard {
  constructor(
    public readonly id: number,
    public readonly status: JobOfferStatusType,
    public readonly user: JobOfferUserCardDto,
    public readonly contacts: CrewCvContactsDto,
    public readonly position: CrewPositionDto,
    public readonly location: JobOfferLocation,
    public readonly salary: ExpectedSalaryDto,
    public readonly experience: number,
    public readonly greeny: boolean,
    public readonly dateCreate: string,
    public readonly dateUpdate: string,
    public readonly dateUpdateStatus: string,
    public readonly additional: SharingOffersAdditionalData,
    public readonly jobOfferInvitationId: number,
    public readonly jobOfferId: number,
    public readonly invStatus: number,
    public readonly token: string,
    public readonly lookingJobStatus?: CrewSearchMapLookingJobDto,
    public selected?: boolean,
  ) {}
}

export class SharingOffersPayloadParams {
  constructor(
    public readonly id: number | undefined,
    public readonly jobOfferInvitationIds: number[],
  ) {}
}

export class SharingOffersData {
  constructor(
    public readonly crewAll: number[],
    public readonly crewInProcess: number[],
    public readonly list: SharingOffersCard[],
    public readonly pagination: PaginationDto
  ) {}
}

export class SharingFavoriteCandidates {
  constructor(
    public readonly favoriteAll: number[],
    public readonly crewInProcess: number[],
    public readonly list: SharingOffersCard[],
    public readonly pagination: PaginationDto
  ) {}
}

export class FavoriteListToOfferList {
  public readonly crewAll: number[];
  public readonly crewInProcess: number[];
  public readonly list: SharingOffersCard[];
  public readonly pagination: PaginationDto;
  constructor(data: SharingFavoriteCandidates) {
    this.crewAll = data.favoriteAll;
    this.crewInProcess = [];
    this.list = data.list;
    this.pagination = data.pagination;
  }
}

export class SharedOfferActionsPage {
  constructor(
    public readonly jobOffer: JobOffersListItemDto,
    // public readonly boat: BoatShortViewDto,
    public readonly list: SharingOffersCard[],
    public readonly pagination: PaginationDto
  ) {}
}

export class SharingOffersAdditionalData {
  constructor(
    public readonly video: string,
  ) {
  }
}
