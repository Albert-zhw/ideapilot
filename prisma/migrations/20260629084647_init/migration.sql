-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT,
    "avatar" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ideas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "rawText" TEXT NOT NULL,
    "title" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ANALYZED',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ideas_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "analysis_results" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ideaId" TEXT NOT NULL,
    "track" TEXT NOT NULL,
    "targetUser" TEXT NOT NULL,
    "painPoint" TEXT NOT NULL,
    "mvp" TEXT NOT NULL,
    "demoRoute" TEXT NOT NULL,
    "tasks" TEXT NOT NULL,
    "pitch" TEXT NOT NULL,
    "canvas" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "modelUsed" TEXT NOT NULL,
    "tokensUsed" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "analysis_results_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "ideas" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tags" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "idea_tags" (
    "ideaId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    PRIMARY KEY ("ideaId", "tagId"),
    CONSTRAINT "idea_tags_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "ideas" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "idea_tags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tags" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "shares" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ideaId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" DATETIME,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "shares_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "ideas" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "shares_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "exports" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ideaId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "fileUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "exports_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "ideas" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "exports_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "templates" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "track" TEXT NOT NULL,
    "exampleInput" TEXT NOT NULL,
    "exampleOutput" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "ideas_userId_idx" ON "ideas"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "analysis_results_ideaId_key" ON "analysis_results"("ideaId");

-- CreateIndex
CREATE UNIQUE INDEX "tags_name_key" ON "tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "shares_token_key" ON "shares"("token");

-- CreateIndex
CREATE INDEX "shares_token_idx" ON "shares"("token");

-- CreateIndex
CREATE UNIQUE INDEX "templates_track_key" ON "templates"("track");
