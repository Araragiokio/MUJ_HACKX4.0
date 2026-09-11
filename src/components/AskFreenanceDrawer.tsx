import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';

import { askFreenanceAI } from '../utils/geminiClient';
import { Modal } from './Modal';
import { Sparkles, Send, Bot, User, ArrowRight, ShieldCheck } from 'lucide-react';
import { UserProfile } from '../types';
import { formatINR } from '../utils/formatters';

interface AskFreenanceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
}

interface Message {
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

export const AskFreenanceDrawer: React.FC<AskFreenanceDrawerProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: `Hello Aarav! I've analyzed your September finances (₹1,20,000 salary, ₹62,500 committed expenses, and ₹48,000 liquid balance). Ask me about affordability, liabilities, or how to accelerate your goals.`,
      timestamp: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const presetQuestions = [
    'Can I afford an iPhone 16 Pro (₹1,34,000) right now?',
    'Why is my food spending flagged this month?',
    'Should I pay HDFC Credit Card or Personal Loan first?',
    'How can I reach my ₹2,00,000 Emergency Fund faster?',
  ];

  const financialContext = `You are Freenance AI, a grounded financial reasoning assistant embedded in a personal finance dashboard.
Answer using ONLY this user's real financial data below — do not invent numbers that aren't given or implied here.

User profile:
- Name: Aarav Mehta
- Monthly Income: ₹1,20,000
- Committed Expenses: ₹62,500 (rent, 4 EMIs, insurance)
- Discretionary Spending: ₹21,300 this month
- Projected Savings: ₹36,200/month (30.2% savings rate)
- Liquid Balance: ₹48,000
- Financial Health Score: 78/100 (Tier A-)
- Debt-to-Income Ratio: 21.5%
- Liquid Runway: 3.2 months
- Credit Card: HDFC Regalia, ₹42,000 revolving balance @ ~38% APR
- Personal Loan: ICICI, ₹1,80,000 @ 13.5%
- Bike Loan: 9.2% APR
- Education Loan: 8.5% APR
- Emergency Fund Goal: ₹2,00,000 target, ₹1,18,000 saved so far

Keep answers concise, specific, and actionable — like a financial analyst, not a generic chatbot.

Formatting rules:
- Keep responses short: 2-4 sentences, or a short list — never one dense paragraph.
- Lead with the key ₹ amount or % when relevant.
- If giving multiple points or steps, start a NEW LINE for each one — never put two "• " points in the same line. Each bullet must be on its own separate line.
- Do not use asterisks (*), double asterisks (**), hash symbols (#), or underscores (_).
- End with a short, direct next-step suggestion or question when relevant.`;

  const handleSend = async (textToSend?: string) => {
    const question = (textToSend || input).trim();
    if (!question) return;

    const userMsg: Message = {
      sender: 'user',
      text: question,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const answer = await askFreenanceAI(question, financialContext);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: answer,
          timestamp: 'Just now',
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: "Sorry, I couldn't reach the AI service just now. Please check your API key and try again.",
          timestamp: 'Just now',
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Ask Freenance AI"
      subtitle="Grounded financial reasoning engine for Aarav's finances"
      maxWidth="max-w-2xl"
    >
      <div className="flex flex-col h-[520px]">
        {/* Messages area */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 pb-3">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-xl bg-teal-700 text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${msg.sender === 'user'
                  ? 'bg-slate-950 text-white rounded-tr-xs shadow-xs whitespace-pre-line'
                  : 'bg-slate-50 border border-slate-200/80 text-slate-800 rounded-tl-xs font-normal'
                  }`}
              >
                {msg.sender === 'ai' ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkBreaks]}
                    components={{
                      p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                      ul: ({ children }) => <ul className="space-y-1 pl-1 list-none">{children}</ul>,
                      li: ({ children }) => <li className="flex gap-1.5"><span className="text-teal-600 shrink-0">•</span><span>{children}</span></li>,
                      strong: ({ children }) => <span className="font-semibold text-slate-900">{children}</span>,
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                ) : (
                  msg.text
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 font-bold text-xs">
                  AM
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 items-center text-xs text-slate-400 italic">
              <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              </div>
              <span>Freenance is reasoning through your ledger...</span>
            </div>
          )}
        </div>

        {/* Preset Suggested Questions */}
        <div className="py-2.5 border-t border-slate-100">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5 tracking-wider">
            Quick Inquiries:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {presetQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-700 transition-colors text-left flex items-center gap-1 cursor-pointer"
              >
                <span>{q}</span>
                <ArrowRight className="w-2.5 h-2.5 text-slate-400 shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Input bar */}
        <div className="pt-2 flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask anything about your cash flow, EMIs, or savings..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim()}
            className="p-2.5 rounded-xl bg-teal-700 text-white hover:bg-teal-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-2xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        <div className="text-[10px] text-slate-400 pt-2 text-center flex items-center justify-center gap-1">
          <ShieldCheck className="w-3 h-3 text-teal-600" />
          <span>Grounded in Aarav's verified bank commitments • Deterministic Demo Model</span>
        </div>
      </div>
    </Modal>
  );
};
