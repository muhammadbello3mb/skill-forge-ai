import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { BadgeCheck, QrCode, Shield, Download, Share2, Award, Star, MapPin, Calendar, Check, X, Eye, Upload } from 'lucide-react';
import type { UserProfile, Evidence } from '../types';

interface PassportViewProps {
  profile: UserProfile;
  evidence: Evidence[];
}

export function PassportView({ profile, evidence }: PassportViewProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const passportRef = useRef<HTMLDivElement>(null);

  const verifiedSkills = profile.skills.filter(s => s.verified).length;
  const totalSkills = profile.skills.length;
  const verifiedEvidence = evidence.filter(e => e.verified).length;

  const handleDownload = () => {
    toast.success('Passport download started!');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${profile.name}'s SkillProof Passport`,
        text: `Check out my verified SkillProof passport! ${verifiedSkills}/${totalSkills} skills verified.`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Passport link copied to clipboard!');
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6 pb-8">
      {/* Passport Card */}
      <div className="relative perspective-1000" style={{ perspective: '1000px' }}>
        <motion.div
          ref={passportRef}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 100, damping: 20 }}
          className="relative w-full aspect-[3/4] cursor-pointer preserve-3d"
          style={{ transformStyle: 'preserve-3d' }}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          {/* Front Face */}
          <div
            className="absolute inset-0 rounded-2xl overflow-hidden backface-hidden"
            style={{ backfaceVisibility: 'hidden' }}
          >
            {/* Card Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-700 via-emerald-600 to-emerald-800" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,215,0,0.15),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(255,255,255,0.08),transparent_50%)]" />

            {/* Nigerian Map Pattern */}
            <div className="absolute inset-0 opacity-[0.03]">
              <div className="w-full h-full" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }} />
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col p-5">
              {/* Top Section */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BadgeCheck size={18} className="text-emerald-200" />
                  <span className="text-emerald-100 text-xs font-semibold tracking-wider">SKILLPROOF</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield size={14} className="text-emerald-300" />
                  <span className="text-emerald-200 text-[10px] font-medium">SECURE</span>
                </div>
              </div>

              {/* Passport Header */}
              <div className="mt-3 text-center">
                <div className="text-emerald-200 text-[10px] font-medium tracking-[0.2em] uppercase mb-1">Digital Skill Passport</div>
                <div className="w-16 h-0.5 bg-emerald-400/50 mx-auto rounded-full" />
              </div>

              {/* Photo & Name */}
              <div className="flex-1 flex flex-col items-center justify-center -mt-2">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-emerald-300/50 ring-offset-2 ring-offset-emerald-700 shadow-lg">
                    <img
                      src={profile.avatar || 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/c31cd1f2-9b75-4911-82c2-34612150645f/avatar-male-25d15492-1784613848301.webp'}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-400 flex items-center justify-center shadow-md">
                    <BadgeCheck size={14} className="text-emerald-900" />
                  </div>
                </div>
                <h2 className="mt-3 text-white font-bold text-lg tracking-tight">{profile.name}</h2>
                <p className="text-emerald-200 text-sm font-medium">{profile.trade}</p>
                <div className="flex items-center gap-1 mt-1">
                  <MapPin size={12} className="text-emerald-300" />
                  <span className="text-emerald-200 text-xs">{profile.location}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="text-center p-2 rounded-lg bg-white/10 backdrop-blur-sm">
                  <p className="text-white font-bold text-sm">{verifiedSkills}/{totalSkills}</p>
                  <p className="text-emerald-200 text-[10px]">Verified Skills</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-white/10 backdrop-blur-sm">
                  <p className="text-white font-bold text-sm">{profile.yearsOfExperience}+</p>
                  <p className="text-emerald-200 text-[10px]">Years Exp.</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-white/10 backdrop-blur-sm">
                  <p className="text-white font-bold text-sm">{verifiedEvidence}</p>
                  <p className="text-emerald-200 text-[10px]">Verified</p>
                </div>
              </div>

              {/* Bottom Bar */}
              <div className="flex items-center justify-between text-[10px] text-emerald-300/70">
                <span>ID: {profile.passportId || 'PENDING'}</span>
                <span className="tracking-wider">© SKILLPROOF AI</span>
              </div>
            </div>
          </div>

          {/* Back Face */}
          <div
            className="absolute inset-0 rounded-2xl overflow-hidden backface-hidden"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(16,185,129,0.1),transparent_60%)]" />

            <div className="relative z-10 h-full flex flex-col p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-slate-400 text-xs font-semibold tracking-wider">VERIFICATION DETAILS</span>
                <BadgeCheck size={16} className="text-emerald-400" />
              </div>

              {/* Skills List */}
              <div className="flex-1 space-y-1.5 overflow-y-auto scrollbar-hide">
                {profile.skills.map(skill => (
                  <div key={skill.id} className="flex items-center gap-2 py-1.5 px-2 rounded-lg bg-white/5">
                    <div className={`w-1.5 h-1.5 rounded-full ${skill.verified ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                    <span className="flex-1 text-xs text-slate-300">{skill.name}</span>
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                      skill.level === 'expert' ? 'bg-emerald-900/40 text-emerald-300' :
                      skill.level === 'advanced' ? 'bg-blue-900/40 text-blue-300' :
                      skill.level === 'intermediate' ? 'bg-amber-900/40 text-amber-300' :
                      'bg-slate-700 text-slate-400'
                    }`}>{skill.level}</span>
                    {skill.verified ? (
                      <Check size={12} className="text-emerald-400 shrink-0" />
                    ) : (
                      <X size={12} className="text-slate-500 shrink-0" />
                    )}
                  </div>
                ))}
              </div>

              {/* QR Code */}
              {showQR && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex justify-center my-2"
                >
                  <div className="w-20 h-20 bg-white rounded-lg p-1 flex items-center justify-center">
                    <QrCode size={60} className="text-slate-900" />
                  </div>
                </motion.div>
              )}

              <div className="text-center text-[10px] text-slate-500 mt-2">
                Tap card to flip • Scan QR to verify
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-center">
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-emerald-100 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all"
        >
          <Download size={16} />
          Download
        </button>
        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-emerald-100 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all"
        >
          <Share2 size={16} />
          Share
        </button>
        <button
          onClick={() => setShowQR(!showQR)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
            showQR
              ? 'bg-emerald-600 text-white'
              : 'bg-white dark:bg-slate-800 border border-emerald-100 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
          }`}
        >
          <QrCode size={16} />
          QR
        </button>
      </div>

      {/* Verification Badge */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-emerald-100 dark:border-slate-700">
        <div className="flex items-center gap-2 mb-2">
          <Shield size={16} className="text-emerald-500" />
          <span className="text-sm font-semibold text-slate-900 dark:text-white">Verification Status</span>
        </div>
        <div className="space-y-2">
          {profile.skills.map(skill => (
            <div key={skill.id} className="flex items-center justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">{skill.name}</span>
              <span className={`flex items-center gap-1 text-xs font-medium ${
                skill.verified ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-500'
              }`}>
                {skill.verified ? <BadgeCheck size={14} /> : <Upload size={14} />}
                {skill.verified ? 'Verified' : 'Pending'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Evidence Gallery */}
      {evidence.length > 0 && (
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Supporting Evidence</h3>
          <div className="space-y-2">
            {evidence.map(ev => (
              <div key={ev.id} className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-emerald-50 dark:border-slate-700">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  ev.type === 'photo' ? 'bg-blue-100 dark:bg-blue-900/40' :
                  ev.type === 'project' ? 'bg-emerald-100 dark:bg-emerald-900/40' :
                  'bg-purple-100 dark:bg-purple-900/40'
                }`}>
                  {ev.type === 'photo' ? <Camera size={18} className="text-blue-600 dark:text-blue-400" /> :
                   ev.type === 'project' ? <Award size={18} className="text-emerald-600 dark:text-emerald-400" /> :
                   <Eye size={18} className="text-purple-600 dark:text-purple-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{ev.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{ev.description}</p>
                </div>
                {ev.verified ? (
                  <BadgeCheck size={16} className="text-emerald-500 shrink-0" />
                ) : (
                  <span className="text-[10px] font-medium text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-full shrink-0">Pending</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}