import {
    CompositePrincipal,
    type IRole,
    ManagedPolicy,
    ServicePrincipal,
} from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

import { accountId } from '../../../variables';
import { BaseIAM } from '../../base';
import { ParameterStoreUtil } from '../../utils';
import { talentAcquisitionLambdaPolicy } from './talent-acquisition-lambda-policy';

export class IAMRoleGroupResources extends Construct {
    public readonly talentAcquisitionLambdaRole: IRole;

    /**
     * IAMRoleGroupResources
     *
     * @public talentAcquisitionLambdaRole {@link IRole}
     *
     * @param scope {@link Construct}
     * @param id
     */
    constructor(scope: Construct, id: string) {
        super(scope, id);

        this.talentAcquisitionLambdaRole = new BaseIAM(
            this,
            'talent-acquisition-lambda-role',
            {
                resourceName: 'talent-acquisition-lambda',
                assumedBy: new CompositePrincipal(
                    new ServicePrincipal('lambda.amazonaws.com'),
                ),
                customPolicies: [
                    {
                        policyName: 'talent-acquisition-lambda',
                        statements: ParameterStoreUtil.resolveSSMArray(
                            this,
                            talentAcquisitionLambdaPolicy,
                        ),
                    },
                ],
                managedPolicies: [
                    ManagedPolicy.fromManagedPolicyArn(
                        this,
                        'aws-lambda-vpc-access-execution-role',
                        'arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole',
                    ),
                    ManagedPolicy.fromManagedPolicyArn(
                        this,
                        'pulsifi-kms-policy',
                        `arn:aws:iam::${accountId}:policy/PulsifiKMSPolicy`,
                    ),
                    ManagedPolicy.fromManagedPolicyArn(
                        this,
                        'pulsifi-scanned-document-bucket-policy',
                        `arn:aws:iam::${accountId}:policy/PulsifiScannedDocumentBucketPolicy`,
                    ),
                ],
            },
        ).role;
    }
}
