import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  User,
  Sparkles,
  BookCheck,
  AlertTriangle,
  HelpCircle,
  ShieldAlert,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { assistantApi } from '../services/api';
import { ChatMessage } from '../types';

const SUGGESTED_PROMPTS = [
  'What are the common symptoms of Tomato Early Blight?',
  'What should I check if my crop leaves are turning yellow?',
  'How can I prevent fungal problems during humid cloudy weather?',
  'What are the cultural control practices for Rice Blast?',
  'How do I monitor Fall Armyworm in Maize without excess pesticides?'
];

export const AgricultureAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: `Hello! I am your **KrushiMitra AI Assistant**, developed following Indian Council of Agricultural Research (ICAR) guidelines.

I can assist you with:
- **Identifying Foliar Diseases & Pests** (Early Blight, Rice Blast, Cotton Bollworm, etc.)
- **Nutrient Deficiencies** (distinguishing between Nitrogen and Potassium chlorosis)
- **Cultural & Biological IPM Strategies** (crop spacing, Trichoderma, Neem formulations)
- **Weather-Driven Epidemic Risks** (high humidity and extended leaf wetness)

How can I support your farm or study today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sources: ['ICAR / TNAU Agritech Knowledge Standards'],
      isAiGenerated: false
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Build history payload
      const historyPayload = messages.map((m) => ({
        sender: m.sender,
        text: m.text
      }));

      const response = await assistantApi.chat(query.trim(), historyPayload);

      if (response.data.success && response.data.data) {
        const botMsg: ChatMessage = {
          id: 'bot-' + Date.now(),
          sender: 'bot',
          text: response.data.data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sources: response.data.data.sources,
          isAiGenerated: response.data.data.isAiGenerated
        };
        setMessages((prev) => [...prev, botMsg]);
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: 'err-' + Date.now(),
        sender: 'bot',
        text: 'I encountered an error retrieving agricultural advisory. Please try rephrasing your question or check back shortly.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4 flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-1.5">
              KrushiMitra AI Assistant
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                Groq Llama 3.3
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Verified agricultural query engine grounded in ICAR & extension research.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setMessages([messages[0]]);
          }}
          className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Clear Conversation"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.sender === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs ${
                msg.sender === 'user'
                  ? 'bg-slate-800 text-white dark:bg-slate-700'
                  : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed space-y-2 ${
                msg.sender === 'user'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 shadow-sm'
              }`}
            >
              {/* Message Content formatted with line breaks */}
              <div className="whitespace-pre-line font-medium space-y-2">
                {msg.text}
              </div>

              {/* Verified Sources & Safety Footer */}
              {msg.sources && msg.sources.length > 0 && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-1.5 text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">
                  <BookCheck className="w-3.5 h-3.5" />
                  <span>Grounding: {msg.sources.join(', ')}</span>
                </div>
              )}

              <div
                className={`text-[9px] pt-0.5 ${
                  msg.sender === 'user' ? 'text-emerald-200 text-right' : 'text-slate-400'
                }`}
              >
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
              <Bot className="w-4 h-4 animate-bounce" />
            </div>
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Analyzing query against agricultural standards...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Question Chips */}
      <div className="space-y-1.5 pt-1">
        <span className="text-[10px] uppercase font-bold text-slate-400">
          Suggested Inquiries:
        </span>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {SUGGESTED_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(prompt)}
              className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-300 whitespace-nowrap transition-colors border border-slate-200/60 dark:border-slate-700"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form Bar */}
      <div className="p-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-2">
        <textarea
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything regarding crop diseases, pest thresholds, or agronomic advisory..."
          className="flex-1 px-3 py-2 text-xs bg-transparent text-slate-900 dark:text-white resize-none focus:outline-none placeholder:text-slate-400"
        />

        <button
          type="button"
          onClick={() => handleSend()}
          disabled={!input.trim() || loading}
          className={`p-2.5 rounded-xl font-bold transition-all ${
            input.trim() && !loading
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
          }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      {/* Disclaimer */}
      <p className="text-[10px] text-center text-slate-400">
        AI responses cite peer-reviewed agricultural manuals. Specific pesticide dosages must follow CIBRC regulations.
      </p>
    </div>
  );
};
