import {
  Controller,
  Get,
  Param,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { YandexMusicService } from './yandex-music.service';

@Controller('yandex-music') // Базовый маршрут для всех запросов контроллера
export class YandexMusicController {
  constructor(private readonly yandexMusicService: YandexMusicService) {}

  // GET /yandex-music/account/status
  @Get('account/status')
  async getAccountStatus() {
    return this.yandexMusicService.getAccountStatus();
  }

  // GET /yandex-music/track/:trackId
  @Get('track/:trackId')
  async getTrackById(@Param('trackId') trackId: string) {
    if (!trackId) {
      throw new HttpException('trackId is required', 400);
    }
    return this.yandexMusicService.getTrackById(trackId);
  }

  // GET /yandex-music/track/:trackId/download
  @Get('track/:trackId/download')
  async getDownloadLink(@Param('trackId') trackId: string) {
    if (!trackId) {
      throw new HttpException('trackId is required', 400);
    }
    return this.yandexMusicService.getDownloadLink(trackId);
  }

  // GET /yandex-music/users/:userId/likes/tracks
  @Get('/users/:userId/likes/tracks')
  async getLikedTracks(@Param('userId') userId: string) {
    if (!userId) {
      throw new HttpException('UserId is required', HttpStatus.BAD_REQUEST);
    }
    return this.yandexMusicService.getLikedTracks(userId);
  }

  // GET /yandex-music/tracks/:trackId/supplement
  @Get('/tracks/:trackId/supplement')
  async getTrackSupplement(@Param('trackId') trackId: string) {
    if (!trackId) {
      throw new HttpException('TrackId is required', HttpStatus.BAD_REQUEST);
    }
    return this.yandexMusicService.getTrackSupplement(trackId);
  }

  // GET /yandex-music/tracks/:trackId/lyrics
  @Get('/tracks/:trackId/lyrics')
  async getTrackLyrics(@Param('trackId') trackId: string) {
    if (!trackId) {
      throw new HttpException('TrackId is required', HttpStatus.BAD_REQUEST);
    }
    return this.yandexMusicService.getTrackLyrics(trackId);
  }
}
