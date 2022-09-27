import { PrismaService } from "src/prisma.service"

export async function setMatch(this: PrismaService, w_score: number, l_score: number, w_login: string, l_login: string) {
  await this.prisma.match.create({
    data: {
      winnerScore: w_score,
      looserScore: l_score,
      winnerid: w_login,
      looserid: l_login,
    }
  }).catch();
}

export async function getNoWinnedMatchs(this: PrismaService, login: string) {
    return await this.prisma.match.count({
        where: { winnerid: login },
    })
}

export async function getNolostMatchs(this: PrismaService, login: string) {
    return await this.prisma.match.count({
        where: { looserid: login },
    })
}

export async function getMatchHistory(this: PrismaService, login: string) {
    const list = await this.prisma.user.findUnique({
        where: { login: login },
        select: { 
            winnedMatchs: { orderBy: {createdAt: 'desc'} },
            lostMatchs: { orderBy: {createdAt: 'desc'} },
        },
    });
    return list.lostMatchs.concat(list.winnedMatchs).sort((a, b) => {
        if(a.createdAt < b.createdAt)
            return -1;
        else if (a.createdAt > b.createdAt)
            return 1;
        return 0;
    }); 
}
  export async function getRatio(this: PrismaService, login: string) {
    const wins = await this.prisma.match.count({
        where: { winnerid: login }
    });
    const lost = await this.prisma.match.count({
        where: { looserid: login }
    });
    return [wins, lost];
}
