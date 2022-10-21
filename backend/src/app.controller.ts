import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { PrismaService } from './prisma.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private db: PrismaService,
    private authService: AuthService,
  ) {
    // this.db.setUser(
    //   'jiglesia',
    //   'Juan Iglesias',
    //   'Juan',
    //   'Iglesias',
    //   'jiglesia@student.42.fr',
    //   'https://cdn.intra.42.fr/users/jiglesia.jpg',
    // ).then(tmp =>
    //   this.db.setUser(
    //     'mravily',
    //     'Medhi Ravily',
    //     'Medhi',
    //     'Ravily',
    //     'mravily@student.42.fr',
    //     'https://cdn.intra.42.fr/users/mravily.jpg',
    //   )
    // ).then(tmp =>
    //   this.db.setUser(
    //     'upeyret',
    //     'Ulysse Peyret',
    //     'Ulysse',
    //     'Peyret',
    //     'upeyret@student.42.fr',
    //     'https://cdn.intra.42.fr/users/upeyret.jpg',
    //   )
    // ).then(tmp =>
    //   this.db.setUser(
    //     'adesvall',
    //     'Augustin Desvallées',
    //     'Augustin',
    //     'Desvallées',
    //     'adesvall@student.42.fr',
    //     'https://cdn.intra.42.fr/users/adesvall.jpg',
    //   )
    // ).then(tmp =>
    //     this.db.sendFriendReq('upeyret', 'jiglesia')
    // ).then( tmp =>
    //   this.db.sendFriendReq('upeyret', 'mravily')
    // ).then( tmp =>
    //   this.db.sendFriendReq('upeyret', 'adesvall')
    // ).then( tmp =>
    //   this.db.sendFriendReq('mravily', 'jiglesia')
    // ).then( tmp =>
    //   this.db.sendFriendReq('mravily', 'adesvall')
    // ).then( tmp =>
    //   this.db.sendFriendReq('adesvall', 'jiglesia')
    // ).then( tmp => {
    //     this.db.acceptFriendship('jiglesia', 'mravily');
    //     this.db.acceptFriendship('jiglesia', 'upeyret');
    //     this.db.acceptFriendship('jiglesia', 'adesvall');
    //     this.db.acceptFriendship('mravily', 'upeyret');
    //     this.db.acceptFriendship('adesvall', 'mravily');
    //     this.db.acceptFriendship('adesvall', 'upeyret');
    //   }
    // )
  }

  @Get()
  getHello(): string {
    //console.log('lol');
    return this.appService.getHello();
  }
}