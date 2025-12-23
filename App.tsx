
import React, { useState, useRef, useEffect } from 'react';
import { GeminiService } from './services/geminiService';
import { Message, ChatState } from './types';
import { Send, User, Bot, Globe, Phone, Mail, ChevronRight, X, Sparkles, ExternalLink, Headphones } from 'lucide-react';

const App: React.FC = () => {
  const [input, setInput] = useState('');
  const [chatState, setChatState] = useState<ChatState>({
    messages: [
      {
        id: '1',
        role: 'assistant',
        content: "Hello! I am the Kenmark ITan Solutions virtual assistant. How can I help you today with our services or training programs?",
        timestamp: new Date()
      }
    ],
    isLoading: false,
    error: null
  });

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const geminiServiceRef = useRef<GeminiService | null>(null);

  useEffect(() => {
    if (!process.env.API_KEY) {
      setChatState(prev => ({ ...prev, error: "API Key missing. Please ensure your environment is configured." }));
      return;
    }
    geminiServiceRef.current = new GeminiService(process.env.API_KEY);
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatState.messages]);

  const handleSend = async (e?: React.FormEvent, presetMessage?: string) => {
    if (e) e.preventDefault();
    const messageText = presetMessage || input.trim();
    if (!messageText || chatState.isLoading || !geminiServiceRef.current) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      error: null
    }));
    setInput('');

    try {
      let assistantResponseText = "";
      const assistantMessageId = (Date.now() + 1).toString();
      
      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, {
          id: assistantMessageId,
          role: 'assistant',
          content: "",
          timestamp: new Date()
        }]
      }));

      const stream = geminiServiceRef.current.sendMessageStream(messageText);
      
      for await (const chunk of stream) {
        assistantResponseText += chunk;
        setChatState(prev => ({
          ...prev,
          messages: prev.messages.map(m => 
            m.id === assistantMessageId ? { ...m, content: assistantResponseText } : m
          )
        }));
      }
    } catch (error: any) {
      setChatState(prev => ({
        ...prev,
        error: error.message || "An unexpected error occurred."
      }));
    } finally {
      setChatState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleServicesClick = () => {
    handleSend(undefined, "What services does Kenmark ITan Solutions offer?");
  };

  const handleSupportClick = () => {
    handleSend(undefined, "How can I contact support and what information do you have on support?");
  };

  const QuickQuestion: React.FC<{ text: string }> = ({ text }) => (
    <button
      onClick={() => handleSend(undefined, text)}
      className="px-4 py-2 text-sm bg-indigo-900/40 text-indigo-200 rounded-full border border-indigo-700/50 hover:bg-indigo-800/60 transition-all whitespace-nowrap backdrop-blur-sm"
    >
      {text}
    </button>
  );

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="bg-indigo-950 border-b border-indigo-900/50 px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-2xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Sparkles className="text-indigo-950 w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">Kenmark ITan</h1>
            <p className="text-[10px] text-amber-400 font-bold uppercase tracking-widest">AI Concierge</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 md:space-x-4">
          <a 
            href="https://kenmarkitan.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-indigo-200 hover:bg-indigo-900/60 hover:text-white transition-all text-sm font-medium"
          >
            <Globe className="w-4 h-4" />
            <span className="hidden sm:inline">Website</span>
            <ExternalLink className="w-3 h-3 opacity-50" />
          </a>
          <button 
            onClick={handleServicesClick}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-indigo-200 hover:bg-indigo-900/60 hover:text-white transition-all text-sm font-medium"
          >
            <Bot className="w-4 h-4" />
            <span className="hidden sm:inline">Services</span>
          </button>
          <button 
            onClick={handleSupportClick}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-indigo-200 hover:bg-indigo-900/60 hover:text-white transition-all text-sm font-medium"
          >
            <Headphones className="w-4 h-4" />
            <span className="hidden sm:inline">Support</span>
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Sidebar - Desktop only */}
        <aside className="hidden lg:flex w-80 flex-col border-r border-indigo-900/30 bg-indigo-950/50 p-6 overflow-y-auto">
          <section className="mb-8">
            <h3 className="text-[10px] font-bold text-amber-500/80 uppercase tracking-widest mb-4">About the Company</h3>
            <p className="text-sm text-indigo-100/70 leading-relaxed font-medium">
              Kenmark ITan Solutions bridges business needs with technological excellence through innovative IT services and global certification training.
            </p>
          </section>

          <section className="mb-8">
            <h3 className="text-[10px] font-bold text-amber-500/80 uppercase tracking-widest mb-4">Global Reach</h3>
            <div className="space-y-4">
              <div className="group flex items-start space-x-3 text-indigo-200/70 hover:text-white transition-colors text-sm">
                <Mail className="w-4 h-4 mt-1 text-amber-500/60 group-hover:text-amber-400" />
                <span className="font-medium">info@kenmarkitan.com</span>
              </div>
              <div className="group flex items-start space-x-3 text-indigo-200/70 hover:text-white transition-colors text-sm">
                <Phone className="w-4 h-4 mt-1 text-amber-500/60 group-hover:text-amber-400" />
                <span className="font-medium">+91 80 1234 5678<br/>+1 (555) 987-6543</span>
              </div>
            </div>
          </section>

          <section className="mt-auto pt-6 border-t border-indigo-900/30">
            <h3 className="text-[10px] font-bold text-amber-500/80 uppercase tracking-widest mb-4">Key Verticals</h3>
            <div className="grid grid-cols-1 gap-2">
              {["PMP Certification", "Cloud Computing", "AI Solutions", "Cybersecurity"].map(s => (
                <div key={s} className="flex items-center text-xs font-semibold text-indigo-200/60 bg-indigo-900/30 px-3 py-2 rounded-lg border border-indigo-800/20">
                  <ChevronRight className="w-3 h-3 text-amber-500 mr-2" />
                  {s}
                </div>
              ))}
            </div>
          </section>
        </aside>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col relative bg-slate-950">
          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar space-y-6"
          >
            {chatState.messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex w-full ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-[90%] md:max-w-[75%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center shadow-lg ${
                    message.role === 'user' ? 'ml-3 bg-amber-500' : 'mr-3 bg-indigo-800 border border-indigo-700'
                  }`}>
                    {message.role === 'user' ? (
                      <User className="w-5 h-5 text-indigo-950" />
                    ) : (
                      <Bot className="w-5 h-5 text-indigo-100" />
                    )}
                  </div>
                  <div className={`p-4 rounded-2xl shadow-xl border ${
                    message.role === 'user' 
                      ? 'bg-amber-600 text-white border-amber-500 rounded-tr-none' 
                      : 'bg-indigo-900/40 text-indigo-50 border-indigo-800/50 rounded-tl-none backdrop-blur-md'
                  }`}>
                    <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap font-medium">
                      {message.content || (chatState.isLoading && "Processing request...")}
                    </p>
                    <span className={`text-[10px] mt-2 block font-bold opacity-50 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {chatState.error && (
              <div className="flex justify-center">
                <div className="bg-red-900/20 text-red-400 px-4 py-3 rounded-xl text-sm border border-red-900/50 flex items-center space-x-2 animate-pulse">
                  <X className="w-4 h-4" />
                  <span className="font-semibold">{chatState.error}</span>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-indigo-950/40 border-t border-indigo-900/30 backdrop-blur-xl">
            <div className="max-w-4xl mx-auto">
              <div className="mb-4 flex space-x-2 overflow-x-auto pb-2 no-scrollbar">
                <QuickQuestion text="What training programs do you have?" />
                <QuickQuestion text="Do you provide AI consulting?" />
                <QuickQuestion text="Where is your HQ located?" />
                <QuickQuestion text="How to enroll for PMP?" />
              </div>
              
              <form onSubmit={handleSend} className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your query here..."
                  disabled={chatState.isLoading}
                  className="w-full bg-indigo-900/20 border border-indigo-700/50 text-white rounded-2xl py-4 pl-6 pr-14 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/50 transition-all disabled:opacity-50 placeholder-indigo-400/50 font-medium"
                />
                <button
                  type="submit"
                  disabled={chatState.isLoading || !input.trim()}
                  className="absolute right-2 top-2 bottom-2 w-10 h-10 bg-amber-500 text-indigo-950 rounded-xl flex items-center justify-center hover:bg-amber-400 transition-all disabled:bg-indigo-900/50 disabled:text-indigo-700 disabled:cursor-not-allowed shadow-lg shadow-amber-500/20 active:scale-95"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
              <p className="text-center text-[10px] text-indigo-400/60 mt-4 font-bold uppercase tracking-widest">
                Official Assistant &bull; Kenmark ITan Solutions &bull; Secure AI
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
