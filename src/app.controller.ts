import { Controller, Get } from '@nestjs/common';
import { YandexMusicService } from './yandex-music/yandex-music.service';

@Controller()
export class AppController {
  constructor(private readonly yandexMusicService: YandexMusicService) {}

  @Get()
  async getStatus() {
    return await this.yandexMusicService.getAccountStatus();
  }
}
