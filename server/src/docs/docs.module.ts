import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DocsController } from './docs.controller';
import { DocsService } from './docs.service';
import { AuthModule } from '../auth/auth.module';
import { DocRepository } from './doc.repository';
import { AwsService } from '../aws/aws.service'


@Module({
  controllers: [DocsController],
  imports: [
    TypeOrmModule.forFeature([DocRepository]),
    AuthModule,
    AwsService
  ],
  providers: [DocsService, AwsService],
})
export class DocsModule {}
