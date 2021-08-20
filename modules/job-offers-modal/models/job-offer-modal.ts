import {PublishStatus} from '@models';

export type JobOfferModalActionType = 'addOrEdit' | 'remove';

export interface JobOfferModalClosePayload {
  action: JobOfferModalActionType;
  status: PublishStatus | null;
}
