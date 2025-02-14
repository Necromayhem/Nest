import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { YandexMusicModule } from './yandex-music/yandex-music.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Чтобы можно было использовать везде
    }),
    YandexMusicModule,
  ],
})
export class AppModule {}
