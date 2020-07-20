import { Injectable } from '@nestjs/common';
import { S3, Textract } from 'aws-sdk';

@Injectable()
export class AwsService {

    s3 = new S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    });

    textract = new Textract({
        region: 'eu-west-2'
    });


  // abstracts function to upload a file returning a promise
    uploadFile(buffer, name, type){
        const params = {
        ACL: 'public-read',
        Body: buffer,
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        ContentType: type.mime,
        Key: `${name}.${type.ext}`
        };
        return this.s3.upload(params).promise();
    };

    getS3(): S3 {
        return this.s3;
    }

    uploadJson(data, fullPathName){
        const params = {
            Key: fullPathName,
            ACL: 'public-read',
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Body: data,
            ContentType: "application/json"
        };        
        return this.s3.putObject(params).promise()                    
                .then(
                data => {
                return fullPathName;
                },
                err => {
                console.log(err);
                return err;
                }
            );
    }


    async textractAnalyze(params: any, newDoc: any, user): Promise<any>{

        const request = this.textract.analyzeDocument(params);
        const data = await request.promise();
        const savePath = `docs/${user.id}/results${newDoc.id}.json`;
        const jsonData = JSON.stringify(data,);
        const uploadedJson = await this.uploadJson(jsonData, savePath)
        return uploadedJson;
    }
  
}
