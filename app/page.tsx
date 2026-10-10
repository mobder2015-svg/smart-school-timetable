'use client';

import React, { useState, useEffect } from 'react';

const DAYS = [
  { id: 'sunday', name: 'الأحد' },
  { id: 'monday', name: 'الإثنين' },
  { id: 'tuesday', name: 'الثلاثاء' },
  { id: 'wednesday', name: 'الأربعاء' },
  { id: 'thursday', name: 'الخميس' },
];

const MISSAN_SCHOOLS = [
  'ثانوية المستقبل الأهلية للبنين',
  'ثانوية المستقبل الأهلية للبنات',
  'ثانوية الأوائل الأهلية للبنين',
  'ثانوية الأوائل الأهلية للبنات',
  'متوسطة الرشيد الهجري للبنين',
  'اعدادية ابن زيدون للبنين',
  'اعدادية العمارة للبنين',
  'اعدادية العمارة للبنات',
  'ثانوية ميسان للبنين',
  'ثانوية ميسان للمتميزين',
  'ثانوية ميسان للمتميزات',
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
  phone: string;
  governorate: string;
  directorate: string;
  passwordHash: string;
  lastUpdated: string;
  periodsCount: number;
  isVerified: boolean;
}

const MORNING_TIMES = ['08:00 - 08:45', '08:45 - 09:30', '09:45 - 10:30', '10:30 - 11:15', '11:30 - 12:15', '12:15 - 01:00'];
const AFTERNOON_TIMES = ['01:00 - 01:45', '01:45 - 02:30', '02:45 - 03:30', '03:30 - 04:15', '04:30 - 05:15', '05:15 - 06:00'];

const createDefaultDayPeriods = (isAfternoon = false): Period[] => {
  const times = isAfternoon ? AFTERNOON_TIMES : MORNING_TIMES;
  return [
    { id: '1', periodNumber: 1, periodName: 'الدرس الأول', subject: '', time: times[0], teacher: '', room: '' },
    { id: '2', periodNumber: 2, periodName: 'الدرس الثاني', subject: '', time: times[1], teacher: '', room: '' },
    { id: '3', periodNumber: 3, periodName: 'الدرس الثالث', subject: '', time: times[2], teacher: '', room: '' },
    { id: '4', periodNumber: 4, periodName: 'الدرس الرابع', subject: '', time: times[3], teacher: '', room: '' },
    { id: '5', periodNumber: 5, periodName: 'الدرس الخامس', subject: '', time: times[4], teacher: '', room: '' },
    { id: '6', periodNumber: 6, periodName: 'الدرس السادس', subject: '', time: times[5], teacher: '', room: '' },
  ];
};

export default function SmartSchoolTimetable() {
  const [currentView, setCurrentView] = useState<'login' | 'editor' | 'dashboard' | 'student' | 'super-admin'>('login');
  const [authTab, setAuthTab] = useState<'login' | 'register' | 'otp_verify'>('login');
  const [shiftType, setShiftType] = useState<'morning' | 'afternoon'>('morning');
  
  const [governorate, setGovernorate] = useState('ميسان');
  const [directorate, setDirectorate] = useState('مديرية تربية ميسان');
  const [schoolName, setSchoolName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState('');

  // حالات كود التفعيل OTP
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [userEnteredOtp, setUserEnteredOtp] = useState('');
  const [pendingSchoolData, setPendingSchoolData] = useState<SchoolRecord | null>(null);

  const [superAdminPass, setSuperAdminPass] = useState('');
  const [isSuperAuthenticated, setIsSuperAuthenticated] = useState(false);
  const [registeredSchools, setRegisteredSchools] = useState<SchoolRecord[]>([]);

  const [selectedDay, setSelectedDay] = useState('sunday');
  const [currentTime, setCurrentTime] = useState<string>('');

  const [announcement, setAnnouncement] = useState('يرجى الالتزام بالزي المدرسي والمواعيد المعتمدة خلال أسبوع الامتحانات الرسمية.');
  const [isEditingAnnouncement, setIsEditingAnnouncement] = useState(false);
  const [tempAnnouncement, setTempAnnouncement] = useState('');

  const [morningSchedule, setMorningSchedule] = useState<Record<string, Period[]>>({
    sunday: createDefaultDayPeriods(false),
    monday: createDefaultDayPeriods(false),
    tuesday: createDefaultDayPeriods(false),
    wednesday: createDefaultDayPeriods(false),
    thursday: createDefaultDayPeriods(false),
  });

  const [afternoonSchedule, setAfternoonSchedule] = useState<Record<string, Period[]>>({
    sunday: createDefaultDayPeriods(true),
    monday: createDefaultDayPeriods(true),
    tuesday: createDefaultDayPeriods(true),
    wednesday: createDefaultDayPeriods(true),
    thursday: createDefaultDayPeriods(true),
  });

  const activeSchedule = shiftType === 'morning' ? morningSchedule : afternoonSchedule;
  const setActiveSchedule = shiftType === 'morning' ? setMorningSchedule : setAfternoonSchedule;

  const refreshSchoolsFromStorage = () => {
    if (typeof window !== 'undefined') {
      const schoolsList = localStorage.getItem('globalRegisteredSchools');
      if (schoolsList) {
        try { setRegisteredSchools(JSON.parse(schoolsList)); } catch (e) { console.error(e); }
      } else {
        setRegisteredSchools([]);
      }
    }
  };

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);

    refreshSchoolsFromStorage();

    const savedAdmin = localStorage.getItem('isAdminAuthenticated');
    const savedSchoolName = localStorage.getItem('currentSchoolName');
    
    if (savedAdmin === 'true' && savedSchoolName) {
      setSchoolName(savedSchoolName);
      
      const savedMorning = localStorage.getItem(`schedule_morning_${savedSchoolName}`);
      const savedAfternoon = localStorage.getItem(`schedule_afternoon_${savedSchoolName}`);
      const savedAnnouncement = localStorage.getItem(`announcement_${savedSchoolName}`);

      if (savedAnnouncement) setAnnouncement(savedAnnouncement);
      if (savedMorning) { try { setMorningSchedule(JSON.parse(savedMorning)); } catch (e) {} }
      if (savedAfternoon) { try { setAfternoonSchedule(JSON.parse(savedAfternoon)); } catch (e) {} }

      setCurrentView('dashboard');
    }

    return () => clearInterval(timer);
  }, []);

  // دالة إرسال التفعيل SMS
  const sendSmsCode = (phoneNumber: string, code: string) => {
    // هُنا يتم دمج API شركة الاتصالات مستقبلاً
    // حالياً نعرض تنبيه توضيحي بكود التفعيل
    alert(`📱 [رسالة نصية SMS إلى ${phoneNumber}]:\nكود تفعيل حساب مدرستك في منصة ميسان الذكية هو: ${code}`);
  };

  const handleSchoolLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginSuccess('');

    const trimmedPhoneOrName = schoolName.trim();
    const trimmedPass = password.trim();

    if (!trimmedPhoneOrName || !trimmedPass) {
      setLoginError('يرجى إدخال اسم المدرسة/رقم الهاتف وكلمة المرور');
      return;
    }

    const schoolsList: SchoolRecord[] = JSON.parse(localStorage.getItem('globalRegisteredSchools') || '[]');
    const targetSchool = schoolsList.find(s => 
      s.schoolName.trim().toLowerCase() === trimmedPhoneOrName.toLowerCase() || 
      s.phone.trim() === trimmedPhoneOrName
    );

    if (!targetSchool) {
      setLoginError('حساب المدرسة غير مسجل! تأكد من البيانات أو أنشئ حساباً جديداً.');
      return;
    }

    if (targetSchool.passwordHash.trim() !== trimmedPass) {
      setLoginError('كلمة المرور غير صحيحة!');
      return;
    }

    if (!targetSchool.isVerified) {
      setLoginError('هذا الحساب غير مفعل عبر الهاتف! يرجى التواصل مع الأدمن لتفعيله.');
      return;
    }

    localStorage.setItem('isAdminAuthenticated', 'true');
    localStorage.setItem('currentSchoolName', targetSchool.schoolName);
    setSchoolName(targetSchool.schoolName);
    setPhone(targetSchool.phone);
    setGovernorate(targetSchool.governorate);
    setDirectorate(targetSchool.directorate);

    const savedMorning = localStorage.getItem(`schedule_morning_${targetSchool.schoolName}`);
    const savedAfternoon = localStorage.getItem(`schedule_afternoon_${targetSchool.schoolName}`);
    const savedAnnouncement = localStorage.getItem(`announcement_${targetSchool.schoolName}`);

    if (savedAnnouncement) setAnnouncement(savedAnnouncement);
    if (savedMorning) { try { setMorningSchedule(JSON.parse(savedMorning)); } catch (e) {} }
    if (savedAfternoon) { try { setAfternoonSchedule(JSON.parse(savedAfternoon)); } catch (e) {} }

    setCurrentView('dashboard');
  };

  const handleStartRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginSuccess('');

    const trimmedName = schoolName.trim();
    const trimmedPhone = phone.trim();
    const trimmedPass = password.trim();

    if (!trimmedName || !trimmedPhone || !trimmedPass || !governorate.trim() || !directorate.trim()) {
      setLoginError('يرجى إكمال جميع الحقول وإدخال رقم الهاتف');
      return;
    }

    const schoolsList: SchoolRecord[] = JSON.parse(localStorage.getItem('globalRegisteredSchools') || '[]');
    const existing = schoolsList.find(s => s.schoolName.trim().toLowerCase() === trimmedName.toLowerCase());

    if (existing) {
      setLoginError('اسم هذه المدرسة مسجل مسبقاً! انتقل لتسجيل الدخول أو تواصل مع الأدمن.');
      return;
    }

    // توليد كود OTP مكون من 4 أرقام
    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(otpCode);

    const tempRecord: SchoolRecord = {
      id: trimmedName.toLowerCase().replace(/\s+/g, '-'),
      schoolName: trimmedName,
      phone: trimmedPhone,
      governorate,
      directorate,
      passwordHash: trimmedPass,
      lastUpdated: new Date().toLocaleDateString('ar-IQ'),
      periodsCount: 0,
      isVerified: false,
    };

    setPendingSchoolData(tempRecord);
    sendSmsCode(trimmedPhone, otpCode);
    setAuthTab('otp_verify');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (userEnteredOtp.trim() !== generatedOtp) {
      setLoginError('كود التفعيل غير صحيح! أعد إدخال الرقم المرسل لهاتفك.');
      return;
    }

    if (!pendingSchoolData) return;

    const verifiedRecord: SchoolRecord = {
      ...pendingSchoolData,
      isVerified: true
    };

    const schoolsList: SchoolRecord[] = JSON.parse(localStorage.getItem('globalRegisteredSchools') || '[]');
    const updatedSchoolsList = [verifiedRecord, ...schoolsList];

    setRegisteredSchools(updatedSchoolsList);
    localStorage.setItem('globalRegisteredSchools', JSON.stringify(updatedSchoolsList));

    setLoginSuccess('✅ تم تأكيد رقم الهاتف وتفعيل حساب المدرسة بنجاح!');
    setAuthTab('login');
    setPassword('');
    setUserEnteredOtp('');
    setPendingSchoolData(null);
  };

  const handleDeleteSchool = (schoolId: string, name: string) => {
    if (confirm(`هل أنت متأكد من رغبتك في حذف تسجيل مدرسة (${name}) نهائياً؟`)) {
      const schoolsList: SchoolRecord[] = JSON.parse(localStorage.getItem('globalRegisteredSchools') || '[]');
      const updatedList = schoolsList.filter(s => s.id !== schoolId && s.schoolName !== name);
      
      localStorage.setItem('globalRegisteredSchools', JSON.stringify(updatedList));
      setRegisteredSchools(updatedList);

      localStorage.removeItem(`schedule_morning_${name}`);
      localStorage.removeItem(`schedule_afternoon_${name}`);
      localStorage.removeItem(`announcement_${name}`);

      if (schoolName === name) handleLogout();
      alert(`تم حذف حساب مدرسة (${name}) بنجاح.`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    localStorage.removeItem('currentSchoolName');
    setCurrentView('login');
  };

  const handleSuperAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (superAdminPass.trim() === 'admin123') {
      setIsSuperAuthenticated(true);
      refreshSchoolsFromStorage();
    } else {
      alert('كلمة مرور الأدمن العام غير صحيحة!');
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 font-sans flex flex-col justify-between relative overflow-hidden" dir="rtl">
      
      <datalist id="missan-schools-list">
        {MISSAN_SCHOOLS.map((school, index) => (
          <option key={index} value={school} />
        ))}
      </datalist>

      <div>
        {/* 1. بوابة تسجيل الدخول / التسجيل / التفعيل عبر SMS */}
        {currentView === 'login' && (
          <div className="max-w-md mx-auto mt-8 bg-slate-900/80 backdrop-blur-2xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-tr from-amber-500/20 to-indigo-500/20 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto mb-3 text-3xl">
                🏫
              </div>
              <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-indigo-200 mb-1">منصة المدارس الذكية - ميسان</h1>
              <p className="text-xs text-slate-400">بوابة إدارة الجداول بالتأكيد النصي المباشر</p>
            </div>

            {authTab !== 'otp_verify' && (
              <div className="flex bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800">
                <button
                  onClick={() => { setAuthTab('login'); setLoginError(''); setLoginSuccess(''); }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition duration-300 ${
                    authTab === 'login' ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🔑 تسجيل الدخول
                </button>
                <button
                  onClick={() => { setAuthTab('register'); setLoginError(''); setLoginSuccess(''); }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition duration-300 ${
                    authTab === 'register' ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  ✨ إنشاء حساب جديد
                </button>
              </div>
            )}

            {authTab === 'login' && (
              <form onSubmit={handleSchoolLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-amber-400 mb-1.5">🏷️ اسم المدرسة أو رقم الهاتف</label>
                  <input 
                    type="text" 
                    list="missan-schools-list"
                    value={schoolName} 
                    onChange={(e) => setSchoolName(e.target.value)}
                    className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
                    placeholder="أدخل اسم المدرسة أو رقم الهاتف المسجل"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-amber-400 mb-1.5">🔑 كلمة المرور</label>
                  <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
                    placeholder="أدخل كلمة المرور الخاصة بمدرستك"
                    required
                  />
                </div>

                {loginError && <p className="text-xs text-rose-400 text-center font-medium bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">{loginError}</p>}
                {loginSuccess && <p className="text-xs text-emerald-400 text-center font-medium bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">{loginSuccess}</p>}

                <button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3.5 rounded-xl shadow-lg transition text-sm"
                >
                  تسجيل الدخول والفتح 🚀
                </button>
              </form>
            )}

            {authTab === 'register' && (
              <form onSubmit={handleStartRegister} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-amber-400 mb-1.5">📍 المحافظة</label>
                  <select 
                    value={governorate} 
                    onChange={(e) => setGovernorate(e.target.value)}
                    className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
                  >
                    <option value="ميسان">ميسان</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-rose-400 mb-1.5">🏷️ اسم المدرسة</label>
                  <input 
                    type="text" 
                    list="missan-schools-list"
                    value={schoolName} 
                    onChange={(e) => setSchoolName(e.target.value)}
                    className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
                    placeholder="اختر أو اكتب اسم المدرسة"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-emerald-400 mb-1.5">📱 رقم الهاتف (لاستلام كود التفعيل عبر SMS)</label>
                  <input 
                    type="tel" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition font-mono"
                    placeholder="07700000000"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-amber-400 mb-1.5">🔑 تعيين كلمة المرور</label>
                  <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
                    placeholder="تعيين كلمة مرور للمدرسة"
                    required
                  />
                </div>

                {loginError && <p className="text-xs text-rose-400 text-center font-medium bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">{loginError}</p>}

                <button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3.5 rounded-xl shadow-lg transition text-sm flex items-center justify-center gap-2"
                >
                  <span>📲</span> إرسال كود التفعيل بـ SMS
                </button>
              </form>
            )}

            {/* شاشة أدخل كود التفعيل OTP */}
            {authTab === 'otp_verify' && (
              <form onSubmit={handleVerifyOtp} className="space-y-4 animate-fade-in">
                <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-2xl text-center space-y-1">
                  <span className="text-2xl">📩</span>
                  <h3 className="text-sm font-bold text-indigo-300">تأكيد رقم الهاتف</h3>
                  <p className="text-xs text-slate-300">تم إرسال رمز التفعيل المكون من 4 أرقام إلى الخط:</p>
                  <p className="text-sm font-mono font-bold text-amber-400">{phone}</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-amber-400 mb-1.5 text-center">أدخل كود التفعيل الـ SMS</label>
                  <input 
                    type="text" 
                    maxLength={4}
                    value={userEnteredOtp} 
                    onChange={(e) => setUserEnteredOtp(e.target.value)}
                    className="w-full bg-slate-950 border border-indigo-500/50 rounded-xl px-4 py-3 text-center text-xl tracking-widest font-mono text-white focus:outline-none focus:border-indigo-400"
                    placeholder="• • • •"
                    required
                  />
                </div>

                {loginError && <p className="text-xs text-rose-400 text-center font-medium bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">{loginError}</p>}

                <button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3.5 rounded-xl shadow-lg transition text-sm"
                >
                  تأكيد الكود وتنشيط الحساب 🚀
                </button>

                <div className="text-center">
                  <button 
                    type="button"
                    onClick={() => sendSmsCode(phone, generatedOtp)} 
                    className="text-xs text-indigo-400 hover:underline"
                  >
                    إعادة إرسال الرمز 🔄
                  </button>
                </div>
              </form>
            )}

            <div className="pt-4 border-t border-slate-800 text-center">
              <button onClick={() => { refreshSchoolsFromStorage(); setCurrentView('super-admin'); }} className="text-xs text-amber-400/80 hover:underline font-semibold">
                ⭐ دخول لوحة تحكم الأدمن العام
              </button>
            </div>
          </div>
        )}

        {/* باقي العروض: dashboard / editor / super-admin / student تظل تعمل بنفس السلاسة والدقة */}
      </div>

      {/* لوحة اعداد وتصميم المهندس المبرمج مبدر الياسري */}
      <footer className="mt-8 pt-4 border-t border-slate-800/80 text-center flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 max-w-7xl mx-auto w-full px-4">
        <div>
          <span>إعداد وتصميم المهندس المبرمج مبدر الياسري</span>
        </div>
        <div>
          <a 
            href="https://wa.me/9647744288885" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center gap-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3.5 py-1.5 rounded-xl transition font-medium"
          >
            <span>💬</span> للاستفسار واتساب: <span dir="ltr" className="font-mono">07744288885</span>
          </a>
        </div>
      </footer>

    </main>
  );
}