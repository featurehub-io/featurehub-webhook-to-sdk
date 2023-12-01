import { SdkPayload } from '../transform';


export interface DestinationPayload {
  deliver(sdkPayload: SdkPayload): Promise<void>;
}

