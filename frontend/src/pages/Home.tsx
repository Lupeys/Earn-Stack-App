import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// --- SVG Icons ---
const CheckCircleIcon = ({ className = 'w-5 h-5 text-[#4A8B71]' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
  </svg>
);

const HourglassIcon = () => (
  <svg className="w-8 h-8 text-[#4A8B71]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2M6 2h12M6 22h12M8 2v4a4 4 0 008 0V2M8 22v-4a4 4 0 018 0v4" />
  </svg>
);

const NavIconTasks = ({ active }: { active: boolean }) => (
  <svg className={`w-6 h-6 mb-1 ${active ? 'text-[#64B594]' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
  </svg>
);

const NavIconEarn = ({ active }: { active: boolean }) => (
  <svg className={`w-6 h-6 mb-1 ${active ? 'text-[#64B594]' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const NavIconEarnings = ({ active }: { active: boolean }) => (
  <svg className={`w-6 h-6 mb-1 ${active ? 'text-[#64B594]' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const NavIconCashOut = ({ active }: { active: boolean }) => (
  <svg className={`w-6 h-6 mb-1 ${active ? 'text-[#64B594]' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

export default function Home() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'tasks' | 'earn' | 'earnings' | 'cashout'>('tasks');
  const [notifyEmail, setNotifyEmail] = useState('');
  const [notifySubmitted, setNotifySubmitted] = useState(false);
  const [notifyError, setNotifyError] = useState('');

  const balance = user?.balance ?? 0;
  const canCashOut = balance >= 5;

  function handleTabNav(tab: 'tasks' | 'earn' | 'earnings' | 'cashout') {
    setActiveTab(tab);
    if (!user) { navigate('/login'); return; }
    if (tab === 'earn') navigate('/earn');
    if (tab === 'earnings') navigate('/earnings');
    if (tab === 'cashout') navigate('/payout');
  }

  function handleNotifySubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!notifyEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(notifyEmail)) {
      setNotifyError('Please enter a valid email address.');
      return;
    }
    setNotifyError('');
    setNotifySubmitted(true);
  }

  const avatarInitial = user?.email?.[0]?.toUpperCase() ?? 'G';

  return (
    <div className="min-h-screen bg-[#111A16] flex justify-center selection:bg-[#4A8B71]/30">
      <div className="w-full max-w-[420px] bg-[#F4F6F4] relative shadow-2xl overflow-hidden flex flex-col font-sans min-h-screen">

        {/* Deep green gradient header background */}
        <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-[#103D2E] via-[#144A37] to-[#F4F6F4] z-0 pointer-events-none" />

        {/* Header */}
        <header className="relative z-10 flex justify-between items-center px-6 pt-12 pb-4">
          <h1 className="text-2xl font-semibold tracking-tight text-white">EarnStack</h1>
          <div className="relative">
            {user ? (
              <>
                <button
                  onClick={logout}
                  className="w-10 h-10 rounded-full bg-[#4A8B71] flex items-center justify-center text-white font-bold text-base border-2 border-[#1B2A23]"
                  aria-label="Logged in — tap to sign out"
                  title="Sign out"
                >
                  {avatarInitial}
                </button>
                <span className="absolute top-0 -right-0.5 w-3.5 h-3.5 bg-[#4ADE80] border-2 border-[#103D2E] rounded-full" />
              </>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="text-sm font-semibold text-[#64B594] border border-[#4A8B71] rounded-full px-4 py-1.5 hover:bg-[#4A8B71]/10 transition-colors"
              >
                Sign in
              </button>
            )}
          </div>
        </header>

        {/* Balance Card */}
        <section className="relative z-10 px-5 mb-8">
          <div className="bg-[#1C2822] rounded-[24px] p-6 shadow-xl text-white">
            <p className="text-[#899C94] text-sm mb-1 font-medium tracking-wide">Available Cash Balance</p>
            <h2 className="text-[52px] leading-none font-bold tracking-tight mb-1 tabular-nums">
              ${balance.toFixed(2)}
            </h2>
            <p className="text-[#556860] text-xs mb-5">CAD · Reviewed within 1–2 business days</p>
            <div className="flex justify-between items-end">
              <div>
                {user && (
                  <span className="inline-flex items-center gap-1 bg-[#4A8B71]/20 text-[#64B594] text-xs font-semibold px-3 py-1 rounded-full">
                    <CheckCircleIcon className="w-3.5 h-3.5 text-[#64B594]" />
                    Verified
                  </span>
                )}
                <p className="text-[#556860] text-xs mt-2">Min. payout $5.00 CAD</p>
              </div>
              {canCashOut ? (
                <button
                  onClick={() => navigate('/payout')}
                  className="rounded-full border border-[#4A8B71] text-[#64B594] px-5 py-2 text-sm font-semibold hover:bg-[#4A8B71]/10 active:scale-95 transition-all"
                >
                  Cash Out →
                </button>
              ) : (
                <button
                  disabled
                  className="rounded-full border border-[#2E4A3E] text-[#3D5A4E] px-5 py-2 text-sm font-semibold cursor-not-allowed"
                  title="Minimum $5.00 CAD required to cash out"
                >
                  Cash Out
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto pb-32 z-10 relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

          {/* Today's Tasks */}
          <section className="mb-8">
            <div className="flex justify-between items-center px-6 mb-4">
              <h3 className="text-[22px] font-bold tracking-tight text-[#111A16]">Today's Tasks</h3>
              {user && (
                <button
                  onClick={() => navigate('/tasks')}
                  className="text-[#3F7A63] text-[15px] font-semibold hover:opacity-80"
                >
                  View all →
                </button>
              )}
            </div>

            {/* Horizontal scroll task cards */}
            <div className="flex overflow-x-auto gap-4 px-6 pb-4 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

              {/* Pre-launch placeholder card */}
              <div className="bg-white rounded-[24px] p-5 min-w-[200px] shadow-sm shrink-0 snap-start border border-[#E8ECE9] flex flex-col items-center justify-center text-center gap-3">
                <HourglassIcon />
                <p className="text-[15px] font-semibold text-[#111A16] leading-snug">Sponsor tasks<br/>coming soon</p>
                <p className="text-[13px] text-[#718078] leading-snug">Get notified when<br/>tasks go live</p>
              </div>

              {/* Earn page card */}
              <div className="bg-white rounded-[24px] p-5 min-w-[170px] shadow-sm shrink-0 snap-start border border-[#E8ECE9]">
                <span className="inline-block bg-[#F2F5F3] text-[#46534E] px-3 py-1.5 rounded-full text-[13px] font-semibold mb-4 tracking-tight">
                  Live Now
                </span>
                <h4 className="text-[17px] font-bold text-[#111A16] leading-snug mb-6 max-w-[120px]">
                  Offerwall<br/>Surveys
                </h4>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-[#3F7A63] font-bold text-base tracking-tight">Varies</span>
                  <button
                    onClick={() => user ? navigate('/earn') : navigate('/login')}
                    className="bg-[#3F7A63] text-white rounded-full px-4 py-1.5 text-sm font-semibold hover:bg-[#346652] transition-colors active:scale-95"
                  >
                    Earn →
                  </button>
                </div>
              </div>

            </div>
          </section>

          {/* Notify form (pre-launch) */}
          {!notifySubmitted ? (
            <section className="px-6 mb-8">
              <div className="bg-white rounded-[20px] border border-[#E8ECE9] p-5 shadow-sm">
                <p className="text-[15px] font-semibold text-[#111A16] mb-1">Get notified when tasks launch</p>
                <p className="text-[13px] text-[#718078] mb-4">We'll email you when sponsor-funded tasks are ready.</p>
                <form onSubmit={handleNotifySubmit} className="flex gap-2">
                  <input
                    type="email"
                    value={notifyEmail}
                    onChange={e => { setNotifyEmail(e.target.value); setNotifyError(''); }}
                    placeholder="your@email.com"
                    className="flex-1 rounded-full border border-[#DDE6E1] bg-[#F4F6F4] px-4 py-2 text-sm text-[#111A16] placeholder:text-[#9AADA6] focus:outline-none focus:ring-2 focus:ring-[#4A8B71]/40"
                  />
                  <button
                    type="submit"
                    className="bg-[#3F7A63] text-white rounded-full px-4 py-2 text-sm font-semibold hover:bg-[#346652] transition-colors active:scale-95"
                  >
                    Notify me
                  </button>
                </form>
                {notifyError && <p className="text-[#A36A2B] text-xs mt-2 pl-1">{notifyError}</p>}
              </div>
            </section>
          ) : (
            <section className="px-6 mb-8">
              <div className="bg-white rounded-[20px] border border-[#E8ECE9] p-5 shadow-sm flex items-center gap-3">
                <CheckCircleIcon className="w-5 h-5 text-[#3E7A43] shrink-0" />
                <p className="text-[14px] text-[#111A16]">You're on the list — we'll email you when tasks go live.</p>
              </div>
            </section>
          )}

          {/* How it works */}
          <section className="px-6 mb-10">
            <h3 className="text-[22px] font-bold tracking-tight text-[#111A16] mb-5">How it works</h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col">
                <div className="w-6 h-6 rounded-full border border-[#3F7A63] flex items-center justify-center text-[#3F7A63] text-xs font-bold mb-3">1</div>
                <h4 className="text-[15px] font-semibold text-[#111A16] leading-tight mb-1">Complete tasks</h4>
                <p className="text-[13px] text-[#718078] leading-snug">Submit proof for each sponsor-funded task</p>
              </div>
              <div className="flex flex-col">
                <div className="w-6 h-6 rounded-full border border-[#3F7A63] flex items-center justify-center text-[#3F7A63] text-xs font-bold mb-3">2</div>
                <h4 className="text-[15px] font-semibold text-[#111A16] leading-tight mb-1">Get verified</h4>
                <p className="text-[13px] text-[#718078] leading-snug">Manual review keeps payouts fair and secure</p>
              </div>
              <div className="flex flex-col">
                <div className="w-6 h-6 rounded-full border border-[#3F7A63] flex items-center justify-center text-[#3F7A63] text-xs font-bold mb-3">3</div>
                <h4 className="text-[15px] font-semibold text-[#111A16] leading-tight mb-1">Cash out</h4>
                <p className="text-[13px] text-[#718078] leading-snug">PayPal payout once your balance reaches $5 CAD</p>
              </div>
            </div>
          </section>

          {/* Recent activity */}
          <section className="px-6 mb-4">
            <h3 className="text-[22px] font-bold tracking-tight text-[#111A16] mb-5">Recent</h3>
            {user ? (
              <div className="space-y-1">
                <p className="text-[14px] text-[#718078]">Your completed tasks and earnings will appear here.</p>
                <button
                  onClick={() => navigate('/earnings')}
                  className="text-[#3F7A63] text-[14px] font-semibold hover:opacity-80 mt-2 block"
                >
                  View earnings ledger →
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Blurred placeholder rows — no fake names or amounts */}
                {[1, 2].map(i => (
                  <div key={i} className="flex items-center justify-between blur-[3px] select-none pointer-events-none" aria-hidden="true">
                    <div className="flex items-center gap-4">
                      <div className="w-[46px] h-[46px] rounded-full bg-[#DDE6E1]" />
                      <div className="space-y-1.5">
                        <div className="h-3 w-28 bg-[#DDE6E1] rounded-full" />
                        <div className="h-3 w-20 bg-[#DDE6E1] rounded-full" />
                      </div>
                    </div>
                    <div className="h-3 w-12 bg-[#DDE6E1] rounded-full" />
                  </div>
                ))}
                <button
                  onClick={() => navigate('/register')}
                  className="w-full mt-4 rounded-full bg-[#3F7A63] text-white py-3 text-sm font-semibold hover:bg-[#346652] transition-colors active:scale-95"
                >
                  Create a free account →
                </button>
              </div>
            )}
          </section>

        </div>

        {/* Bottom Navigation */}
        <nav className="absolute bottom-0 left-0 w-full bg-[#1C2822] rounded-t-[32px] px-8 pt-4 pb-8 z-50">
          <div className="flex justify-between items-center relative">

            {activeTab === 'tasks'    && <div className="absolute top-[-16px] left-[6%]  w-[12%] h-[3px] bg-[#64B594] rounded-full" />}
            {activeTab === 'earn'     && <div className="absolute top-[-16px] left-[32%] w-[12%] h-[3px] bg-[#64B594] rounded-full" />}
            {activeTab === 'earnings' && <div className="absolute top-[-16px] left-[58%] w-[12%] h-[3px] bg-[#64B594] rounded-full" />}
            {activeTab === 'cashout'  && <div className="absolute top-[-16px] left-[84%] w-[12%] h-[3px] bg-[#64B594] rounded-full" />}

            <button onClick={() => handleTabNav('tasks')} className="flex flex-col items-center gap-1 w-16">
              <NavIconTasks active={activeTab === 'tasks'} />
              <span className={`text-[11px] font-semibold tracking-wide ${activeTab === 'tasks' ? 'text-[#64B594]' : 'text-[#899C94]'}`}>Tasks</span>
            </button>

            <button onClick={() => handleTabNav('earn')} className="flex flex-col items-center gap-1 w-16">
              <NavIconEarn active={activeTab === 'earn'} />
              <span className={`text-[11px] font-semibold tracking-wide ${activeTab === 'earn' ? 'text-[#64B594]' : 'text-[#899C94]'}`}>Earn</span>
            </button>

            <button onClick={() => handleTabNav('earnings')} className="flex flex-col items-center gap-1 w-16">
              <NavIconEarnings active={activeTab === 'earnings'} />
              <span className={`text-[11px] font-semibold tracking-wide ${activeTab === 'earnings' ? 'text-[#64B594]' : 'text-[#899C94]'}`}>Earnings</span>
            </button>

            <button onClick={() => handleTabNav('cashout')} className="flex flex-col items-center gap-1 w-16">
              <NavIconCashOut active={activeTab === 'cashout'} />
              <span className={`text-[11px] font-semibold tracking-wide ${activeTab === 'cashout' ? 'text-[#64B594]' : 'text-[#899C94]'}`}>Cash Out</span>
            </button>

          </div>
          <div className="w-1/3 h-1 bg-white/20 rounded-full mx-auto mt-6" />
        </nav>

      </div>
    </div>
  );
}
