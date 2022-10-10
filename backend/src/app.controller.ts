import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { Tokens } from './auth/types/tokens.type';
import { PrismaService } from './prisma.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private db: PrismaService,
    private authService: AuthService,
  ) {
    this.db.setUser(
      'jiglesia',
      'Juan Iglesias',
      'Juan',
      'Iglesias',
      'jiglesia@student.42.fr',
      'https://cdn.intra.42.fr/users/jiglesia.jpg',
    );
    this.db.setUser(
      'mravily',
      'titi toto',
      'titi',
      'toto',
      'toto@student.42.fr',
      'https://cdn.intra.42.fr/users/mravily.jpg',
    );
    // this.db.setFriend("jiglesia", "mravily");
  }

  @Get()
  getHello(): string {
    console.log('lol');
    return this.appService.getHello();
  }

}
