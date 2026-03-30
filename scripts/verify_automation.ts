import { prisma } from "../packages/db/src/client";
import { processWebhookEvent } from "../packages/automation/src/index";

// Mock global fetch for Meta API calls
(globalThis as any).fetch = async (url: string, options: any) => {
  console.log(`[Mock Fetch] Called: ${url}`);
  return {
    ok: true,
    json: async () => ({ message_id: "meta_reply_888", id: "meta_reply_888" })
  };
};

async function verify() {
  console.log("--- STARTING AUTOMATION VERIFICATION ---");

  try {
    // 0. Cleanup old Test Data
    console.log("0. Cleaning up previous test data...");
    await prisma.message.deleteMany({ where: { account: { externalId: "meta_123" } } });
    await prisma.thread.deleteMany({ where: { account: { externalId: "meta_123" } } });
    await prisma.trigger.deleteMany({ where: { automation: { user: { email: "test@ventry.ai" } } } });
    await prisma.action.deleteMany({ where: { automation: { user: { email: "test@ventry.ai" } } } });
    await prisma.automation.deleteMany({ where: { user: { email: "test@ventry.ai" } } });

    // 1. Setup Test Data
    console.log("1. Setting up mock user and automation...");
    const user = await prisma.user.upsert({
      where: { email: "test@ventry.ai" },
      update: {},
      create: {
        email: "test@ventry.ai",
        name: "Test User",
        subscriptionStatus: "active",
      },
    });

    const account = await prisma.account.upsert({
      where: { platform_externalId: { platform: "instagram", externalId: "meta_123" } },
      update: { accessToken: "mock_token" },
      create: {
        userId: user.id,
        platform: "instagram",
        externalId: "meta_123",
        accessToken: "mock_token"
      },
    });

    const automation = await prisma.automation.create({
      data: {
        userId: user.id,
        name: "Discount Bot",
        isActive: true,
        triggers: {
          create: {
            type: "messages",
            keywords: ["discount", "promo", "deal"],
          },
        },
        actions: {
          create: {
            type: "send_dm",
            payload: { useAI: true },
          },
        },
      },
    });

    console.log(`Created Automation ID: ${automation.id}`);

    // 2. Simulate Webhook Inbound
    const mockContent = "Hey, do you have any discount codes?";
    const mockThreadId = "thread_abc_123";
    const mockExternalId = "mid." + Date.now().toString();

    console.log(`2. Simulating inbound message: "${mockContent}"`);

    await processWebhookEvent(
      account.id,
      mockContent,
      "messages",
      mockThreadId,
      mockExternalId
    );

    // 3. Verify Idempotency (Repeat)
    console.log("3. Testing idempotency (second call with same ID)...");
    await processWebhookEvent(
      account.id,
      mockContent,
      "messages",
      mockThreadId,
      mockExternalId
    );

    const thread = await prisma.thread.findUnique({
      where: { accountId_externalThreadId: { accountId: account.id, externalThreadId: mockThreadId } },
      include: { messages: true },
    });

    if (!thread) {
      throw new Error("FAIL: Thread not created in DB");
    }
    console.log("PASS: Thread created successfully.");

    const inbound = thread.messages.find(m => m.direction === "inbound");
    if (!inbound || inbound.content !== mockContent) {
      throw new Error("FAIL: Inbound message not stored correctly");
    }
    console.log("PASS: Inbound message stored.");

    const outbound = thread.messages.find(m => m.direction === "outbound");
    if (!outbound) {
      throw new Error("FAIL: Automation did not trigger an outbound message");
    }
    console.log(`PASS: Outbound reply generated: "${outbound.content}"`);

    console.log("\n--- VERIFICATION SUCCESSFUL ---");

  } catch (error) {
    console.error("\n--- VERIFICATION FAILED ---");
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

verify();
