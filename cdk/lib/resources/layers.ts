import { Code, type LayerVersion } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

import { BaseLayer } from '../base/base-layer';

export class LayerGroupResources extends Construct {
    public readonly talentAcquisitionFnLayer: LayerVersion;
    /**
     * LayerGroupResources
     *
     * @public talentAcquisitionFnLayer {@link LayerVersion}
     *
     * @param scope {@link Construct}
     * @param id
     */
    constructor(scope: Construct, id: string) {
        super(scope, id);

        this.talentAcquisitionFnLayer = new BaseLayer(
            scope,
            'talent-acquisition-fn-layer',
            {
                layerVersionName: 'talent-acquisition-fn-layer',
                description: 'Talent Acquisition Fn Layer',
                code: Code.fromAsset('layer'),
            },
        );
    }
}
