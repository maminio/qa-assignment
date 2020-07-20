import { Controller, Post, Req, Res, Body } from '@nestjs/common';

@Controller('upload')
export class UploadController {
    // constructor(private readonly uploadService: ImageUploadService) {}




    // @Post()
    // async create(@Req() request, @Res() response) {
    //   try {
    //     await this.imageUploadService.fileupload(request, response);
    //   } catch (error) {
    //     return response
    //       .status(500)
    //       .json(`Failed to upload image file: ${error.message}`);
    //   }
    // }
}
