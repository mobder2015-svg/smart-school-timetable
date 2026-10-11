'use client';

import React, { useState, useEffect } from 'react';
import { Printer, Share2, Upload, Building2 } from 'lucide-react';

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
  className?: string;
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
    { id: '1', periodNumber: 1, periodName: 'الدرس الأول', subject: '', time: times[0], teacher: '', room: '', className: '' },
    { id: '2', periodNumber: 2, periodName: 'الدرس الثاني', subject: '', time: times[1], teacher: '', room: '', className: '' },
    { id: '3', periodNumber: 3, periodName: 'الدرس الثالث', subject: '', time: times[2], teacher: '', room: '', className: '' },
    { id: '4', periodNumber: 4, periodName: 'الدرس الرابع', subject: '', time: times[3], teacher: '', room: '', className: '' },
    { id: '5', periodNumber: 5, periodName: 'الدرس الخامس', subject: '', time: times[4], teacher: '', room: '', className: '' },
    { id: '6', periodNumber: 6, periodName: 'الدرس السادس', subject: '', time: times[5], teacher: '', room: '', className: '' },
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

  const [schoolLogo, setSchoolLogo] = useState<string | null>(null);
  const [superAdminPass, setSuperAdminPass] = useState('');
  const [isSuperAuthenticated, setIsSuperAuthenticated] = useState(false);
  const [registeredSchools, setRegisteredSchools] = useState<SchoolRecord[]>([]);

  const [selectedDay, setSelectedDay] = useState('sunday');
  const [announcement, setAnnouncement] = useState('يرجى الالتزام بالزي المدرسي والمواعيد المعتمدة.');
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

  // جلب المدارس من السيرفر أو التخزين الآمن
  const refreshSchools = async (): Promise<SchoolRecord[]> => {
    try {
      const res = await fetch('/api/schools');
      if (res.ok) {
        const data = await res.json();
        setRegisteredSchools(data);
        return data;
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  };

  useEffect(() => {
    refreshSchools();
    const savedAdmin = localStorage.getItem('isAdminAuthenticated');
    const savedSchoolName = localStorage.getItem('currentSchoolName');
    
    if (savedAdmin === 'true' && savedSchoolName) {
      setSchoolName(savedSchoolName);
      loadSchoolData(savedSchoolName);
      setCurrentView('dashboard');
    }
  }, []);

  const loadSchoolData = async (name: string) => {
    try {
      const res = await fetch(`/api/schools?name=${encodeURIComponent(name)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.school) {
          setPhone(data.school.phone);
          setGovernorate(data.school.governorate);
          setDirectorate(data.school.directorate);
        }
        if (data.morning) setMorningSchedule(data.morning);
        if (data.afternoon) setAfternoonSchedule(data.afternoon);
        if (data.announcement) setAnnouncement(data.announcement);
        if (data.logo) setSchoolLogo(data.logo);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        setSchoolLogo(base64String);
        if (schoolName) {
          await fetch('/api/schools', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'saveLogo', schoolName, logo: base64String })
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleWhatsAppShare = () => {
    const message = encodeURIComponent(
      `جدول الحصص الأسبوعي - ${schoolName || 'منصة المدارس الذكية'}\nيمكنكم الاطلاع على الجدول عبر الرابط المباشر.`
    );
    window.open(`https://wa.me/?text=${message}`, "_blank");
  };

  // تسجيل الدخول الآمن والمدعوم مركزياً
  const handleSchoolLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginSuccess('');

    const inputName = schoolName.trim();
    const inputPass = password.trim();

    if (!inputName || !inputPass) {
      setLoginError('يرجى إدخال اسم المدرسة وكلمة المرور');
      return;
    }

    try {
      const res = await fetch('/api/schools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', schoolName: inputName, password: inputPass })
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setLoginError(data.message || 'خطأ في اسم المدرسة أو كلمة المرور!');
        return;
      }

      localStorage.setItem('isAdminAuthenticated', 'true');
      localStorage.setItem('currentSchoolName', data.school.schoolName);
      setSchoolName(data.school.schoolName);
      setPhone(data.school.phone);
      setGovernorate(data.school.governorate);
      setDirectorate(data.school.directorate);

      await loadSchoolData(data.school.schoolName);
      setCurrentView('dashboard');
    } catch (e) {
      setLoginError('حدث خطأ في الاتصال بالسيرفر.');
    }
  };

  // تسجيل مدرسة جديدة وحفظها نهائياً
  const handleSchoolRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginSuccess('');

    const trimmedName = schoolName.trim();
    const trimmedPhone = phone.trim();
    const trimmedPass = password.trim();

    if (!trimmedName || !trimmedPhone || !trimmedPass) {
      setLoginError('يرجى تعبئة كافة الحقول المطلوبة');
      return;
    }

    try {
      const res = await fetch('/api/schools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'register',
          schoolName: trimmedName,
          phone: trimmedPhone,
          governorate,
          directorate,
          password: trimmedPass
        })
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setLoginError(data.message || 'حدث خطأ أثناء التسجيل.');
        return;
      }

      await refreshSchools();
      setLoginSuccess('✅ تم حفظ بيانات الحساب نهائياً بنجاح! يمكنك تسجيل الدخول الآن.');
      setAuthTab('login');
      setPassword('');
    } catch (e) {
      setLoginError('خطأ في الاتصال بالخادم.');
    }
  };

  const handleDeleteSchool = async (schoolId: string, name: string) => {
    if (confirm(`هل أنت متأكد من حذف مدرسة (${name}) نهائياً؟`)) {
      await fetch('/api/schools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', schoolName: name })
      });
      await refreshSchools();
      if (schoolName === name) handleLogout();
      alert('تم الحذف بنجاح.');
    }
  };

  const handleResetPassword = async (name: string) => {
    const newPass = prompt(`أدخل كلمة المرور الجديدة لمدرسة (${name}):`);
    if (newPass && newPass.trim() !== '') {
      await fetch('/api/schools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'resetPassword', schoolName: name, newPassword: newPass.trim() })
      });
      await refreshSchools();
      alert('تم تحديث كلمة المرور بنجاح!');
    }
  };

  const handleSaveAnnouncement = async () => {
    if (!tempAnnouncement.trim()) return;
    setAnnouncement(tempAnnouncement);
    setIsEditingAnnouncement(false);

    await fetch('/api/schools', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'saveAnnouncement', schoolName, announcement: tempAnnouncement })
    });
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

  const handleSaveFullSchedule = async () => {
    await fetch('/api/schools', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'saveSchedule',
        schoolName,
        shiftType,
        scheduleData: activeSchedule
      })
    });

    setCurrentView('dashboard');
  };

  const handleClearDay = (dayId: string) => {
    if (confirm(`تفريغ جدول يوم ${DAYS.find(d => d.id === dayId)?.name}؟`)) {
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
      refreshSchools();
    } else {
      alert('كلمة المرور غير صحيحة!');
    }
  };

  const filledCount = activeSchedule[selectedDay]?.filter(p => p.subject.trim() !== '').length || 0;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 font-sans flex flex-col justify-between relative overflow-hidden selection:bg-indigo-500 selection:text-white" dir="rtl">
      
      <style jsx global>{`
        @media print {
          @page { size: A4 landscape; margin: 6mm; }
          body { background: white !important; color: black !important; font-size: 11px !important; }
          .screen-only, header, .sidebar-panel, footer, button, nav { display: none !important; }
          .print-container { display: block !important; width: 100% !important; color: black !important; }
          .print-table { width: 100% !important; border-collapse: collapse !important; margin-top: 10px !important; }
          .print-table th, .print-table td { border: 1.5px solid #000 !important; padding: 6px 4px !important; text-align: center !important; vertical-align: middle !important; }
          .print-table th { background-color: #f1f5f9 !important; font-weight: bold !important; color: black !important; }
        }
      `}</style>

      {/* نموذج الطباعة الشامل */}
      <div className="hidden print-container">
        <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-2">
          <div className="flex items-center gap-3">
            {schoolLogo && <img src={schoolLogo} alt="Logo" className="w-14 h-14 object-contain" />}
            <div>
              <h1 className="text-xl font-bold">{schoolName || 'اسم المدرسة'}</h1>
              <p className="text-xs">{governorate} - {directorate}</p>
            </div>
          </div>
          <div className="text-left">
            <h2 className="text-base font-bold">جدول الحصص الأسبوعي الشامل</h2>
            <p className="text-xs font-semibold">الدوام: {shiftType === 'morning' ? 'الصباحي ☀️' : 'الظهري 🌙'}</p>
          </div>
        </div>

        <table className="print-table">
          <thead>
            <tr>
              <th className="w-24">اليوم / الحصة</th>
              <th>الدرس الأول</th>
              <th>الدرس الثاني</th>
              <th>الدرس الثالث</th>
              <th>الدرس الرابع</th>
              <th>الدرس الخامس</th>
              <th>الدرس السادس</th>
            </tr>
          </thead>
          <tbody>
            {DAYS.map((day) => {
              const dayPeriods = activeSchedule[day.id] || [];
              return (
                <tr key={day.id}>
                  <td className="font-bold bg-slate-100">{day.name}</td>
                  {[1, 2, 3, 4, 5, 6].map((num) => {
                    const period = dayPeriods.find((p) => p.periodNumber === num);
                    const subject = period?.subject?.trim();
                    const className = period?.className?.trim();
                    return (
                      <td key={num}>
                        {subject ? (
                          <div>
                            <div className="font-bold text-xs">{subject}</div>
                            {className && <div className="text-[10px] text-slate-700">{className}</div>}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[10px]">-</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="mt-4 flex justify-between text-[10px] font-bold border-t border-slate-300 pt-2">
          <span>إدارة المدرسة: ________________</span>
          <span>الختم الرسمي: ________________</span>
          <span>إعداد المهندس مبدر الياسري</span>
        </div>
      </div>

      <div className="screen-only">
        {currentView === 'login' && (
          <div className="max-w-md mx-auto mt-8 bg-slate-900/80 backdrop-blur-2xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-tr from-amber-500/20 to-indigo-500/20 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto mb-3 text-3xl shadow-inner">
                🔒
              </div>
              <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-indigo-200 mb-1">منصة المدارس الذكية</h1>
              <p className="text-xs text-slate-400">نظام موثوق وحفظ دائم للمدارس</p>
            </div>

            <div className="flex bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800">
              <button
                onClick={() => { setAuthTab('login'); setLoginError(''); setLoginSuccess(''); }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition ${
                  authTab === 'login' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400'
                }`}
              >
                🔑 تسجيل الدخول
              </button>
              <button
                onClick={() => { setAuthTab('register'); setLoginError(''); setLoginSuccess(''); }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition ${
                  authTab === 'register' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400'
                }`}
              >
                ✨ تسجيل مدرسة جديدة
              </button>
            </div>

            {authTab === 'login' && (
              <form onSubmit={handleSchoolLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-amber-400 mb-1.5">🏷️ اسم المدرسة</label>
                  <input 
                    type="text" 
                    value={schoolName} 
                    onChange={(e) => setSchoolName(e.target.value)}
                    className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                    placeholder="اكتب اسم المدرسة"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-amber-400 mb-1.5">🔑 كلمة المرور</label>
                  <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                    placeholder="أدخل كلمة المرور"
                    required
                  />
                </div>

                {loginError && <p className="text-xs text-rose-400 text-center bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">{loginError}</p>}
                {loginSuccess && <p className="text-xs text-emerald-400 text-center bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">{loginSuccess}</p>}

                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl transition text-sm shadow-lg">
                  تسجيل الدخول 🚀
                </button>
              </form>
            )}

            {authTab === 'register' && (
              <form onSubmit={handleSchoolRegister} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-amber-400 mb-1.5">📍 المحافظة</label>
                  <input type="text" value={governorate} disabled className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-400" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">🏫 مديرية التربية</label>
                  <input type="text" value={directorate} onChange={(e) => setDirectorate(e.target.value)} className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-rose-400 mb-1.5">🏷️ اسم المدرسة</label>
                  <input type="text" value={schoolName} onChange={(e) => setSchoolName(e.target.value)} className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white" placeholder="مثال: ثانوية المستقبل الأهلية" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-emerald-400 mb-1.5">📱 رقم الهاتف</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white" placeholder="07700000000" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-amber-400 mb-1.5">🔑 كلمة المرور</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white" placeholder="تعيين رمز سري" required />
                </div>

                {loginError && <p className="text-xs text-rose-400 text-center bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">{loginError}</p>}

                <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl transition text-sm shadow-lg">
                  حفظ وتسجيل الحساب نهائياً 📝
                </button>
              </form>
            )}

            <div className="pt-4 border-t border-slate-800 text-center">
              <button onClick={() => { refreshSchools(); setCurrentView('super-admin'); }} className="text-xs text-amber-400 hover:underline font-semibold">
                ⭐ لوحة تحكم الأدمن العام
              </button>
            </div>
          </div>
        )}

        {currentView === 'dashboard' && (
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="bg-slate-900/80 backdrop-blur-2xl border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative group w-16 h-16 rounded-2xl border-2 border-dashed border-indigo-500/40 flex items-center justify-center bg-slate-950 overflow-hidden cursor-pointer">
                  {schoolLogo ? <img src={schoolLogo} alt="Logo" className="w-full h-full object-cover" /> : <Upload className="w-5 h-5 text-indigo-400" />}
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
                <div>
                  <span className="text-[11px] bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full font-semibold">● متصل ومحفوظ بثبات</span>
                  <h1 className="text-2xl font-black text-white mt-2 flex items-center gap-2">
                    <Building2 className="w-6 h-6 text-indigo-400" />
                    {schoolName}
                  </h1>
                  <p className="text-xs text-slate-400">{governorate} - {directorate}</p>
                </div>
              </div>

              <div className="flex bg-slate-950/90 p-1.5 rounded-2xl border border-slate-800">
                <button onClick={() => setShiftType('morning')} className={`px-4 py-2 rounded-xl text-xs font-bold transition ${shiftType === 'morning' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'}`}>☀️ صباحي</button>
                <button onClick={() => setShiftType('afternoon')} className={`px-4 py-2 rounded-xl text-xs font-bold transition ${shiftType === 'afternoon' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>🌙 ظهري</button>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button onClick={handleWhatsAppShare} className="bg-emerald-600 text-white px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1"><Share2 className="w-4 h-4" /> واتساب</button>
                <button onClick={() => setCurrentView('editor')} className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold">تعديل الجدول ✏️</button>
                <button onClick={handleLogout} className="bg-rose-500/10 text-rose-400 px-3 py-2.5 rounded-xl text-xs">خروج</button>
              </div>
            </div>

            {/* عرض أزرار أيام الأسبوع */}
            <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {DAYS.map((day) => (
                  <button
                    key={day.id}
                    onClick={() => setSelectedDay(day.id)}
                    className={`flex-1 min-w-[75px] py-2.5 px-3 rounded-2xl text-xs font-bold text-center transition ${
                      selectedDay === day.id ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-slate-950 text-slate-400 border border-slate-800'
                    }`}
                  >
                    {day.name}
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                {activeSchedule[selectedDay]?.map((period) => (
                  <div key={period.id} className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-xs">0{period.periodNumber}</span>
                      <span className="text-xs text-slate-400">{period.periodName}</span>
                    </div>
                    <span className="text-xs bg-slate-900 text-indigo-300 px-3 py-1 rounded-lg font-bold">{period.className || 'الصف غير محدد'}</span>
                    <span className="text-base font-black text-amber-400">{period.subject || 'حصة فراغ'}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 text-center">
                <button onClick={() => window.print()} className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-xl text-xs font-bold border border-slate-700">🖨️ طباعة الجدول بالكامل (A4)</button>
              </div>
            </div>
          </div>
        )}

        {currentView === 'editor' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-slate-900/80 p-5 rounded-3xl border border-slate-800 flex items-center justify-between">
              <h1 className="text-lg font-bold text-white">محرر الحصص الدراسية</h1>
              <button onClick={() => setCurrentView('dashboard')} className="text-xs bg-slate-800 text-slate-300 px-4 py-2 rounded-xl">العودة ↩️</button>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
              {DAYS.map((day) => (
                <button
                  key={day.id}
                  onClick={() => setSelectedDay(day.id)}
                  className={`flex-1 py-3 px-3 rounded-xl text-xs font-bold text-center ${selectedDay === day.id ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400 border border-slate-800'}`}
                >
                  {day.name}
                </button>
              ))}
            </div>

            <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 space-y-4">
              <h2 className="text-sm font-bold text-indigo-400 border-b border-slate-800 pb-2">تعديل حصص يوم {DAYS.find(d => d.id === selectedDay)?.name}</h2>

              {activeSchedule[selectedDay]?.map((period) => (
                <div key={period.id} className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-3">
                  <span className="text-xs font-bold text-indigo-300">الدرس رقم {period.periodNumber}</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input 
                      type="text" 
                      value={period.subject} 
                      onChange={(e) => handlePeriodFieldChange(selectedDay, period.id, 'subject', e.target.value)}
                      placeholder="اسم المادة (أو حصة فراغ)" 
                      className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" 
                    />
                    <input 
                      type="text" 
                      value={period.className || ''} 
                      onChange={(e) => handlePeriodFieldChange(selectedDay, period.id, 'className', e.target.value)}
                      placeholder="الصف (مثال: الخامس الابتدائي)" 
                      className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-amber-400" 
                    />
                    <input 
                      type="text" 
                      value={period.teacher} 
                      onChange={(e) => handlePeriodFieldChange(selectedDay, period.id, 'teacher', e.target.value)}
                      placeholder="اسم الأستاذ" 
                      className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" 
                    />
                  </div>
                </div>
              ))}

              <button onClick={handleSaveFullSchedule} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-2xl text-sm shadow-xl">
                💾 حفظ التعديلات والاعتماد نهائياً
              </button>
            </div>
          </div>
        )}

        {currentView === 'super-admin' && (
          <div className="max-w-3xl mx-auto space-y-6">
            {!isSuperAuthenticated ? (
              <div className="bg-slate-900/80 p-8 rounded-3xl border border-slate-800 text-center space-y-4">
                <h1 className="text-xl font-bold text-white">لوحة الأدمن العام</h1>
                <form onSubmit={handleSuperAdminLogin} className="space-y-4 max-w-sm mx-auto">
                  <input type="password" value={superAdminPass} onChange={(e) => setSuperAdminPass(e.target.value)} placeholder="كلمة المرور" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white" required />
                  <button type="submit" className="w-full bg-amber-500 text-slate-950 font-bold py-3 rounded-xl">دخول</button>
                </form>
                <button onClick={() => setCurrentView('login')} className="text-xs text-slate-400 underline">العودة</button>
              </div>
            ) : (
              <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <h2 className="text-sm font-bold text-white">المدارس المسجلة ({registeredSchools.length})</h2>
                  <button onClick={() => setIsSuperAuthenticated(false)} className="text-xs text-slate-400">قفل اللوحة 🔒</button>
                </div>
                <div className="space-y-3">
                  {registeredSchools.map((s) => (
                    <div key={s.id} className="bg-slate-950 p-4 rounded-2xl flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-white text-sm block">{s.schoolName}</span>
                        <span className="text-emerald-400">هاتف: {s.phone}</span> | <span className="text-amber-400">الرمز: {s.passwordHash}</span>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleResetPassword(s.schoolName)} className="bg-amber-500/10 text-amber-400 px-3 py-1.5 rounded-xl">تغيير الرمز</button>
                        <button onClick={() => handleDeleteSchool(s.id, s.schoolName)} className="bg-rose-500/10 text-rose-400 px-3 py-1.5 rounded-xl">حذف</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-center pt-2">
                  <button onClick={() => setCurrentView('login')} className="text-xs text-slate-400 underline">العودة للرئيسية</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <footer className="mt-8 pt-4 border-t border-slate-800 text-center text-xs text-slate-400 screen-only">
        إعداد وتصميم المهندس مبدر الياسري | دعم فني واتساب: <span dir="ltr">07744288885</span>
      </footer>

    </main>
  );
}