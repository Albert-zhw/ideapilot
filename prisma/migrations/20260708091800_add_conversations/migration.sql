-- CreateTable
CREATE TABLE "conversations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ideaId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "conversations_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "ideas" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "conversations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "chat_messages" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "conversationId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "kind" TEXT NOT NULL DEFAULT 'NORMAL',
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "chat_messages_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "conversations" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "development_prompts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ideaId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "development_prompts_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "ideas" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "development_prompts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "conversations_ideaId_idx" ON "conversations"("ideaId");

-- CreateIndex
CREATE INDEX "conversations_userId_idx" ON "conversations"("userId");

-- CreateIndex
CREATE INDEX "chat_messages_conversationId_idx" ON "chat_messages"("conversationId");

-- CreateIndex
CREATE INDEX "development_prompts_ideaId_idx" ON "development_prompts"("ideaId");

-- CreateIndex
CREATE INDEX "development_prompts_userId_idx" ON "development_prompts"("userId");
