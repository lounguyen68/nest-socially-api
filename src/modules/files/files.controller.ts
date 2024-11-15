import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { FilesService } from './files.service';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';

// @UseGuards(JwtAuthGuard)
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get('signed-url')
  async getSignedUrl(
    @Query('key') key: string,
    @Query('contentType') contentType: string,
  ): Promise<{ url: string }> {
    const url = await this.filesService.getSignedUrl(key, contentType);
    return { url };
  }
}
