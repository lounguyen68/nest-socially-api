import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { FilesService } from './files.service';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { GetSignedUrlDto } from './dto/get-signed-url.dto';

@UseGuards(JwtAuthGuard)
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('signed-url')
  async getSignedUrl(@Body() data: GetSignedUrlDto) {
    const { key, contentType, uploadType } = data;
    const url = await this.filesService.getSignedUrl(
      key,
      contentType,
      uploadType,
    );
    return {
      success: true,
      data: { url },
    };
  }
}
