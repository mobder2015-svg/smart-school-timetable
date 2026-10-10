'use client';

import React, { useState, useEffect } from 'react';

const DAYS = [
  { id: 'sunday', name: 'الأحد' },
  { id: 'monday', name: 'الإثنين' },
  { id: 'tuesday', name: 'الثلاثاء' },
  { id: 'wednesday', name: 'الأربعاء' },
  { id: 'thursday', name: 'الخميس' },
];

interface Period {
  id: string;
  periodNumber: number;
  periodName: string;
  subject: string;
  time: string;
  teacher: string;
  room: string;
}

interface SchoolRecord {
  id: string;
  schoolName: string;
  governorate: string;
  directorate: string;
  lastUpdated: string;
  periodsCount: number;
}

const createDefaultDayPeriods = (): Period[] => [
  { id: '1', periodNumber: 1, periodName: 'الدرس الأول', subject: '', time: '08:00 - 08:45', teacher: '', room: '' },
  { id: '2', periodNumber: 2, periodName: 'الدرس الثاني', subject: '', time: '08:45 - 09:30', teacher: '', room: '' },
  { id: '3', periodNumber: 3, periodName: 'الدرس الثالث', subject: '', time: '09:45 - 10:30', teacher: '', room: '' },
  { id: '4', periodNumber: 4, periodName: 'الدرس الرابع', subject: '', time: '10:30 - 11:15', teacher: '', room: '' },
  { id: '5', periodNumber: 5, periodName: 'الدرس الخامس', subject: '', time: '11:30 - 12:15', teacher: '', room: '' },
  { id: '6', periodNumber: 6, periodName: 'الدرس السادس', subject: '', time: '12:15 - 13:00', teacher: '', room: '' },
];

export default function SmartSchoolTimetable() {
  const [currentView, setCurrentView] = useState<'login' | 'editor' | 'dashboard' | 'student' | 'super-admin'>('login');
  
  const [governorate, setGovernorate] = useState('ميسان');
  const [directorate, setDirectorate] = useState('مديرية تربية ميسان');
  const [schoolName, setSchoolName] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [superAdminPass, setSuperAdminPass] = useState('');
  const [isSuperAuthenticated, setIsSuperAuthenticated] = useState(false);
  const [registeredSchools, setRegisteredSchools] = useState<SchoolRecord[]>([]);

  const [selectedDay, setSelectedDay] = useState('sunday');
  
  // حالة الساعة الحية
  const [currentTime, setCurrentTime] = useState<string>('');

  // حالة الإعلان والتعديل
  const [announcement, setAnnouncement] = useState('يرجى الالتزام بالزي المدرسي والمواعيد المعتمدة خلال أسبوع الامتحانات الرسمية.');
  const [isEditingAnnouncement, setIsEditingAnnouncement] = useState(false);
  const [tempAnnouncement, setTempAnnouncement] = useState('');

  const [schedule, setSchedule] = useState<Record<string, Period[]>>({
    sunday: createDefaultDayPeriods(),
    monday: createDefaultDayPeriods(),
    tuesday: createDefaultDayPeriods(),
    wednesday: createDefaultDayPeriods(),
    thursday: createDefaultDayPeriods(),
  });

  useEffect(() => {
    // تفعيل الساعة الحية وتحديثها كل ثانية
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);

    const savedAdmin = localStorage.getItem('isAdminAuthenticated');
    const savedSchoolName = localStorage.getItem('currentSchoolName');
    const schoolsList = localStorage.getItem('globalRegisteredSchools');
    
    if (schoolsList) {
      try {
        setRegisteredSchools(JSON.parse(schoolsList));
      } catch (e) {
        console.error(e);
      }
    }

    if (savedAdmin === 'true' && savedSchoolName) {
      setSchoolName(savedSchoolName);
      
      const schoolScheduleKey = `schedule_${savedSchoolName}`;
      const savedSchedule = localStorage.getItem(schoolScheduleKey);
      const savedAnnouncement = localStorage.getItem(`announcement_${savedSchoolName}`);

      if (savedAnnouncement) {
        setAnnouncement(savedAnnouncement);
      }

      if (savedSchedule) {
        try {
          const parsed = JSON.parse(savedSchedule);
          const normalized: Record<string, Period[]> = {};
          DAYS.forEach(day => {
            if (parsed[day.id] && Array.isArray(parsed[day.id])) {
              normalized[day.id] = parsed[day.id];
            } else {
              normalized[day.id] = createDefaultDayPeriods();
            }
          });
          setSchedule(normalized);
        } catch (e) {
          console.error(e);
        }
      }
      setCurrentView('dashboard');
    }

    return () => clearInterval(timer);
  }, []);

  const handleSchoolLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolName.trim() || !password.trim()) {
      setLoginError('يرجى إدخال اسم المدرسة وكلمة المرور');
      return;
    }
    
    localStorage.setItem('isAdminAuthenticated', 'true');
    localStorage.setItem('currentSchoolName', schoolName);

    const schoolScheduleKey = `schedule_${schoolName}`;
    const savedSchedule = localStorage.getItem(schoolScheduleKey);
    const savedAnnouncement = localStorage.getItem(`announcement_${schoolName}`);

    if (savedAnnouncement) {
      setAnnouncement(savedAnnouncement);
    }

    let currentSchedule = schedule;
    if (savedSchedule) {
      try {
        const parsed = JSON.parse(savedSchedule);
        const normalized: Record<string, Period[]> = {};
        DAYS.forEach(day => {
          if (parsed[day.id] && Array.isArray(parsed[day.id])) {
            normalized[day.id] = parsed[day.id];
          } else {
            normalized[day.id] = createDefaultDayPeriods();
          }
        });
        currentSchedule = normalized;
        setSchedule(currentSchedule);
      } catch (e) {
        console.error(e);
      }
    }

    const totalPeriods = Object.values(currentSchedule).reduce(
      (acc, dayPeriods) => acc + dayPeriods.filter(p => p.subject.trim() !== '').length, 0
    );

    const newSchoolRecord: SchoolRecord = {
      id: schoolName.toLowerCase().replace(/\s+/g, '-'),
      schoolName,
      governorate,
      directorate,
      lastUpdated: new Date().toLocaleDateString('ar-IQ'),
      periodsCount: totalPeriods,
    };

    const existingSchools: SchoolRecord[] = JSON.parse(localStorage.getItem('globalRegisteredSchools') || '[]');
    const filtered = existingSchools.filter(s => s.schoolName !== schoolName);
    const updatedSchoolsList = [newSchoolRecord, ...filtered];
    
    setRegisteredSchools(updatedSchoolsList);
    localStorage.setItem('globalRegisteredSchools', JSON.stringify(updatedSchoolsList));
    setLoginError('');
    setCurrentView('dashboard');
  };

  const handleSaveAnnouncement = () => {
    if (!tempAnnouncement.trim()) return;
    setAnnouncement(tempAnnouncement);
    localStorage.setItem(`announcement_${schoolName}`, tempAnnouncement);
    setIsEditingAnnouncement(false);
  };

  const handlePeriodFieldChange = (dayId: string, periodId: string, field: keyof Period, value: string) => {
    const updatedDayPeriods = schedule[dayId].map(p => {
      if (p.id === periodId) {
        return { ...p, [field]: value };
      }
      return p;
    });

    setSchedule({
      ...schedule,
      [dayId]: updatedDayPeriods,
    });
  };

  const handleSaveFullSchedule = () => {
    const schoolScheduleKey = `schedule_${schoolName}`;
    localStorage.setItem(schoolScheduleKey, JSON.stringify(schedule));

    const totalPeriods = Object.values(schedule).reduce(
      (acc, dayPeriods) => acc + dayPeriods.filter(p => p.subject.trim() !== '').length, 0
    );

    const existingSchools: SchoolRecord[] = JSON.parse(localStorage.getItem('globalRegisteredSchools') || '[]');
    const updatedSchoolsList = existingSchools.map(s => {
      if (s.schoolName === schoolName) {
        return { ...s, periodsCount: totalPeriods, lastUpdated: new Date().toLocaleDateString('ar-IQ') };
      }
      return s;
    });
    setRegisteredSchools(updatedSchoolsList);
    localStorage.setItem('globalRegisteredSchools', JSON.stringify(updatedSchoolsList));

    setCurrentView('dashboard');
  };

  const handleClearDay = (dayId: string) => {
    if (confirm(`هل أنت متأكد من رغبتك في تفريغ جدول يوم ${DAYS.find(d => d.id === dayId)?.name}؟`)) {
      setSchedule({
        ...schedule,
        [dayId]: createDefaultDayPeriods(),
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    localStorage.removeItem('currentSchoolName');
    setCurrentView('login');
  };

  const handleSuperAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (superAdminPass === 'admin123') {
      setIsSuperAuthenticated(true);
    } else {
      alert('كلمة مرور الأدمن العام غير صحيحة!');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-slate-100 p-4 sm:p-6 font-sans" dir="rtl">
      
      {/* 1. تسجيل دخول المدرسة */}
      {currentView === 'login' && (
        <div className="max-w-md mx-auto mt-10 bg-slate-900/85 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl shadow-inner">
              🏫
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">بوابة إدارة المدرسة الآمنة</h1>
            <p className="text-sm text-slate-400">سجل دخولك لإنشاء وتعديل جدول الحصص الأسبوعي</p>
          </div>

          <form onSubmit={handleSchoolLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-amber-400 mb-1">📍 المحافظة</label>
              <select 
                value={governorate} 
                onChange={(e) => setGovernorate(e.target.value)}
                className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="ميسان">ميسان</option>
                <option value="بغداد">بغداد</option>
                <option value="البصرة">البصرة</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">🏫 مديرية التربية</label>
              <input 
                type="text" 
                value={directorate} 
                onChange={(e) => setDirectorate(e.target.value)}
                className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                placeholder="مديرية تربية ميسان"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-rose-400 mb-1">🏷️ اسم المدرسة</label>
              <input 
                type="text" 
                value={schoolName} 
                onChange={(e) => setSchoolName(e.target.value)}
                className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                placeholder="مثال: اعدادية اليمامة للبنين"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-amber-400 mb-1">🔑 كلمة المرور السرية</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                placeholder="أدخل كلمة المرور"
                required
              />
            </div>

            {loginError && <p className="text-xs text-rose-500 text-center">{loginError}</p>}

            <button 
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-medium py-3.5 rounded-xl shadow-lg transition"
            >
              تسجيل الدخول والبدء 🚀
            </button>
          </form>

          <div className="mt-6 text-center pt-4 border-t border-slate-800">
            <button onClick={() => setCurrentView('super-admin')} className="text-xs text-amber-400 hover:underline font-semibold">
              ⭐ دخول لوحة تحكم الأدمن العام
            </button>
          </div>
        </div>
      )}

      {/* 2. واجهة المدرسة الرئيسية (Dashboard) مع الساعة الجدارية */}
      {currentView === 'dashboard' && (
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full">لوحة تحكم المدرسة النشطة</span>
              <h1 className="text-2xl font-bold text-white mt-2">{schoolName}</h1>
              <p className="text-xs text-slate-400">{governorate} - {directorate}</p>
            </div>

            {/* الساعة الجدارية الرقمية الحية في الشريط العلوي */}
            <div className="bg-slate-950/90 border border-indigo-500/30 px-5 py-2.5 rounded-2xl shadow-inner flex items-center gap-3">
              <span className="text-xl">⏰</span>
              <div className="text-left" dir="ltr">
                <div className="text-base font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">
                  {currentTime || '00:00:00'}
                </div>
                <div className="text-[10px] text-slate-400 text-center uppercase tracking-widest">
                  Live Clock
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap w-full sm:w-auto">
              <button 
                onClick={() => setCurrentView('editor')}
                className="flex-1 sm:flex-none bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md transition flex items-center justify-center gap-1.5"
              >
                <span>✏️</span> تعديل الجدول الأسبوعي
              </button>
              <button 
                onClick={() => setCurrentView('student')}
                className="flex-1 sm:flex-none bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 px-4 py-2.5 rounded-xl text-xs font-medium hover:bg-emerald-600/35 transition"
              >
                🎓 معاينة واجهة الطالب
              </button>
              <button 
                onClick={handleLogout}
                className="bg-rose-600/20 border border-rose-500/30 text-rose-400 px-3.5 py-2.5 rounded-xl text-xs font-medium hover:bg-rose-600/35 transition"
              >
                خروج
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* الشريط الجانبي الأيمن: حالة الدوام */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
                  <h3 className="text-sm font-bold text-white">حالة الدوام الحالية</h3>
                </div>

                <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 text-center space-y-2">
                  <span className="text-xs text-slate-400">الدرس القائم الآن 🔔</span>
                  <h4 className="text-base font-black text-amber-400">
                    {schedule[selectedDay]?.[0]?.subject || 'الدرس الأول'}
                  </h4>
                  <span className="text-[11px] bg-indigo-500/10 text-indigo-400 px-2.5 py-1 rounded-lg inline-block">
                    ⏰ {schedule[selectedDay]?.[0]?.time || '08:00 - 08:45'}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/80 flex items-center justify-between">
                    <span className="text-slate-400">إجمالي حصص اليوم:</span>
                    <span className="font-bold text-white">6 دروس</span>
                  </div>
                  <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/80 flex items-center justify-between">
                    <span className="text-slate-400">الحصص المملوءة:</span>
                    <span className="font-bold text-emerald-400">
                      {schedule[selectedDay]?.filter(p => p.subject.trim() !== '').length || 0} حصة
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* العمود الأوسط: جدول الحصص */}
            <div className="lg:col-span-2 space-y-5">
              <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <h2 className="text-lg font-bold text-white">📅 جدول الحصص الأسبوعي</h2>
                    <p className="text-xs text-slate-400 mt-0.5">الجدول المعتمد المعروض للطلبة</p>
                  </div>
                  <button 
                    onClick={() => setCurrentView('editor')}
                    className="text-xs text-indigo-400 hover:underline bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-2 rounded-xl"
                  >
                    تعديل الجدول ⚙️
                  </button>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2">
                  {DAYS.map((day) => (
                    <button
                      key={day.id}
                      onClick={() => setSelectedDay(day.id)}
                      className={`flex-1 min-w-[75px] py-2.5 px-3 rounded-xl text-xs font-semibold text-center transition ${
                        selectedDay === day.id 
                          ? 'bg-indigo-600 text-white shadow-md' 
                          : 'bg-slate-950 text-slate-400 border border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      {day.name}
                    </button>
                  ))}
                </div>

                <div className="space-y-3.5 pt-2">
                  {schedule[selectedDay]?.map((period) => (
                    <div key={period.id} className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-md">
                      <div className="grid grid-cols-3 items-center border-b border-slate-800/90 pb-2.5">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xs font-extrabold shadow-md">
                            0{period.periodNumber}
                          </span>
                          <h3 className="text-xs font-bold text-slate-400">{period.periodName}</h3>
                        </div>
                        
                        <div className="text-center">
                          <span className="text-base sm:text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-white tracking-wide">
                            {period.subject || 'حصة فراغ'}
                          </span>
                        </div>

                        <div></div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                        <div className="bg-slate-900 border border-slate-800/80 px-3 py-2 rounded-xl text-slate-300 flex items-center gap-2">
                          <span>⏰</span> <span className="text-slate-400">الوقت:</span> <span className="font-bold text-white">{period.time || '---'}</span>
                        </div>
                        <div className="bg-slate-900 border border-slate-800/80 px-3 py-2 rounded-xl text-slate-300 flex items-center gap-2">
                          <span>👨‍🏫</span> <span className="text-slate-400">المدرس:</span> <span className="font-bold text-white">{period.teacher || '---'}</span>
                        </div>
                        <div className="bg-slate-900 border border-slate-800/80 px-3 py-2 rounded-xl text-slate-300 flex items-center gap-2">
                          <span>🚪</span> <span className="text-slate-400">القاعة:</span> <span className="font-bold text-white">{period.room || '---'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* الشريط الجانبي الأيسر: الشاشة التلفزيونية */}
            <div className="lg:col-span-1 space-y-4">
              
              <div className="relative bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 border-4 border-slate-700/80 rounded-3xl p-3 shadow-2xl shadow-indigo-950/50 group">
                
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 via-indigo-500/20 to-amber-500/20 rounded-3xl blur-md opacity-70 group-hover:opacity-100 transition duration-500"></div>

                <div className="relative bg-slate-950 rounded-2xl overflow-hidden border border-slate-800/90 shadow-inner flex flex-col justify-between min-h-[300px]">
                  
                  <div className="bg-slate-900/95 border-b border-slate-800 px-3 py-2.5 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                      <span className="text-[9px] font-bold tracking-wider text-rose-400 uppercase">LIVE</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[9px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-1.5 py-0.5 rounded font-mono">4K</span>
                      {!isEditingAnnouncement && (
                        <button 
                          onClick={() => {
                            setTempAnnouncement(announcement);
                            setIsEditingAnnouncement(true);
                          }}
                          className="text-[10px] text-amber-400 hover:text-white bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded transition font-medium"
                        >
                          تعديل ✏️
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-center relative">
                    
                    <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-indigo-500/5 pointer-events-none"></div>

                    {isEditingAnnouncement ? (
                      <div className="space-y-3 z-10 py-1">
                        <textarea 
                          value={tempAnnouncement} 
                          onChange={(e) => setTempAnnouncement(e.target.value)}
                          rows={4}
                          className="w-full bg-slate-900/95 border border-amber-500/40 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-400 font-sans"
                          placeholder="اكتب التنبيه أو الإعلان المدرسي هنا..."
                        />
                        <div className="flex gap-2">
                          <button 
                            onClick={handleSaveAnnouncement}
                            className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold py-1.5 rounded-lg text-xs transition shadow-md"
                          >
                            بث الإعلان 📡
                          </button>
                          <button 
                            onClick={() => setIsEditingAnnouncement(false)}
                            className="bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg text-xs transition"
                          >
                            إلغاء
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2.5 text-center z-10 py-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-amber-400/20 to-amber-600/10 border border-amber-500/30 rounded-xl flex items-center justify-center mx-auto text-lg text-amber-300 shadow-inner">
                          📢
                        </div>
                        <h4 className="text-[11px] font-bold text-amber-400 tracking-wide uppercase">إعلان المدرسة الرسمي</h4>
                        <p className="text-xs font-medium text-slate-200 leading-relaxed bg-slate-900/90 border border-slate-800 p-3 rounded-xl shadow-sm">
                          "{announcement}"
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="bg-slate-900 border-t border-slate-800 px-3 py-2 text-[10px] text-slate-300 flex items-center gap-2">
                    <span className="bg-amber-500 text-slate-950 font-extrabold px-1.5 py-0.5 rounded text-[9px] shrink-0">تنبيه</span>
                    <p className="font-medium text-amber-200/90 truncate">
                      {announcement}
                    </p>
                  </div>

                </div>

                <div className="w-20 h-1.5 bg-gradient-to-r from-slate-700 via-slate-500 to-slate-700 mx-auto rounded-b-md shadow-md mt-1"></div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-2">
                <button 
                  onClick={() => window.print()}
                  className="w-full bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 py-2.5 rounded-xl text-xs font-medium transition flex items-center justify-center gap-2"
                >
                  <span>🖨️</span> طباعة الجدول
                </button>
                <button 
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      navigator.clipboard.writeText(window.location.href);
                      alert('تم نسخ رابط جدول المدرسة بنجاح!');
                    }
                  }}
                  className="w-full bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 py-2.5 rounded-xl text-xs font-medium transition flex items-center justify-center gap-2"
                >
                  <span>🔗</span> مشاركة رابط الجدول
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* 3. شاشة تعديل الجدول الأسبوعي (Editor) */}
      {currentView === 'editor' && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white">✏️ محرر الجدول الأسبوعي</h1>
              <p className="text-xs text-slate-400 mt-0.5">اختر اليوم، املأ الحصص الـ 6، ثم اضغط حفظ الجدول لينتقل تلقائياً للواجهة</p>
            </div>
            <button 
              onClick={() => setCurrentView('dashboard')}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2.5 rounded-xl border border-slate-700"
            >
              إلغاء والعودة ↩️
            </button>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-xs font-semibold text-slate-300">اختر اليوم لتعديل حصصه:</h2>
              <button 
                onClick={() => handleClearDay(selectedDay)}
                className="text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-xl text-xs hover:bg-rose-500/20 transition"
              >
                🗑️ تفريغ جدول هذا اليوم
              </button>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {DAYS.map((day) => (
                <button
                  key={day.id}
                  onClick={() => setSelectedDay(day.id)}
                  className={`flex-1 min-w-[85px] py-3 px-3 rounded-xl text-xs font-bold text-center transition ${
                    selectedDay === day.id 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/40' 
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  {day.name}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <span>📝</span> تعبئة حصص يوم <span className="text-indigo-400">{DAYS.find(d => d.id === selectedDay)?.name}</span>
            </h2>

            <div className="space-y-4">
              {schedule[selectedDay]?.map((period) => (
                <div key={period.id} className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3 shadow-inner">
                  <div className="flex items-center gap-2.5 border-b border-slate-800/80 pb-2">
                    <span className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center text-xs font-extrabold">
                      0{period.periodNumber}
                    </span>
                    <h3 className="text-sm font-bold text-white">{period.periodName}</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">اسم المادة</label>
                      <input 
                        type="text" 
                        value={period.subject} 
                        onChange={(e) => handlePeriodFieldChange(selectedDay, period.id, 'subject', e.target.value)}
                        placeholder="مثال: رياضيات" 
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500" 
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">الوقت</label>
                      <input 
                        type="text" 
                        value={period.time} 
                        onChange={(e) => handlePeriodFieldChange(selectedDay, period.id, 'time', e.target.value)}
                        placeholder="08:00 - 08:45" 
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500" 
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">اسم الأستاذ</label>
                      <input 
                        type="text" 
                        value={period.teacher} 
                        onChange={(e) => handlePeriodFieldChange(selectedDay, period.id, 'teacher', e.target.value)}
                        placeholder="أ. علي" 
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500" 
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">رقم القاعة</label>
                      <input 
                        type="text" 
                        value={period.room} 
                        onChange={(e) => handlePeriodFieldChange(selectedDay, period.id, 'room', e.target.value)}
                        placeholder="5" 
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500" 
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <button 
                onClick={handleSaveFullSchedule}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-4 rounded-2xl shadow-xl shadow-emerald-600/30 transition flex items-center justify-center gap-2 text-sm"
              >
                <span>💾</span> حفظ الجدول بالكامل والانتقال إلى واجهة المدرسة الرئيسية ✨
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. لوحة تحكم الأدمن العام */}
      {currentView === 'super-admin' && (
        <div className="max-w-2xl mx-auto space-y-6">
          {!isSuperAuthenticated ? (
            <div className="bg-slate-900/90 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto mb-3 text-3xl">
                  👑
                </div>
                <h1 className="text-2xl font-bold text-white mb-1">لوحة تحكم الأدمن العام</h1>
                <p className="text-xs text-slate-400">كلمة المرور الافتراضية: admin123</p>
              </div>

              <form onSubmit={handleSuperAdminLogin} className="space-y-4">
                <input 
                  type="password" 
                  value={superAdminPass} 
                  onChange={(e) => setSuperAdminPass(e.target.value)}
                  placeholder="أدخل كلمة مرور الأدمن العام" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500"
                  required
                />
                <button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 rounded-xl transition shadow-lg">
                  دخول لوحة الأدمن العام 🚀
                </button>
              </form>

              <div className="mt-4 text-center">
                <button onClick={() => setCurrentView('login')} className="text-xs text-slate-400 hover:underline">
                  ⬅️ العودة لبوابة تسجيل الدخول
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl flex items-center justify-between">
                <div>
                  <span className="text-xs bg-amber-500/10 border border-amber-500/20 text-amber-400 px-3 py-1 rounded-full">الإحصائيات العامة للمنصة</span>
                  <h1 className="text-2xl font-bold text-white mt-2">إدارة المدارس المسجلة</h1>
                </div>
                <button onClick={() => setIsSuperAuthenticated(false)} className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-2 rounded-xl border border-slate-700">
                  قفل اللوحة 🔒
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 text-center">
                  <span className="text-2xl font-extrabold text-amber-400">{registeredSchools.length}</span>
                  <p className="text-xs text-slate-400 mt-1">إجمالي المدارس المسجلة 🏫</p>
                </div>
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 text-center">
                  <span className="text-2xl font-extrabold text-emerald-400">نشط 🟢</span>
                  <p className="text-xs text-slate-400 mt-1">حالة السيرفر والمنصة</p>
                </div>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl">
                <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <span>📋</span> قائمة المدارس المنضمة للمنصة:
                </h2>

                {registeredSchools.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-8">لم تقم أي مدرسة بتسجيل الدخول وإنشاء جدولها حتى الآن.</p>
                ) : (
                  <div className="space-y-3">
                    {registeredSchools.map((school) => (
                      <div key={school.id} className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div>
                          <h3 className="text-sm font-bold text-white">{school.schoolName}</h3>
                          <p className="text-xs text-slate-400 mt-0.5">📍 {school.governorate} - {school.directorate}</p>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-2.5 py-1 rounded-xl">
                            {school.periodsCount} حصة مسجلة
                          </span>
                          <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded-xl">
                            {school.lastUpdated}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="text-center">
                <button onClick={() => setCurrentView('login')} className="text-xs text-slate-400 hover:text-white underline">
                  ⬅️ العودة للصفحة الرئيسية
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. واجهة الطالب */}
      {currentView === 'student' && (
        <div className="max-w-md mx-auto space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 text-center shadow-xl">
            <div className="inline-block bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs px-3 py-1 rounded-full mb-3 font-medium">بوابة الطالب الرسمية ✨</div>
            <h1 className="text-xl font-bold text-white mb-1">{schoolName || 'المدرسة'}</h1>
            <p className="text-xs text-slate-400 mb-4">الجدول الدراسي الرسمي المعتمد</p>
            <button onClick={() => window.print()} className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium py-2.5 rounded-xl border border-slate-700">🖨️ طباعة الجدول</button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {DAYS.map((day) => (
              <button
                key={day.id}
                onClick={() => setSelectedDay(day.id)}
                className={`flex-1 min-w-[75px] py-2.5 px-3 rounded-2xl text-xs font-semibold text-center transition ${
                  selectedDay === day.id ? 'bg-emerald-500 text-slate-950 shadow-lg' : 'bg-slate-900/80 text-slate-400 border border-slate-800'
                }`}
              >
                {day.name}
              </button>
            ))}
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-4 shadow-xl">
            <div className="flex items-center justify-between mb-4 px-1">
              <span className="text-sm font-bold text-white">جدول يوم: {DAYS.find(d => d.id === selectedDay)?.name}</span>
              <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-xl">
                {schedule[selectedDay]?.filter(p => p.subject.trim() !== '').length || 0} دروس
              </span>
            </div>

            <div className="space-y-3">
              {schedule[selectedDay]?.map((period) => (
                <div key={period.id} className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-2.5 shadow-inner">
                  <div className="grid grid-cols-3 items-center border-b border-slate-800 pb-2">
                    <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-lg w-fit">{period.periodName}</span>
                    <div className="text-center">
                      <span className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-white">
                        {period.subject || 'حصة فراغ'}
                      </span>
                    </div>
                    <div></div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 pt-1">
                    <div className="bg-slate-900 p-2 rounded-xl">⏰ {period.time || '---'}</div>
                    <div className="bg-slate-900 p-2 rounded-xl">👨‍🏫 {period.teacher || '---'}</div>
                  </div>
                  <div className="flex items-center justify-between bg-slate-900/40 px-3 py-1.5 rounded-xl text-xs text-slate-400">
                    <span>🚪 القاعة:</span>
                    <span className="font-semibold text-white">{period.room || '---'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center pt-2">
            <button onClick={() => setCurrentView('dashboard')} className="text-xs text-slate-400 hover:text-white underline">⚙️ العودة لواجهة المدرسة</button>
          </div>
        </div>
      )}

    </main>
  );
}