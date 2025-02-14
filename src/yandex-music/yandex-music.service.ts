import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class YandexMusicService {
  private readonly baseUrl: string;
  private readonly token: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = 'https://api.music.yandex.net:443';
    // Обрабатываем undefined, выбрасывая исключение
    const token = this.configService.get<string>('YANDEX_MUSIC_TOKEN');
    if (!token) {
      throw new Error(
        'YANDEX_MUSIC_TOKEN is not defined in environment variables',
      );
    }
    this.token = token;
  }

  // Метод для получения статуса аккаунта (example: /account/status)
  async getAccountStatus() {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/account/status`, {
          headers: {
            Authorization: `OAuth ${this.token}`,
            'Accept-Language': 'ru',
          },
        }),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        'Error fetching account status from Yandex Music API',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Метод для получения трека по ID
  async getTrackById(trackId: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/tracks/${trackId}`, {
          headers: {
            Authorization: `OAuth ${this.token}`,
            'Accept-Language': 'ru',
          },
        }),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        'Error fetching track data from Yandex Music API',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Метод для получения ссылки на скачивание трека
  async getDownloadLink(trackId: string) {
    try {
      const trackInfoResponse = await firstValueFrom(
        this.httpService.get(
          `${this.baseUrl}/tracks/${trackId}/download-info`,
          {
            headers: {
              Authorization: `OAuth ${this.token}`,
              'Accept-Language': 'ru',
            },
          },
        ),
      );

      const trackInfo = trackInfoResponse.data.result;
      if (!trackInfo || trackInfo.length === 0) {
        throw new HttpException(
          'Track download information not found',
          HttpStatus.NOT_FOUND,
        );
      }

      const selectedInfo =
        trackInfo.find((item: any) => item.codec === 'mp3' && !item.preview) ||
        trackInfo[0];

      if (!selectedInfo || !selectedInfo.downloadInfoUrl) {
        throw new HttpException(
          'No valid downloadInfoUrl found',
          HttpStatus.NOT_FOUND,
        );
      }

      const downloadInfoResponse = await firstValueFrom(
        this.httpService.get(`${selectedInfo.downloadInfoUrl}&format=json`, {
          headers: {
            Authorization: `OAuth ${this.token}`,
          },
        }),
      );

      const { s, ts, path, host } = downloadInfoResponse.data;
      if (!s || !ts || !path || !host) {
        throw new HttpException(
          'Invalid response from downloadInfoUrl',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const trackUrl = `XGRlBW9FXlekgbPrRHuSiA${path.substr(1)}${s}`;
      const hashedUrl = crypto.createHash('md5').update(trackUrl).digest('hex');
      const downloadLink = `https://${host}/get-mp3/${hashedUrl}/${ts}${path}`;

      return { downloadLink };
    } catch (error) {
      throw new HttpException(
        error.message || 'Error fetching track download link',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // GET /users/{userId}/likes/tracks — получение любимых треков пользователя
  async getLikedTracks(userId: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `${this.baseUrl}/users/${userId}/likes/tracks`, // Формируем URL
          {
            headers: {
              Authorization: `OAuth ${this.token}`,
              'Accept-Language': 'ru',
            },
          },
        ),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        'Error fetching liked tracks from Yandex Music API',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // GET /tracks/{trackId}/supplement — получение дополнительной информации о треке
  async getTrackSupplement(trackId: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `${this.baseUrl}/tracks/${trackId}/supplement`, // Формируем URL
          {
            headers: {
              Authorization: `OAuth ${this.token}`,
              'Accept-Language': 'ru',
            },
          },
        ),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        'Error fetching track supplement information from Yandex Music API',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // GET /tracks/{trackId}/lyrics — получение текста песни с таймкодами
  async getTrackLyrics(trackId: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/tracks/${trackId}/lyrics`, {
          headers: {
            Authorization: `OAuth ${this.token}`,
            'Accept-Language': 'ru',
          },
        }),
      );
      console.log('Response from Yandex Music API:', response.data); // Логируем полный ответ
      return response.data;
    } catch (error) {
      console.error('Error fetching lyrics:', error); // Логируем ошибку
      throw new HttpException(
        'Error fetching track lyrics from Yandex Music API: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
