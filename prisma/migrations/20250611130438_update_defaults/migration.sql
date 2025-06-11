-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_GameConfig" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "currentMode" TEXT NOT NULL DEFAULT 'cardMaker',
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_GameConfig" ("createdAt", "currentMode", "id", "isEnabled", "updatedAt") SELECT "createdAt", "currentMode", "id", "isEnabled", "updatedAt" FROM "GameConfig";
DROP TABLE "GameConfig";
ALTER TABLE "new_GameConfig" RENAME TO "GameConfig";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
