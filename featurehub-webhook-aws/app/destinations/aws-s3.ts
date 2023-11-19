import {DestinationPayload, DestinationCode, SdkPayload} from "featurehub-webhook-utils";
import {DeleteObjectCommand, PutObjectCommand, S3Client} from "@aws-sdk/client-s3";
import {DestinationConfig, SdkAction} from "featurehub-webhook-utils/dist";

// register this class for processing s3 data
DestinationConfig.register('s3', (code) => new DestinationAwsS3(code));

export class DestinationAwsS3 implements DestinationPayload {
  private code: DestinationCode;
  private bucket: string;
  private folder: string;
  private readonly s3Client: S3Client;

  constructor(code: DestinationCode) {
    this.code = code;

    const bucket = code.key('bucket');
    if (bucket === undefined) {
      throw new Error(`config ${code.code} requires a bucket name.`);
    }

    this.bucket = bucket;
    this.folder = code.key('folder') || '';


    this.s3Client = new S3Client({
      region: 'us-east-1',
      endpoint: process.env.AWS_ENDPOINT,
      forcePathStyle: (process.env.AWS_ENDPOINT !== undefined)
    });
  }

  async deliver(features: SdkPayload): Promise<void> {
    const keyFile = `${this.folder}/${features.environmentId}.json`;

    if (features.action === SdkAction.delete) {
      await this.deleteEnvironment(keyFile, features);
    } else {
      await this.replaceEnvironment(keyFile, features);
    }
  }

  private async deleteEnvironment(keyFile: string, features: SdkPayload) {
    try {
      await this.s3Client.send(new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: keyFile
      }));
    } catch (err) {
      console.error(`Error deleting environment ${features.environmentId} to bucket ${this.bucket} at ${keyFile}`, err);
    }
  }

  private async replaceEnvironment(keyFile: string, features: SdkPayload) {
    try {
      console.log(`uploading to ${keyFile} in bucket ${this.bucket}`, features.sdkPayload);
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: keyFile,
          Body: JSON.stringify(features.sdkPayload),
          ContentType: 'application/json'
        })
      );
    } catch (err) {
      console.error(`Error uploading environment ${features.environmentId} to bucket ${this.bucket} at ${keyFile}`, err);
    }
  }
}

