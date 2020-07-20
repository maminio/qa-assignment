import { Module } from '@nestjs/common';
import { AwsService } from './aws.service';
import { DocsService } from 'src/docs/docs.service';

@Module({
  providers: [AwsService]
})
export class AwsModule {}
