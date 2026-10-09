'use client';

import React, { useState, useEffect } from 'react';

interface Lecture {
  id: number;
  time: string;
  subject: string;
  hall: string;
  professor: string;
}

const provinceToDirectorateMap: Record<string, string> = {
  'ميسان': 'مديرية تربية ميسان',
  'بغداد': 'مديرية تربية بغداد (الكرخ / الرصافة)',
  'البصرة': 'مديرية تربية البصرة',
  'ذي قار': 'مديرية تربية ذي قار',
  'المثنى': 'مديرية تربية المثنى',
  'واسط': 'مديرية تربية واسط',
  'النجف الأشرف': 'مديرية تربية النجف الأشرف',
  'كربلاء المقدسة': 'مديرية تربية كربلاء المقدسة',
  'بابل': 'مديرية تربية بابل',
  'ديالى': 'مديرية تربية ديالى',
  'صلاح الدين': 'مديرية تربية صلاح الدين',
  'الأنبار': 'مديرية تربية الأنبار',
  'كركوك': 'مديرية تربية كركوك',
  'نينوى': 'مديرية تربية نينوى',
  'أربيل': 'مديرية تربية أربيل',
  'السليمانية': 'مديرية تربية السليمانية',
  'دهوك': 'مديرية تربية دهوك',
};

const initialTimetable: Record<string, Lecture[]> = {
  'الأحد': [
    { id: 1, time: '08:30 - 10:00', subject: 'هندسة برمجيات متقدمة', hall: '3', professor: 'د. أحمد' },
    { id: 2, time: '10:15 - 11:45', subject: 'أنظمة قواعد البيانات', hall: 'مختبر الحاسوب', professor: 'د. مريم' },
  ],
  'الإثنين': [
    { id: 1, time: '09:00 - 10:30', subject: 'شبكات الحاسوب', hall: '5', professor: 'د. علي' },
  ],
  'الثلاثاء': [
    { id: 1, time: '11:00 - 12:30', subject: 'الذكاء الاصطناعي', hall: '10', professor: 'د. حسن' },
  ],
  'الأربعاء': [
    { id: 1, time: '08:30 - 10:00', subject: 'أمن المعلومات', hall: '2', professor: 'د. زينب' },
  ],
  'الخميس': [
    { id: 1, time: '10:00 - 11:30', subject: 'مشروع التخرج / التطبيق العملي', hall: 'المختبر المركزي', professor: 'لجنة الإشراف' },
  ],
};

export default function SmartTimetable() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isStudentView, setIsStudentView] = useState(false);
  
  const [province, setProvince] = useState('ميسان');
  const [directorate, setDirectorate] = useState('مديرية تربية ميسان');
  const [schoolName, setSchoolName] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [copyStatus, setCopyStatus] = useState('');

  const [selectedDay, setSelectedDay] = useState<'الأحد' | 'الإثنين' | 'الثلاثاء' | 'الأربعاء' | 'الخميس'>('الأحد');
  const [timetable, setTimetable] = useState<Record<string, Lecture[]>>(initialTimetable);
  const [isInitialized, setIsInitialized] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newHall, setNewHall] = useState('');
  const [newProfessor, setNewProfessor] = useState('');

  const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'] as const;

  useEffect(() => {
    // التحقق هل الرابط يحتوي على وضع الطالب (مثل ?view=student&school=...)
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view');
    const schoolParam = params.get('school');

    if (viewParam === 'student' && schoolParam) {
      const decodedSchool = decodeURIComponent(schoolParam);
      setSchoolName(decodedSchool);
      
      // جلب بيانات جدول المدرسة الخاصة بهذا الاسم من التخزين
      const savedData = localStorage.getItem(`timetable_school_${decodedSchool}`) || 
                        localStorage.getItem('smart_timetable_master_v1');
      if (savedData) {
        try {
          setTimetable(JSON.parse(savedData));
        } catch (e) {
          console.error(e);
        }
      }
      setIsStudentView(true);
      setIsInitialized(true);
      return;
    }

    // التحقق من جلسة تسجيل دخول الإدارة العادية
    const savedLogin = localStorage.getItem('school_login_secure_session');
    if (savedLogin) {
      try {
        const info = JSON.parse(savedLogin);
        setProvince(info.province);
        setDirectorate(info.directorate);
        setSchoolName(info.schoolName);
        setIsLoggedIn(true);

        // جلب جدول المدرسة الخاصة بالاسم المسجل
        const savedSchoolData = localStorage.getItem(`timetable_school_${info.schoolName}`);
        if (savedSchoolData) {
          setTimetable(JSON.parse(savedSchoolData));
        }
      } catch (e) {
        console.error(e);
      }
    }

    setIsInitialized(true);
  }, []);

  // حفظ جدول الحصص الخاص بالمدرسة الحالية تلقائياً
  useEffect(() => {
    if (isInitialized && schoolName && !isStudentView) {
      localStorage.setItem(`timetable_school_${schoolName}`, JSON.stringify(timetable));
      localStorage.setItem('smart_timetable_master_v1', JSON.stringify(timetable));
    }
  }, [timetable, schoolName, isInitialized, isStudentView]);

  const handleProvinceChange = (prov: string) => {
    setProvince(prov);
    if (provinceToDirectorateMap[prov]) {
      setDirectorate(provinceToDirectorateMap[prov]);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!schoolName.trim() || !password.trim()) {
      setLoginError('يرجى إدخال اسم المدرسة وكلمة المرور.');
      return;
    }

    const savedPasswordKey = `school_pwd_${schoolName.trim()}`;
    const existingPassword = localStorage.getItem(savedPasswordKey);

    if (existingPassword) {
      if (existingPassword !== password) {
        setLoginError('كلمة المرور غير صحيحة لهذه المدرسة!');
        return;
      }
    } else {
      localStorage.setItem(savedPasswordKey, password);
    }

    const loginData = { province, directorate, schoolName: schoolName.trim() };
    localStorage.setItem('school_login_secure_session', JSON.stringify(loginData));
    
    // جلب جدول هذه المدرسة إن وجد
    const savedSchoolData = localStorage.getItem(`timetable_school_${schoolName.trim()}`);
    if (savedSchoolData) {
      try {
        setTimetable(JSON.parse(savedSchoolData));
      } catch (e) {
        console.error(e);
      }
    }

    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
      localStorage.removeItem('school_login_secure_session');
      setIsLoggedIn(false);
      setPassword('');
    }
  };

  // توليد ونسخ رابط الطالب المباشر
  const handleCopyStudentLink = () => {
    const baseUrl = window.location.origin + window.location.pathname;
    const studentUrl = `${baseUrl}?view=student&school=${encodeURIComponent(schoolName)}`;
    
    navigator.clipboard.writeText(studentUrl);
    setCopyStatus('تم نسخ رابط الطلاب المباشر بنجاح! 📋');
    setTimeout(() => setCopyStatus(''), 4000);
  };

  const handleAddLecture = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject || !newTime) return;

    const newLect: Lecture = {
      id: Date.now(),
      time: newTime,
      subject: newSubject,
      hall: newHall || 'عامة',
      professor: newProfessor || 'غير محدد',
    };

    setTimetable((prev) => ({
      ...prev,
      [selectedDay]: [...(prev[selectedDay] || []), newLect],
    }));

    setNewSubject('');
    setNewTime('');
    setNewHall('');
    setNewProfessor('');
    setShowAddModal(false);
  };

  const handleDeleteLecture = (id: number) => {
    setTimetable((prev) => ({
      ...prev,
      [selectedDay]: prev[selectedDay].filter((item) => item.id !== id),
    }));
  };

  const handleClearDay = () => {
    if (confirm(`هل أنت متأكد من حذف جميع دروس يوم ${selectedDay}؟`)) {
      setTimetable((prev) => ({
        ...prev,
        [selectedDay]: [],
      }));
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!isInitialized) return null;

  // ==========================================================
  // 1. واجهة الطالب المباشرة (عرض فقط Read-Only بدون إمكانية التعديل)
  // ==========================================================
  if (isStudentView) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-slate-200 p-6 md:p-12 relative overflow-hidden font-sans tracking-wide leading-relaxed" dir="rtl">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-4xl mx-auto relative z-10">
          
          {/* رأس الصفحة الخاص بالطالب */}
          <header className="bg-slate-900/80 backdrop-blur-xl shadow-xl rounded-3xl p-8 mb-8 border border-slate-700/60 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3.5">
              <span className="bg-slate-800 text-emerald-400 p-3.5 rounded-2xl text-2xl shadow-sm border border-slate-700/40">🎓</span>
              <div>
                <span className="text-xs bg-emerald-950/60 text-emerald-300 font-medium px-3 py-1 rounded-xl border border-emerald-800/50">بوابة الطالب الرسمية</span>
                <h1 className="text-2xl font-bold text-slate-100 mt-2">{schoolName}</h1>
                <p className="text-slate-400 text-xs mt-0.5">الجدول الدراسي الرسمي المعتمد</p>
              </div>
            </div>

            <button
              onClick={handlePrint}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-5 py-2.5 rounded-2xl font-medium border border-slate-700 text-xs flex items-center gap-2"
            >
              🖨️ طباعة الجدول
            </button>
          </header>

          {/* شريط الأيام */}
          <div className="flex flex-wrap gap-2 justify-center mb-8 bg-slate-900/60 p-3 rounded-3xl border border-slate-700/60 backdrop-blur-md">
            {days.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-6 py-2.5 rounded-2xl font-medium transition-all duration-300 text-sm ${
                  selectedDay === day
                    ? 'bg-emerald-600 text-white shadow-md scale-105'
                    : 'bg-slate-900/60 hover:bg-slate-900 text-slate-400 border border-slate-800'
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          {/* جدول الحصص الخاص بالطالب (عرض فقط) */}
          <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-700/60 overflow-hidden">
            <div className="p-6 border-b border-slate-800 bg-slate-900/90 flex justify-between items-center">
              <h2 className="text-base font-medium text-slate-200 flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
                جدول حصص يوم: <span className="text-emerald-400 font-semibold">{selectedDay}</span>
              </h2>
              <span className="text-xs bg-slate-800 text-slate-300 font-medium px-4 py-1.5 rounded-xl border border-slate-700/60">
                {timetable[selectedDay]?.length || 0} دروس مسجلة
              </span>
            </div>

            <div className="p-4 md:p-6 space-y-3">
              {timetable[selectedDay] && timetable[selectedDay].length > 0 ? (
                timetable[selectedDay].map((item, index) => (
                  <div 
                    key={item.id} 
                    className="bg-slate-950/40 border border-slate-800/90 rounded-2xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-inner"
                  >
                    <div className="flex items-center gap-2 bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-800 min-w-[90px] justify-center">
                      <span className="text-xs text-slate-400 font-normal">الدرس:</span>
                      <span className="text-xs font-semibold text-emerald-300">0{index + 1}</span>
                    </div>

                    <div className="flex-1 bg-slate-900/70 px-4 py-2.5 rounded-xl border border-slate-800 flex flex-col justify-center">
                      <span className="text-[11px] text-slate-400 font-normal mb-0.5">اسم المادة</span>
                      <span className="text-sm font-semibold text-slate-100">{item.subject}</span>
                    </div>

                    <div className="bg-slate-900/70 px-4 py-2.5 rounded-xl border border-slate-800 flex flex-col justify-center min-w-[140px]">
                      <span className="text-[11px] text-slate-400 font-normal mb-0.5">الوقت</span>
                      <span className="text-xs font-medium text-emerald-200">⏰ {item.time}</span>
                    </div>

                    <div className="flex-1 bg-slate-900/70 px-4 py-2.5 rounded-xl border border-slate-800 flex flex-col justify-center">
                      <span className="text-[11px] text-slate-400 font-normal mb-0.5">أستاذ المادة</span>
                      <span className="text-sm font-normal text-slate-300">{item.professor}</span>
                    </div>

                    <div className="bg-indigo-950/30 border border-indigo-900/40 px-4 py-2.5 rounded-xl flex items-center gap-2 min-w-[110px] justify-center">
                      <span className="text-xs text-indigo-300">قاعة:</span>
                      <span className="text-sm font-semibold text-indigo-300">{item.hall}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-16 text-center text-slate-500">
                  <p className="text-sm font-medium">لا توجد دروس مسجلة في هذا اليوم.</p>
                </div>
              )}
            </div>
          </div>

          <footer className="text-center mt-12 text-xs font-normal text-slate-500">
            Smart School Timetable &copy; 2026 - عرض مباشر لجدول الطلاب
          </footer>

        </div>
      </main>
    );
  }

  // ==========================================================
  // 2. شاشة تسجيل الدخول للإدارة (المدرسة)
  // ==========================================================
  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-slate-200 flex items-center justify-center p-6" dir="rtl">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="bg-slate-900/90 backdrop-blur-2xl border border-slate-700/80 rounded-3xl p-8 max-w-md w-full shadow-2xl relative z-10">
          <div className="text-center mb-6">
            <span className="bg-slate-800 text-indigo-400 p-4 rounded-2xl text-3xl inline-block mb-3 border border-slate-700">🔒</span>
            <h1 className="text-2xl font-bold text-slate-100">بوابة دخول المدارس الآمنة</h1>
            <p className="text-slate-400 text-xs mt-1">أدخل بيانات المدرسة وكلمة المرور الخاصة لإدارة الجدول</p>
          </div>

          {loginError && (
            <div className="bg-rose-950/50 border border-rose-800/60 text-rose-300 text-xs p-3 rounded-xl mb-4 text-center font-medium">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">📍 المحافظة</label>
              <select
                value={province}
                onChange={(e) => handleProvinceChange(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-4 py-3 text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
              >
                {Object.keys(provinceToDirectorateMap).map((prov) => (
                  <option key={prov} value={prov}>{prov}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">🏛️ مديرية التربية (تلقائي)</label>
              <input
                type="text"
                disabled
                value={directorate}
                className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl px-4 py-3 text-indigo-300 text-sm cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">🏫 اسم المدرسة</label>
              <input
                type="text"
                required
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                placeholder="مثال: اعدادية المجد للبنين"
                className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-4 py-3 text-slate-200 text-sm placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">🔑 كلمة المرور الخاصة بالمدرسة</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="أدخل كلمة المرور السرية"
                className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-4 py-3 text-slate-200 text-sm placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3.5 rounded-2xl transition-all shadow-lg text-sm mt-4"
            >
              تسجيل الدخول الآمن 🛡️
            </button>
          </form>
        </div>
      </main>
    );
  }

  // ==========================================================
  // 3. لوحة تحكم إدارة المدرسة (مع زر نسخ رابط الطالب المباشر)
  // ==========================================================
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-slate-200 p-6 md:p-12 relative overflow-hidden font-sans tracking-wide leading-relaxed" dir="rtl">
      
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        
        <header className="bg-slate-900/80 backdrop-blur-xl shadow-xl rounded-3xl p-8 mb-8 border border-slate-700/60 flex flex-col gap-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-slate-800 pb-6">
            <div className="flex items-center gap-3.5">
              <span className="bg-slate-800 text-indigo-400 p-3.5 rounded-2xl text-2xl shadow-sm border border-slate-700/40">🏛️</span>
              <div>
                <h1 className="text-xl font-bold text-slate-100">{schoolName}</h1>
                <p className="text-slate-400 text-xs font-normal mt-0.5">{directorate} - محافظة {province}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleCopyStudentLink}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-2xl font-medium shadow-md transition-all text-xs flex items-center gap-2"
                title="نسخ رابط مباشر خاص بالطلاب"
              >
                🔗 نسخ رابط الطلاب
              </button>
              <button
                onClick={handlePrint}
                className="bg-slate-800/80 hover:bg-slate-800 text-slate-300 px-4 py-2.5 rounded-2xl font-medium transition-all border border-slate-700/60 text-xs flex items-center gap-2"
              >
                🖨️ طباعة
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-2xl font-medium shadow-md transition-all text-xs flex items-center gap-2"
              >
                <span>+</span> إضافة درس
              </button>
              <button
                onClick={handleLogout}
                className="bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 px-4 py-2.5 rounded-2xl font-medium border border-rose-900/50 transition-all text-xs"
              >
                🚪 خروج
              </button>
            </div>
          </div>

          <div className="bg-slate-950/40 px-6 py-4 rounded-2xl border border-slate-800/80 flex flex-col md:flex-row justify-between items-center gap-2 text-xs">
            <span className="text-slate-400">لوحة تحكم الإدارة: <span className="text-emerald-400 font-medium">تم تسجيل الدخول بنجاح 🔒</span></span>
            {copyStatus ? (
              <span className="text-emerald-400 font-bold animate-pulse">{copyStatus}</span>
            ) : (
              <span className="text-indigo-300">اضغط على "نسخ رابط الطلاب" ومشاركته معهم ليعرض لهم الجدول فوراً.</span>
            )}
          </div>
        </header>

        {/* شريط الأيام */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 bg-slate-900/60 p-3 rounded-3xl border border-slate-700/60 backdrop-blur-md">
          <div className="flex flex-wrap gap-2 justify-center">
            {days.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-5 py-2.5 rounded-2xl font-medium transition-all duration-300 text-sm ${
                  selectedDay === day
                    ? 'bg-indigo-600 text-white shadow-md scale-105'
                    : 'bg-slate-900/60 hover:bg-slate-900 text-slate-400 border border-slate-800'
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          <button
            onClick={handleClearDay}
            className="text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 px-4 py-2 rounded-2xl text-xs font-medium transition-all border border-rose-900/30 bg-rose-950/10"
          >
            🗑️ تفريغ يوم {selectedDay}
          </button>
        </div>

        {/* جدول الحصص الخاص بالإدارة */}
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-700/60 overflow-hidden">
          <div className="p-6 border-b border-slate-800 bg-slate-900/90 flex justify-between items-center">
            <h2 className="text-base font-medium text-slate-200 flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
              جدول الحصص ليوم: <span className="text-indigo-400 font-semibold">{selectedDay}</span>
            </h2>
            <span className="text-xs bg-slate-800 text-slate-300 font-medium px-4 py-1.5 rounded-xl border border-slate-700/60">
              {timetable[selectedDay]?.length || 0} دروس مسجلة
            </span>
          </div>

          <div className="p-4 md:p-6 space-y-3">
            {timetable[selectedDay] && timetable[selectedDay].length > 0 ? (
              timetable[selectedDay].map((item, index) => (
                <div 
                  key={item.id} 
                  className="bg-slate-950/40 border border-slate-800/90 rounded-2xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 hover:bg-slate-900/60 transition-all shadow-inner"
                >
                  <div className="flex items-center gap-2 bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-800 min-w-[90px] justify-center">
                    <span className="text-xs text-slate-400 font-normal">الدرس:</span>
                    <span className="text-xs font-semibold text-indigo-300">0{index + 1}</span>
                  </div>

                  <div className="flex-1 bg-slate-900/70 px-4 py-2.5 rounded-xl border border-slate-800 flex flex-col justify-center">
                    <span className="text-[11px] text-slate-400 font-normal mb-0.5">اسم المادة</span>
                    <span className="text-sm font-semibold text-slate-100">{item.subject}</span>
                  </div>

                  <div className="bg-slate-900/70 px-4 py-2.5 rounded-xl border border-slate-800 flex flex-col justify-center min-w-[140px]">
                    <span className="text-[11px] text-slate-400 font-normal mb-0.5">الوقت</span>
                    <span className="text-xs font-medium text-indigo-200">⏰ {item.time}</span>
                  </div>

                  <div className="flex-1 bg-slate-900/70 px-4 py-2.5 rounded-xl border border-slate-800 flex flex-col justify-center">
                    <span className="text-[11px] text-slate-400 font-normal mb-0.5">اسم الأستاذ</span>
                    <span className="text-sm font-normal text-slate-300">{item.professor}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-indigo-950/30 border border-indigo-900/40 px-3.5 py-2 rounded-xl flex items-center gap-2 min-w-[100px] justify-center">
                      <span className="text-xs text-indigo-300">قاعة:</span>
                      <span className="text-sm font-semibold text-indigo-300">{item.hall}</span>
                    </div>

                    <button
                      onClick={() => handleDeleteLecture(item.id)}
                      className="text-rose-400 hover:text-white hover:bg-rose-950/50 p-2.5 rounded-xl transition-all border border-rose-950 bg-rose-950/20"
                      title="حذف الدرس"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-16 text-center text-slate-500">
                <p className="text-sm font-medium">لا توجد دروس مسجلة في هذا اليوم.</p>
                <p className="text-xs font-normal mt-1 text-slate-600">استمتع بيومك أو أضف درساً جديداً! ☕</p>
              </div>
            )}
          </div>
        </div>

        {/* نافذة إضافة درس جديدة */}
        {showAddModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex justify-center items-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl p-8 max-w-md w-full shadow-2xl">
              <h3 className="text-lg font-bold text-slate-100 mb-6">إضافة درس ليوم {selectedDay}</h3>
              
              <form onSubmit={handleAddLecture} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">اسم المادة الدراسية</label>
                  <input
                    type="text"
                    required
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    placeholder="مثال: الرياضيات"
                    className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-4 py-3 text-slate-200 font-normal placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">اسم الأستاذ</label>
                  <input
                    type="text"
                    value={newProfessor}
                    onChange={(e) => setNewProfessor(e.target.value)}
                    placeholder="مثال: أ. محمد علي"
                    className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-4 py-3 text-slate-200 font-normal placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2">الوقت</label>
                    <input
                      type="text"
                      required
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      placeholder="08:30 - 10:00"
                      className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-4 py-3 text-slate-200 font-normal placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2">رقم القاعة</label>
                    <input
                      type="text"
                      required
                      value={newHall}
                      onChange={(e) => setNewHall(e.target.value)}
                      placeholder="3"
                      className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-4 py-3 text-slate-200 font-normal placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 text-sm"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3.5 rounded-2xl transition-all shadow-md text-sm"
                  >
                    حفظ وإضافة
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium py-3.5 rounded-2xl transition-all border border-slate-700 text-sm"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <footer className="text-center mt-12 text-xs font-normal text-slate-500">
          Smart School Timetable &copy; 2026 - نظام إدارة ج场的 المدارس وروابط الطلاب المباشرة
        </footer>

      </div>
    </main>
  );
}