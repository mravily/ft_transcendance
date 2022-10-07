import { PrismaService } from "../prisma.service";

export async function getProfileOverview(this: PrismaService, login: string) {
    try {
        const usr = await this.prisma.user.findUnique({
            where: { login: login },
            select: {
                _count: {
                    select: {
                        winnedMatchs: true,
                        lostMatchs: true,
                    }
                },
                imgUrl: true,
                nickName: true,
                winnedMatchs: {
                    select: {
                        winnerScore: true,
                        looserScore: true,
                        looser: {
                            select: {
                                login: true,
                                imgUrl: true,
                                nickName: true,
                            }
                        }
                    },
                },
                lostMatchs: {
                    select: {
                        looserScore: true,
                        winnerScore: true,
                        winner: {
                            select: {
                                login: true,
                                imgUrl: true,
                                nickName: true,
                            }
                        }
                    }
                },
                //
            }
        });
        // let profile = {} as ProfileOverview;
        // if (usr) {

        // }
        // return profile;
    }
    catch (error) {
        console.log(error.message);
    }
}