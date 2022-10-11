import { PrismaService } from '../prisma.service';
import { IMatch } from '../interfaces';

export async function setMatch(this: PrismaService): Promise<number> {
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

export async function getNoWinnedMatchs(this: PrismaService, login: string): Promise<number> {
  try {
    return await this.prisma.match.count({
      where: { winner: { login: login } },
    });
  } catch (error) {
    console.log(error.message);
  }
}

export async function getNolostMatchs(this: PrismaService, login: string): Promise<number> {
  try {
    return await this.prisma.match.count({
      where: { looser: { login: login } },
    });
  } catch (error) {
    console.log(error.message);
  }
}

export async function getMatchHistory(this: PrismaService, login: string): Promise<IMatch[]> {
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
    const tmp = list.lostMatchs.concat(list.winnedMatchs).sort((a, b) => {
      if (a.createdAt < b.createdAt) return -1;
      else if (a.createdAt > b.createdAt) return 1;
      return 0;
    });
    let matches: IMatch[] = [];
    for (let i in tmp) {
      matches.push({
        createdAt: tmp[i].createdAt,
        winner: tmp[i].winner.login,
        winnerScore: tmp[i].winnerScore,
        looser: tmp[i].looser.login,
        looserScore: tmp[i].looserScore,
      });
    }
    return matches;
  } catch (error) {
    console.log(error.message);
  }
}

export async function getRatio(this: PrismaService, login: string): Promise<[number, number]> {
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

export async function getRatioById(this: PrismaService, id: string): Promise<[number, number]> {
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
