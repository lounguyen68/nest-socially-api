import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class FilesService {
  private s3: AWS.S3;

  constructor() {
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
  }

  async getSignedUrl(
    key: string,
    contentType: string,
    uploadType: string,
  ): Promise<string> {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `${uploadType}/${key}`,
      Expires: 120,
      ACL: 'public-read',
      ContentType: contentType,
    };

    return this.s3.getSignedUrl('putObject', params);
  }
}
