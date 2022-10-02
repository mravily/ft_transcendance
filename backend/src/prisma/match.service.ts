import { PrismaService } from '../prisma.service';

export async function setMatch(this: PrismaService) {
  try {
    const match = await this.prisma.match.create({ data: {} });
    return match.id;
  } catch (error) {
    console.log(error.message);
  }
}

export async function setMatchWinner(
  this: PrismaService,
  matchId: number,
  id: string,
  score: number,
) {
  try {
    await this.prisma.match.update({
      where: { id: matchId },
      data: { winnerid: id, winnerScore: score },
    });
  } catch (error) {
    console.log(error.message);
  }
}

export async function getNoWinnedMatchs(this: PrismaService, login: string) {
  try {
    return await this.prisma.match.count({
      where: { winner: { login: login } },
    });
  } catch (error) {
    console.log(error.message);
  }
}

export async function getNolostMatchs(this: PrismaService, login: string) {
  try {
    return await this.prisma.match.count({
      where: { looser: { login: login } },
    });
  } catch (error) {
    console.log(error.message);
  }
}

export async function getMatchHistory(this: PrismaService, login: string) {
  try {
    const list = await this.prisma.user.findUnique({
      where: { login: login },
      select: {
        winnedMatchs: {
          select: {
            createdAt: true,
            winner: { select: { login: true } },
            winnerScore: true,
            looser: { select: { login: true } },
            looserScore: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        lostMatchs: {
          select: {
            createdAt: true,
            winner: { select: { login: true } },
            winnerScore: true,
            looser: { select: { login: true } },
            looserScore: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    return list.lostMatchs.concat(list.winnedMatchs).sort((a, b) => {
      if (a.createdAt < b.createdAt) return -1;
      else if (a.createdAt > b.createdAt) return 1;
      return 0;
    });
  } catch (error) {
    console.log(error.message);
  }
}

export async function getRatio(this: PrismaService, login: string) {
  try {
    const wins = await this.prisma.match.count({
      where: { winner: { login: login } },
    });
    const lost = await this.prisma.match.count({
      where: { looser: { login: login } },
    });
    return [wins, lost];
  } catch (error) {
    console.log(error.message);
  }
}

export async function getRatioById(this: PrismaService, id: string) {
  try {
    const wins = await this.prisma.match.count({
      where: { winnerid: id },
    });
    const lost = await this.prisma.match.count({
      where: { looserid: id },
    });
    return [wins, lost];
  } catch (error) {
    console.log(error.message);
  }
}
