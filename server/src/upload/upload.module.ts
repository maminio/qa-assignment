import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { AwsService } from 'src/aws/aws.service';
import { UploadService } from './upload.service';

@Module({
  controllers: [UploadController],
  providers: [AwsService, UploadService],

})
export class UploadModule {}
