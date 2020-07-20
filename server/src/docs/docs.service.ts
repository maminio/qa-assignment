import { Injectable, NotFoundException, Req, Res, } from '@nestjs/common';
import { DocRepository } from './doc.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDocDto } from './dto/create-doc.dto';
import { User } from '../auth/user.entity';
import { Doc } from './doc.entity';
import * as multer from 'multer';
import * as multerS3 from 'multer-s3';
import { AwsService } from '../aws/aws.service'
import { DocStatus } from './doc-status.enum';


@Injectable()
export class DocsService {
    constructor(
        @InjectRepository(DocRepository)
        private docRepository: DocRepository,
        private awsService: AwsService
      ) {}


      
    upload = multer({
      storage: multerS3({
          s3: this.awsService.getS3(),
          bucket: process.env.AWS_S3_BUCKET_NAME,
          acl: 'public-read',
          key: function(request, file, cb) {
          cb(null, `${Date.now().toString()} - ${file.originalname}`);
          },
      }),
      }).array('upload', 1);
    
    async fileupload(@Req() req, @Res() res) {
        try {
          this.upload(req, res, function(error) {
            if (error) {
              console.log(error);
              return res.status(404).json(`Failed to upload image file: ${error}`);
            }
            
            return res.status(201).json(req.file);
          });
        } catch (error) {
          console.log(error);
          return res.status(500).json(`Failed to upload image file: ${error}`);
        }
    }


    async getDocs(
      user: User,
    ): Promise<Doc[]> {
      return this.docRepository.getDocs(user);
    }
  
    async createDoc(
        createDocDto: CreateDocDto,
        user: User,
      ): Promise<Doc> {
        return this.docRepository.createDoc(createDocDto, user);
    }

    async uploadFile(file: any, user: User): Promise<string>{
      const urlKey = `docs/${user.id}/${file.originalname}`;
      const params = {
        Body: file.buffer,
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: urlKey,
      };


      const data = await this.awsService.getS3()
                    .putObject(params)
                    .promise()
                    .then(
                      data => {
                        console.log(data);
                        return urlKey;
                      },
                      err => {
                        console.log(err);
                        return err;
                      }
                    );
      return data;

    }

    async getDocById(
      id: number,
      user: User,
    ): Promise<Doc> {
      const found = await this.docRepository.findOne({ where: { id, userId: user.id } });
  
      if (!found) {
        throw new NotFoundException(`Doc with ID "${id}" not found`);
      }
  
      return found;
    }

    async updateDocStatus(
      id: number,
      status: DocStatus,
      user: User,
      result: string,
    ): Promise<Doc> {
      const doc = await this.getDocById(id, user);
      doc.status = status;
      doc.result = result
      await doc.save();
      return doc;
    }

}
