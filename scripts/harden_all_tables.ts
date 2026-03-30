import { prisma } from "../packages/db/src/client";

async function hardenDB() {
  console.log("--- STARTING DATABASE HARDENING (RLS) ---");

  const tables = ["User", "Account", "Automation", "Thread", "Message", "Post"];

  try {
    for (const table of tables) {
      console.log(`Enabling RLS on "${table}"...`);
      await prisma.$executeRawUnsafe(`ALTER TABLE "${table}" ENABLE ROW LEVEL SECURITY;`);
      await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Owner access" ON "${table}";`);
    }

    // 1. Direct userId tables
    console.log("Applying direct userId policies...");
    const directTables = ["User", "Account", "Automation"];
    for (const table of directTables) {
      const column = table === "User" ? "id" : "userId";
      await prisma.$executeRawUnsafe(`
        CREATE POLICY "Owner access" ON "${table}"
        FOR ALL USING (auth.uid()::text = "${column}");
      `);
    }

    // 2. Related tables (Thread, Message, Post via Account)
    console.log("Applying subquery policies for related tables...");
    
    // Thread
    await prisma.$executeRawUnsafe(`
      CREATE POLICY "Owner access" ON "Thread"
      FOR ALL USING (
        auth.uid()::text = (
          SELECT "userId" FROM "Account" WHERE "Account".id = "Thread"."accountId"
          LIMIT 1
        )
      );
    `);

    // Message
    await prisma.$executeRawUnsafe(`
      CREATE POLICY "Owner access" ON "Message"
      FOR ALL USING (
        auth.uid()::text = (
          SELECT "userId" FROM "Account" WHERE "Account".id = "Message"."accountId"
          LIMIT 1
        )
      );
    `);

    // Post
    await prisma.$executeRawUnsafe(`
      CREATE POLICY "Owner access" ON "Post"
      FOR ALL USING (
        auth.uid()::text = (
          SELECT "userId" FROM "Account" WHERE "Account".id = "Post"."accountId"
          LIMIT 1
        )
      );
    `);

    console.log("--- DATABASE HARDENING SUCCESSFUL ---");
  } catch (error) {
    console.error("--- DATABASE HARDENING FAILED ---");
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

hardenDB();
