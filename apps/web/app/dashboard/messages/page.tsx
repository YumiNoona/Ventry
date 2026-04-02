import { getAuthUser } from "@/lib/getUser";
import { prisma } from "@/lib/prisma";
import { MessageSquare, User, Bot, Clock, Filter, Search } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default async function InboxPage() {
  const user = await getAuthUser();

  // Get all messages for the current user's accounts, grouped by threadId
  const data = await prisma.message.findMany({
    where: { account: { userId: user.id } },
    include: { account: true, thread: true },
    orderBy: { createdAt: "desc" },
  });

  type MessageWithAccount = typeof data[number];

  // Simple thread grouping logic for the UI
  const threadsMap = new Map<string, { id: string, lastMessage: MessageWithAccount, messages: MessageWithAccount[], account: any }>();
  
  data.forEach((msg: MessageWithAccount) => {
    const threadKey = msg.threadId || msg.id; // fallback to message id if no thread
    if (!threadsMap.has(threadKey)) {
      threadsMap.set(threadKey, {
        id: threadKey,
        lastMessage: msg,
        messages: [],
        account: msg.account,
      });
    }
    threadsMap.get(threadKey)!.messages.push(msg);
  });

  const threads = Array.from(threadsMap.values());
  type Thread = typeof threads[number];

  return (
    <div className="h-full flex bg-background overflow-hidden animate-in fade-in duration-300">
      {/* Thread List Sidebar */}
      <div className="w-80 border-r border-border flex flex-col bg-muted/5 z-10">
        <div className="p-4 border-b border-border bg-background">
          <div className="flex items-center gap-2">
            <div className="flex-1 flex gap-1 p-1 bg-muted/50 rounded-lg">
               <div className="flex-1 rounded-md bg-background shadow-sm text-foreground text-xs font-semibold flex items-center justify-center py-1.5 cursor-pointer">All</div>
               <div className="flex-1 rounded-md text-muted-foreground hover:text-foreground text-xs font-medium flex items-center justify-center py-1.5 cursor-pointer transition-colors">Unread</div>
            </div>
            <div className="flex items-center gap-1">
              <button className="p-2 rounded-md hover:bg-muted text-muted-foreground transition-colors"><Search className="h-4 w-4" /></button>
              <button className="p-2 rounded-md hover:bg-muted text-muted-foreground transition-colors"><Filter className="h-4 w-4" /></button>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {threads.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <MessageSquare className="h-8 w-8 mx-auto mb-4 opacity-20" />
              <p className="text-sm font-medium">No conversations yet.</p>
              <p className="text-xs mt-1 opacity-60 leading-relaxed">Messages will appear once automations process incoming DMs.</p>
            </div>
          ) : (
            threads.map((thread: Thread) => (
              <div key={thread.id} className="p-4 border-b border-border hover:bg-muted/50 cursor-pointer transition-colors">
                <div className="flex items-start gap-3">
                  <div className="size-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold truncate text-foreground">Thread: {thread.id.slice(-6)}</h4>
                      <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(thread.lastMessage.createdAt))} ago</span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {thread.lastMessage.direction === 'outbound' ? 'You: ' : ''}{thread.lastMessage.content}
                    </p>
                    <div className="flex items-center gap-1.5 pt-1">
                      <div className="size-2 rounded-full bg-green-500/20 flex items-center justify-center">
                         <div className="size-1 rounded-full bg-green-500"></div>
                      </div>
                      <span className="text-xs font-medium text-muted-foreground">Instagram</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat View */}
      <div className="flex-1 flex flex-col bg-background/50">
        {threads.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-4">
             <div className="size-16 rounded-2xl bg-muted flex items-center justify-center">
                <MessageSquare className="h-8 w-8 text-muted-foreground opacity-50" />
             </div>
             <div>
                <h3 className="text-xl font-bold text-foreground">Your inbox is empty</h3>
                <p className="text-sm text-muted-foreground max-w-sm mt-2 mx-auto leading-relaxed">
                    Once users start messaging your Instagram accounts, their conversations and our AI's replies will appear here.
                </p>
             </div>
          </div>
        ) : (
          <>
            {/* Thread Header */}
            <div className="h-16 border-b border-border px-6 flex items-center justify-between bg-background">
               <div className="flex items-center gap-3">
                  <div className="size-8 rounded-full bg-muted flex items-center justify-center"><User className="h-4 w-4" /></div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground leading-tight">Thread: {threads[0].id.slice(-6)}</h3>
                    <p className="text-xs font-medium text-success">Connected via Instagram</p>
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
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {threads[0].messages.sort((a: MessageWithAccount, b: MessageWithAccount) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()).map((msg: MessageWithAccount) => (
                <div key={msg.id} className={`flex flex-col ${msg.direction === 'outbound' ? 'items-end' : 'items-start'} animate-fade-in`}>
                   <div className="flex items-center gap-2 mb-1.5 px-1">
                      <span className="text-xs font-medium text-muted-foreground">
                        {msg.direction === 'outbound' ? 'Ventry AI' : 'Customer'}
                      </span>
                   </div>
                   <div className={`max-w-md p-4 text-sm leading-relaxed ${
                     msg.direction === 'outbound' 
                      ? 'bg-foreground text-background rounded-2xl rounded-tr-sm' 
                      : 'bg-card border border-border text-foreground rounded-2xl rounded-tl-sm'
                   }`}>
                      {msg.content}
                   </div>
                   <span className="text-[10px] text-muted-foreground mt-1.5 font-medium px-1">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                   </span>
                </div>
              ))}
            </div>

            {/* Typing Bar */}
            <div className="p-4 border-t border-border bg-background">
               <div className="p-3 rounded-lg bg-muted/30 border border-dashed border-border text-center">
                  <p className="text-xs text-muted-foreground font-medium flex items-center justify-center gap-2">
                    <Bot className="h-4 w-4" />
                    This conversation is being handled by the <span className="text-foreground font-semibold">AI Engine</span>
                  </p>
               </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
