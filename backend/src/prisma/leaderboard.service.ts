import { PrismaService, accountUser } from '../prisma.service';

export async function getTopTen(this: PrismaService) {
  const list = await this.prisma.user.findMany({
    select: {
      email: true,
      login: true,
      nickName: true,
      imgUrl: true,
      score: true,
      isOnline: true,
      _count: { select: { winnedMatchs: true, lostMatchs: true } },
    },
    orderBy: { score: 'desc' },
    take: 10,
  });
  let users: accountUser[] = [];
  for (let i in list) {
    const user: accountUser = {
      score: list[i].score,
      login: list[i].login,
      fullName: list[i].nickName,
      email: list[i].email,
      avatar: list[i].imgUrl,
      isOnline: list[i].isOnline,
      win: list[i]._count.winnedMatchs,
      lost: list[i]._count.lostMatchs,
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
      nickName: true,
      imgUrl: true,
      score: true,
      isOnline: true,
      _count: { select: { winnedMatchs: true, lostMatchs: true } },
    },
    orderBy: { score: 'desc' },
  });
  let users: accountUser[] = [];
  for (let i in list) {
    const user: accountUser = {
      score: list[i].score,
      login: list[i].login,
      fullName: list[i].nickName,
      email: list[i].email,
      avatar: list[i].imgUrl,
      isOnline: list[i].isOnline,
      win: list[i]._count.winnedMatchs, //await this.getNoWinnedMatchs(list[i].login),
      lost: list[i]._count.lostMatchs, //await this.getNolostMatchs(list[i].login),
    };
    users.push(user);
  }
  return users;
}
