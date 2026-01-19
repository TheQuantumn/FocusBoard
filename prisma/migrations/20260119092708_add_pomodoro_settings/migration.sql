-- CreateTable
CREATE TABLE "PomodoroSettings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studyTime" INTEGER NOT NULL,
    "breakTime" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "PomodoroSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "PomodoroSettings_userId_key" ON "PomodoroSettings"("userId");
