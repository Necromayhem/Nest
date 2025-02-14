import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { YandexMusicService } from './yandex-music.service';
import { YandexMusicController } from './yandex-music.controller';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [YandexMusicController],
  providers: [YandexMusicService],
})
export class YandexMusicModule {}
