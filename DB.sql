-- 1. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE "user" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "plan" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "account" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "automation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "trigger" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "action" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "thread" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "message" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "post" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "automation_execution" ENABLE ROW LEVEL SECURITY;

-- 2. RESET POLICIES (CLEAN SLATE)
DO $$ 
DECLARE pol record;
BEGIN 
    FOR pol IN (SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public') LOOP 
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I', pol.policyname, pol.tablename);
    END LOOP; 
END $$;

-- 3. PLAN POLICIES (PUBLIC READ)
CREATE POLICY "Public read plans" ON "plan" FOR SELECT TO authenticated, anon USING (true);

-- 4. USER POLICIES (SELF-MANAGEMENT)
CREATE POLICY "Users can manage own profile" ON "user" FOR ALL TO authenticated USING (auth.uid()::text = id);

-- 5. ACCOUNT POLICIES (OWNERSHIP TRACE)
CREATE POLICY "Users can manage own accounts" ON "account" FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM "user" WHERE "user".id = "account".user_id AND "user".id = auth.uid()::text)
);

-- 6. AUTOMATION POLICIES
CREATE POLICY "Users can manage own automations" ON "automation" FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM "user" WHERE "user".id = "automation".user_id AND "user".id = auth.uid()::text)
);

-- 7. COMPONENT POLICIES (TRIGGER, ACTION, EXECUTION)
CREATE POLICY "Users can manage own triggers" ON "trigger" FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM "automation" 
    JOIN "user" ON "user".id = "automation".user_id 
    WHERE "automation".id = "trigger".automation_id AND "user".id = auth.uid()::text
  )
);

CREATE POLICY "Users can manage own actions" ON "action" FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM "automation" 
    JOIN "user" ON "user".id = "automation".user_id 
    WHERE "automation".id = "action".automation_id AND "user".id = auth.uid()::text
  )
);

CREATE POLICY "Users can manage own executions" ON "automation_execution" FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM "automation" 
    JOIN "user" ON "user".id = "automation".user_id 
    WHERE "automation".id = "automation_execution".automation_id AND "user".id = auth.uid()::text
  )
);

-- 8. CONVERSATION & CONTENT POLICIES (THREAD, MESSAGE, POST)
CREATE POLICY "Users can manage own threads" ON "thread" FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM "account" 
    JOIN "user" ON "user".id = "account".user_id 
    WHERE "account".id = "thread".account_id AND "user".id = auth.uid()::text
  )
);

CREATE POLICY "Users can manage own messages" ON "message" FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM "account" 
    JOIN "user" ON "user".id = "account".user_id 
    WHERE "account".id = "message".account_id AND "user".id = auth.uid()::text
  )
);

CREATE POLICY "Users can manage own posts" ON "post" FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM "account" 
    JOIN "user" ON "user".id = "account".user_id 
    WHERE "account".id = "post".account_id AND "user".id = auth.uid()::text
  )
);

-- 9. SEED DEFAULT PLANS
INSERT INTO "plan" (id, name, price, message_limit, created_at)
VALUES 
  ('cl1', 'Free', 0, 50, NOW()),
  ('cl2', 'Pro', 2900, 1000, NOW()),
  ('cl3', 'Elite', 9900, NULL, NOW())
ON CONFLICT (name) DO UPDATE 
SET price = EXCLUDED.price, message_limit = EXCLUDED.message_limit;
