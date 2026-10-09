'use client';

import React, { useState, useEffect } from 'react';

// قائمة الأيام
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

interface TimetableData {
  schoolName: string;
  governorate: string;
  directorate: string;
  schedule: Record<string, Period[]>;
}

export default function SmartSchoolTimetable() {
  const [viewMode, setViewMode] = useState<'admin' | 'student'>('admin');
  
  // بيانات الإدارة
  const [governorate, setGovernorate] = useState('ميسان');
  const [directorate, setDirectorate] = useState('مديرية تربية ميسان');
  const [schoolName, setSchoolName] = useState('');
  const [password, setPassword] = useState('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState('');

  // بيانات الجدول
  const [selectedDay, setSelectedDay] = useState('sunday');
  const [schedule, setSchedule] = useState<Record<string, Period[]>>({
    sunday: [],
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
  });

  // نموذج إضافة حصة جديدة
  const [newSubject, setNewSubject] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newTeacher, setNewTeacher] = useState('');
  const [newRoom, setNewRoom] = useState('');

  // دعم رابط الطالب عبر URL Parameters أو الحالة
  const [studentSchoolData, setStudentSchoolData] = useState<TimetableData | null>(null);

  useEffect(() => {
    // التحقق إذا كان الرابط يحتوي على وضع الطالب أو بيانات محفوظة
    const savedAdmin = localStorage.getItem('isAdminAuthenticated');
    const savedData = localStorage.getItem('schoolTimetableData');
    if (savedAdmin === 'true' && savedData) {
      const parsed = JSON.parse(savedData);
      setSchoolName(parsed.schoolName || '');
      setGovernorate(parsed.governorate || 'ميسان');
      setDirectorate(parsed.directorate || 'مديرية تربية ميسان');
      setSchedule(parsed.schedule || schedule);
      setIsAdminAuthenticated(true);
      setViewMode('admin');
    }
  }, []);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolName.trim() || !password.trim()) {
      setLoginError('يرجى إدخال اسم المدرسة وكلمة المرور');
      return;
    }
    // افتراض كلمة مرور مؤقتة أو التحفظ عليها
    setIsAdminAuthenticated(true);
    localStorage.setItem('isAdminAuthenticated', 'true');
    const dataToSave = { schoolName, governorate, directorate, schedule };
    localStorage.setItem('schoolTimetableData', JSON.stringify(dataToSave));
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
    
    // حفظ التحديثات
    const dataToSave = { schoolName, governorate, directorate, schedule: updatedSchedule };
    localStorage.setItem('schoolTimetableData', JSON.stringify(dataToSave));

    // تصفير الحقول
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
    const dataToSave = { schoolName, governorate, directorate, schedule: updatedSchedule };
    localStorage.setItem('schoolTimetableData', JSON.stringify(dataToSave));
  };

  const handleLogout = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('isAdminAuthenticated');
  };

  // محاكاة الانتقال لواجهة الطالب للتجربة
  const switchToStudentView = () => {
    setViewMode('student');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-slate-100 p-4 sm:p-6 font-sans" dir="rtl">
      
      {/* شاشة تسجيل الدخول للإدارة */}
      {viewMode === 'admin' && !isAdminAuthenticated && (
        <div className="max-w-md mx-auto mt-12 bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl shadow-inner">
              🔒
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">بوابة دخول المدارس الآمنة</h1>
            <p className="text-sm text-slate-400">أدخل بيانات المدرسة وكلمة المرور الخاصة لإدارة الجدول</p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-amber-400 mb-1.5">📍 المحافظة</label>
              <select 
                value={governorate} 
                onChange={(e) => setGovernorate(e.target.value)}
                className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
              >
                <option value="ميسان">ميسان</option>
                <option value="بغداد">بغداد</option>
                <option value="البصرة">البصرة</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">🏫 مديرية التربية (النطاق)</label>
              <input 
                type="text" 
                value={directorate} 
                onChange={(e) => setDirectorate(e.target.value)}
                className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
                placeholder="مديرية تربية ميسان"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-rose-400 mb-1.5">🏷️ اسم المدرسة</label>
              <input 
                type="text" 
                value={schoolName} 
                onChange={(e) => setSchoolName(e.target.value)}
                className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
                placeholder="مثال: اعدادية المجد للبنين"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-amber-400 mb-1.5">🔑 كلمة المرور الخاصة بالمدرسة</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
                placeholder="أدخل كلمة المرور السرية"
                required
              />
            </div>

            {loginError && <p className="text-xs text-rose-500 text-center">{loginError}</p>}

            <button 
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-medium py-3.5 rounded-xl shadow-lg shadow-indigo-600/30 transition duration-200"
            >
              تسجيل الدخول الآمن 🛡️
            </button>
          </form>

          <div className="mt-6 text-center">
            <button 
              onClick={switchToStudentView}
              className="text-xs text-indigo-400 hover:underline"
            >
              الانتقال المباشر لعرض جدول الطلاب (بدون تسجيل دخول) ⬅️
            </button>
          </div>
        </div>
      )}

      {/* لوحة تحكم الإدارة */}
      {viewMode === 'admin' && isAdminAuthenticated && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
            <div>
              <span className="text-xs bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full border border-indigo-500/20">لوحة تحكم الإدارة</span>
              <h1 className="text-2xl font-bold text-white mt-2">{schoolName || 'المدرسة'}</h1>
              <p className="text-xs text-slate-400">{governorate} - {directorate}</p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button 
                onClick={switchToStudentView}
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

          {/* إضافة حصة جديدة */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span>➕</span> إضافة حصة جديدة ليوم: <span className="text-indigo-400">{DAYS.find(d => d.id === selectedDay)?.name}</span>
            </h2>

            {/* اختيار اليوم */}
            <div className="flex gap-2 overflow-x-auto pb-3 mb-4">
              {DAYS.map((day) => (
                <button
                  key={day.id}
                  onClick={() => setSelectedDay(day.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition ${
                    selectedDay === day.id 
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' 
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  {day.name}
                </button>
              ))}
            </div>

            <form onSubmit={handleAddPeriod} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <input 
                type="text" 
                placeholder="اسم المادة (مثال: رياضيات)" 
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                required
              />
              <input 
                type="text" 
                placeholder="الوقت (مثال: 08:00 - 09:00)" 
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
              <input 
                type="text" 
                placeholder="أستاذ المادة" 
                value={newTeacher}
                onChange={(e) => setNewTeacher(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
              <input 
                type="text" 
                placeholder="القاعة" 
                value={newRoom}
                onChange={(e) => setNewRoom(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
              <div className="sm:col-span-2 md:col-span-4">
                <button 
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-xl text-sm transition shadow-md"
                >
                  حفظ وإضافة الحصة للجدول
                </button>
              </div>
            </form>
          </div>

          {/* استعراض الجدول الحالي للإدارة */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <h2 className="text-lg font-semibold text-white mb-4">📚 الحصص المسجلة ليوم {DAYS.find(d => d.id === selectedDay)?.name}</h2>
            
            {schedule[selectedDay]?.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-6">لا توجد حصص مسجلة لهذا اليوم بعد.</p>
            ) : (
              <div className="space-y-3">
                {schedule[selectedDay]?.map((period, index) => (
                  <div key={period.id} className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </span>
                      <div>
                        <h3 className="text-sm font-bold text-white">{period.subject}</h3>
                        <p className="text-xs text-slate-400 mt-0.5">⏰ {period.time} | 👨‍🏫 {period.teacher} | 🚪 قاعة {period.room}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDeletePeriod(selectedDay, period.id)}
                      className="text-rose-400 hover:text-rose-300 bg-rose-500/10 p-2 rounded-lg text-xs transition"
                    >
                      🗑️ حذف
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 🎓 واجهة الطالب المطورة والمرتبة بشكل فائق على الموبايل */}
      {viewMode === 'student' && (
        <div className="max-w-md mx-auto space-y-4">
          
          {/* رأس بطاقة الطالب */}
          <div className="bg-slate-900/90 border border-slate-800/80 rounded-3xl p-5 text-center shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="inline-block bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs px-3 py-1 rounded-full mb-3 font-medium">
              بوابة الطالب الرسمية ✨
            </div>
            
            <div className="w-14 h-14 bg-indigo-600/20 border border-indigo-500/30 rounded-2xl flex items-center justify-center mx-auto mb-3 text-2xl shadow-inner">
              🎓
            </div>
            
            <h1 className="text-xl font-bold text-white mb-1">{schoolName || 'مدرسة اليمامة'}</h1>
            <p className="text-xs text-slate-400 mb-4">الجدول الدراسي الرسمي المعتمد</p>

            <button 
              onClick={() => window.print()}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium py-2.5 rounded-xl border border-slate-700 transition flex items-center justify-center gap-2"
            >
              <span>🖨️</span> طباعة الجدول أو حفظه PDF
            </button>
          </div>

          {/* شريط اختيار الأيام بتصميم أفقي سلس للموبايل */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {DAYS.map((day) => (
              <button
                key={day.id}
                onClick={() => setSelectedDay(day.id)}
                className={`flex-1 min-w-[75px] py-2.5 px-3 rounded-2xl text-xs font-semibold text-center transition ${
                  selectedDay === day.id
                    ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                    : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:bg-slate-800'
                }`}
              >
                {day.name}
              </button>
            ))}
          </div>

          {/* محتوى جدول الحصص الخاص بالطالب (تصميم كارد مدمج واحترافي) */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-4 shadow-xl">
            <div className="flex items-center justify-between mb-4 px-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-sm font-bold text-white">جدول حصص يوم: {DAYS.find(d => d.id === selectedDay)?.name}</span>
              </div>
              <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-xl">
                {schedule[selectedDay]?.length || 0} دروس مسجلة
              </span>
            </div>

            {schedule[selectedDay]?.length === 0 ? (
              <div className="text-center py-10">
                <span className="text-3xl">☕</span>
                <p className="text-xs text-slate-400 mt-2">لا توجد حصص دراسية مجدولة لهذا اليوم.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {schedule[selectedDay]?.map((period, index) => (
                  <div 
                    key={period.id} 
                    className="bg-slate-950/70 border border-slate-800/70 rounded-2xl p-4 space-y-2.5 shadow-inner hover:border-indigo-500/40 transition"
                  >
                    {/* رأس الكارد: رقم الدرس والمادة */}
                    <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
                      <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-lg">
                        الدرس {index + 1 < 10 ? `0${index + 1}` : index + 1}
                      </span>
                      <h3 className="text-sm font-bold text-white">{period.subject}</h3>
                    </div>

                    {/* تفاصيل الحصة (الوقت، الأستاذ، القاعة) في صف واحد منظم */}
                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 pt-1">
                      <div className="flex items-center gap-1.5 bg-slate-900/60 p-2 rounded-xl border border-slate-800/40">
                        <span>⏰</span>
                        <span className="truncate">{period.time}</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-slate-900/60 p-2 rounded-xl border border-slate-800/40">
                        <span>👨‍🏫</span>
                        <span className="truncate">{period.teacher}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between bg-slate-900/40 px-3 py-1.5 rounded-xl text-xs text-slate-400 border border-slate-800/30">
                      <span>🚪 رقم القاعة:</span>
                      <span className="font-semibold text-white">{period.room}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* زر الرجوع للتحكم بالإدارة */}
          <div className="text-center pt-2">
            <button 
              onClick={() => setViewMode('admin')}
              className="text-xs text-slate-400 hover:text-white transition underline"
            >
              ⚙️ العودة لواجهة الإدارة وتعديل الجدول
            </button>
          </div>

        </div>
      )}

    </main>
  );
}