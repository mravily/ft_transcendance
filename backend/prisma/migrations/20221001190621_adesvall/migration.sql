-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nickName" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "isOnline" BOOLEAN NOT NULL,
    "isAdmin" BOOLEAN NOT NULL,
    "atoken" TEXT NOT NULL,
    "rtoken" TEXT NOT NULL,
    "twoFA" BOOLEAN NOT NULL,
    "twoFApwd" TEXT,
    "imgUrl" TEXT NOT NULL,
    "n_messages" INTEGER NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Match" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "winnerScore" INTEGER,
    "looserScore" INTEGER,
    "winnerid" TEXT,
    "looserid" TEXT,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Channel" (
    "channelName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "is_pwd" BOOLEAN NOT NULL,
    "pwd" TEXT,
    "isDirect" BOOLEAN NOT NULL,
    "isPrivate" BOOLEAN NOT NULL,
    "creatorId" TEXT NOT NULL,

    CONSTRAINT "Channel_pkey" PRIMARY KEY ("channelName")
);

-- CreateTable
CREATE TABLE "makeAdmin" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "channelId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "makeAdmin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "muteUser" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "duration" INTEGER NOT NULL,
    "channelId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "muteUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BanUser" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "channelId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "BanUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JoinChannel" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,

    CONSTRAINT "JoinChannel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChannelMessage" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL,
    "fromId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,

    CONSTRAINT "ChannelMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AddFriend" (
    "id" SERIAL NOT NULL,
    "createdAd" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isAccepted" BOOLEAN NOT NULL,
    "requesterId" TEXT NOT NULL,
    "requestedId" TEXT NOT NULL,

    CONSTRAINT "AddFriend_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlockUser" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "blockerId" TEXT NOT NULL,
    "blockedId" TEXT NOT NULL,

    CONSTRAINT "BlockUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Photos" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "filename" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Photos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_login_key" ON "User"("login");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_atoken_key" ON "User"("atoken");

-- CreateIndex
CREATE UNIQUE INDEX "User_rtoken_key" ON "User"("rtoken");

-- CreateIndex
CREATE UNIQUE INDEX "makeAdmin_channelId_userId_key" ON "makeAdmin"("channelId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "muteUser_channelId_userId_key" ON "muteUser"("channelId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "BanUser_channelId_userId_key" ON "BanUser"("channelId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "JoinChannel_channelId_userId_key" ON "JoinChannel"("channelId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Photos_filename_key" ON "Photos"("filename");

-- CreateIndex
CREATE UNIQUE INDEX "Photos_path_key" ON "Photos"("path");

-- CreateIndex
CREATE UNIQUE INDEX "Photos_userId_path_key" ON "Photos"("userId", "path");

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_winnerid_fkey" FOREIGN KEY ("winnerid") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_looserid_fkey" FOREIGN KEY ("looserid") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Channel" ADD CONSTRAINT "Channel_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "makeAdmin" ADD CONSTRAINT "makeAdmin_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("channelName") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "makeAdmin" ADD CONSTRAINT "makeAdmin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("login") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "muteUser" ADD CONSTRAINT "muteUser_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("channelName") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "muteUser" ADD CONSTRAINT "muteUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("login") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BanUser" ADD CONSTRAINT "BanUser_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("channelName") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BanUser" ADD CONSTRAINT "BanUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("login") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JoinChannel" ADD CONSTRAINT "JoinChannel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JoinChannel" ADD CONSTRAINT "JoinChannel_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("channelName") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChannelMessage" ADD CONSTRAINT "ChannelMessage_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChannelMessage" ADD CONSTRAINT "ChannelMessage_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("channelName") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AddFriend" ADD CONSTRAINT "AddFriend_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AddFriend" ADD CONSTRAINT "AddFriend_requestedId_fkey" FOREIGN KEY ("requestedId") REFERENCES "User"("login") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlockUser" ADD CONSTRAINT "BlockUser_blockerId_fkey" FOREIGN KEY ("blockerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlockUser" ADD CONSTRAINT "BlockUser_blockedId_fkey" FOREIGN KEY ("blockedId") REFERENCES "User"("login") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Photos" ADD CONSTRAINT "Photos_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
