import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Trash2, 
  Building2, 
  Stethoscope, 
  Store, 
  Trees,
  Lightbulb,
  ArrowLeft
} from 'lucide-react';
import { motion } from 'motion/react';

const services = [
  {
    title: 'النظافة وإدارة النفايات',
    description: 'الإبلاغ عن تراكم النفايات، أو طلب حاويات جديدة، أو الشكوى من التقصير في النظافة العامة.',
    icon: Trash2,
    color: 'from-green-400 to-emerald-600',
    iconColor: 'text-emerald-500'
  },
  {
    title: 'تنظيم الأبنية والتراخيص',
    description: 'متابعة شؤون البناء، إصدار التراخيص اللازمة، والتبليغ عن المخالفات الإنشائية.',
    icon: Building2,
    color: 'from-blue-400 to-indigo-600',
    iconColor: 'text-indigo-500'
  },
  {
    title: 'تنظيم الشوارع والإنارة',
    description: 'صيانة الشوارع، إصلاح أعطال الإنارة العامة، والتبليغ عن الحفر أو مشاكل الأرصفة.',
    icon: Lightbulb,
    color: 'from-yellow-400 to-amber-600',
    iconColor: 'text-amber-500'
  },
  {
    title: 'الرقابة الصحية على المحلات',
    description: 'الرقابة على المنشآت الغذائية والتجارية لضمان التزامها بالاشتراطات والمعايير الصحية.',
    icon: Stethoscope,
    color: 'from-teal-400 to-cyan-600',
    iconColor: 'text-cyan-500'
  },
  {
    title: 'تنظيم الأسواق والبسطات',
    description: 'تنظيم عمل الأسواق الشعبية، ومنع التعديات، وإدارة تواجد البسطات في الأماكن المخصصة.',
    icon: Store,
    color: 'from-orange-400 to-red-500',
    iconColor: 'text-orange-500'
  },
  {
    title: 'الحدائق والمتنزهات',
    description: 'الاعتناء بالحدائق العامة، تقليم الأشجار المتداخلة، وزيادة الرقعة الخضراء في المدينة.',
    icon: Trees,
    color: 'from-lime-400 to-green-600',
    iconColor: 'text-green-500'
  }
];

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans relative" dir="rtl">
      {/* Fixed Background Image */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-25 pointer-events-none z-0"
        style={{ backgroundImage: "url('/bgc 2.jpeg')" }}
      />
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            {/* <div className="flex-shrink-0 flex items-center gap-2 md:gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-indigo-600 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold text-lg md:text-xl shadow-lg shadow-indigo-200">
                م
              </div>
              <span className="text-xl md:text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-blue-600">
                مشكلتك
              </span>
            </div> */}

            {/* Right - Logo */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <img 
                  src="/favicon-32x32.png" 
                  alt="لوغو مشكلتك" 
                  className="w-8 h-8 object-contain" 
                />
                <h1 className="text-2xl font-black text-emerald-700">
                  مشكلتك
                </h1>
              </div>
            </div>
                      
            
            {/* Action Buttons */}
            <div className="flex items-center gap-2 md:gap-4">
              <Link 
                to="/login" 
                className="text-sm md:text-base text-slate-600 hover:text-indigo-600 font-semibold transition-colors duration-200"
              >
                دخول
              </Link>
              <Link 
                to="/register" 
                className="text-sm md:text-base bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-4 md:px-6 py-2 md:py-2.5 rounded-full font-semibold shadow-md hover:shadow-lg hover:shadow-indigo-200 hover:-translate-y-0.5 transition-all duration-200"
              >
                حساب جديد
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-24 pb-16 md:pt-32 md:pb-20 lg:pt-40 lg:pb-28 overflow-hidden z-10">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 md:w-96 h-64 md:h-96 rounded-full bg-indigo-100 blur-3xl opacity-50 mix-blend-multiply pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 md:w-96 h-64 md:h-96 rounded-full bg-blue-100 blur-3xl opacity-50 mix-blend-multiply pointer-events-none"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-6 md:mb-8"
          >
            صوتك يهمنا، <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">لنبني معاً</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 max-w-2xl mx-auto text-lg sm:text-xl text-slate-600 leading-relaxed mb-8 md:mb-10 px-2"
          >
            منصة "مشكلتك" هي حلقة الوصل المباشرة بينك وبين بلديتك. ارفع شكواك، قدم مقترحاتك، وتابع حالة طلباتك بكل شفافية وسهولة.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center gap-4"
          >
            <Link 
              to="/login" 
              className="bg-indigo-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-bold text-base md:text-lg shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
            >
              ابدأ الآن <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Services Section */}
      <div className="py-16 md:py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-4">الخدمات التي نقدمها</h2>
            <div className="w-16 md:w-24 h-1.5 bg-indigo-600 mx-auto rounded-full"></div>
            <p className="mt-4 text-base md:text-lg text-slate-500">اختر نوع الخدمة أو الشكوى التي تود الإبلاغ عنها</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-white/50 shadow-lg hover:shadow-2xl hover:border-indigo-100 transition-all duration-300"
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-slate-50 group-hover:scale-110 transition-transform duration-300`}>
                  <service.icon className={`w-8 h-8 ${service.iconColor}`} />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-3">{service.title}</h3>
                <p className="text-slate-600 mb-8 leading-relaxed h-20">
                  {service.description}
                </p>
                
                <Link 
                  to="/login" 
                  className={`inline-flex items-center justify-center w-full py-3 px-4 rounded-xl text-white font-semibold bg-gradient-to-r ${service.color} opacity-90 group-hover:opacity-100 hover:shadow-lg transition-all duration-200 gap-2`}
                >
                  قدم الآن
                  <ArrowLeft className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 py-12 text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-bold">
            م
          </div>
          <span className="text-xl font-bold text-white">
            مشكلتك
          </span>
        </div>
        <p className="text-slate-400">© {new Date().getFullYear()} منصة مشكلتك. جميع الحقوق محفوظة.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
