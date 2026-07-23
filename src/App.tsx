import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'sonner';
import { ThemeProvider, useTheme } from 'next-themes';
import {
  ArrowRight, Shield, BadgeCheck, QrCode, Globe, Award, Briefcase,
  BookOpen, GraduationCap, Sparkles, Languages, Target, Mic, Send,
  CirclePlay, RefreshCw, Lightbulb, TrendingUp, Zap, Clock, MapPin,
  Settings, Eye, Download, Share2, Check, X, Menu, ChevronDown,
  ChevronRight, Sun, Moon, Plus, Star, User, Wrench, ChefHat,
  Smartphone, HardHat, Scissors, Home, House, Users, Search,
  Camera, Calendar, Upload, Bell, LogOut, ChevronLeft, ChevronUp,
  Palette, Megaphone
} from 'lucide-react';
import type { ViewType, UserProfile, InterviewMessage, Skill, Evidence, Trade } from './types';
import { TRADES, SAMPLE_USER, OPPORTUNITIES, INTERVIEW_FLOWS, NIGERIAN_CITIES, LANGUAGES, BRAND_NAME, BRAND_TAGLINE, STORAGE_KEYS } from './constants';
import { PassportView } from './components/PassportView';

const HERO_IMAGE = 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/c31cd1f2-9b75-4911-82c2-34612150645f/hero-artisan-a7db5cdc-1784613848146.webp';
const AVATAR_FEMALE = 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/c31cd1f2-9b75-4911-82c2-34612150645f/avatar-female-1e74e1a7-1784613848300.webp';
const PASSPORT_BG = 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/c31cd1f2-9b75-4911-82c2-34612150645f/passport-badge-2bcb0b4a-1784613848305.webp';
const TRUST_BADGE = 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/c31cd1f2-9b75-4911-82c2-34612150645f/trust-badge-4b9e17e6-1784613848302.webp';

function AppContent() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [currentView, setCurrentView] = useState<ViewType>('welcome');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [interviewMessages, setInterviewMessages] = useState<InterviewMessage[]>([]);
  const [interviewStep, setInterviewStep] = useState(0);
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [interviewComplete, setInterviewComplete] = useState(false);
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      if (saved) setUserProfile(JSON.parse(saved));
      const ev = localStorage.getItem(STORAGE_KEYS.EVIDENCE);
      if (ev) setEvidence(JSON.parse(ev));
    } catch { /* ignore corrupt data */ }
  }, []);

  // Persist
  useEffect(() => { if (userProfile) localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(userProfile)); }, [userProfile]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.EVIDENCE, JSON.stringify(evidence)); }, [evidence]);

  const handleStartInterview = useCallback((trade: Trade) => {
    setSelectedTrade(trade);
    const flow = structuredClone(INTERVIEW_FLOWS.default);
    // Customize first question
    flow[0].text = `Hello! I'm your SkillProof AI interviewer. Let me help you build your digital passport. You selected **${trade.name}** — great choice! Let's start assessing your skills.`;
    setInterviewMessages(flow);
    setInterviewStep(0);
    setInterviewComplete(false);
    setCurrentView('interview');
  }, []);

  const handleInterviewResponse = useCallback((option: string) => {
    if (!selectedTrade) return;
    const currentMsg = interviewMessages[interviewStep];
    const userMsg: InterviewMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: option,
      timestamp: Date.now(),
    };
    const updated = [...interviewMessages.slice(0, interviewStep + 1), userMsg];
    setInterviewMessages(updated);
    setIsTyping(true);

    setTimeout(() => {
      const nextIdx = interviewStep + 1;
      if (nextIdx < interviewMessages.length) {
        const nextMsg = { ...interviewMessages[nextIdx] };
        // Customize follow-ups based on trade
        if (nextIdx === 2) {
          const tradeQuestions: Record<string, string> = {
            'Fashion Design & Tailoring': 'Tell me about the types of garments you typically make — traditional agbadas, modern suits, or both?',
            'Automotive Diagnostics & Repair': 'What types of vehicles do you work on most — cars, trucks, or both?',
            'Catering & Pastry Arts': 'What kind of events do you typically cater for — weddings, corporate events, or daily orders?',
            'Phone & Laptop Repair': 'What types of devices do you repair most — phones, laptops, or both?',
            'Building & Construction': 'What kind of projects do you handle — residential, commercial, or both?',
            'Hair & Beauty': 'What services do you offer most — braiding, styling, makeup, or all?',
          };
          nextMsg.text = tradeQuestions[selectedTrade.name] || nextMsg.text;
        }
        setInterviewMessages(prev => [...prev, nextMsg]);
        setInterviewStep(nextIdx);
      } else {
        // Interview complete
        const skills = selectedTrade.skills.map(s => ({
          ...s,
          verified: Math.random() > 0.4,
        }));
        setUserProfile(prev => prev ? {
          ...prev,
          trade: selectedTrade.name,
          skills,
          passportCreated: true,
        } : {
          ...SAMPLE_USER,
          trade: selectedTrade.name,
          skills,
          passportCreated: true,
        });
        setInterviewComplete(true);
        toast.success('Skills identified! Your passport is ready.');
      }
      setIsTyping(false);
    }, 1200);
  }, [interviewMessages, interviewStep, selectedTrade]);

  const handleAddEvidence = useCallback((type: Evidence['type']) => {
    const newEvidence: Evidence = {
      id: `ev-${Date.now()}`,
      type,
      title: type === 'photo' ? 'New Photo Evidence' : type === 'project' ? 'New Project' : 'New Reference',
      description: 'Add a description of your evidence...',
      date: new Date().toISOString().split('T')[0],
      verified: false,
    };
    setEvidence(prev => [newEvidence, ...prev]);
    toast.success('Evidence added! It will be reviewed for verification.');
  }, []);

  const resetApp = useCallback(() => {
    setUserProfile(null);
    setInterviewMessages([]);
    setInterviewStep(0);
    setSelectedTrade(null);
    setInterviewComplete(false);
    setEvidence([]);
    localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
    localStorage.removeItem(STORAGE_KEYS.EVIDENCE);
    setCurrentView('welcome');
  }, []);

  const navItems: { view: ViewType; label: string; icon: typeof Home }[] = [
    { view: 'dashboard', label: 'Home', icon: Home },
    { view: 'passport', label: 'Passport', icon: BadgeCheck },
    { view: 'opportunities', label: 'Opportunities', icon: TrendingUp },
    { view: 'evidence', label: 'Evidence', icon: Eye },
  ];

  const bottomNav = mounted && userProfile?.passportCreated && (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-emerald-100 dark:border-emerald-900/50 safe-area-bottom">
      <div className="flex items-center justify-around max-w-lg mx-auto px-2 py-2">
        {navItems.map(({ view, label, icon: Icon }) => (
          <button
            key={view}
            onClick={() => { setCurrentView(view); setMobileMenuOpen(false); }}
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all min-w-[64px] ${
              currentView === view
                ? 'text-emerald-700 dark:text-emerald-400'
                : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            <Icon size={22} className={currentView === view ? 'drop-shadow-sm' : ''} />
            <span className="text-[10px] font-medium leading-tight">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/50 via-white to-amber-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <Toaster position="top-center" richColors />

      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-emerald-100/50 dark:border-emerald-900/30">
        <div className="flex items-center justify-between max-w-5xl mx-auto px-4 h-14">
          <button onClick={() => setCurrentView('welcome')} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-sm">
              <BadgeCheck size={18} className="text-white" />
            </div>
            <span className="font-bold text-emerald-900 dark:text-emerald-100 text-sm tracking-tight">{BRAND_NAME}</span>
          </button>

          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <div className="relative group">
              <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors">
                <Languages size={14} />
                <span className="hidden sm:inline">EN</span>
                <ChevronDown size={12} />
              </button>
              <div className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-emerald-100 dark:border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                {LANGUAGES.map(lang => (
                  <button key={lang.code} className="w-full text-left px-3 py-2 text-sm hover:bg-emerald-50 dark:hover:bg-slate-700 first:rounded-t-xl last:rounded-b-xl transition-colors">
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Mobile Menu */}
            {userProfile?.passportCreated && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors sm:hidden"
              >
                {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && userProfile?.passportCreated && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-0 top-14 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md sm:hidden"
          >
            <div className="flex flex-col p-4 gap-2">
              {navItems.map(({ view, label, icon: Icon }) => (
                <button
                  key={view}
                  onClick={() => { setCurrentView(view); setMobileMenuOpen(false); }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                    currentView === view ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon size={20} />
                  {label}
                </button>
              ))}
              <hr className="my-2 border-emerald-100 dark:border-slate-700" />
              <button onClick={resetApp} className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                <LogOut size={20} />
                Reset Passport
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className={`max-w-5xl mx-auto px-4 pb-24 ${currentView === 'welcome' ? '' : 'pt-4'}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {currentView === 'welcome' && (
              <WelcomeView
                onStartInterview={(trade) => handleStartInterview(trade)}
                userProfile={userProfile}
              />
            )}
            {currentView === 'interview' && (
              <InterviewView
                messages={interviewMessages}
                step={interviewStep}
                isTyping={isTyping}
                complete={interviewComplete}
                selectedTrade={selectedTrade}
                onResponse={handleInterviewResponse}
                onViewPassport={() => setCurrentView('passport')}
              />
            )}
            {currentView === 'dashboard' && userProfile && (
              <DashboardView
                profile={userProfile}
                evidence={evidence}
                onViewChange={setCurrentView}
              />
            )}
            {currentView === 'passport' && userProfile && (
              <PassportView
                profile={userProfile}
                evidence={evidence}
              />
            )}
            {currentView === 'opportunities' && userProfile && (
              <OpportunitiesView
                profile={userProfile}
                onViewChange={setCurrentView}
              />
            )}
            {currentView === 'evidence' && userProfile && (
              <EvidenceView
                evidence={evidence}
                onAddEvidence={handleAddEvidence}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {bottomNav}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <AppContent />
    </ThemeProvider>
  );
}

/* ========== WELCOME VIEW ========== */
function WelcomeView({ onStartInterview, userProfile }: {
  onStartInterview: (trade: Trade) => void;
  userProfile: UserProfile | null;
}) {
  const [showTrades, setShowTrades] = useState(false);

  const trustIndicators = [
    { icon: Shield, text: 'Blockchain-Verified Credentials' },
    { icon: BadgeCheck, text: 'Trusted by 5,000+ Artisans' },
    { icon: Globe, text: 'Recognized Across Nigeria' },
    { icon: Award, text: 'Open to All Trades & Skills' },
  ];

  const testimonials = [
    { name: 'Amina S.', trade: 'Fashion Designer', text: 'SkillProof helped me get a contract with a major Lagos boutique. My passport opened doors!', avatar: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/c31cd1f2-9b75-4911-82c2-34612150645f/avatar-female-1e74e1a7-1784613848300.webp' },
    { name: 'Chidi O.', trade: 'Auto Mechanic', text: 'My customers trust me more now. They scan my QR code and see my verified skills.', avatar: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/c31cd1f2-9b75-4911-82c2-34612150645f/avatar-male-25d15492-1784613848301.webp' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <section className="relative pt-8 pb-12 md:pt-16 md:pb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/5 via-transparent to-amber-500/5 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="flex-1 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-4">
                <Sparkles size={14} />
                Nigeria's #1 Skill Verification Platform
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight mb-4">
                Make Your{' '}
                <span className="bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
                  Skills
                </span>{' '}
                Visible
              </h1>
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-lg mb-8 leading-relaxed">
                {BRAND_TAGLINE}. Get a verified digital passport that proves your expertise — whether you're a tailor, mechanic, chef, or builder.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                {userProfile?.passportCreated ? (
                  <button
                    onClick={() => window.location.reload()}
                    className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-lg shadow-emerald-200/50 dark:shadow-emerald-900/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <BadgeCheck size={20} />
                    View My Passport
                  </button>
                ) : (
                  <button
                    onClick={() => setShowTrades(!showTrades)}
                    className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-lg shadow-emerald-200/50 dark:shadow-emerald-900/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Target size={20} />
                    Get Your Skill Passport
                    <ArrowRight size={18} />
                  </button>
                )}
                <button className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl border-2 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-semibold hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all">
                  <CirclePlay size={20} />
                  Watch Demo
                </button>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 relative"
          >
            <div className="relative w-full max-w-sm mx-auto aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl shadow-emerald-900/20">
              <img src={HERO_IMAGE} alt="Nigerian artisan" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/40 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-xl p-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                    <BadgeCheck size={20} className="text-emerald-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Verified Artisan</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">SkillProof Passport Holder</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trade Selection */}
      <AnimatePresence>
        {showTrades && (
          <motion.section
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-8"
          >
            <div className="py-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Choose Your Trade</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Select your profession to begin the AI skill assessment</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {TRADES.map((trade, idx) => (
                  <motion.button
                    key={trade.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.06 }}
                    onClick={() => onStartInterview(trade)}
                    className="group relative flex items-start gap-3 p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-emerald-100 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-600 hover:shadow-lg hover:shadow-emerald-100/50 dark:hover:shadow-emerald-900/20 transition-all text-left"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/40 dark:to-emerald-800/40 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      {trade.id === 'fashion' && <Scissors size={20} className="text-emerald-600" />}
                      {trade.id === 'auto' && <Wrench size={20} className="text-emerald-600" />}
                      {trade.id === 'catering' && <ChefHat size={20} className="text-emerald-600" />}
                      {trade.id === 'repair' && <Smartphone size={20} className="text-emerald-600" />}
                      {trade.id === 'building' && <HardHat size={20} className="text-emerald-600" />}
                      {trade.id === 'beauty' && <Sparkles size={20} className="text-emerald-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 dark:text-white text-sm group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{trade.name}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{trade.description}</p>
                      <span className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        Start Assessment <ArrowRight size={12} />
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Trust Indicators */}
      <section className="py-8 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {trustIndicators.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              className="flex flex-col items-center text-center gap-2 p-4 rounded-xl bg-white/50 dark:bg-slate-800/30 backdrop-blur-sm border border-emerald-50 dark:border-slate-700/50"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                <item.icon size={20} className="text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{item.text}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-8 border-t border-emerald-100/50 dark:border-slate-800">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 text-center">Trusted by Nigerian Artisans</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="flex items-start gap-3 p-4 rounded-xl bg-white dark:bg-slate-800/50 border border-emerald-50 dark:border-slate-700"
            >
              <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-200 dark:ring-emerald-800" />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-slate-900 dark:text-white text-sm">{t.name}</span>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">{t.trade}</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">"{t.text}"</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      {!showTrades && !userProfile?.passportCreated && (
        <section className="py-8 text-center">
          <button onClick={() => setShowTrades(true)} className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold text-lg shadow-xl shadow-emerald-200/50 dark:shadow-emerald-900/30 hover:scale-[1.02] active:scale-[0.98] transition-all">
            <Sparkles size={22} />
            Start Your Skill Assessment
            <ArrowRight size={20} />
          </button>
          <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">Free • Takes 5 minutes • No app download needed</p>
        </section>
      )}
    </div>
  );
}

/* ========== INTERVIEW VIEW ========== */
function InterviewView({ messages, step, isTyping, complete, selectedTrade, onResponse, onViewPassport }: {
  messages: InterviewMessage[];
  step: number;
  isTyping: boolean;
  complete: boolean;
  selectedTrade: Trade | null;
  onResponse: (option: string) => void;
  onViewPassport: () => void;
}) {
  const endRef = useEndRef();

  return (
    <div className="flex flex-col max-w-lg mx-auto min-h-[calc(100vh-8rem)]">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-sm">
          <Mic size={18} className="text-white" />
        </div>
        <div>
          <h2 className="font-bold text-slate-900 dark:text-white text-base">AI Skill Interview</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">{selectedTrade?.name || 'Skill Assessment'}</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          {complete ? 'Complete' : 'In Progress'}
        </div>
      </div>

      <div ref={endRef} className="flex-1 overflow-y-auto space-y-3 mb-4 scrollbar-hide">
        {messages.slice(0, step + 1).map((msg, idx) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: idx * 0.05, type: 'spring', stiffness: 200, damping: 20 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
              msg.role === 'user'
                ? 'bg-emerald-600 text-white rounded-tr-md'
                : 'bg-white dark:bg-slate-800 border border-emerald-100 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-md shadow-sm'
            }`}>
              <p className="text-sm leading-relaxed whitespace-pre-line">{msg.text}</p>
            </div>
          </motion.div>
        ))}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-white dark:bg-slate-800 border border-emerald-100 dark:border-slate-700 rounded-2xl rounded-tl-md px-4 py-3 shadow-sm">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Options / Actions */}
      <div className="sticky bottom-0 bg-gradient-to-t from-white dark:from-slate-900 via-white/80 dark:via-slate-900/80 to-transparent pt-4 pb-2">
        {complete ? (
          <div className="text-center space-y-3">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-semibold text-sm">
                <BadgeCheck size={18} />
                Skills Identified!
              </div>
            </motion.div>
            <button
              onClick={onViewPassport}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <BadgeCheck size={20} />
              View Your Skill Passport
              <ArrowRight size={18} />
            </button>
          </div>
        ) : messages[step]?.options ? (
          <div className="flex flex-wrap gap-2 justify-center">
            {messages[step].options!.map((opt, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => onResponse(opt)}
                className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-emerald-200 dark:border-slate-600 text-sm font-medium text-slate-700 dark:text-slate-300 hover:border-emerald-400 dark:hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:shadow-md transition-all active:scale-[0.97]"
              >
                {opt}
              </motion.button>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-white dark:bg-slate-800 rounded-xl border border-emerald-100 dark:border-slate-700 p-1">
            <input
              type="text"
              placeholder="Type your response..."
              className="flex-1 bg-transparent border-none outline-none px-3 py-2 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                  onResponse(e.currentTarget.value.trim());
                  e.currentTarget.value = '';
                }
              }}
            />
            <button
              onClick={() => {
                const input = document.querySelector('input[type="text"]') as HTMLInputElement;
                if (input?.value.trim()) {
                  onResponse(input.value.trim());
                  input.value = '';
                }
              }}
              className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ========== DASHBOARD VIEW ========== */
function DashboardView({ profile, evidence, onViewChange }: {
  profile: UserProfile;
  evidence: Evidence[];
  onViewChange: (v: ViewType) => void;
}) {
  const verifiedCount = profile.skills.filter(s => s.verified).length;
  const totalSkills = profile.skills.length;
  const verifiedEvidence = evidence.filter(e => e.verified).length;

  const stats = [
    { label: 'Verified Skills', value: `${verifiedCount}/${totalSkills}`, icon: BadgeCheck, color: 'emerald' },
    { label: 'Evidence Items', value: `${evidence.length}`, icon: Eye, color: 'blue' },
    { label: 'Opportunities', value: `${OPPORTUNITIES.length}`, icon: TrendingUp, color: 'amber' },
    { label: 'Experience', value: `${profile.yearsOfExperience} yrs`, icon: Clock, color: 'purple' },
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Profile Header */}
      <div className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-emerald-100 dark:border-slate-700 shadow-sm">
        <img
          src={profile.avatar || AVATAR_FEMALE}
          alt={profile.name}
          className="w-16 h-16 rounded-full object-cover ring-2 ring-emerald-300 dark:ring-emerald-700"
        />
        <div className="flex-1">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">{profile.name}</h2>
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <Briefcase size={14} />
            <span>{profile.trade}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            <MapPin size={12} />
            <span>{profile.location}</span>
          </div>
        </div>
        <button onClick={() => onViewChange('passport')} className="px-3 py-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold hover:bg-emerald-200 dark:hover:bg-emerald-900/60 transition-colors">
          View Passport
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-emerald-50 dark:border-slate-700"
          >
            <div className={`w-8 h-8 rounded-lg bg-${s.color}-100 dark:bg-${s.color}-900/40 flex items-center justify-center mb-2`}>
              <s.icon size={18} className={`text-${s.color}-600 dark:text-${s.color}-400`} />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{s.value}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Skills Progress */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-emerald-100 dark:border-slate-700">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-slate-900 dark:text-white">My Skills</h3>
          <button onClick={() => onViewChange('interview')} className="text-xs text-emerald-600 dark:text-emerald-400 font-medium hover:underline">
            Update Skills
          </button>
        </div>
        <div className="space-y-2">
          {profile.skills.slice(0, 4).map(skill => (
            <div key={skill.id} className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${skill.verified ? 'bg-emerald-500' : 'bg-amber-400'}`} />
              <span className="flex-1 text-sm text-slate-700 dark:text-slate-300">{skill.name}</span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                skill.level === 'expert' ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300' :
                skill.level === 'advanced' ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300' :
                skill.level === 'intermediate' ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300' :
                'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
              }`}>{skill.level}</span>
              {skill.verified && <BadgeCheck size={14} className="text-emerald-500 shrink-0" />}
            </div>
          ))}
        </div>
        {profile.skills.length > 4 && (
          <button onClick={() => onViewChange('passport')} className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-2 hover:underline">
            +{profile.skills.length - 4} more skills
          </button>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => onViewChange('evidence')} className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-emerald-50 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-700 transition-all text-left">
          <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
            <Camera size={20} className="text-amber-600" />
          </div>
          <div>
            <p className="font-semibold text-slate-900 dark:text-white text-sm">Add Evidence</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Photos, projects, references</p>
          </div>
        </button>
        <button onClick={() => onViewChange('opportunities')} className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-emerald-50 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-700 transition-all text-left">
          <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
            <TrendingUp size={20} className="text-blue-600" />
          </div>
          <div>
            <p className="font-semibold text-slate-900 dark:text-white text-sm">Opportunities</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Jobs, courses, mentorships</p>
          </div>
        </button>
      </div>
    </div>
  );
}

/* ========== OPPORTUNITIES VIEW ========== */
function OpportunitiesView({ profile, onViewChange }: {
  profile: UserProfile;
  onViewChange: (v: ViewType) => void;
}) {
  const skillCategories = [...new Set(profile.skills.map(s => s.category))];
  const verifiedCount = profile.skills.filter(s => s.verified).length;
  const gapSkills = profile.skills.filter(s => !s.verified);

  return (
    <div className="space-y-6 pb-8">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white">Opportunities for You</h2>

      {/* Skill Gap Analysis */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-emerald-100 dark:border-slate-700">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Your Skill Profile</h3>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-600 dark:text-slate-400">Verification Rate</span>
          <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{Math.round((verifiedCount / profile.skills.length) * 100)}%</span>
        </div>
        <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden mb-4">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(verifiedCount / profile.skills.length) * 100}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
          />
        </div>
        <div className="space-y-2">
          {skillCategories.map(cat => {
            const catSkills = profile.skills.filter(s => s.category === cat);
            const catVerified = catSkills.filter(s => s.verified).length;
            return (
              <div key={cat} className="flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">{cat}</span>
                <span className="text-slate-900 dark:text-white font-medium">{catVerified}/{catSkills.length} verified</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Skill Gaps to Bridge */}
      {gapSkills.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
            <Lightbulb size={18} className="text-amber-500" />
            Skills to Verify
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Submit evidence for these skills to get them verified</p>
          <div className="flex flex-wrap gap-2">
            {gapSkills.map(s => (
              <span key={s.id} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-700 text-xs font-medium text-slate-700 dark:text-slate-300">
                {s.name}
                <button onClick={() => onViewChange('evidence')} className="text-amber-500 hover:text-amber-600">
                  <Plus size={12} />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Matched Opportunities */}
      <h3 className="font-semibold text-slate-900 dark:text-white">Matched Opportunities</h3>
      <div className="space-y-3">
        {OPPORTUNITIES.map((opp, i) => (
          <motion.div
            key={opp.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-emerald-50 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-700 transition-all"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h4 className="font-semibold text-slate-900 dark:text-white text-sm">{opp.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{opp.provider}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{opp.description}</p>
                {opp.location && (
                  <div className="flex items-center gap-1 mt-1">
                    <MapPin size={12} className="text-slate-400" />
                    <span className="text-xs text-slate-400">{opp.location}</span>
                  </div>
                )}
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{opp.matchScore}%</span>
                </div>
                <span className="text-[10px] text-slate-400">match</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                opp.type === 'job' ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300' :
                opp.type === 'course' ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300' :
                opp.type === 'mentorship' ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300' :
                'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300'
              }`}>{opp.type}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ========== USE END REF HOOK ========== */
function useEndRef() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  });
  return ref;
}

/* ========== EVIDENCE VIEW ========== */
function EvidenceView({ evidence, onAddEvidence }: {
  evidence: Evidence[];
  onAddEvidence: (type: Evidence['type']) => void;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const evidenceTypes = [
    { type: 'photo' as const, label: 'Photo', icon: Camera, color: 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400' },
    { type: 'project' as const, label: 'Project', icon: Award, color: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400' },
    { type: 'reference' as const, label: 'Reference', icon: Eye, color: 'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400' },
  ];

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Evidence Center</h2>
        <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full font-medium">
          {evidence.length} items
        </span>
      </div>

      {/* Add Evidence */}
      <div className="grid grid-cols-3 gap-3">
        {evidenceTypes.map(({ type, label, icon: Icon, color }) => (
          <button
            key={type}
            onClick={() => onAddEvidence(type)}
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-emerald-50 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-700 hover:shadow-md transition-all"
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
              <Icon size={20} />
            </div>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Add {label}</span>
          </button>
        ))}
      </div>

      {/* Evidence List */}
      {evidence.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3">
            <Upload size={28} className="text-slate-400" />
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">No evidence yet</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Add photos, projects, or references to strengthen your passport</p>
        </div>
      ) : (
        <div className="space-y-2">
          {evidence.map(ev => (
            <motion.div
              key={ev.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-emerald-50 dark:border-slate-700"
            >
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  ev.type === 'photo' ? 'bg-blue-100 dark:bg-blue-900/40' :
                  ev.type === 'project' ? 'bg-emerald-100 dark:bg-emerald-900/40' :
                  'bg-purple-100 dark:bg-purple-900/40'
                }`}>
                  {ev.type === 'photo' ? <Camera size={18} className="text-blue-600 dark:text-blue-400" /> :
                   ev.type === 'project' ? <Award size={18} className="text-emerald-600 dark:text-emerald-400" /> :
                   <Eye size={18} className="text-purple-600 dark:text-purple-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-slate-900 dark:text-white text-sm truncate">{ev.title}</h4>
                    {ev.verified ? (
                      <BadgeCheck size={14} className="text-emerald-500 shrink-0" />
                    ) : (
                      <span className="text-[10px] font-medium text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-full shrink-0">Pending</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{ev.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar size={10} className="text-slate-400" />
                    <span className="text-[10px] text-slate-400">{ev.date}</span>
                  </div>
                </div>
                <button
                  onClick={() => setExpanded(expanded === ev.id ? null : ev.id)}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  {expanded === ev.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>
              {expanded === ev.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="mt-3 pt-3 border-t border-emerald-50 dark:border-slate-700"
                >
                  <div className="flex gap-2">
                    <button className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline">Edit</button>
                    <button className="text-xs font-medium text-red-500 hover:underline">Remove</button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}