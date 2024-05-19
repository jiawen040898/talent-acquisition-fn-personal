import { Duration } from 'aws-cdk-lib';
import type { Function as AwsLambdaFunction } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

import { version } from '../../variables';
import { BaseFunction } from '../base';
import type { IAMRoleGroupResources } from './iam/iam-roles';
import type { LayerGroupResources } from './layers';
import type SQSGroupResources from './sqs';

/**
 * FunctionGroupResourcesProps
 *
 * @param iamRoleGroupResources {@link IAMRoleGroupResources}
 * @param sqsGroupResources {@link SQSGroupResources}
 * @param layerGroupResources {@link LayerGroupResources}
 */
type FunctionGroupResourcesProps = {
    iamRoleGroupResources: IAMRoleGroupResources;
    sqsGroupResources: SQSGroupResources;
    layerGroupResources: LayerGroupResources;
};

export class FunctionGroupResources extends Construct {
    public readonly talentAcquisitionAssessmentScoreFn: AwsLambdaFunction;
    public readonly talentAcquisitionFn: AwsLambdaFunction;
    public readonly talentAcquisitionFitScoreFn: AwsLambdaFunction;
    public readonly talentAcquisitionScoreDistributionFn: AwsLambdaFunction;

    /**
     * FunctionGroupResources
     *
     * @public talentAcquisitionAssessmentScoreFn {@link AwsLambdaFunction}
     * @public talentAcquisitionFn {@link AwsLambdaFunction}
     * @public talentAcquisitionFitScoreFn {@link AwsLambdaFunction}
     * @public talentAcquisitionScoreDistributionFn {@link AwsLambdaFunction}
     *
     * @param scope {@link Construct}
     * @param id
     * @param props {@link FunctionGroupResourcesProps}
     */
    constructor(
        scope: Construct,
        id: string,
        props: FunctionGroupResourcesProps,
    ) {
        super(scope, id);

        this.talentAcquisitionAssessmentScoreFn = new BaseFunction(
            this,
            'talent-acquisition-assessment-score-fn',
            {
                functionName: 'talent-acquisition-assessment-score-fn',
                description: `Receive scores and calculate personality then store into db (v${version})`,
                // reservedConcurrency: 20,
                entry: 'src/functions/process-assessment-score.ts',
                isLogGroupExists: true,
                iamRole:
                    props.iamRoleGroupResources.talentAcquisitionLambdaRole,
                layers: [props.layerGroupResources.talentAcquisitionFnLayer],
                sqsEventSources: [
                    {
                        queue: props.sqsGroupResources
                            .talentAcquisitionAssessmentScoreQueue,
                        sqsEventSourceProps: {
                            batchSize: 1,
                            maxConcurrency: 20,
                        },
                    },
                ],
            },
        ).lambda;

        this.talentAcquisitionFn = new BaseFunction(
            this,
            'talent-acquisition-fn',
            {
                functionName: 'talent-acquisition-fn',
                description: `Process SQS messages from Talent Acquisition Domain Queue (v${version})`,
                // reservedConcurrency: 40,
                entry: 'src/functions/process-domain-event.ts',
                isLogGroupExists: true,
                iamRole:
                    props.iamRoleGroupResources.talentAcquisitionLambdaRole,
                layers: [props.layerGroupResources.talentAcquisitionFnLayer],
                sqsEventSources: [
                    {
                        queue: props.sqsGroupResources
                            .talentAcquisitionDomainQueue,
                        sqsEventSourceProps: {
                            batchSize: 1,
                            maxConcurrency: 40,
                        },
                    },
                ],
            },
        ).lambda;

        this.talentAcquisitionFitScoreFn = new BaseFunction(
            this,
            'talent-acquisition-fit-score-fn',
            {
                functionName: 'talent-acquisition-fit-score-fn',
                description: `Receive scores and calculate respective distribution then store into db (v${version})`,
                // reservedConcurrency: 20,
                entry: 'src/functions/process-fit-score-calculation.ts',
                isLogGroupExists: true,
                iamRole:
                    props.iamRoleGroupResources.talentAcquisitionLambdaRole,
                layers: [props.layerGroupResources.talentAcquisitionFnLayer],
                sqsEventSources: [
                    {
                        queue: props.sqsGroupResources
                            .talentAcquisitionFitScoreQueue,
                        sqsEventSourceProps: {
                            batchSize: 1,
                            maxConcurrency: 20,
                        },
                    },
                ],
            },
        ).lambda;

        this.talentAcquisitionScoreDistributionFn = new BaseFunction(
            this,
            'talent-acquisition-score-distribution-fn',
            {
                functionName: 'talent-acquisition-score-distribution-fn',
                description: `Receive scores and calculate respective distribution then store into db (v${version})`,
                // reservedConcurrency: 20,
                entry: 'src/functions/process-job-distribution-score.ts',
                isLogGroupExists: true,
                iamRole:
                    props.iamRoleGroupResources.talentAcquisitionLambdaRole,
                layers: [props.layerGroupResources.talentAcquisitionFnLayer],
                sqsEventSources: [
                    {
                        queue: props.sqsGroupResources
                            .talentAcquisitionScoreDistributionQueue,
                        sqsEventSourceProps: {
                            batchSize: 1,
                            maxConcurrency: 20,
                        },
                    },
                ],
            },
        ).lambda;

        this.talentAcquisitionScoreDistributionFn = new BaseFunction(
            this,
            'talent-acquisition-resume-analyzed-fn',
            {
                functionName: 'talent-acquisition-resume-analyzed-fn',
                description: `Process Resume Analyzed (v${version})`,
                // reservedConcurrency: 20,
                entry: 'src/functions/process-resume-analyzed.ts',
                isLogGroupExists: true,
                timeout: Duration.seconds(60),
                iamRole:
                    props.iamRoleGroupResources.talentAcquisitionLambdaRole,
                layers: [props.layerGroupResources.talentAcquisitionFnLayer],
                sqsEventSources: [
                    {
                        queue: props.sqsGroupResources
                            .talentAcquisitionResumeAnalyzedQueue,
                        sqsEventSourceProps: {
                            batchSize: 1,
                            maxConcurrency: 15,
                        },
                    },
                ],
            },
        ).lambda;
    }
}
