import {DestinationPayload} from "./payload";
import {DestinationCode} from "./code";
import {SdkAction, SdkPayload} from "../transform";
import {EnrichedFeatures} from "featurehub-javascript-webhooks";


export type DestinationPayloadCallbackCreator = (key: DestinationCode) => DestinationPayload;
/**
 * This uses the environment variables in the format DESTINATIONS=fred,betty then DESTINATION_FRED_TYPE=<type>, DESTINATION_FRED_<x>
 */
export class DestinationConfig implements DestinationPayload {
  public readonly destinations: Array<DestinationCode>;
  private payloadDestinations: Array<DestinationPayload> = [];
  private initialized: boolean = false;
  private static readonly types: Record<string, DestinationPayloadCallbackCreator> = {};

  constructor() {
    this.destinations = (process.env.DESTINATIONS || '').split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0)
      .map(s => new DestinationCode(s));
  }

  public static register(type: string, destination: DestinationPayloadCallbackCreator) {
    this.types[type.toUpperCase()] = destination;
  }

  async deliver(payload: SdkPayload): Promise<void> {
    if (!this.initialized) {
      this.initialized = true;
      this.payloadDestinations = [...this.defaultDestinations(), ... this.destinations
        .filter(dest => dest.key('type') !== undefined)
        .map(dest => DestinationConfig.types[dest.key('type').toUpperCase()](dest))
        .filter(p => p !== undefined)];
    }

    this.payloadDestinations.forEach(pd => console.log('destination is ', pd));
    console.log('destinations are ')

    const deliveries: Array<Promise<void>> = [];

    for (const dest of this.payloadDestinations) {
      deliveries.push(dest.deliver(payload));
    }

    await Promise.all(deliveries);
  }

  async route(body: string | any): Promise<void> {
    let enrichedFeatures: EnrichedFeatures;

    if (typeof body === 'string' || body instanceof String) {
      enrichedFeatures = JSON.parse(body.toString()) as EnrichedFeatures;
    } else {
      enrichedFeatures = body as EnrichedFeatures;
    }

    const payload = new SdkPayload(enrichedFeatures);

    if (payload.action != SdkAction.none) {
      await this.deliver(payload);
    }
  }

  private defaultDestinations(): Array<DestinationPayload> {
    const defaults = [];

    // this takes standard types, e.g. S3, GCPSTORAGE, REDIS, SNS, or whatever and turns them into
    // destinations without separation between "name" and "type. e.g. we can have DESTINATIONS=S3, DESTINATION_S3_BUCKET=fred
    // without having to have DESTINATION_S3_TYPE=s3

    for(const key in DestinationConfig.types) {
      defaults.push(DestinationConfig.types[key](new DestinationCode(key)))
    }

    return defaults;
  }
}





