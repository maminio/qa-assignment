import { AuthGuard } from '@nestjs/passport';
import { Controller, 
    Post, Body,  Get, Query,
    UsePipes, ValidationPipe,  UseGuards,
    UploadedFile, UseInterceptors, UploadedFiles,
 } from '@nestjs/common';
import { Doc } from "./doc.entity";
import { User } from '../auth/user.entity';
import { GetUser } from '../auth/get-user.decorator';
import { CreateDocDto } from './dto/create-doc.dto';
import { DocsService } from './docs.service';
import { FileInterceptor  } from '@nestjs/platform-express';
import { AwsService } from 'src/aws/aws.service';
import { DocStatus } from './doc-status.enum';


@Controller('docs')
@UseGuards(AuthGuard())
export class DocsController {

    constructor(
        private docsService: DocsService,
        private awsService: AwsService,
        ) {}

    @Get()
    getDocs(
      @GetUser() user: User,
    ): Promise<Doc[]> {
        return this.docsService.getDocs(user);
      
      
    }


    @Post('/create')
    // @UsePipes(ValidationPipe)
    @UseInterceptors(FileInterceptor('file'))
    async createNewDoc(
        @UploadedFile() file,
        @Body() createDocDto: CreateDocDto,
        @GetUser() user: User,
    ): Promise<Doc> {        
        const uploadedFile = await this.docsService.uploadFile(file, user);
        const fileName = file.originalname;
        createDocDto.file = uploadedFile;
        const params = {
            Document: {
                S3Object: {
                    Bucket: process.env.AWS_S3_BUCKET_NAME,
                    Name: uploadedFile,
                    // Version: 'STRING_VALUE'
                }
            },
            FeatureTypes: ["FORMS"]
            
        };
        
        const newDoc = await this.docsService.createDoc(createDocDto, user);
        this.awsService.textractAnalyze(params, newDoc, user).then((uploadedJson)=>{
           const updatedDoc = this.docsService.updateDocStatus(newDoc.id, DocStatus.DONE, user, `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_ZONE}.amazonaws.com/${uploadedJson}`)
        })

        return newDoc;
    }


}
