import { SubscriptionFilter } from 'aws-cdk-lib/aws-sns';
import type { Queue } from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';

import { accountId, region } from '../../variables';
import { BaseSQS } from '../base';

export default class SQSGroupResources extends Construct {
    public readonly talentAcquisitionAssessmentScoreQueue: Queue;
    public readonly talentAcquisitionDomainQueue: Queue;
    public readonly talentAcquisitionFitScoreQueue: Queue;
    public readonly talentAcquisitionScoreDistributionQueue: Queue;
    public readonly talentAcquisitionResumeAnalyzedQueue: Queue;

    /**
     * SQSGroupResources
     *
     * @public talentAcquisitionAssessmentScoreQueue {@link Queue}
     * @public talentAcquisitionDomainQueue {@link Queue}
     * @public talentAcquisitionFitScoreQueue {@link Queue}
     * @public talentAcquisitionScoreDistributionQueue {@link Queue}
     * @public talentAcquisitionResumeAnalyzedQueue {@link Queue}
     *
     * @param scope {@link Construct}
     * @param id
     */
    constructor(scope: Construct, id: string) {
        super(scope, id);

        this.talentAcquisitionAssessmentScoreQueue = new BaseSQS(
            this,
            'talent-acquisition-assessment-score-queue',
            {
                sqsName: 'talent-acquisition-assessment-score',
                fifo: true,
                isDlq: false,
                snsSubscriptions: [
                    {
                        topicArn: `arn:aws:sns:${region}:${accountId}:talent-acquisition-topic.fifo`,
                        subscriptionFilterPolicy: {
                            filterPolicy: {
                                event_type: SubscriptionFilter.stringFilter({
                                    allowlist: [
                                        'talent_acquisition_application_submitted',
                                        'talent_acquisition_assessment_submitted',
                                    ],
                                }),
                            },
                        },
                    },
                ],
            },
        ).mainSQS;

        this.talentAcquisitionDomainQueue = new BaseSQS(
            this,
            'talent-acquisition-domain-queue',
            {
                sqsName: 'talent-acquisition-domain',
                fifo: true,
                isDlq: false,
                snsSubscriptions: [
                    {
                        topicArn: `arn:aws:sns:${region}:${accountId}:candidate-topic.fifo`,
                        subscriptionFilterPolicy: {
                            filterPolicy: {
                                event_type: SubscriptionFilter.stringFilter({
                                    allowlist: [
                                        'candidate_application_completed',
                                        'candidate_assessment_submitted',
                                        'candidate_application_submitted',
                                        'candidate_application_applied',
                                        'candidate_application_withdrawn',
                                        'candidate_assessment_started',
                                        'candidate_assessment_resetted',
                                        'candidate_application_resume_uploaded',
                                    ],
                                }),
                            },
                        },
                    },
                    {
                        topicArn: `arn:aws:sns:${region}:${accountId}:identity-topic.fifo`,
                        subscriptionFilterPolicy: {
                            filterPolicy: {
                                event_type: SubscriptionFilter.stringFilter({
                                    allowlist: [
                                        'identity_delete_user',
                                        'identity_update_user',
                                    ],
                                }),
                            },
                        },
                    },
                    {
                        topicArn: `arn:aws:sns:${region}:${accountId}:talent-management-domain-topic.fifo`,
                        subscriptionFilterPolicy: {
                            filterPolicy: {
                                event_type: SubscriptionFilter.stringFilter({
                                    allowlist: [
                                        'talent_management_employee_imported',
                                    ],
                                }),
                            },
                        },
                    },
                ],
            },
        ).mainSQS;

        this.talentAcquisitionFitScoreQueue = new BaseSQS(
            this,
            'talent-acquisition-fit-score-queue',
            {
                sqsName: 'talent-acquisition-fit-score',
                fifo: true,
                isDlq: false,
                snsSubscriptions: [
                    {
                        topicArn: `arn:aws:sns:${region}:${accountId}:talent-acquisition-topic.fifo`,
                        subscriptionFilterPolicy: {
                            filterPolicy: {
                                event_type: SubscriptionFilter.stringFilter({
                                    allowlist: [
                                        'talent_acquisition_assessments_score_calculated',
                                        'talent_acquisition_pairwise_score_calculated',
                                    ],
                                }),
                            },
                        },
                    },
                ],
            },
        ).mainSQS;

        this.talentAcquisitionScoreDistributionQueue = new BaseSQS(
            this,
            'talent-acquisition-score-distribution-queue',
            {
                sqsName: 'talent-acquisition-score-distribution',
                fifo: true,
                isDlq: false,
                highTroughput: true,
                snsSubscriptions: [
                    {
                        topicArn: `arn:aws:sns:${region}:${accountId}:talent-acquisition-topic.fifo`,
                        subscriptionFilterPolicy: {
                            filterPolicy: {
                                event_type: SubscriptionFilter.stringFilter({
                                    allowlist: [
                                        'talent_acquisition_assessments_score_calculated',
                                        'talent_acquisition_pairwise_score_calculated',
                                    ],
                                }),
                            },
                        },
                    },
                ],
            },
        ).mainSQS;

        this.talentAcquisitionResumeAnalyzedQueue = new BaseSQS(
            this,
            'talent-acquisition-resume-analyzed-queue',
            {
                sqsName: 'talent-acquisition-resume-analyzed',
                fifo: true,
                isDlq: false,
                visibilityTimeoutInSeconds: 60,
                snsSubscriptions: [
                    {
                        topicArn: `arn:aws:sns:${region}:${accountId}:talent-acquisition-topic.fifo`,
                        subscriptionFilterPolicy: {
                            filterPolicy: {
                                event_type: SubscriptionFilter.stringFilter({
                                    allowlist: [
                                        'talent_acquisition_application_submitted',
                                        'talent_acquisition_application_updated',
                                    ],
                                }),
                            },
                        },
                    },
                ],
            },
        ).mainSQS;
    }
}
