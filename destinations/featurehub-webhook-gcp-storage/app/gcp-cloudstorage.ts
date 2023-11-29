import {Storage} from "@google-cloud/storage";
import {DestinationCode, DestinationConfig, DestinationPayload, SdkAction, SdkPayload} from "featurehub-webhook-utils";

DestinationConfig.register('storage', (code) => new DestinationGcpCloudStorage(code));

export class DestinationGcpCloudStorage implements  DestinationPayload {
  private readonly bucket: string;
  private readonly folder: string;
  private readonly client: Storage;

  constructor(code: DestinationCode) {
    const bucket = code.key('BUCKET');
    if (bucket === undefined) {
      throw new Error(`Unable to determine bucket name for GCP Cloud Storage code ${code.code}`);
    }
    this.bucket = bucket;
    this.folder = code.key('FOLDER') || '';
    if (this.folder.length > 0) {
      this.folder = this.folder + '/';
    }
    console.log(`GCP Storage destination ${code.code}: bucket is ${bucket}, folder is ${this.folder}`);
    this.client = new Storage();
  }

  async deliver(features: SdkPayload): Promise<void> {
    const keyFile = `${this.folder}${features.environmentId}.json`;
    const file = this.client.bucket(this.bucket).file(keyFile, { });

    try {
      if (features.action === SdkAction.delete) {
        await file.delete();
      } else {
        await file.save(JSON.stringify(features.sdkPayload));
      }
    } catch (err) {
      console.error(`Unable to save/delete file ${keyFile}`, err);
    }
  }
}
