"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import Link from "next/link";
import {
  generateDevelopmentPromptAction,
  getConversationAction,
  getQuickPromptsAction,
  sendDiscussionMessageAction,
} from "@/actions/discussionActions";

type Message = {
  id: string;
  role: "USER" | "ASSISTANT" | "SYSTEM";
  kind: "NORMAL" | "QUESTION" | "SUGGESTION" | "PROMPT";
  content: string;
};

type Conversation = {
  id: string;
  messages: Message[];
};

export function DiscussionPanel({ ideaId }: { ideaId: string }) {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [quickPrompts, setQuickPrompts] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [prompt, setPrompt] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;
    Promise.all([getConversationAction(ideaId), getQuickPromptsAction()])
      .then(([conv, prompts]) => {
        if (!mounted) return;
        setConversation(conv as Conversation);
        setQuickPrompts(prompts);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "加载研讨失败"));
    return () => {
      mounted = false;
    };
  }, [ideaId]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [conversation?.messages.length]);

  const messages = useMemo(() => conversation?.messages ?? [], [conversation]);

  function send(content: string) {
    if (!content.trim() || isPending) return;
    setError("");
    setInput("");
    startTransition(async () => {
      try {
        const updated = await sendDiscussionMessageAction(ideaId, content.trim());
        setConversation(updated as Conversation);
      } catch (e) {
        setError(e instanceof Error ? e.message : "发送失败");
      }
    });
  }

  function generatePrompt() {
    setError("");
    setCopied(false);
    startTransition(async () => {
      try {
        const result = await generateDevelopmentPromptAction(ideaId);
        setPrompt(result.content);
      } catch (e) {
        setError(e instanceof Error ? e.message : "生成失败");
      }
    });
  }

  async function copyPrompt() {
    if (!prompt) return;
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
  }

  return (
    <aside className="glass rounded-2xl p-5 h-fit">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="font-bold text-lg">AI 产品教练</h2>
          <p className="text-xs opacity-55 mt-1">多轮研讨，把方案打磨成可交给 TRAE 开发的提示词。</p>
        </div>
        <span className="text-[10px] px-2 py-1 rounded-full border border-cyan-400/30 text-cyan-200 bg-cyan-400/10">
          Coach
        </span>
      </div>

      {error && <div className="mb-3 text-sm text-red-300 bg-red-500/10 border border-red-400/20 rounded-lg px-3 py-2">{error}</div>}

      <div ref={listRef} className="space-y-3 max-h-[420px] overflow-y-auto pr-1 mb-4">
        {messages.length === 0 && <p className="text-sm opacity-50">教练正在准备问题…</p>}
        {messages.map((m) => (
          <div key={m.id} className={m.role === "USER" ? "text-right" : "text-left"}>
            <div
              className={
                m.role === "USER"
                  ? "inline-block max-w-[92%] rounded-2xl rounded-tr-sm bg-cyan-400/20 border border-cyan-300/20 px-4 py-3 text-sm text-left"
                  : "inline-block max-w-[92%] rounded-2xl rounded-tl-sm bg-white/8 border border-white/10 px-4 py-3 text-sm whitespace-pre-wrap"
              }
            >
              {m.content}
            </div>
          </div>
        ))}
        {isPending && <p className="text-xs opacity-45">AI 教练正在思考…</p>}
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {quickPrompts.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => send(q)}
            disabled={isPending}
            className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-cyan-300/40 hover:bg-cyan-300/10 transition disabled:opacity-50"
          >
            {q.split("：")[0]}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="space-y-3"
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="继续问：这个项目如何更有比赛亮点？"
          className="w-full h-24 px-3 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 focus:outline-none text-sm resize-none"
          disabled={isPending}
        />
        <div className="grid grid-cols-2 gap-2">
          <button type="submit" disabled={isPending || !input.trim()} className="py-2 rounded-xl gradient-btn text-sm disabled:opacity-50">
            发送研讨
          </button>
          <button type="button" onClick={generatePrompt} disabled={isPending} className="py-2 rounded-xl bg-emerald-400/20 border border-emerald-300/30 text-emerald-100 text-sm disabled:opacity-50">
            生成 TRAE 提示词
          </button>
        </div>
      </form>

      {prompt && (
        <div className="mt-4 rounded-xl border border-emerald-300/20 bg-emerald-300/8 p-3">
          <div className="flex items-center justify-between mb-2">
            <strong className="text-sm text-emerald-100">TRAE 开发提示词已生成</strong>
            <div className="flex gap-2">
              <Link href={`/ideas/${ideaId}/prompt`} className="text-xs px-2 py-1 rounded bg-white/10 hover:bg-white/15">
                详情页
              </Link>
              <button onClick={copyPrompt} className="text-xs px-2 py-1 rounded bg-white/10 hover:bg-white/15">
                {copied ? "已复制" : "复制"}
              </button>
            </div>
          </div>
          <pre className="max-h-52 overflow-auto text-xs whitespace-pre-wrap opacity-80">{prompt}</pre>
        </div>
      )}
    </aside>
  );
}
