import { useState, useRef, useEffect, useCallback } from 'react';
import { Bot, X, Send, Sparkles } from 'lucide-react';
import { suggestedPrompts, chatResponses, defaultResponse } from '../../data/chatResponses';

export default function ChatPanel() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  const sendMessage = useCallback((text) => {
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setInput('');
    setTyping(true);

    const response = chatResponses[text] || defaultResponse;

    timerRef.current = setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    }, 1200);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input.trim());
  };

  return (
    <>
      {/* Floating trigger button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-gradient-to-br from-sky-500 to-blue-500 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center"
          title="Open AltoACE AI Assistant"
        >
          <Sparkles size={20} />
        </button>
      )}

      {/* Slide-out panel */}
      {open && (
        <div className="fixed inset-y-0 right-0 z-50 w-96 bg-white border-l border-gray-200 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-blue-500 flex items-center justify-center">
                <Sparkles size={16} className="text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">AltoACE</div>
                <div className="text-[10px] text-gray-500">Powered by Claude Sonnet 4.6</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
            {messages.length === 0 && !typing && (
              <div className="text-center pt-8">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center mx-auto mb-3">
                  <Bot size={24} className="text-sky-600" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">AltoACE AI Assistant</h3>
                <p className="text-xs text-gray-500 mb-6">Ask me about faults, equipment health, energy savings, or HVAC diagnostics.</p>
                <div className="space-y-2">
                  {suggestedPrompts.map(prompt => (
                    <button
                      key={prompt}
                      onClick={() => sendMessage(prompt)}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 bg-gray-50 hover:bg-sky-50 hover:text-sky-700 rounded-lg border border-gray-200 hover:border-sky-200 transition-colors"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-xl px-3.5 py-2.5 ${
                  msg.role === 'user'
                    ? 'bg-sky-500 text-white text-sm'
                    : 'bg-gray-50 border border-gray-200 text-sm text-gray-700'
                }`}>
                  {msg.role === 'assistant' ? (
                    <div className="prose-sm leading-relaxed">
                      {msg.content.split('\n').map((line, j) => {
                        if (line.startsWith('**') && line.endsWith('**')) {
                          return <div key={j} className="font-semibold text-gray-900 mt-2 first:mt-0">{line.replace(/\*\*/g, '')}</div>;
                        }
                        if (line.startsWith('- ') || line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ') || line.startsWith('4. ')) {
                          return <div key={j} className="ml-2 text-xs text-gray-600 mt-0.5">{line}</div>;
                        }
                        if (line.startsWith('|')) return null;
                        if (line.trim() === '') return <div key={j} className="h-1.5" />;
                        return <div key={j} className="text-xs text-gray-700">{line.replace(/\*\*/g, '').replace(/\*/g, '')}</div>;
                      })}
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex justify-start">
                <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="px-4 py-3 border-t border-gray-200 shrink-0">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask AltoACE..."
                disabled={typing}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || typing}
                className="p-2 rounded-lg bg-gradient-to-r from-sky-500 to-blue-500 text-white hover:from-sky-600 hover:to-blue-600 disabled:opacity-40 transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
