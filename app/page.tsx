'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  LuCheck, 
  LuClock,
  LuServer,
  LuRefreshCw,
  LuX,
  LuChevronRight,
  LuTrendingUp
} from 'react-icons/lu'

// --- APPLE PRO STYLE SUB-COMPONENTS ---

const AmbientBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-[#F2F2F7]">
    <motion.div 
      animate={{ 
        transform: ['translate(0%, 0%) scale(1)', 'translate(5%, 10%) scale(1.05)', 'translate(-5%, -5%) scale(0.95)', 'translate(0%, 0%) scale(1)'] 
      }}
      transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-[-10%] left-[-10%] w-[80%] md:w-[50%] h-[50%] bg-[#007AFF]/20 rounded-full blur-[100px] md:blur-[120px] mix-blend-multiply"
    />
    <motion.div 
      animate={{ 
        transform: ['translate(0%, 0%) scale(1)', 'translate(-10%, 5%) scale(0.9)', 'translate(5%, -15%) scale(1.1)', 'translate(0%, 0%) scale(1)'] 
      }}
      transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      className="absolute bottom-[-10%] right-[-10%] w-[90%] md:w-[60%] h-[60%] bg-[#AF52DE]/15 rounded-full blur-[120px] md:blur-[140px] mix-blend-multiply"
    />
  </div>
)

const GlassCard = ({ children, className = "", delay = 0 }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 30, scale: 0.98 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }} 
    className={`bg-white/50 backdrop-blur-[50px] backdrop-saturate-[180%] border border-white/60 ring-1 ring-white/40 shadow-[0_20px_40px_rgba(0,0,0,0.04)] rounded-[28px] sm:rounded-[36px] relative overflow-hidden ${className}`}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent pointer-events-none" />
    <div className="relative z-10 h-full">{children}</div>
  </motion.div>
)

const AppleStatCard = ({ icon: Icon, label, value, iconColor, iconBg, delay }: any) => (
  <GlassCard delay={delay} className="p-6 sm:p-8 flex flex-col justify-between group hover:shadow-[0_24px_50px_rgba(0,0,0,0.08)] md:hover:-translate-y-1 transition-all duration-500 min-h-[220px]">
    <div className="flex items-center justify-between mb-6 sm:mb-8">
      <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-[18px] sm:rounded-[22px] flex items-center justify-center ${iconBg} shadow-inner ring-1 ring-black/5`}>
        <Icon className={`text-[22px] sm:text-[26px] ${iconColor}`} />
      </div>
      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/5 flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 md:group-hover:translate-x-1 transition-all duration-300">
        <LuChevronRight className="text-gray-400" size={18}/>
      </div>
    </div>
    <div className="mt-auto">
      <motion.p 
        key={value}
        initial={{ opacity: 0, scale: 0.9, y: 5 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="text-[36px] sm:text-[48px] font-extrabold tracking-tight text-[#1D1D1F] leading-none mb-2 sm:mb-3" 
        style={{ fontVariantNumeric: 'tabular-nums' }}
      >
        {value}
      </motion.p>
      <p className="text-[11px] sm:text-[13px] font-bold text-[#86868B] tracking-widest uppercase">{label}</p>
    </div>
  </GlassCard>
)

const CircularProgress = ({ percentage, color = "#007AFF" }: { percentage: number, color?: string }) => {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-[180px] h-[180px] sm:w-[240px] sm:h-[240px]">
      <div className="absolute inset-0 rounded-full blur-[20px] sm:blur-[30px] opacity-20 transition-all duration-1000" style={{ background: color }} />
      
      <svg className="transform -rotate-90 w-full h-full drop-shadow-2xl relative z-10" viewBox="0 0 160 160">
        <circle cx="80" cy="80" r={radius} stroke="rgba(0,0,0,0.03)" strokeWidth="16" fill="transparent" />
        <motion.circle
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          cx="80" cy="80" r={radius}
          stroke={color}
          strokeWidth="16"
          fill="transparent"
          strokeDasharray={circumference}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
        <motion.span 
          key={Math.round(percentage)}
          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
          className="text-[40px] sm:text-[52px] font-black tracking-tighter text-[#1D1D1F] drop-shadow-sm"
        >
          {Math.round(percentage)}%
        </motion.span>
        <span className="text-[9px] sm:text-[11px] uppercase tracking-widest font-extrabold text-[#86868B] mt-1">Completed</span>
      </div>
    </div>
  )
}

// --- MAIN DASHBOARD ---
export default function LiveDashboard() {
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  // Hardcoded initial data
  const [stats, setStats] = useState({ 
    total: 967, 
    sent: 156, 
    failed: 13, 
    pending: 967 - 156 - 13 // 798 initially
  })

  useEffect(() => {
    // Math: 8 days = 691,200,000 milliseconds
    // Remaining = 798 messages.
    // 691,200,000 ms / 798 messages = exactly 866,165 ms per message
    const exactIntervalFor8Days = 866165; 

    // CHANGE 'exactIntervalFor8Days' to '1000' in the line below if you want to test it visually at 1 second per increment
    const timerId = setInterval(() => {
      setStats(prev => {
        if (prev.pending <= 0) {
          clearInterval(timerId);
          return prev;
        }

        // 90% chance to be successfully sent, 10% chance to fail
        const isSuccess = Math.random() > 0.1;

        return {
          ...prev,
          sent: isSuccess ? prev.sent + 1 : prev.sent,
          failed: !isSuccess ? prev.failed + 1 : prev.failed,
          pending: prev.pending - 1,
        };
      });

      setLastUpdated(new Date());
    }, exactIntervalFor8Days); 

    // Remove loading state artificially after 1 second
    setTimeout(() => setIsInitialLoad(false), 1000);

    return () => clearInterval(timerId);
  }, []);

  const progressPercent = stats.total === 0 ? 0 : ((stats.sent + stats.failed) / stats.total) * 100

  return (
    <div className="min-h-screen font-sans p-4 sm:p-6 lg:p-10 flex flex-col relative selection:bg-blue-200 text-[#1D1D1F]">
      <AmbientBackground />

      {/* HEADER */}
      <header className="max-w-[1400px] mx-auto w-full flex flex-col md:flex-row md:items-end justify-between gap-5 sm:gap-6 mb-8 sm:mb-12 z-10 relative">
        <div className="flex items-center gap-4 sm:gap-5">
          <div className="w-[56px] h-[56px] sm:w-[70px] sm:h-[70px] bg-white/90 backdrop-blur-md rounded-[18px] sm:rounded-[22px] shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-white flex items-center justify-center overflow-hidden flex-shrink-0 ring-1 ring-black/5">
            <img src="/ssilogo.png" alt="SSI Logo" className="w-[85%] h-[85%] object-contain drop-shadow-sm" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-[26px] sm:text-[36px] font-black tracking-tight text-[#1D1D1F] leading-none mb-1.5 sm:mb-2 drop-shadow-sm">
              SSI Messenger Dashboard
            </h1>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2 bg-white/60 backdrop-blur-xl border border-white/80 px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full shadow-sm ring-1 ring-[#34C759]/20">
                <div className="relative flex items-center justify-center w-2.5 h-2.5 sm:w-3 sm:h-3">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-[#34C759] opacity-40 animate-ping"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-[#34C759] shadow-[0_0_8px_#34C759]"></span>
                </div>
                <span className="text-[10px] sm:text-[12px] font-extrabold text-[#1D1D1F] uppercase tracking-wider">Live Stream</span>
              </div>
              <p className="text-[#86868B] font-semibold text-[11px] sm:text-[13px] flex items-center gap-1.5">
                <LuServer size={14} className="text-[#AF52DE] hidden sm:block" /> Online database
              </p>
            </div>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center justify-between w-full md:w-auto gap-3 sm:gap-4 bg-white/80 backdrop-blur-3xl p-2 sm:p-3 rounded-[20px] sm:rounded-[24px] shadow-[0_8px_20px_rgba(0,0,0,0.04)] border border-white ring-1 ring-black/5">
          <div className="text-[#1D1D1F] font-bold text-[13px] sm:text-[15px] px-2 sm:px-3">
            Batch_Local_01
          </div>
          <div className="h-6 sm:h-8 w-[1px] bg-gray-200"></div>
          <div className="px-2 sm:px-3 flex items-center justify-center gap-2 text-[11px] sm:text-[13px] font-bold text-[#86868B] w-[90px] sm:w-[130px] whitespace-nowrap">
            {isInitialLoad ? (
              <LuRefreshCw className="animate-spin text-[#007AFF]" size={14}/>
            ) : (
              <span className="font-mono tabular-nums flex items-center gap-1.5 sm:gap-2">
                <LuClock size={12} className="sm:w-[14px] sm:h-[14px]"/>
                {lastUpdated.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* DASHBOARD CONTENT */}
      <main className="max-w-[1400px] mx-auto w-full grid grid-cols-1 xl:grid-cols-12 gap-6 sm:gap-8 flex-1 z-10 relative">
        
        {/* LEFT COLUMN - PROGRESS RING */}
        <div className="xl:col-span-4 flex flex-col h-full gap-6 sm:gap-8">
          <GlassCard delay={0.1} className="p-6 sm:p-10 flex flex-col items-center justify-center flex-1">
             <div className="w-full flex justify-between items-center mb-8 sm:mb-12 border-b border-gray-200/50 pb-4 sm:pb-5">
               <h2 className="text-[18px] sm:text-[22px] font-extrabold text-[#1D1D1F] tracking-tight">Campaign Overview</h2>
               <div className="p-1.5 sm:p-2 bg-[#007AFF]/10 rounded-full text-[#007AFF]">
                 <LuTrendingUp size={20} className="sm:w-[22px] sm:h-[22px]"/>
               </div>
             </div>
             
             <CircularProgress percentage={progressPercent} color="#007AFF" />
             
             <div className="w-full grid grid-cols-2 gap-4 sm:gap-5 mt-10 sm:mt-14">
               <div className="bg-[#F5F5F7]/80 backdrop-blur-md p-4 sm:p-5 rounded-[20px] sm:rounded-[24px] text-center border border-white shadow-inner flex flex-col items-center justify-center">
                 <p className="text-[24px] sm:text-[32px] font-black text-[#1D1D1F] leading-none mb-1">{stats.sent + stats.failed}</p>
                 <p className="text-[10px] sm:text-[12px] font-bold text-[#86868B] uppercase tracking-wider">Processed</p>
               </div>
               <div className="bg-[#F5F5F7]/80 backdrop-blur-md p-4 sm:p-5 rounded-[20px] sm:rounded-[24px] text-center border border-white shadow-inner flex flex-col items-center justify-center">
                 <p className="text-[24px] sm:text-[32px] font-black text-[#1D1D1F] leading-none mb-1">{stats.total}</p>
                 <p className="text-[10px] sm:text-[12px] font-bold text-[#86868B] uppercase tracking-wider">Total Pool</p>
               </div>
             </div>
          </GlassCard>
        </div>

        {/* RIGHT COLUMN - STAT CARDS */}
        <div className="xl:col-span-8 flex flex-col gap-6 sm:gap-8 h-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8 h-full">
            <AppleStatCard delay={0.2} icon={LuClock} label="Pending Queue" value={stats.pending} iconColor="text-[#FF9500]" iconBg="bg-gradient-to-br from-[#FF9500]/20 to-[#FFCC00]/10" />
            <AppleStatCard delay={0.3} icon={LuCheck} label="Delivered" value={stats.sent} iconColor="text-[#34C759]" iconBg="bg-gradient-to-br from-[#34C759]/20 to-[#30D158]/10" />
            <AppleStatCard delay={0.4} icon={LuX} label="Failed / Invalid" value={stats.failed} iconColor="text-[#FF3B30]" iconBg="bg-gradient-to-br from-[#FF3B30]/20 to-[#FF6961]/10" />
          </div>
        </div>

      </main>
    </div>
  )
}