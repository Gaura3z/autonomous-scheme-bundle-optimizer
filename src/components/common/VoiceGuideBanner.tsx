/**
 * Civic Voice & Mobile Step Guidance Banner
 * Provides spoken and clear textual instructions for every step on mobile and desktop.
 * Ensures students in Maharashtra understand the process and know to scroll down to continue.
 * Kurukshetra 2.0 HACKFEST 2026 PS16
 */
import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Sparkles, ChevronDown, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface VoiceGuideBannerProps {
  stepNumber: number;
  totalSteps?: number;
  title: string;
  guidanceText: string;
  marathiText?: string;
  showScrollHint?: boolean;
}

export const VoiceGuideBanner: React.FC<VoiceGuideBannerProps> = ({
  stepNumber,
  totalSteps = 6,
  title,
  guidanceText,
  marathiText,
  showScrollHint = true,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showLanguage, setShowLanguage] = useState<'en' | 'mr'>('en');
  const [hasScrolled, setHasScrolled] = useState(false);

  // Monitor scroll to fade scroll hint
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 120) {
        setHasScrolled(true);
      } else {
        setHasScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Stop speech when unmounting or changing step
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
  }, [stepNumber]);

  const handleToggleVoice = () => {
    if (!('speechSynthesis' in window)) {
      alert('Voice narration is not supported on this browser.');
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel();
    const textToSpeak = showLanguage === 'mr' && marathiText ? marathiText : guidanceText;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.95; // Slightly slower for clear government/student guidance
    utterance.pitch = 1.0;
    
    // Try finding an Indian English voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => 
      showLanguage === 'mr' 
        ? v.lang.includes('mr') || v.lang.includes('hi')
        : (v.lang.includes('en-IN') || v.name.includes('India'))
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  return (
    <div className="w-full mb-6">
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-sm border border-blue-800/40 relative overflow-hidden"
      >
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none -mr-16 -mt-16" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center shrink-0 text-blue-300 mt-0.5">
              <Compass className="w-5 h-5 text-blue-300" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-[11px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-blue-500/30 text-blue-200 border border-blue-400/20">
                  Step {stepNumber} of {totalSteps}
                </span>
                <span className="text-xs font-semibold text-slate-300">
                  {title}
                </span>
                {marathiText && (
                  <button
                    type="button"
                    onClick={() => setShowLanguage(prev => prev === 'en' ? 'mr' : 'en')}
                    className="text-[10px] text-blue-300 hover:text-white underline cursor-pointer ml-1"
                  >
                    {showLanguage === 'en' ? 'मराठीत वाचा' : 'Read in English'}
                  </button>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-2xl font-normal">
                {showLanguage === 'mr' && marathiText ? marathiText : guidanceText}
              </p>
            </div>
          </div>

          {/* Voice narration button */}
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            <motion.button
              type="button"
              onClick={handleToggleVoice}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isPlaying
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md animate-pulse'
                  : 'bg-white/10 hover:bg-white/20 text-blue-100 border border-white/15'
              }`}
              title="Listen to spoken instructions"
            >
              {isPlaying ? (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>Stop Voice</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-blue-300" />
                  <span>Voice Guide</span>
                </>
              )}
            </motion.button>
          </div>
        </div>

        {/* Scroll hint on mobile */}
        {showScrollHint && !hasScrolled && (
          <div className="sm:hidden mt-3 pt-2.5 border-t border-white/10 flex items-center justify-center gap-1.5 text-[11px] text-blue-200/90 animate-bounce">
            <ChevronDown className="w-3.5 h-3.5" />
            <span>Scroll down to fill details & continue to Next Step</span>
          </div>
        )}
      </motion.div>
    </div>
  );
};
