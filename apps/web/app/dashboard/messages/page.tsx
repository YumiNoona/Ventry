import { requireUser } from "@/lib/getUser";
import { prisma } from "@/lib/prisma";
import { MessageSquare, User, Bot, Clock, Filter, Search } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default async function InboxPage() {
  const { dbUser } = await requireUser();

  // Get all messages for the current user's accounts, grouped by threadId
  const messages = await prisma.message.findMany({
    where: { account: { userId: dbUser?.id } },
    include: { account: true, automation: true },
    orderBy: { createdAt: "desc" },
  });

  // Simple thread grouping logic for the UI
  const threadsMap = new Map();
  messages.forEach((msg) => {
    if (!threadsMap.has(msg.threadId)) {
      threadsMap.set(msg.threadId, {
        id: msg.threadId,
        lastMessage: msg,
        messages: [],
        account: msg.account,
      });
    }
    threadsMap.get(msg.threadId).messages.push(msg);
  });

  const threads = Array.from(threadsMap.values());

  return (
    <div className="h-[calc(100vh-160px)] flex rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
      {/* Thread List Sidebar */}
      <div className="w-80 border-r border-border flex flex-col bg-muted/10">
        <div className="p-4 border-b border-border space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-lg">Inbox</h2>
            <div className="flex gap-2">
              <button className="p-1.5 rounded-md hover:bg-muted text-muted-foreground"><Search className="h-4 w-4" /></button>
              <button className="p-1.5 rounded-md hover:bg-muted text-muted-foreground"><Filter className="h-4 w-4" /></button>
            </div>
          </div>
          <div className="flex gap-2">
             <div className="flex-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-tighter flex items-center justify-center py-1">All Threads</div>
             <div className="flex-1 rounded-full bg-muted text-muted-foreground text-[10px] font-bold uppercase tracking-tighter flex items-center justify-center py-1">Unread</div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {threads.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <MessageSquare className="h-8 w-8 mx-auto mb-4 opacity-20" />
              <p className="text-sm">No conversations yet.</p>
            </div>
          ) : (
            threads.map((thread) => (
              <div key={thread.id} className="p-4 border-b border-border hover:bg-muted/50 cursor-pointer group transition-colors relative">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex items-start gap-3">
                  <div className="size-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold truncate">Thread: {thread.id.slice(-6)}</h4>
                      <span className="text-[10px] text-muted-foreground uppercase">{formatDistanceToNow(new Date(thread.lastMessage.createdAt))} ago</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate leading-relaxed">
                      {thread.lastMessage.direction === 'outbound' ? 'You: ' : ''}{thread.lastMessage.content}
                    </p>
                    <div className="flex items-center gap-1.5 pt-1">
                      <div className="size-3 rounded-full bg-primary/20 flex items-center justify-center">
                         <div className="size-1 rounded-full bg-primary"></div>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">{thread.account.name}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat View */}
      <div className="flex-1 flex flex-col bg-background">
        {threads.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-4">
             <div className="size-20 rounded-full bg-muted flex items-center justify-center">
                <MessageSquare className="h-10 w-10 text-muted-foreground opacity-20" />
             </div>
             <div>
                <h3 className="text-xl font-bold">Your inbox is empty</h3>
                <p className="text-sm text-muted-foreground max-w-xs mt-2 mx-auto">
                    Once users start messaging your Instagram accounts, their conversations and our AI's replies will appear here.
                </p>
             </div>
          </div>
        ) : (
          <>
            {/* Thread Header */}
            <div className="h-16 border-b border-border px-6 flex items-center justify-between bg-card/30">
               <div className="flex items-center gap-3">
                  <div className="size-8 rounded-full bg-muted flex items-center justify-center"><User className="h-4 w-4" /></div>
                  <div>
                    <h3 className="text-sm font-bold">Thread ID: {threads[0].id}</h3>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-success opacity-80">Connected to {threads[0].account.name}</p>
                  </div>
               </div>
               <div className="flex gap-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>Last active {formatDistanceToNow(new Date(threads[0].lastMessage.createdAt))} ago</span>
                  </div>
               </div>
            </div>

            {/* Messages Display */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-muted/5">
              {threads[0].messages.sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()).map((msg: any) => (
                <div key={msg.id} className={`flex flex-col ${msg.direction === 'outbound' ? 'items-end' : 'items-start'} animate-fade-in`}>
                   <div className="flex items-center gap-2 mb-1.5 px-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        {msg.direction === 'outbound' ? 'Ventry AI' : 'Customer'}
                      </span>
                      {msg.automationId && (
                        <span className="text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                          {msg.automation.name}
                        </span>
                      )}
                   </div>
                   <div className={`max-w-md p-4 rounded-2xl text-sm leading-relaxed ${
                     msg.direction === 'outbound' 
                      ? 'bg-primary text-primary-foreground rounded-tr-none shadow-md shadow-primary/10' 
                      : 'bg-card border border-border text-foreground rounded-tl-none shadow-sm'
                   }`}>
                      {msg.content}
                   </div>
                   <span className="text-[9px] text-muted-foreground mt-1.5 uppercase font-bold tracking-tighter opacity-50 px-1">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                   </span>
                </div>
              ))}
            </div>

            {/* Typing Bar (ReadOnly for now as Ventry is an Automation tool) */}
            <div className="p-4 border-t border-border bg-card">
               <div className="p-4 rounded-xl bg-muted/30 border border-dashed border-border text-center">
                  <p className="text-xs text-muted-foreground font-medium flex items-center justify-center gap-2">
                    <Bot className="h-3 w-3" />
                    This conversation is being handled by the <span className="text-primary font-bold">{threads[0].messages.find((m: any) => m.automationId)?.automation?.name || "AI Engine"}</span>
                  </p>
               </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
