import React, { useState } from 'react';
import { X, Sparkles, Send, Bot, User, Loader2, Lightbulb, ShieldAlert, ShoppingBag } from 'lucide-react';
import { askAIBargainAssistant } from '../services/api';
import { Product } from '../types';

interface AIBargainAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
}

interface Message {
  sender: 'user' | 'assistant';
  text: string;
}

export const AIBargainAssistantModal: React.FC<AIBargainAssistantModalProps> = ({
  isOpen,
  onClose,
  products
}) => {
  if (!isOpen) return null;

  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'assistant',
      text: `Hello! I am your PricePulse AI Deal Assistant. I analyze real market price trends, historical lows, and fake MSRP discounts across online retailers. Ask me anything about your ${products.length} tracked products or shopping timing!`
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const sampleQuestions = [
    'Which item in my list has the biggest real price drop?',
    'Should I buy the Sony Headphones now or wait?',
    'How do I spot inflated MSRP fake discounts?',
    'Find items priced below historical average'
  ];

  const handleSend = async (questionText?: string) => {
    const q = questionText || inputMessage;
    if (!q.trim() || isLoading) return;

    const userMsg: Message = { sender: 'user', text: q };
    setMessages((prev) => [...prev, userMsg]);
    if (!questionText) setInputMessage('');
    setIsLoading(true);

    try {
      const answer = await askAIBargainAssistant(q, products);
      setMessages((prev) => [...prev, { sender: 'assistant', text: answer }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: 'assistant', text: 'Sorry, I ran into an error getting deal insights. Please try again.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl text-slate-100 flex flex-col h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-white">AI Bargain & Deal Assistant</h3>
              <p className="text-xs text-slate-400">Powered by Gemini 3.6 Flash & Google Search Grounding</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${
                msg.sender === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                  msg.sender === 'user'
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-indigo-600 text-white'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[80%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                  msg.sender === 'user'
                    ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-100 rounded-tr-none'
                    : 'bg-slate-800/80 border border-slate-700/80 text-slate-200 rounded-tl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/80 text-xs text-indigo-300 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing price history & live market deals...
              </div>
            </div>
          )}
        </div>

        {/* Preset Questions */}
        <div className="px-6 py-2 bg-slate-950/40 border-t border-slate-800/80">
          <span className="text-[11px] text-slate-500 font-medium block mb-1.5 flex items-center gap-1">
            <Lightbulb className="w-3 h-3 text-amber-400" />
            Suggested Questions:
          </span>
          <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto scrollbar-none">
            {sampleQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSend(q)}
                disabled={isLoading}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 transition-colors border border-slate-700/60 truncate max-w-xs"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-slate-900 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about price drops, fake discounts, or timing..."
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-indigo-500 placeholder:text-slate-500"
            />
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs sm:text-sm rounded-xl transition-all disabled:opacity-50 flex items-center gap-1.5 shrink-0"
            >
              <Send className="w-4 h-4" />
              Send
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
