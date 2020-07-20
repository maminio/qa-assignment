import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { AwsModule } from './aws/aws.module';
import { DocsModule } from './docs/docs.module';
import { UploadModule } from './upload/upload.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    ConfigModule.forRoot({
      envFilePath: 'config/.env.local'
    }),
    DocsModule,
    AuthModule,
    AwsModule,    
    UploadModule,
  ],
})
export class AppModule {}