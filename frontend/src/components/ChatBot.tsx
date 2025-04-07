import 'regenerator-runtime/runtime'; 
import React, { useState, useRef, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Send, Mic, Home, MessageSquare, Dog, Cat, Bird, Fish, Rabbit, Upload } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  error?: boolean;
  imageUrl?: string;
}

const PET_ANIMATIONS = [
  { Icon: Dog, color: '#4A90E2', size: 12 },
  { Icon: Cat, color: '#FF6F61', size: 10 },
  { Icon: Bird, color: '#A8E6CF', size: 8 },
  { Icon: Fish, color: '#4A90E2', size: 10 },
  { Icon: Rabbit, color: '#FF6F61', size: 12 },
];

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hi there! How can I help you and your pet today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const { transcript, listening } = useSpeechRecognition();

  // Update the message list with the user's speech input
  const handleSpeechRecognition = () => {
    if (listening) {
      setInputText(transcript);
    }
  };

  useEffect(() => {
    handleSpeechRecognition();
  }, [listening, transcript]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim() && !uploadedImage) return;

    // If an image is uploaded, add it to messages
    if (uploadedImage) {
      const imageMessage: Message = {
        id: Date.now().toString(),
        text: '',
        sender: 'user',
        timestamp: new Date(),
        imageUrl: uploadedImage,
      };
      setMessages(prev => [...prev, imageMessage]);
    }

    // If text is entered, add it to messages
    if (inputText.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputText,
        sender: 'user',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, newMessage]);
    }

    setInputText('');
    setUploadedImage(null); // Clear uploaded image after sending
    setIsTyping(true);

    try {
      // For image messages, send to disease API
      if (uploadedImage) {
        const formData = new FormData();
        const file = await fetch(uploadedImage).then(res => res.blob());
        formData.append('file', file);

        const response = await fetch('http://localhost:8000/diseaseapi/analyze-image', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to analyze image');
        }

        const data = await response.json();
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: `I've analyzed your pet's image. ${data.analysis}`,
          sender: 'bot',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, botResponse]);
      }

      // For text messages, send to chat API with selected language
      if (inputText.trim()) {
        const response = await fetch('http://localhost:8000/chatapi/generate_answer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: inputText, language: selectedLanguage }),
        });

        if (!response.ok) {
          throw new Error('Failed to get response from server');
        }

        const data = await response.json();
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: data.response,
          sender: 'bot',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, botResponse]);
      }
    } catch (err) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
        timestamp: new Date(),
        error: true,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleVoiceRecording = () => {
    if (isRecording) {
      SpeechRecognition.stopListening();
    } else {
      SpeechRecognition.startListening({ continuous: true });
    }
    setIsRecording(!isRecording);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please upload only image files');
        return;
      }
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);
    }
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Define language options (15 languages)
  const languageOptions = [
    "English", "Kannada", "Hindi", "Telugu", "Tamil",
    "Marathi", "Gujarati", "Bengali", "Punjabi", "Malayalam",
    "Odia", "Assamese", "Urdu", "Bhojpuri", "Nepali"
  ];

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Floating Pet Animations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {PET_ANIMATIONS.map(({ Icon, color, size }, index) => (
          <div
            key={index}
            className="absolute animate-float-slow"
            style={{
              top: `${Math.random() * 80 + 10}%`,
              left: `${Math.random() * 80 + 10}%`,
              animationDelay: `${index * 0.5}s`
            }}
          >
            <Icon className={`w-${size} h-${size} opacity-20`} style={{ color }} />
          </div>
        ))}
      </div>

      {/* Navigation Box (Fixed) */}
      <div className="fixed top-0 left-0 w-full bg-white shadow-md z-10 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold">PetCare</h1>
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full bg-[#F5F5F5] hover:bg-[#E5E5E5]">
              <Home className="w-6 h-6" />
            </button>
            <button className="p-2 rounded-full bg-[#F5F5F5] hover:bg-[#E5E5E5]">
              <MessageSquare className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="max-w-4xl mx-auto p-6 pt-24">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden relative">
          {/* Chat Messages (Scrollable) */}
          <div ref={chatContainerRef} className="h-[calc(100vh-220px)] overflow-y-auto p-6 space-y-4 scrollbar-hide">
            {messages.map(message => (
              <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] rounded-lg p-4 ${message.sender === 'user' ? 'bg-[#4A90E2] text-white' : 'bg-[#F5F5F5] text-[#333333]'}`}>
                  {message.imageUrl && (
                    <img src={message.imageUrl} alt="Uploaded" className="w-32 h-32 object-cover rounded-md mb-2" />
                  )}
                  {message.sender === 'bot' ? (
                    <ReactMarkdown>{message.text}</ReactMarkdown>
                  ) : (
                    <p className="mb-1">{message.text}</p>
                  )}
                  <div className={`text-xs ${message.sender === 'user' ? 'text-white/70' : 'text-[#333333]/70'}`}>
                    {formatTimestamp(message.timestamp)}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-[#F5F5F5] rounded-lg p-4 flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[#4A90E2] rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-[#4A90E2] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 bg-[#4A90E2] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            )}
          </div>

          {/* Input Area (Fixed at Bottom) */}
          <div className="border-t border-gray-200 p-4 bg-white">
            <div className="flex items-center space-x-4 mb-2">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
              >
                {languageOptions.map((lang, index) => (
                  <option key={index} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleVoiceRecording}
                className={`p-2 rounded-full transition-colors ${isRecording ? 'bg-[#FF6F61] text-white' : 'bg-[#F5F5F5] text-[#333333] hover:bg-[#E5E5E5]'}`}
              >
                <Mic className="w-6 h-6" />
              </button>
              <label className="p-2 rounded-full cursor-pointer bg-[#F5F5F5] text-[#333333] hover:bg-[#E5E5E5] transition-colors">
                <Upload className="w-6 h-6" />
                <input type="file" onChange={handleFileUpload} accept="image/*" className="hidden" />
              </label>
              <div className="flex-1">
                <textarea
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message here..."
                  className="w-full px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:border-[#4A90E2] resize-none"
                  rows={1}
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim() && !uploadedImage}
                className={`p-2 rounded-full transition-colors ${inputText.trim() || uploadedImage ? 'bg-[#FF6F61] text-white hover:bg-[#ff8a7f]' : 'bg-[#F5F5F5] text-[#333333]'}`}
              >
                <Send className="w-6 h-6" />
              </button>
            </div>
            {uploadedImage && (
              <div className="mt-4">
                <img src={uploadedImage} alt="Uploaded" className="w-32 h-32 object-cover rounded-md" />
              </div>
            )}
            {error && (
              <div className="mt-4 text-red-500 text-sm">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
