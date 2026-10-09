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

export default function SmartSchoolTimetable() {
  const [viewMode, setViewMode] = useState<'admin' | 'student' | 'super-admin'>('admin');
  
  const [governorate, setGovernorate] = useState('ميسان');
  const [directorate, setDirectorate] = useState('مديرية تربية ميسان');
  const [schoolName, setSchoolName] = useState('');
  const [password, setPassword] = useState('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState('');

  const [superAdminPass, setSuperAdminPass] = useState('');
  const [isSuperAuthenticated, setIsSuperAuthenticated] = useState(false);
  const [registeredSchools, setRegisteredSchools] = useState<SchoolRecord[]>([]);

  const [selectedDay, setSelectedDay] = useState('sunday');
  const [schedule, setSchedule] = useState<Record<string, Period[]>>({
    sunday: [],
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
  });

  const [newSubject, setNewSubject] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newTeacher, setNewTeacher] = useState('');
  const [newRoom, setNewRoom] = useState('');

  useEffect(() => {
    const savedAdmin = localStorage.getItem('isAdminAuthenticated');
    const savedSchoolName = localStorage.getItem('currentSchoolName');
    const schoolsList = localStorage.getItem('globalRegisteredSchools');
    
    if (schoolsList) {
      setRegisteredSchools(JSON.parse(schoolsList));
    }

    if (savedAdmin === 'true' && savedSchoolName) {
      setSchoolName(savedSchoolName);
      setIsAdminAuthenticated(true);
      
      // محاولة استرجاع جدول هذه المدرسة بالتحديد، وإن لم يوجد نبحث عن الجدول القديم العام لعدم ضياع البيانات
      const schoolScheduleKey = `schedule_${savedSchoolName}`;
      const savedSchedule = localStorage.getItem(schoolScheduleKey);
      const oldGeneralSchedule = localStorage.getItem('schoolTimetableData');

      if (savedSchedule) {
        setSchedule(JSON.parse(savedSchedule));
      } else if (oldGeneralSchedule) {
        try {
          const parsedOld = JSON.parse(oldGeneralSchedule);
          if (parsedOld.schedule) {
            setSchedule(parsedOld.schedule);
            // حفظه فوراً بالمفتاح الجديد للمدرسة
            localStorage.setItem(schoolScheduleKey, JSON.stringify(parsedOld.schedule));
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolName.trim() || !password.trim()) {
      setLoginError('يرجى إدخال اسم المدرسة وكلمة المرور');
      return;
    }
    
    setIsAdminAuthenticated(true);
    localStorage.setItem('isAdminAuthenticated', 'true');
    localStorage.setItem('currentSchoolName', schoolName);

    const schoolScheduleKey = `schedule_${schoolName}`;
    const savedSchedule = localStorage.getItem(schoolScheduleKey);
    const oldGeneralSchedule = localStorage.getItem('schoolTimetableData');

    let currentSchedule = schedule;
    if (savedSchedule) {
      currentSchedule = JSON.parse(savedSchedule);
      setSchedule(currentSchedule);
    } else if (oldGeneralSchedule) {
      try {
        const parsedOld = JSON.parse(oldGeneralSchedule);
        if (parsedOld.schedule) {
          currentSchedule = parsedOld.schedule;
          setSchedule(currentSchedule);
          localStorage.setItem(schoolScheduleKey, JSON.stringify(currentSchedule));
        }
      } catch (e) {
        console.error(e);
      }
    }

    const totalPeriods = Object.values(currentSchedule).reduce((acc, curr) => acc + curr.length, 0);

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
  };

  const handleAddPeriod = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim()) return;

    const newPeriod: Period = {
      id: Date.now().toString(),
      subject: newSubject,
      time: newTime || '08:00 - 09:00',
      teacher: newTeacher || 'غير محدد',
      room: newRoom || '1',
    };

    const updatedSchedule = {
      ...schedule,
      [selectedDay]: [...(schedule[selectedDay] || []), newPeriod],
    };

    setSchedule(updatedSchedule);
    
    const schoolScheduleKey = `schedule_${schoolName}`;
    localStorage.setItem(schoolScheduleKey, JSON.stringify(updatedSchedule));

    const totalPeriods = Object.values(updatedSchedule).reduce((acc, curr) => acc + curr.length, 0);
    const existingSchools: SchoolRecord[] = JSON.parse(localStorage.getItem('globalRegisteredSchools') || '[]');
    const updatedSchoolsList = existingSchools.map(s => {
      if (s.schoolName === schoolName) {
        return { ...s, periodsCount: totalPeriods, lastUpdated: new Date().toLocaleDateString('ar-IQ') };
      }
      return s;
    });
    setRegisteredSchools(updatedSchoolsList);
    localStorage.setItem('globalRegisteredSchools', JSON.stringify(updatedSchoolsList));

    setNewSubject('');
    setNewTime('');
    setNewTeacher('');
    setNewRoom('');
  };

  const handleDeletePeriod = (dayId: string, periodId: string) => {
    const updatedDayPeriods = schedule[dayId].filter((p) => p.id !== periodId);
    const updatedSchedule = {
      ...schedule,
      [dayId]: updatedDayPeriods,
    };
    setSchedule(updatedSchedule);

    const schoolScheduleKey = `schedule_${schoolName}`;
    localStorage.setItem(schoolScheduleKey, JSON.stringify(updatedSchedule));
  };

  const handleLogout = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('isAdminAuthenticated');
    localStorage.removeItem('currentSchoolName');
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
      
      {viewMode === 'admin' && !isAdminAuthenticated && (
        <div className="max-w-md mx-auto mt-10 bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl shadow-inner">
              🔒
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">بوابة دخول المدارس الآمنة</h1>
            <p className="text-sm text-slate-400">أدخل بيانات المدرسة وكلمة المرور الخاصة لإدارة الجدول</p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
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
                placeholder="مثال: اعدادية المجد للبنين"
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
              تسجيل الدخول الآمن 🛡️
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between text-xs pt-4 border-t border-slate-800">
            <button onClick={() => setViewMode('student')} className="text-indigo-400 hover:underline">
              🎓 عرض جدول الطلاب
            </button>
            <button onClick={() => setViewMode('super-admin')} className="text-amber-400 hover:underline font-semibold">
              ⭐ لوحة تحكم الأدمن العام
            </button>
          </div>
        </div>
      )}

      {viewMode === 'admin' && isAdminAuthenticated && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
            <div>
              <span className="text-xs bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full border border-indigo-500/20">لوحة تحكم الإدارة</span>
              <h1 className="text-2xl font-bold text-white mt-2">{schoolName}</h1>
              <p className="text-xs text-slate-400">{governorate} - {directorate}</p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button 
                onClick={() => setViewMode('student')}
                className="flex-1 sm:flex-none bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 px-4 py-2 rounded-xl text-sm font-medium hover:bg-emerald-600/35 transition"
              >
                🎓 معاينة واجهة الطالب
              </button>
              <button 
                onClick={handleLogout}
                className="bg-rose-600/20 border border-rose-500/30 text-rose-400 px-4 py-2 rounded-xl text-sm font-medium hover:bg-rose-600/35 transition"
              >
                خروج
              </button>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span>➕</span> إضافة حصة ليوم: <span className="text-indigo-400">{DAYS.find(d => d.id === selectedDay)?.name}</span>
            </h2>

            <div className="flex gap-2 overflow-x-auto pb-3 mb-4">
              {DAYS.map((day) => (
                <button
                  key={day.id}
                  onClick={() => setSelectedDay(day.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition ${
                    selectedDay === day.id ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-950 text-slate-400 border border-slate-800'
                  }`}
                >
                  {day.name}
                </button>
              ))}
            </div>

            <form onSubmit={handleAddPeriod} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <input type="text" placeholder="اسم المادة (مثال: رياضيات)" value={newSubject} onChange={(e) => setNewSubject(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500" required />
              <input type="text" placeholder="الوقت (08:00 - 09:00)" value={newTime} onChange={(e) => setNewTime(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500" />
              <input type="text" placeholder="أستاذ المادة" value={newTeacher} onChange={(e) => setNewTeacher(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500" />
              <input type="text" placeholder="القاعة" value={newRoom} onChange={(e) => setNewRoom(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500" />
              <div className="sm:col-span-2 md:col-span-4">
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-xl text-sm transition">حفظ الحصة</button>
              </div>
            </form>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <h2 className="text-lg font-semibold text-white mb-4">📚 الحصص المسجلة ليوم {DAYS.find(d => d.id === selectedDay)?.name}</h2>
            {schedule[selectedDay]?.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-6">لا توجد حصص مسجلة لهذا اليوم بعد.</p>
            ) : (
              <div className="space-y-3">
                {schedule[selectedDay]?.map((period, index) => (
                  <div key={period.id} className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold">{index + 1}</span>
                      <div>
                        <h3 className="text-sm font-bold text-white">{period.subject}</h3>
                        <p className="text-xs text-slate-400 mt-0.5">⏰ {period.time} | 👨‍🏫 {period.teacher} | 🚪 قاعة {period.room}</p>
                      </div>
                    </div>
                    <button onClick={() => handleDeletePeriod(selectedDay, period.id)} className="text-rose-400 bg-rose-500/10 p-2 rounded-lg text-xs">🗑️ حذف</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {viewMode === 'super-admin' && (
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
                <button onClick={() => setViewMode('admin')} className="text-xs text-slate-400 hover:underline">
                  ⬅️ العودة لبوابة دخول المدارس
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl flex items-center justify-between">
                <div>
                  <span className="text-xs bg-amber-500/10 text-amber-400 px-3 py-1 rounded-full border border-amber-500/20">الإحصائيات العامة للمنصة</span>
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
                <button onClick={() => setViewMode('admin')} className="text-xs text-slate-400 hover:text-white underline">
                  ⬅️ العودة للصفحة الرئيسية
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {viewMode === 'student' && (
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
              <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-xl">{schedule[selectedDay]?.length || 0} دروس</span>
            </div>

            {schedule[selectedDay]?.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-8">لا توجد حصص مجدولة لهذا اليوم.</p>
            ) : (
              <div className="space-y-3">
                {schedule[selectedDay]?.map((period, index) => (
                  <div key={period.id} className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 space-y-2.5 shadow-inner">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-lg">الدرس {index + 1}</span>
                      <h3 className="text-sm font-bold text-white">{period.subject}</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                      <div className="bg-slate-900 p-2 rounded-xl">⏰ {period.time}</div>
                      <div className="bg-slate-900 p-2 rounded-xl">👨‍🏫 {period.teacher}</div>
                    </div>
                    <div className="flex items-center justify-between bg-slate-900/40 px-3 py-1.5 rounded-xl text-xs text-slate-400">
                      <span>🚪 القاعة:</span>
                      <span className="font-semibold text-white">{period.room}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="text-center pt-2">
            <button onClick={() => setViewMode('admin')} className="text-xs text-slate-400 hover:text-white underline">⚙️ العودة للإدارة</button>
          </div>
        </div>
      )}

    </main>
  );
}