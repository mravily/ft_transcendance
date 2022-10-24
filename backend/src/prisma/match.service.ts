import { PrismaService } from '../prisma.service';
import { IMatch } from '../interfaces';

export async function setMatch(this: PrismaService, winnerId: string, looserId:string, winnerScore: number, looserScore: number): Promise<number> {
  try {
    const match = await this.prisma.match.create({
      data: {
        winnerid: winnerId,
        looserid: looserId,
        winnerScore: winnerScore,
        looserScore: looserScore
      },
    });
    await this.prisma.user.update({
      where: {id: winnerId},
      data: { score: {increment: winnerScore} },
    });
    await this.prisma.user.update({
      where: {id: looserId},
      data: { score: {increment: looserScore} },
    });
    return match.id;
  }
  catch (error) {
    //console.log(error.message);
  }
}

// export async function setMatchWinner(this: PrismaService, matchId: number, userId: string, score: number) {
//   try {
//     await this.prisma.match.update({
//       where: { id: matchId },
//       data: {
//         winnerid: userId,
//         winnerScore: score
//       },
//     });
//   }
//   catch (error) {
//     console.log(error.message);
//   }
// }

// export async function setMatchLooser(this: PrismaService, matchId: number, userId: string, score: number) {
//     try {
//       await this.prisma.match.update({
//         where: { id: matchId },
//         data: {
//           looserid: userId,
//           looserScore: score
//         },
//       });
//     }
//     catch (error) {
//       console.log(error.message);
//     }
//   }

export async function getNoWinnedMatchs(this: PrismaService, login: string): Promise<number> {
  try {
    return await this.prisma.match.count({
      where: { winner: { login: login } },
    });
  }
  catch (error) {
    //console.log(error.message);
  }
}

export async function getNolostMatchs(this: PrismaService, login: string): Promise<number> {
  try {
    return await this.prisma.match.count({
      where: { looser: { login: login } },
    });
  }
  catch (error) {
    //console.log(error.message);
  }
}

export async function getMatchHistory(this: PrismaService, login: string): Promise<IMatch[]> {
  try {
    const tmp = await this.prisma.match.findMany({
      where: {
        OR: [
          {
            winner: {
              login: login,
            },
          },
          {
            looser: {
              login: login,
            }
          }
        ]
      },
      select: {
        winner: { select: { login: true } },
        winnerScore: true,
        looser: { select: { login: true } },
        looserScore: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
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
  }
  catch (error) {
    //console.log(error.message);
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
  }
  catch (error) {
    //console.log(error.message);
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
  }
  catch (error) {
    //console.log(error.message);
  }
}
