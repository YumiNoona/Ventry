"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewAutomation() {
  const [name, setName] = useState("");
  const [keywords, setKeywords] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const resp = await fetch("/api/automations", {
        method: "POST",
        body: JSON.stringify({
          name,
          keywords: keywords.split(",").map(k => k.trim()).filter(Boolean),
          type: "send_dm",
          useAI: true
        })
      });

      if (resp.ok) {
        router.push("/dashboard/automations");
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">New Automation</h1>
        <p className="text-muted-foreground">Setup a new keyword trigger for your AI replies.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Automation Name</label>
          <input 
            type="text" 
            required
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="e.g. Discount Code Reply"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Keywords (comma separated)</label>
          <input 
            type="text"
            required
            value={keywords}
            onChange={e => setKeywords(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="e.g. discount, coupon, promo"
          />
        </div>

        <div className="p-4 bg-muted/50 rounded-lg border-2 border-dashed">
          <h3 className="font-semibold mb-1">Action: Send AI Reply</h3>
          <p className="text-sm text-muted-foreground">
            When any of the keywords match, Gemini will analyze the context and send a professional response.
          </p>
        </div>

        <button 
          disabled={loading}
          className="w-full bg-primary text-primary-foreground py-2 rounded-md font-medium hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Automation"}
        </button>
      </form>
    </div>
  );
}
