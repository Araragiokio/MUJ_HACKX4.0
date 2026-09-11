import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';

import { askFreenanceAI, FinancialState } from '../utils/geminiClient';
import { Modal } from './Modal';
import { Sparkles, Send, Bot, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';
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

const INITIAL_FINANCIAL_STATE: FinancialState = {
  liquidBalance: 48000,
  alreadyAllocated: 0,
  remainingBalance: 48000,
  allocations: [],
};

export const AskFreenanceDrawer: React.FC<AskFreenanceDrawerProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  const [financialState, setFinancialState] = useState<FinancialState>(INITIAL_FINANCIAL_STATE);

  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: `Hello Aarav! I've analyzed your September finances (₹1,20,000 salary, ₹62,500 committed expenses, and ₹48,000 liquid balance). Ask me about affordability, liabilities, or how to accelerate your goals.\n\n*Mode active: Stateful Conversation. Recommendations commit available liquid funds sequentially.*`,
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

  const handleResetState = () => {
    setFinancialState(INITIAL_FINANCIAL_STATE);
    setMessages([
      {
        sender: 'ai',
        text: `Session financial ledger has been reset. Available liquid balance: ${formatINR(INITIAL_FINANCIAL_STATE.liquidBalance)}. Ask me any question!`,
        timestamp: 'Just now',
      },
    ]);
  };

  const getSystemPrompt = (currentState: FinancialState, conversationHistory: Message[]) => {
    const historyText = conversationHistory
      .slice(-6)
      .map((m) => `${m.sender.toUpperCase()}: ${m.text}`)
      .join('\n');

    return `You are Freenance AI, a grounded financial reasoning assistant embedded in a personal finance dashboard.

DESIGN & CONVERSATION MODE:
- Mode: Stateful Sequential Commitments. Money recommended/allocated in previous turns is ALREADY COMMITTED and CANNOT be spent again unless explicitly freed.
- Current Session Financial Ledger State:
  * Total Initial Liquid Balance: ₹${currentState.liquidBalance.toLocaleString('en-IN')}
  * Total Already Allocated/Committed in this session: ₹${currentState.alreadyAllocated.toLocaleString('en-IN')} ${currentState.allocations.length > 0 ? `(${currentState.allocations.map(a => `${a.purpose}: ₹${a.amount}`).join(', ')})` : '(None)'}
  * Strictly Remaining Available Balance: ₹${currentState.remainingBalance.toLocaleString('en-IN')}

User Baseline Data:
- Name: Aarav Mehta
- Monthly Income: ₹1,20,000
- Committed Monthly Expenses: ₹62,500 (rent, 4 EMIs, insurance)
- Discretionary Spending: ₹21,300 this month
- Projected Monthly Savings: ₹36,200/month (30.2% savings rate)
- Financial Health Score: 78/100 (Tier A-)
- Debt-to-Income Ratio: 21.5%
- Liquid Runway: 3.2 months
- Credit Card Debt: HDFC Regalia, ₹42,000 revolving balance @ 38% APR
- Personal Loan Debt: ICICI, ₹1,80,000 @ 13.5% APR
- Bike Loan: 9.2% APR | Education Loan: 8.5% APR
- Emergency Fund Target: ₹2,00,000 target (Saved so far: ₹1,18,000 | Gap remaining: ₹82,000)

RULES & LOGIC REQUIREMENTS:
1. STATE CONSISTENCY & ALLOCATION LEDGER:
   - Check the remaining balance (₹${currentState.remainingBalance.toLocaleString('en-IN')}) BEFORE making any new financial recommendation.
   - Do NOT recommend spending or allocating money already committed in previous turns.
   - If user asks to fund something costing more than ₹${currentState.remainingBalance.toLocaleString('en-IN')}, clearly state how much available liquid cash remains (₹${currentState.remainingBalance.toLocaleString('en-IN')}) and the deficit.

2. MATH VALIDATION:
   - Check your arithmetic step-by-step.
   - NEVER state that an allocation "closes", "clears", or "fully funds" a gap unless Allocation >= Gap.
   - If Allocation < Gap, state explicitly: "this covers ₹X of the ₹Y gap, leaving ₹(Y - X) remaining".

3. CROSS-GOAL PRIORITIZATION:
   - Reason across competing goals (e.g. 38% APR credit card vs emergency fund vs discretionary items like iPhone) together.
   - Always prioritize high-interest debt (HDFC Credit Card 38% APR) first, then high-priority reserve (Emergency Fund), then discretionary purchases.
   - Explicitly state trade-offs instead of using the same rupee twice.

4. TONE & FRAMING:
   - Maintain a helpful, analytical tone.
   - NEVER say meta-comments like "your prompt was brief" or "based on your question". Answer directly.

5. JSON STATE UPDATE (MANDATORY AT VERY END):
   - At the VERY END of your response, output a single JSON block on a new line containing any NEW money recommended in this turn:
   \`\`\`json
   {"newAllocation": <number>, "purpose": "<short purpose label>"}
   \`\`\`
   If no new money was recommended or committed, output:
   \`\`\`json
   {"newAllocation": 0, "purpose": "none"}
   \`\`\`

Recent Chat History:
${historyText}`;
  };

  const handleSend = async (textToSend?: string) => {
    const question = (textToSend || input).trim();
    if (!question) return;

    const userMsg: Message = {
      sender: 'user',
      text: question,
      timestamp: 'Just now',
    };

    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    setInput('');
    setIsTyping(true);

    try {
      const promptContext = getSystemPrompt(financialState, updatedHistory);
      const rawAnswer = await askFreenanceAI(question, promptContext);

      let cleanAnswer = rawAnswer;
      let newAlloc = 0;
      let purpose = 'allocation';

      // Parse JSON payload at the end of response if present
      const jsonMatch = rawAnswer.match(/```json\s*(\{[\s\S]*?\})\s*```/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[1]);
          newAlloc = Number(parsed.newAllocation) || 0;
          purpose = parsed.purpose || 'allocation';
          cleanAnswer = rawAnswer.replace(/```json\s*\{[\s\S]*?\}\s*```/, '').trim();
        } catch {
          // Fallback if parsing fails
        }
      }

      if (newAlloc > 0) {
        setFinancialState((prev) => {
          const actualAlloc = Math.min(newAlloc, prev.remainingBalance);
          const nextAllocated = prev.alreadyAllocated + actualAlloc;
          const nextRemaining = Math.max(0, prev.liquidBalance - nextAllocated);
          return {
            ...prev,
            alreadyAllocated: nextAllocated,
            remainingBalance: nextRemaining,
            allocations: [...prev.allocations, { purpose, amount: actualAlloc }],
          };
        });
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: cleanAnswer,
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
      <div className="flex flex-col h-[540px]">
        {/* State Banner */}
        <div className="bg-slate-900 text-white rounded-xl p-2.5 mb-3 flex items-center justify-between text-xs border border-slate-800 shadow-xs">
          <div className="flex items-center gap-3">
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-semibold block">Liquid Cash</span>
              <span className="font-bold text-teal-400">{formatINR(financialState.liquidBalance)}</span>
            </div>
            <div className="h-6 w-px bg-slate-700" />
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-semibold block">Committed/Allocated</span>
              <span className="font-semibold text-amber-400">{formatINR(financialState.alreadyAllocated)}</span>
            </div>
            <div className="h-6 w-px bg-slate-700" />
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-semibold block">Available Cash</span>
              <span className="font-bold text-emerald-400">{formatINR(financialState.remainingBalance)}</span>
            </div>
          </div>
          <button
            onClick={handleResetState}
            title="Reset Session Allocation Ledger"
            className="flex items-center gap-1 text-[11px] bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded-lg text-slate-300 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3 h-3 text-slate-400" />
            <span>Reset Ledger</span>
          </button>
        </div>

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
              <span>Freenance is calculating allocation math...</span>
            </div>
          )}
        </div>

        {/* Preset Suggested Questions */}
        <div className="py-2 border-t border-slate-100">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5 tracking-wider">
            Quick Inquiries (Stateful Sequential Mode):
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
          <span>Grounded in Aarav's verified bank commitments • Session Ledger Active</span>
        </div>
      </div>
    </Modal>
  );
};

