import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private db: PrismaService,
  ) {
    this.db.setUser(
      'jiglesia',
      'Juan Iglesias',
      'jiglesia@student.42.fr',
      false,
      'token jiglesia',
      'atoken jiglesia',
      'https://cdn.intra.42.fr/users/jiglesia.jpg',
    );
    this.db.setUser(
      'toto',
      'titi',
      'mravily@student.42.fr',
      false,
      'token toto',
      'atoken titi',
      'https://cdn.intra.42.fr/users/mravily.jpg',
    );
  }

  @Get()
  getHello(): string {
    console.log('lol');
    return this.appService.getHello();
  }
}
