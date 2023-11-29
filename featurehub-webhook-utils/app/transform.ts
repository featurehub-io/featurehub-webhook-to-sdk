import {
  CacheEnvironmentFeature,
  CacheRolloutStrategy, CacheRolloutStrategyAttribute,
  EnrichedFeatures,
  PublishAction
} from 'featurehub-javascript-webhooks';
import { BaseRolloutStrategyAttribute, FeatureRolloutStrategy, FeatureState } from './models';

export enum SdkAction {
  none, delete, upsert
}

export class SdkPayload {
  public readonly environmentId: string;
  public readonly sdkPayload: Array<FeatureState> | undefined;
  public readonly action: SdkAction;

  constructor(payload: EnrichedFeatures) {
    this.environmentId = payload.environment.environment.id;

    if (payload.environment.action === PublishAction.Delete) {
      this.sdkPayload = [];
      this.action = SdkAction.delete;
    } else if (payload.environment.action === PublishAction.Empty) {
      this.sdkPayload = undefined;
      this.action = SdkAction.none;
    } else {
      this.sdkPayload = this.constructSdkPayload(payload.environment.fv, payload.environment.environment.id);
      this.action = SdkAction.upsert;
    }
  }

  private constructSdkPayload(features: Array<CacheEnvironmentFeature>, envId: string) : Array<FeatureState> {
    return features.map(f => this.feature(f, envId));
  }

  private feature(feature: CacheEnvironmentFeature, envId: string): FeatureState {
    return {
      id: feature.feature.id,
      key: feature.feature.key,
      l: feature.value?.locked,
      version: feature.value?.version,
      type: feature.feature.valueType,
      value: feature.value?.value,
      environmentId: envId,
      strategies: feature.value?.rolloutStrategies?.map(s => this.strategy(s))
    };
  }

  private strategy(strategy: CacheRolloutStrategy): FeatureRolloutStrategy {
    return {
      id: strategy.id,
      percentage: strategy.percentage,
      percentageAttributes: strategy.percentageAttributes,
      value: strategy.value,
      attributes: strategy.attributes?.map(a => this.attribute(a))
    };
  }

  private attribute(a: CacheRolloutStrategyAttribute): BaseRolloutStrategyAttribute {
    return {
      conditional: a.conditional,
      fieldName: a.fieldName,
      values: a.values,
      type: a.type
    };
  }
}
