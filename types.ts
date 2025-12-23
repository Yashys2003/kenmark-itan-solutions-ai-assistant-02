
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

export interface KnowledgeBase {
  companyName: string;
  website: string;
  about: string;
  services: string[];
  trainingPrograms: string[];
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  faqs: Array<{ question: string; answer: string }>;
}
