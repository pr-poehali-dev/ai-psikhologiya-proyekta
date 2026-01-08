import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

type Message = {
  role: 'user' | 'assistant';
  content: string;
  emotion?: 'positive' | 'neutral' | 'negative';
};

type Session = {
  id: number;
  date: string;
  duration: number;
  emotion: number;
  topics: string[];
};

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const emotionData = [
    { date: '1 нед', score: 45 },
    { date: '2 нед', score: 52 },
    { date: '3 нед', score: 58 },
    { date: '4 нед', score: 65 },
    { date: '5 нед', score: 71 },
    { date: '6 нед', score: 78 },
  ];

  const sessionsData: Session[] = [
    { id: 1, date: '15 янв', duration: 45, emotion: 78, topics: ['Стресс', 'Работа'] },
    { id: 2, date: '12 янв', duration: 50, emotion: 71, topics: ['Отношения'] },
    { id: 3, date: '8 янв', duration: 40, emotion: 65, topics: ['Тревога', 'Сон'] },
    { id: 4, date: '5 янв', duration: 38, emotion: 58, topics: ['Самооценка'] },
  ];

  const emotionDistribution = [
    { name: 'Позитивные', value: 45, color: '#10b981' },
    { name: 'Нейтральные', value: 35, color: '#8E9196' },
    { name: 'Тревожные', value: 20, color: '#0EA5E9' },
  ];

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: inputMessage,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const chatHistory = [...messages, userMessage].map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await fetch('https://functions.poehali.dev/7ee1612c-e3d1-4ff5-841b-ce1e4253e934', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: chatHistory
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка при получении ответа');
      }

      const aiMessage: Message = {
        role: 'assistant',
        content: data.message,
        emotion: data.emotion,
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Извините, произошла ошибка. Пожалуйста, проверьте подключение к интернету или попробуйте позже.',
        emotion: 'neutral',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <Icon name="Brain" size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">AI Психолог</h1>
                <p className="text-xs text-gray-500">Профессиональная поддержка 24/7</p>
              </div>
            </div>
            <Button onClick={() => setActiveTab('consultation')} className="bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600">
              <Icon name="MessageCircle" size={18} className="mr-2" />
              Начать консультацию
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="home" className="gap-2">
              <Icon name="Home" size={16} />
              Главная
            </TabsTrigger>
            <TabsTrigger value="consultation" className="gap-2">
              <Icon name="MessageCircle" size={16} />
              Консультация
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="space-y-8 animate-fade-in">
            <section className="text-center max-w-3xl mx-auto mb-12">
              <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">
                <Icon name="Shield" size={14} className="mr-1" />
                Конфиденциально и безопасно
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                Ваш личный психолог всегда рядом
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Профессиональная психологическая поддержка на основе искусственного интеллекта. 
                Получите помощь в любое время, анонимно и безопасно.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button size="lg" onClick={() => setActiveTab('consultation')} className="bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600">
                  <Icon name="MessageCircle" size={20} className="mr-2" />
                  Начать сессию
                </Button>
              </div>
            </section>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card className="border-2 hover:border-blue-200 transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                    <Icon name="Heart" size={24} className="text-blue-600" />
                  </div>
                  <CardTitle>Эмпатия</CardTitle>
                  <CardDescription>Искренняя поддержка и понимание ваших переживаний</CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 hover:border-emerald-200 transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-3">
                    <Icon name="TrendingUp" size={24} className="text-emerald-600" />
                  </div>
                  <CardTitle>Прогресс</CardTitle>
                  <CardDescription>Отслеживайте улучшение вашего эмоционального состояния</CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 hover:border-blue-200 transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                    <Icon name="Lock" size={24} className="text-blue-600" />
                  </div>
                  <CardTitle>Конфиденциальность</CardTitle>
                  <CardDescription>Ваши данные защищены и никогда не передаются третьим лицам</CardDescription>
                </CardHeader>
              </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="TrendingUp" size={20} className="text-emerald-600" />
                    Динамика эмоционального состояния
                  </CardTitle>
                  <CardDescription>Ваш прогресс за последние 6 недель</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={emotionData}>
                      <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="date" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip />
                      <Area type="monotone" dataKey="score" stroke="#0EA5E9" fillOpacity={1} fill="url(#colorScore)" />
                    </AreaChart>
                  </ResponsiveContainer>
                  <div className="mt-4 p-4 bg-emerald-50 rounded-lg">
                    <p className="text-sm text-emerald-800 flex items-center gap-2">
                      <Icon name="TrendingUp" size={16} />
                      <span className="font-semibold">+73% улучшение</span> за последний месяц
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="PieChart" size={20} className="text-blue-600" />
                    Распределение эмоций
                  </CardTitle>
                  <CardDescription>Анализ ваших последних сессий</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={emotionDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {emotionDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {emotionDistribution.map((item) => (
                      <div key={item.name} className="text-center p-2 rounded-lg border">
                        <div className="w-3 h-3 rounded-full mx-auto mb-1" style={{ backgroundColor: item.color }} />
                        <p className="text-xs text-gray-600">{item.name}</p>
                        <p className="text-sm font-semibold">{item.value}%</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="History" size={20} className="text-blue-600" />
                  История сессий
                </CardTitle>
                <CardDescription>Последние консультации и ключевые темы</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sessionsData.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Icon name="Calendar" size={20} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold">{session.date}</p>
                          <div className="flex gap-2 mt-1">
                            {session.topics.map((topic) => (
                              <Badge key={topic} variant="secondary" className="text-xs">
                                {topic}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-1">
                          <Icon name="Clock" size={14} className="text-gray-500" />
                          <span className="text-sm text-gray-600">{session.duration} мин</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={session.emotion} className="w-20 h-2" />
                          <span className="text-sm font-semibold text-emerald-600">{session.emotion}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="consultation" className="animate-fade-in">
            <div className="max-w-4xl mx-auto">
              <Card className="border-2">
                <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-emerald-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full flex items-center justify-center">
                          <Icon name="Brain" size={20} className="text-white" />
                        </div>
                        Консультация с AI Психологом
                      </CardTitle>
                      <CardDescription className="mt-2">
                        Расскажите о том, что вас беспокоит. Я здесь, чтобы выслушать и помочь.
                      </CardDescription>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse mr-2" />
                      Онлайн
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[500px] p-6">
                    {messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                          <Icon name="MessageCircle" size={32} className="text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Начните беседу</h3>
                        <p className="text-gray-600 max-w-md">
                          Поделитесь своими мыслями и переживаниями. Все, что вы скажете, останется конфиденциальным.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {messages.map((message, index) => (
                          <div
                            key={index}
                            className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            {message.role === 'assistant' && (
                              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <Icon name="Brain" size={16} className="text-white" />
                              </div>
                            )}
                            <div
                              className={`max-w-[70%] p-4 rounded-2xl ${
                                message.role === 'user'
                                  ? 'bg-gradient-to-r from-blue-500 to-emerald-500 text-white'
                                  : 'bg-gray-100 text-gray-900'
                              }`}
                            >
                              <p className="text-sm leading-relaxed">{message.content}</p>
                            </div>
                            {message.role === 'user' && (
                              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                                <Icon name="User" size={16} className="text-gray-600" />
                              </div>
                            )}
                          </div>
                        ))}
                        {isTyping && (
                          <div className="flex gap-3 justify-start">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <Icon name="Brain" size={16} className="text-white" />
                            </div>
                            <div className="bg-gray-100 p-4 rounded-2xl">
                              <div className="flex gap-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </ScrollArea>
                  <div className="border-t p-4 bg-gray-50">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Напишите ваше сообщение..."
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="flex-1"
                      />
                      <Button 
                        onClick={handleSendMessage} 
                        disabled={!inputMessage.trim() || isTyping}
                        className="bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600"
                      >
                        <Icon name="Send" size={18} />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                      <Icon name="Lock" size={12} />
                      Ваша беседа конфиденциальна и защищена
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t mt-16 py-8 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <Icon name="Brain" size={16} className="text-white" />
            </div>
            <span className="font-semibold text-gray-900">AI Психолог</span>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Профессиональная психологическая поддержка на основе искусственного интеллекта
          </p>
          <p className="text-xs text-gray-500">
            © 2026 AI Психолог. Все права защищены.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;