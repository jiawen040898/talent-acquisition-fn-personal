import { objectParser } from '@pulsifi/fn';
import { IEventModel } from '@pulsifi/interfaces';

import { profile } from './payload';

export const candidateApplicationSubmittedEvent: IEventModel<JSON> = {
    event_type: 'candidate_application_submitted',
    event_id: '09afe4d9-245b-454e-ab68-3e18090ea07e',
    company_id: 5,
    user_account_id: 6700,
    data: objectParser.toJSON(profile),
    timestamp: new Date(),
};
