import { PrismaService, accountUser } from '../prisma.service';

export async function getTopTen(this: PrismaService) {
  const list = await this.prisma.user.findMany({
    select: {
      email: true,
      login: true,
      fullName: true,
      imgUrl: true,
      score: true,
      isOnline: true,
    },
    orderBy: { score: 'desc' },
    take: 10,
  });
  const users: accountUser[] = [];
  for (const i in list) {
    const user: accountUser = {
      score: list[i].score,
      login: list[i].login,
      fullName: list[i].fullName,
      email: list[i].email,
      imgUrl: list[i].imgUrl,
      isOnline: list[i].isOnline,
      win: await this.getNoWinnedMatchs(list[i].login),
      lost: await this.getNolostMatchs(list[i].login),
    };
    users.push(user);
  }
  return users;
}

export async function getUsersRanking(this: PrismaService) {
  const list = await this.prisma.user.findMany({
    select: {
      email: true,
      login: true,
      fullName: true,
      imgUrl: true,
      score: true,
      isOnline: true,
    },
    orderBy: { score: 'desc' },
  });
  const users: accountUser[] = [];
  for (const i in list) {
    const user: accountUser = {
      score: list[i].score,
      login: list[i].login,
      fullName: list[i].fullName,
      email: list[i].email,
      imgUrl: list[i].imgUrl,
      isOnline: list[i].isOnline,
      win: await this.getNoWinnedMatchs(list[i].login),
      lost: await this.getNolostMatchs(list[i].login),
    };
    users.push(user);
  }
  return users;
}
