import React from 'react';
import { 
  Sparkles, MousePointerClick, HelpCircle, 
  Layers, CheckCircle2, Cpu, Play, Pin, X, Eye
} from 'lucide-react';
import { MANUAL_ENTRIES } from '../data/appManualData';

export default function InteractiveAppManual({ activeManualKey, isPinned, onPinToggle, onClear, onTriggerFeature, role }) {
  // If no manual item is actively hovered/clicked, fallback to a sensible contextual default based on active role
  const entry = MANUAL_ENTRIES[activeManualKey] || (
    role === 'host' ? MANUAL_ENTRIES['host-earnings-card'] : MANUAL_ENTRIES['role-switcher']
  );

  const isContextFallback = !MANUAL_ENTRIES[activeManualKey];

  return (
    <aside className="hidden lg:flex flex-col w-[320px] xl:w-[350px] mr-6 xl:mr-10 select-none z-10 space-y-3.5 my-auto">
      {/* Live Manual Card */}
      <div className={`bg-white/95 dark:bg-[#12151D]/90 backdrop-blur-xl border rounded-3xl p-5 shadow-2xl space-y-3.5 relative overflow-hidden transition-all duration-300 ${
        isPinned
          ? 'border-brandYellow ring-2 ring-brandYellow/40'
          : 'border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'
      }`}>
        {/* Ambient background glow */}
        <div className={`absolute -right-8 -top-8 w-28 h-28 rounded-full blur-2xl pointer-events-none opacity-30 ${
          entry.color === 'emerald' ? 'bg-emerald-400' : 'bg-brandYellow'
        }`} />

        {/* Top Header Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-brandYellow animate-ping"></span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-700 dark:text-brandYellow font-extrabold flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              <span>Live App Inspector</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${
              entry.color === 'emerald'
                ? 'bg-emerald-500/15 text-emerald-700 dark:text-neonGreen border-emerald-500/30'
                : 'bg-amber-500/15 text-amber-700 dark:text-brandYellow border-amber-500/30'
            }`}>
              {entry.badge}
            </span>

            {/* Pin Toggle Button */}
            {!isContextFallback && (
              <button
                type="button"
                onClick={onPinToggle}
                className={`p-1 rounded-lg border text-xs transition-all ${
                  isPinned 
                    ? 'bg-brandYellow text-black border-brandYellow shadow glow-yellow font-black' 
                    : 'bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
                title={isPinned ? 'Manual Pinned. Click to unpin.' : 'Pin this manual card'}
              >
                <Pin className={`w-3.5 h-3.5 ${isPinned ? 'fill-current' : ''}`} />
              </button>
            )}

            {/* Clear Button */}
            {!isContextFallback && isPinned && (
              <button
                type="button"
                onClick={onClear}
                className="p-1 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-400 hover:text-gray-900 dark:hover:text-white"
                title="Reset manual"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Element Name & Title */}
        <div>
          <div className="text-[10px] text-gray-500 dark:text-gray-400 font-mono tracking-tight">
            Target Element: <span className="text-gray-700 dark:text-gray-300 font-semibold">{entry.elementName}</span>
          </div>
          <h3 className="text-base font-black text-gray-900 dark:text-white leading-tight mt-0.5">
            {entry.title}
          </h3>
        </div>

        {/* One-Sentence Summary */}
        <p className="text-xs font-semibold text-gray-700 dark:text-gray-200 leading-snug">
          {entry.summary}
        </p>

        {/* Section: Exact Use of that thing in Website */}
        <div className="space-y-1 pt-1 border-t border-gray-100 dark:border-white/5">
          <div className="text-[10px] font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-brandYellow" />
            <span>Use in this Website</span>
          </div>
          <p className="text-[11px] text-gray-600 dark:text-gray-300 leading-relaxed font-normal">
            {entry.useInWebsite}
          </p>
        </div>

        {/* Section: How to Interact */}
        <div className="p-3 rounded-2xl bg-gray-50 dark:bg-[#0D1016] border border-gray-200/80 dark:border-white/5 space-y-1">
          <div className="text-[10px] font-black uppercase tracking-wider text-gray-600 dark:text-gray-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>How to Use It</span>
          </div>
          <p className="text-[11px] text-gray-700 dark:text-gray-300 leading-snug font-medium">
            {entry.howToInteract}
          </p>
        </div>

        {/* Section: Tech Stack */}
        <div className="flex items-center gap-2 text-[10px] text-gray-500 dark:text-gray-400 font-mono bg-amber-500/5 dark:bg-brandYellow/5 p-2 rounded-xl border border-brandYellow/20">
          <Cpu className="w-3.5 h-3.5 text-brandYellow flex-shrink-0" />
          <span className="truncate">{entry.techStack}</span>
        </div>

        {/* Action Trigger Button */}
        {onTriggerFeature && (
          <button
            type="button"
            onClick={() => onTriggerFeature(entry.id)}
            className={`w-full py-2.5 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 ${
              entry.color === 'emerald'
                ? 'bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-black glow-green'
                : 'bg-gradient-to-r from-amber-400 via-brandYellow to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black glow-yellow'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current stroke-none" />
            <span>Test / Focus This Feature</span>
          </button>
        )}
      </div>

      {/* Interactive Helper Hint */}
      <div className="p-3 rounded-2xl bg-white/70 dark:bg-[#12151D]/60 backdrop-blur-md border border-gray-200 dark:border-white/10 text-center space-y-1">
        <div className="text-[10.5px] font-bold text-gray-700 dark:text-gray-300 flex items-center justify-center gap-1.5">
          <MousePointerClick className="w-3.5 h-3.5 text-brandYellow" />
          <span>Interactive Hover Guide Active</span>
        </div>
        <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-snug">
          Move your mouse over or click any button, search bar, GPS lock, or tab in the phone mockup to inspect its manual here.
        </p>
      </div>
    </aside>
  );
}
