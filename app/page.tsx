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
  'ثانوية صدى العلوم الأهلية للبنين',
  'ثانوية صدى العلوم الأهلية للبنات',
  'ثانوية العمارة الحديثة الأهلية للبنين',
  'ثانوية العمارة الحديثة الأهلية للبنات',
  'ثانوية الفراهيدي الأهلية للبنين',
  'ثانوية قلعة العلوم الأهلية للبنين',
  'ثانوية قلعة العلوم الأهلية للبنات',
  'مدارس الزهراء الأهلية النموذجية',
  'مدارس وارث الأهلية',
  'متوسطة الرشيد الهجري للبنين',
  'اعدادية ابن زيدون للبنين',
  'اعدادية العمارة للبنين',
  'اعدادية العمارة للبنات',
  'اعدادية الارشاد للبنين',
  'اعدادية الاعتدال للبنين',
  'اعدادية الاندلس للبنين',
  'اعدادية البصائر للبنات',
  'اعدادية البيان للبنين',
  'اعدادية الزوراء للبنات',
  'اعدادية الساجدين للبنين',
  'اعدادية السراج للبنين',
  'اعدادية الشهيد محمد باقر عامر للبنين',
  'اعدادية الطيبات للبنات',
  'اعدادية بطلة كربلاء للبنات',
  'اعدادية بنت الهدى للبنات',
  'اعدادية جعفر النقدي للبنين',
  'اعدادية حسان بن ثابت للبنين',
  'اعدادية كميت للبنات',
  'اعدادية كميت للبنين',
  'اعدادية مهد الحضارات للبنين',
  'اعدادية ميثم التمار للبنين',
  'اعدادية النباهة للبنين',
  'اعدادية جنة الخلد للبنات',
  'اعدادية رفيدة الأنصارية للبنات',
  'ثانوية ميسان للبنين',
  'ثانوية ميسان للمتميزين',
  'ثانوية ميسان للمتميزات',
  'ثانوية أبو تراب ع للبنين',
  'ثانوية الاباء المختلطة',
  'ثانوية الاحسان للبنات',
  'ثانوية الارتقاء للبنات',
  'ثانوية الاطياب للبنين',
  'ثانوية الاقصى للبنات',
  'ثانوية الامال للبنات',
  'ثانوية البتول للبنات',
  'ثانوية السلام للبنين',
  'ثانوية الشهد للبنات',
  'ثانوية الشهيد باسم المختلطة',
  'ثانوية الشهيد حسين حبيب عريبي المختلطة',
  'ثانوية الشهيد عبد الامير رسن حسن للبنات',
  'ثانوية الشهيد قاسم طارش للبنين',
  'ثانوية الشواهد للبنات',
  'ثانوية الشيخ الطوسي للبنين',
  'ثانوية الشيماء للبنات',
  'ثانوية الصفا للبنين',
  'ثانوية العالم عبد الجبار عبد الله للبنين',
  'ثانوية العدل للبنات',
  'ثانوية العذراء للبنات',
  'ثانوية العلياء للبنات',
  'ثانوية الغفران للبنات',
  'ثانوية الفرات للبنات',
  'ثانوية بني هاشم للبنين',
  'ثانوية بني هاشم للبنات',
  'ثانوية ثغر العراق للبنات',
  'ثانوية جابر بن حيان للبنين',
  'ثانوية جعفر الطيار للبنين',
  'ثانوية جنة الخلد للبنات',
  'ثانوية خولة للبنات',
  'ثانوية دجلة للبنين',
  'ثانوية ذات الصواري للبنين',
  'ثانوية رتاج الكعبة للبنات',
  'ثانوية رقية بنت الحسين ع للبنات',
  'ثانوية سيد احمد الرفاعي للبنين',
  'ثانوية سيناء للبنات',
  'ثانوية صدى الطف للبنين',
  'ثانوية ضياء الصالحين للبنين',
  'ثانوية عبق ميسان',
  'ثانوية عطاء الإسلام للبنين',
  'ثانوية علي الشرقي للبنين',
  'ثانوية علي الغربي للبنات',
  'ثانوية علي الغربي للبنين',
  'ثانوية غرناطة للبنات',
  'ثانوية قبضة الهدى للبنات',
  'ثانوية قلعة صالح للبنات',
  'ثانوية قلعة صالح للبنين',
  'ثانوية الميمونة للبنات',
  'ثانوية مروج الذهب للبنات',
  'متوسطة سما ميسان للبنات',
  'متوسطة المجر الكبير للبنات',
  'متوسطة ام البنين للبنات',
  'متوسطة امنة بنت وهب للبنات',
  'متوسطة حي المعلمين للبنات',
  'متوسطة زينب الحوراء ع للبنات',
  'متوسطة السيدة لبابة للبنات',
  'متوسطة كنز المعرفة المختلطة',
  'متوسطة التراث العربي المختلطة',
  'متوسطة الكاظمية المختلطة',
  'متوسطة التآخي المسائية للبنين'
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
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  const [shiftType, setShiftType] = useState<'morning' | 'afternoon'>('morning');
  
  const [governorate, setGovernorate] = useState('ميسان');
  const [directorate, setDirectorate] = useState('مديرية تربية ميسان');
  const [schoolName, setSchoolName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState('');

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
        try {
          setRegisteredSchools(JSON.parse(schoolsList));
        } catch (e) {
          console.error(e);
        }
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

  const handleSchoolRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginSuccess('');

    const trimmedName = schoolName.trim();
    const trimmedPhone = phone.trim();
    const trimmedPass = password.trim();

    if (!trimmedName || !trimmedPhone || !trimmedPass || !governorate.trim() || !directorate.trim()) {
      setLoginError('يرجى إكمال جميع حقول التسجيل بضمنها رقم الهاتف');
      return;
    }

    const schoolsList: SchoolRecord[] = JSON.parse(localStorage.getItem('globalRegisteredSchools') || '[]');
    const existing = schoolsList.find(s => s.schoolName.trim().toLowerCase() === trimmedName.toLowerCase());

    if (existing) {
      setLoginError('اسم هذه المدرسة مسجل مسبقاً! إذا كنت صاحب المدرسة واجهت مشكلة تواصل مع الدعم.');
      return;
    }

    const newSchoolRecord: SchoolRecord = {
      id: trimmedName.toLowerCase().replace(/\s+/g, '-'),
      schoolName: trimmedName,
      phone: trimmedPhone,
      governorate,
      directorate,
      passwordHash: trimmedPass,
      lastUpdated: new Date().toLocaleDateString('ar-IQ'),
      periodsCount: 0,
    };

    const updatedSchoolsList = [newSchoolRecord, ...schoolsList];
    setRegisteredSchools(updatedSchoolsList);
    localStorage.setItem('globalRegisteredSchools', JSON.stringify(updatedSchoolsList));

    setLoginSuccess('تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول برقم الهاتف أو الاسم.');
    setAuthTab('login');
    setPassword('');
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

      if (schoolName === name) {
        handleLogout();
      }

      alert(`تم حذف حساب مدرسة (${name}) بنجاح.`);
    }
  };

  const handleResetPassword = (name: string) => {
    const newPass = prompt(`أدخل كلمة المرور الجديدة لمدرسة (${name}):`);
    if (newPass && newPass.trim() !== '') {
      const schoolsList: SchoolRecord[] = JSON.parse(localStorage.getItem('globalRegisteredSchools') || '[]');
      const updatedList = schoolsList.map(s => {
        if (s.schoolName === name) {
          return { ...s, passwordHash: newPass.trim() };
        }
        return s;
      });
      localStorage.setItem('globalRegisteredSchools', JSON.stringify(updatedList));
      setRegisteredSchools(updatedList);
      alert('تم تحديث كلمة المرور بنجاح!');
    }
  };

  const handleSaveAnnouncement = () => {
    if (!tempAnnouncement.trim()) return;
    setAnnouncement(tempAnnouncement);
    localStorage.setItem(`announcement_${schoolName}`, tempAnnouncement);
    setIsEditingAnnouncement(false);
  };

  const handlePeriodFieldChange = (dayId: string, periodId: string, field: keyof Period, value: string) => {
    const updatedDayPeriods = activeSchedule[dayId].map(p => {
      if (p.id === periodId) return { ...p, [field]: value };
      return p;
    });

    setActiveSchedule({
      ...activeSchedule,
      [dayId]: updatedDayPeriods,
    });
  };

  const handleSaveFullSchedule = () => {
    const key = `schedule_${shiftType}_${schoolName}`;
    localStorage.setItem(key, JSON.stringify(activeSchedule));

    const totalPeriods = Object.values(activeSchedule).reduce(
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
    if (confirm(`هل أنت متأكد من رغبتك في تفريغ جدول يوم ${DAYS.find(d => d.id === dayId)?.name} للدوام ${shiftType === 'morning' ? 'الصباحي' : 'الظهري'}؟`)) {
      setActiveSchedule({
        ...activeSchedule,
        [dayId]: createDefaultDayPeriods(shiftType === 'afternoon'),
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
    if (superAdminPass.trim() === 'admin123') {
      setIsSuperAuthenticated(true);
      refreshSchoolsFromStorage();
    } else {
      alert('كلمة مرور الأدمن العام غير صحيحة!');
    }
  };

  const filledCount = activeSchedule[selectedDay]?.filter(p => p.subject.trim() !== '').length || 0;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 font-sans flex flex-col justify-between relative overflow-hidden selection:bg-indigo-500 selection:text-white" dir="rtl">
      
      {/* خلفية تفاعلية مشعة */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-[128px] pointer-events-none -z-10 animate-pulse"></div>
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-[128px] pointer-events-none -z-10"></div>

      <datalist id="missan-schools-list">
        {MISSAN_SCHOOLS.map((school, index) => (
          <option key={index} value={school} />
        ))}
      </datalist>

      <div>
        {/* 1. تسجيل الدخول / إنشاء حساب جديد */}
        {currentView === 'login' && (
          <div className="max-w-md mx-auto mt-8 bg-slate-900/80 backdrop-blur-2xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-tr from-amber-500/20 to-indigo-500/20 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto mb-3 text-3xl shadow-inner">
                🏫
              </div>
              <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-indigo-200 mb-1">منصة المدارس الذكية - ميسان</h1>
              <p className="text-xs text-slate-400">بوابة إدارة الجداول الدراسية المركزية</p>
            </div>

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
              <form onSubmit={handleSchoolRegister} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-amber-400 mb-1.5">📍 المحافظة</label>
                  <select 
                    value={governorate} 
                    onChange={(e) => setGovernorate(e.target.value)}
                    className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
                  >
                    <option value="ميسان">ميسان</option>
                    <option value="بغداد">بغداد</option>
                    <option value="البصرة">البصرة</option>
                    <option value="ذي قار">ذي قار</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">🏫 مديرية التربية</label>
                  <input 
                    type="text" 
                    value={directorate} 
                    onChange={(e) => setDirectorate(e.target.value)}
                    className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
                    placeholder="مثال: مديرية تربية ميسان"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-rose-400 mb-1.5">🏷️ اختر أو اكتب اسم المدرسة</label>
                  <input 
                    type="text" 
                    list="missan-schools-list"
                    value={schoolName} 
                    onChange={(e) => setSchoolName(e.target.value)}
                    className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
                    placeholder="اختر من القائمة أو اكتب اسم المدرسة"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-emerald-400 mb-1.5">📱 رقم هاتف المسؤول (أساسي للتوثيق والاسترجاع)</label>
                  <input 
                    type="tel" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition font-mono"
                    placeholder="مثال: 07700000000"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-amber-400 mb-1.5">🔑 تعيين كلمة مرور جديدة</label>
                  <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
                    placeholder="تعيين كلمة مرور خاصة بالمدرسة"
                    required
                  />
                </div>

                {loginError && <p className="text-xs text-rose-400 text-center font-medium bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">{loginError}</p>}

                <button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3.5 rounded-xl shadow-lg transition text-sm"
                >
                  تأكيد وتسجيل المدرسة رسمياً 📝
                </button>
              </form>
            )}

            <div className="pt-4 border-t border-slate-800 text-center">
              <button onClick={() => { refreshSchoolsFromStorage(); setCurrentView('super-admin'); }} className="text-xs text-amber-400/80 hover:underline font-semibold">
                ⭐ دخول لوحة تحكم الأدمن العام
              </button>
            </div>
          </div>
        )}

        {/* 2. واجهة المدرسة الرئيسية (Dashboard) */}
        {currentView === 'dashboard' && (
          <div className="max-w-7xl mx-auto space-y-6">
            
            <div className="bg-slate-900/80 backdrop-blur-2xl border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full font-semibold">
                    ● لوحة تحكم المدرسة النشطة
                  </span>
                </div>
                <h1 className="text-2xl font-black text-white mt-2">{schoolName}</h1>
                <p className="text-xs text-slate-400">{governorate} - {directorate}</p>
              </div>

              {/* أزرار اختيار الدوام الصباحي أو الظهري */}
              <div className="bg-slate-950/90 border border-slate-800 p-1.5 rounded-2xl flex items-center gap-2 shadow-inner">
                <button
                  onClick={() => setShiftType('morning')}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                    shiftType === 'morning' 
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>☀️</span> الدوام الصباحي
                </button>
                <button
                  onClick={() => setShiftType('afternoon')}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                    shiftType === 'afternoon' 
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>🌙</span> الدوام الظهري (المسائي)
                </button>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap w-full md:w-auto">
                <button 
                  onClick={() => setCurrentView('editor')}
                  className="flex-1 md:flex-none bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-lg transition flex items-center justify-center gap-1.5"
                >
                  <span>✏️</span> تعديل الجدول
                </button>
                <button 
                  onClick={() => setCurrentView('student')}
                  className="flex-1 md:flex-none bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-2.5 rounded-xl text-xs font-medium hover:bg-emerald-500/20 transition"
                >
                  🎓 معاينة الطالب
                </button>
                <button 
                  onClick={handleLogout}
                  className="bg-rose-500/10 border border-rose-500/30 text-rose-400 px-3.5 py-2.5 rounded-xl text-xs font-medium hover:bg-rose-500/20 transition"
                >
                  خروج
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
              
              {/* العمود الجانبي الأيمن */}
              <div className="lg:col-span-1 space-y-4">
                <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                      <h3 className="text-xs font-bold text-white">
                        {shiftType === 'morning' ? '☀️ الحصص الصباحية' : '🌙 الحصص الظهرية'}
                      </h3>
                    </div>
                  </div>

                  <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 text-center space-y-2">
                    <span className="text-[11px] text-slate-400 font-medium">الدرس القائم الآن 🔔</span>
                    <h4 className="text-base font-black text-amber-400">
                      {activeSchedule[selectedDay]?.[0]?.subject || 'الدرس الأول'}
                    </h4>
                    <span className="text-[11px] bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-2.5 py-1 rounded-lg inline-block font-mono">
                      ⏰ {activeSchedule[selectedDay]?.[0]?.time || (shiftType === 'morning' ? '08:00 - 08:45' : '01:00 - 01:45')}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                      <span className="text-slate-400">إجمالي الحصص:</span>
                      <span className="font-bold text-white">6 دروس</span>
                    </div>
                    <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                      <span className="text-slate-400">الحصص المملوءة:</span>
                      <span className="font-bold text-emerald-400">{filledCount} حصة</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-950/50 via-slate-900 to-slate-950 border border-indigo-500/30 rounded-3xl p-5 shadow-xl text-center space-y-3">
                  <div className="w-10 h-10 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 flex items-center justify-center mx-auto text-xl">
                    💡
                  </div>
                  <h4 className="text-xs font-bold text-indigo-300">المنظومة الرقمية المدرسية</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    إدارة شاملة ومحدثة لجميع جداول ومواعيد الدوام الصباحي والظهري بدقة عالية.
                  </p>
                </div>
              </div>

              {/* العمود الأوسط - جدول الحصص */}
              <div className="lg:col-span-2 space-y-5">
                <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                      <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <span>📅</span> 
                        جدول الحصص - 
                        <span className={shiftType === 'morning' ? 'text-amber-400' : 'text-indigo-400'}>
                          {shiftType === 'morning' ? 'الدوام الصباحي' : 'الدوام الظهري'}
                        </span>
                      </h2>
                      <p className="text-xs text-slate-400 mt-0.5">جدول الحصص الأسبوعي المعروض للطلبة</p>
                    </div>
                    <button 
                      onClick={() => setCurrentView('editor')}
                      className="text-xs text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-2 rounded-xl transition"
                    >
                      تعديل ⚙️
                    </button>
                  </div>

                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {DAYS.map((day) => (
                      <button
                        key={day.id}
                        onClick={() => setSelectedDay(day.id)}
                        className={`flex-1 min-w-[75px] py-2.5 px-3 rounded-2xl text-xs font-bold text-center transition ${
                          selectedDay === day.id 
                            ? shiftType === 'morning' 
                              ? 'bg-amber-500 text-slate-950 shadow-md' 
                              : 'bg-indigo-600 text-white shadow-md'
                            : 'bg-slate-950/80 text-slate-400 border border-slate-800 hover:bg-slate-800'
                        }`}
                      >
                        {day.name}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-3.5 pt-2">
                    {activeSchedule[selectedDay]?.map((period) => {
                      const isFilled = period.subject.trim() !== '';
                      return (
                        <div key={period.id} className={`border rounded-2xl p-4 space-y-3 transition ${
                          isFilled 
                            ? 'bg-slate-950/80 border-slate-800 shadow-md' 
                            : 'bg-slate-950/30 border-slate-900 border-dashed text-slate-500'
                        }`}>
                          <div className="grid grid-cols-3 items-center border-b border-slate-800 pb-2.5">
                            <div className="flex items-center gap-3">
                              <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shadow-md ${
                                isFilled ? (shiftType === 'morning' ? 'bg-amber-500 text-slate-950' : 'bg-indigo-600 text-white') : 'bg-slate-800 text-slate-500'
                              }`}>
                                0{period.periodNumber}
                              </span>
                              <h3 className="text-xs font-bold text-slate-400">{period.periodName}</h3>
                            </div>
                            
                            <div className="text-center">
                              <span className={`text-base sm:text-lg font-black tracking-wide ${
                                isFilled 
                                  ? 'text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-white' 
                                  : 'text-slate-600 text-xs italic'
                              }`}>
                                {period.subject || 'حصة فراغ'}
                              </span>
                            </div>

                            <div></div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                            <div className="bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl text-slate-300 flex items-center gap-2">
                              <span>⏰</span> <span className="text-slate-400">الوقت:</span> <span className="font-bold text-white font-mono">{period.time || '---'}</span>
                            </div>
                            <div className="bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl text-slate-300 flex items-center gap-2">
                              <span>👨‍🏫</span> <span className="text-slate-400">المدرس:</span> <span className="font-bold text-white">{period.teacher || '---'}</span>
                            </div>
                            <div className="bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl text-slate-300 flex items-center gap-2">
                              <span>🚪</span> <span className="text-slate-400">القاعة:</span> <span className="font-bold text-white">{period.room || '---'}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* الشريط الجانبي الأيسر */}
              <div className="lg:col-span-1 space-y-4">
                <div className="relative bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 border-4 border-slate-700/80 rounded-3xl p-3 shadow-2xl shadow-indigo-950/50 group">
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

                <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-4 shadow-xl space-y-2">
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

        {/* 3. شاشة تعديل الجدول (Editor) */}
        {currentView === 'editor' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-5 shadow-xl flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>✏️</span> محرر الجدول - 
                  <span className={shiftType === 'morning' ? 'text-amber-400' : 'text-indigo-400'}>
                    {shiftType === 'morning' ? 'الدوام الصباحي' : 'الدوام الظهري'}
                  </span>
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">عدل المواعيد والحصص واضغط حفظ</p>
              </div>
              <button 
                onClick={() => setCurrentView('dashboard')}
                className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2.5 rounded-xl border border-slate-700 transition"
              >
                إلغاء والعودة ↩️
              </button>
            </div>

            <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h2 className="text-xs font-semibold text-slate-300">اختر اليوم لتعديل حصصه:</h2>
                <button 
                  onClick={() => handleClearDay(selectedDay)}
                  className="text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-xl text-xs hover:bg-rose-500/20 transition"
                >
                  🗑️ تفريغ هذا اليوم
                </button>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {DAYS.map((day) => (
                  <button
                    key={day.id}
                    onClick={() => setSelectedDay(day.id)}
                    className={`flex-1 min-w-[85px] py-3 px-3 rounded-xl text-xs font-bold text-center transition ${
                      selectedDay === day.id 
                        ? shiftType === 'morning'
                          ? 'bg-amber-500 text-slate-950 shadow-lg'
                          : 'bg-indigo-600 text-white shadow-lg'
                        : 'bg-slate-950 text-slate-400 border border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    {day.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <span>📝</span> حصص يوم <span className="text-indigo-400">{DAYS.find(d => d.id === selectedDay)?.name}</span>
              </h2>

              <div className="space-y-4">
                {activeSchedule[selectedDay]?.map((period) => (
                  <div key={period.id} className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3 shadow-inner">
                    <div className="flex items-center gap-2.5 border-b border-slate-800 pb-2">
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
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition" 
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-slate-400 mb-1">الوقت</label>
                        <input 
                          type="text" 
                          value={period.time} 
                          onChange={(e) => handlePeriodFieldChange(selectedDay, period.id, 'time', e.target.value)}
                          placeholder="08:00 - 08:45" 
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono transition" 
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-slate-400 mb-1">اسم الأستاذ</label>
                        <input 
                          type="text" 
                          value={period.teacher} 
                          onChange={(e) => handlePeriodFieldChange(selectedDay, period.id, 'teacher', e.target.value)}
                          placeholder="أ. علي" 
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition" 
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-slate-400 mb-1">رقم القاعة</label>
                        <input 
                          type="text" 
                          value={period.room} 
                          onChange={(e) => handlePeriodFieldChange(selectedDay, period.id, 'room', e.target.value)}
                          placeholder="5" 
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition" 
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <button 
                  onClick={handleSaveFullSchedule}
                  className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-4 rounded-2xl shadow-xl transition text-sm"
                >
                  <span>💾</span> حفظ الجدول بالكامل والانتقال إلى الواجهة الرئيسية ✨
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 4. لوحة تحكم الأدمن العام */}
        {currentView === 'super-admin' && (
          <div className="max-w-3xl mx-auto space-y-6">
            {!isSuperAuthenticated ? (
              <div className="bg-slate-900/80 backdrop-blur-xl border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto mb-3 text-3xl">
                    👑
                  </div>
                  <h1 className="text-2xl font-bold text-white mb-1">لوحة تحكم الأدمن العام</h1>
                  <p className="text-xs text-slate-400">بوابة الإدارة والأمان لمدارس ميسان</p>
                </div>

                <form onSubmit={handleSuperAdminLogin} className="space-y-4">
                  <input 
                    type="password" 
                    value={superAdminPass} 
                    onChange={(e) => setSuperAdminPass(e.target.value)}
                    placeholder="أدخل كلمة مرور الأدمن العام" 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 transition"
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
                <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-xl flex items-center justify-between">
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

                <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h2 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>📋</span> قائمة المدارس المنضمة للمنصة ({registeredSchools.length}):
                    </h2>
                    <button onClick={refreshSchoolsFromStorage} className="text-xs text-indigo-400 hover:underline">
                      تحديث القائمة 🔄
                    </button>
                  </div>

                  {registeredSchools.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-8">لم تقم أي مدرسة بتسجيل الدخول وإنشاء جدولها حتى الآن.</p>
                  ) : (
                    <div className="space-y-3">
                      {registeredSchools.map((school) => (
                        <div key={school.id} className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          <div>
                            <h3 className="text-sm font-bold text-white">{school.schoolName}</h3>
                            <p className="text-xs text-emerald-400 mt-0.5 font-mono">📱 الهاتف: {school.phone || 'غير مسجل'}</p>
                            <p className="text-[11px] text-amber-400/80 mt-0.5">🔑 الرمز: <span className="font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800">{school.passwordHash}</span></p>
                          </div>
                          
                          <div className="flex items-center gap-2 text-xs flex-wrap">
                            <button 
                              onClick={() => handleResetPassword(school.schoolName)}
                              className="bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 px-2.5 py-1.5 rounded-xl transition font-semibold"
                            >
                              🔑 تغيير الرمز
                            </button>
                            <button 
                              onClick={() => handleDeleteSchool(school.id, school.schoolName)}
                              className="bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 px-2.5 py-1.5 rounded-xl transition font-semibold"
                            >
                              🗑️ حذف
                            </button>
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
            <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-5 text-center shadow-xl space-y-3">
              <div className="inline-block bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs px-3 py-1 rounded-full font-medium">بوابة الطالب الرسمية ✨</div>
              <h1 className="text-xl font-bold text-white">{schoolName || 'المدرسة'}</h1>
              
              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 justify-center gap-1">
                <button 
                  onClick={() => setShiftType('morning')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${shiftType === 'morning' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'}`}
                >
                  ☀️ صباحي
                </button>
                <button 
                  onClick={() => setShiftType('afternoon')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${shiftType === 'afternoon' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
                >
                  🌙 ظهري
                </button>
              </div>

              <button onClick={() => window.print()} className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium py-2.5 rounded-xl border border-slate-700 transition">🖨️ طباعة الجدول</button>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
              {DAYS.map((day) => (
                <button
                  key={day.id}
                  onClick={() => setSelectedDay(day.id)}
                  className={`flex-1 min-w-[75px] py-2.5 px-3 rounded-2xl text-xs font-bold text-center transition ${
                    selectedDay === day.id ? 'bg-emerald-500 text-slate-950 shadow-lg' : 'bg-slate-900/80 text-slate-400 border border-slate-800'
                  }`}
                >
                  {day.name}
                </button>
              ))}
            </div>

            <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-4 shadow-xl">
              <div className="flex items-center justify-between mb-4 px-1">
                <span className="text-sm font-bold text-white">جدول يوم: {DAYS.find(d => d.id === selectedDay)?.name}</span>
                <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-xl font-mono">
                  {activeSchedule[selectedDay]?.filter(p => p.subject.trim() !== '').length || 0} دروس
                </span>
              </div>

              <div className="space-y-3">
                {activeSchedule[selectedDay]?.map((period) => (
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
                      <div className="bg-slate-900 p-2 rounded-xl font-mono">⏰ {period.time || '---'}</div>
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