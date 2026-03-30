import { prisma } from "../packages/db/src/client";

async function enableRLS() {
  console.log("--- ENABLING RLS ON ACCOUNT TABLE ---");

  try {
    // 1. Enable RLS
    await prisma.$executeRawUnsafe(`ALTER TABLE "Account" ENABLE ROW LEVEL SECURITY;`);

    // 2. Drop existing policy if any
    await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Users can only see their own accounts" ON "Account";`);

    // 3. Create Policy (Users can only see their own accounts)
    await prisma.$executeRawUnsafe(`
      CREATE POLICY "Users can only see their own accounts"
      ON "Account"
      FOR ALL
      USING (auth.uid()::text = "userId");
    `);


    console.log("--- RLS SUCCESSFULLY ENABLED ---");
  } catch (error) {
    console.error("--- RLS ENABLE FAILED ---");
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

enableRLS();
