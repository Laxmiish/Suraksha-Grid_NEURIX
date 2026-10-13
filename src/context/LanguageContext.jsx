import React, { createContext, useContext, useState, useEffect } from "react";
import { GlobeIcon } from "../components/Icons";

const LanguageContext = createContext();

export const translations = {
  en: {
    // Brand
    brandName: "Suraksha Grid",
    brandTagline: "National Portable Social Security Infrastructure",
    subTagline: "Verifiable work seniority, BOCW welfare benefits, and portable social security for India's unorganized workforce.",
    
    // Roles
    worker: "Worker",
    workerDesc: "Construction & unorganized laborers seeking portable statutory benefits",
    workProvider: "Work Provider",
    workProviderDesc: "Licensed contractors & project heads managing jobsites and muster rolls",
    supervisor: "Supervisor",
    supervisorDesc: "On-site welfare officers verifying muster rolls & compliance",
    householdEmployer: "Household Employer",
    householdDesc: "Citizens directly engaging cooks, drivers, housekeepers & caretakers",

    // Common Actions & Labels
    signIn: "Sign In",
    register: "Register with e-KYC",
    login: "Log In",
    logout: "Sign Out",
    welcomeBack: "Welcome Back",
    selectRole: "Select Your Role",
    mobileNumber: "Mobile Number",
    password: "Password",
    enterMobile: "Enter 10-digit mobile number",
    enterPassword: "Enter your password",
    submitting: "Processing...",
    backToRole: "Change Role",
    needAccount: "Don't have an account?",
    alreadyAccount: "Already registered?",
    createAccount: "Create Verified Account",
    demoCredentials: "Demo Credentials Available",
    
    // Status & Badges
    active: "Active",
    verified: "Verified",
    statutory: "Statutory",
    seniority: "Statutory Seniority",
    daysWorked: "Days Worked",
    bocwYears: "BOCW Years",
    nextTier: "Days to Next Benefit Tier",
    eligibleSchemes: "Eligible Schemes",
    
    // Dashboards
    workerPortal: "Worker Welfare Portal",
    workProviderPortal: "Work Provider Portal",
    supervisorPortal: "Supervisory Compliance Portal",
    jobsites: "Active Jobsites",
    musterRoll: "Daily Muster Roll",
    addJobsite: "Register New Site",
    markPresent: "Mark Present",
    markAbsent: "Mark Absent",
    dailyRate: "Daily Wage",
    action: "Action",
    status: "Status",
    date: "Date",
    viewDetails: "View Details",
    
    // Benefits
    welfareBenefits: "Statutory BOCW Welfare Benefits",
    unionMemberships: "Trade Union History",
    labourBoards: "State Welfare Board Registrations",
    coverageAmount: "Coverage",
    schemeType: "Scheme Type",
    requirement: "Seniority Requirement",
    noSchemes: "No eligible schemes found for current seniority tier.",
    
    // Errors
    invalidMobile: "Please enter a valid 10-digit mobile number.",
    invalidPass: "Password must be at least 6 characters.",
    networkError: "Unable to connect to server. Please ensure backend is active."
  },
  
  hi: {
    brandName: "सुरक्षा ग्रिड",
    brandTagline: "राष्ट्रीय पोर्टेबल सामाजिक सुरक्षा अवसंरचना",
    subTagline: "असंगठित श्रमिकों के लिए सत्यापित कार्य वरिष्ठता, बीओसीडब्ल्यू कल्याण लाभ और पोर्टेबल पहचान।",
    
    worker: "श्रमिक (मज़दूर)",
    workerDesc: "पोर्टेबल लाभ और वरिष्ठता ट्रैक करने वाले निर्माण व असंगठित श्रमिक",
    workProvider: "कार्य प्रदाता (ठेकेदार)",
    workProviderDesc: "कार्यस्थल और उपस्थिति रजिस्टर प्रबंधित करने वाले लाइसेंस प्राप्त प्रदाता",
    supervisor: "पर्यवेक्षक (सुपरवाइज़र)",
    supervisorDesc: "कार्यस्थल अनुपालन और दैनिक उपस्थिति प्रमाणित करने वाले अधिकारी",
    householdEmployer: "घरेलू नियोक्ता",
    householdDesc: "रसोइया, चालक, घरेलू सहायकों को सीधे नियुक्त करने वाले नागरिक",

    signIn: "लॉग इन करें",
    register: "ई-केवाईसी से पंजीकरण",
    login: "लॉग इन",
    logout: "लॉग आउट",
    welcomeBack: "वापसी पर स्वागत",
    selectRole: "अपनी भूमिका चुनें",
    mobileNumber: "मोबाइल नंबर",
    password: "पासवर्ड",
    enterMobile: "10-अंकीय मोबाइल नंबर दर्ज करें",
    enterPassword: "अपना पासवर्ड दर्ज करें",
    submitting: "प्रक्रिया जारी...",
    backToRole: "भूमिका बदलें",
    needAccount: "खाता नहीं है?",
    alreadyAccount: "पहले से पंजीकृत हैं?",
    createAccount: "सत्यापित खाता बनाएं",
    demoCredentials: "डेमो क्रेडेंशियल्स उपलब्ध हैं",
    
    active: "सक्रिय",
    verified: "सत्यापित",
    statutory: "वैधानिक",
    seniority: "वैधानिक वरिष्ठता",
    daysWorked: "कार्य दिवस",
    bocwYears: "बीओसीडब्ल्यू वर्ष",
    nextTier: "अगले लाभ स्तर हेतु शेष दिन",
    eligibleSchemes: "पात्र योजनाएं",
    
    workerPortal: "श्रमिक कल्याण पोर्टल",
    workProviderPortal: "कार्य प्रदाता पोर्टल",
    supervisorPortal: "पर्यवेक्षी अनुपालन पोर्टल",
    jobsites: "सक्रिय कार्यस्थल",
    musterRoll: "दैनिक मस्टर रोल",
    addJobsite: "नया कार्यस्थल जोड़ें",
    markPresent: "उपस्थित दर्ज करें",
    markAbsent: "अनुपस्थित दर्ज करें",
    dailyRate: "दैनिक मजदूरी",
    action: "कार्रवाई",
    status: "स्थिति",
    date: "दिनांक",
    viewDetails: "विवरण देखें",
    
    welfareBenefits: "वैधानिक बीओसीडब्ल्यू कल्याण लाभ",
    unionMemberships: "श्रम संघ सदस्यता इतिहास",
    labourBoards: "राज्य कल्याण बोर्ड पंजीकरण",
    coverageAmount: "कवरेज राशि",
    schemeType: "योजना प्रकार",
    requirement: "आवश्यक वरिष्ठता",
    noSchemes: "वर्तमान वरिष्ठता स्तर पर कोई योजना उपलब्ध नहीं।",
    
    invalidMobile: "कृपया वैध 10-अंकीय मोबाइल नंबर दर्ज करें।",
    invalidPass: "पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।",
    networkError: "सर्वर से संपर्क नहीं हो सका। कृपया बैकएंड जांचें।"
  },

  mr: {
    brandName: "सुरक्षा ग्रिड",
    brandTagline: "राष्ट्रीय पोर्टेबल सामाजिक सुरक्षा पायाभूत सुविधा",
    subTagline: "असंघटित कामगारांसाठी प्रमाणित कार्य ज्येष्ठता आणि कल्याणकारी योजनांचा लाभ.",
    
    worker: "कामगार",
    workerDesc: "बांधकाम व असंघटित कामगार ज्यांना पोर्टेबल लाभ हवे आहेत",
    workProvider: "काम प्रदाता (कंत्राटदार)",
    workProviderDesc: "कामाच्या जागा आणि उपस्थिती व्यवस्थापित करणारे परवानाधारक प्रदाता",
    supervisor: "पर्यवेक्षक",
    supervisorDesc: "कामाच्या ठिकाणी हजेरी व नियमांचे पालन तपासणारे अधिकारी",
    householdEmployer: "घरगुती मालक",
    householdDesc: "स्वयंपाकी, चालक व घरकामगारांना थेट कामावर ठेवणारे नागरिक",

    signIn: "साइन इन करा",
    register: "ई-केवायसी नोंदणी",
    login: "लॉग इन",
    logout: "बाहेर पडा",
    welcomeBack: "पुन्हा स्वागत",
    selectRole: "आपली भूमिका निवडा",
    mobileNumber: "मोबाईल नंबर",
    password: "पासवर्ड",
    enterMobile: "१० अंकी मोबाईल नंबर टाका",
    enterPassword: "पासवर्ड टाका",
    submitting: "प्रक्रिया चालू आहे...",
    backToRole: "भूमिका बदला",
    needAccount: "खाते नाही का?",
    alreadyAccount: "आधीच नोंदणी केली आहे?",
    createAccount: "खाते तयार करा",
    demoCredentials: "डेमो क्रेडेन्शियल्स उपलब्ध",
    
    active: "सक्रिय",
    verified: "प्रमाणित",
    statutory: "वैधानिक",
    seniority: "वैधानिक ज्येष्ठता",
    daysWorked: "कामाचे दिवस",
    bocwYears: "बीओसीडब्ल्यू वर्षे",
    nextTier: "पुढील लाभासाठी उर्वरित दिवस",
    eligibleSchemes: "पात्र योजना",
    
    workerPortal: "कामगार कल्याण पोर्टल",
    workProviderPortal: "काम प्रदाता पोर्टल",
    supervisorPortal: "पर्यवेक्षक पोर्टल",
    jobsites: "सक्रिय कार्यस्थळे",
    musterRoll: "दैनिक हजेरी पत्रक",
    addJobsite: "नवीन जागा जोडा",
    markPresent: "हजर नोंदवा",
    markAbsent: "गैरहजर नोंदवा",
    dailyRate: "दैनिक मजुरी",
    action: "कृती",
    status: "स्थिती",
    date: "तारीख",
    viewDetails: "तपशील पहा",
    
    welfareBenefits: "वैधानिक बीओसीडब्ल्यू कल्याणकारी लाभ",
    unionMemberships: "कामगार संघटना इतिहास",
    labourBoards: "राज्य कामगार मंडळ नोंदणी",
    coverageAmount: "कवरेज रक्कम",
    schemeType: "योजना प्रकार",
    requirement: "आवश्यक ज्येष्ठता",
    noSchemes: "सध्याच्या स्तरावर कोणत्याही योजना उपलब्ध नाहीत.",
    
    invalidMobile: "कृपया वैध १० अंकी मोबाईल नंबर टाका.",
    invalidPass: "पासवर्ड किमान ६ अक्षरांचा असावा.",
    networkError: "सर्व्हरशी संपर्क होऊ शकला नाही."
  },

  ta: {
    brandName: "சுரக்ஷா கிரிட்",
    brandTagline: "தேசிய சமூக பாதுகாப்பு உள்கட்டமைப்பு",
    subTagline: "அமைப்புசாரா தொழிலாளர்களுக்கான பணி மூப்பு மற்றும் சமூக பாதுகாப்பு நன்மைகள்.",
    
    worker: "தொழிலாளி",
    workerDesc: "நன்மைகளைப் பெற விரும்பும் அமைப்புசாரா தொழிலாளர்கள்",
    workProvider: "வேலை வழங்குநர்",
    workProviderDesc: "பணித்தளங்களை நிர்வகிக்கும் ஒப்பந்ததாரர்கள்",
    supervisor: "கண்காணிப்பாளர்",
    supervisorDesc: "வருகைப்பதிவு மற்றும் விதிகளை உறுதிப்படுத்தும் அலுவலர்கள்",
    householdEmployer: "வீட்டு முதலாளி",
    householdDesc: "வீட்டுப் பணியாளர்களை நேரடியாக நியமிக்கும் பொதுமக்கள்",

    signIn: "உள்நுழைக",
    register: "இ-கேஒய்சி பதிவு",
    login: "உள்நுழைக",
    logout: "வெளியேறு",
    welcomeBack: "மீண்டும் வருக",
    selectRole: "உங்கள் பாத்திரத்தைத் தேர்வுசெய்க",
    mobileNumber: "கைபேசி எண்",
    password: "கடவுச்சொல்",
    enterMobile: "10 இலக்க எண்ணை உள்ளிடவும்",
    enterPassword: "கடவுச்சொல்லை உள்ளிடவும்",
    submitting: "செயலாக்குகிறது...",
    backToRole: "மாற்றவும்",
    needAccount: "கணக்கு இல்லையா?",
    alreadyAccount: "ஏற்கனவே பதிந்துள்ளீர்களா?",
    createAccount: "கணக்கை உருவாக்குக",
    demoCredentials: "டெமோ விவரங்கள் கிடைக்கின்றன",
    
    active: "செயலில் உள்ளது",
    verified: "சரிபார்க்கப்பட்டது",
    statutory: "சட்டபூர்வ",
    seniority: "பணி மூப்பு",
    daysWorked: "வேலை செய்த நாட்கள்",
    bocwYears: "BOCW ஆண்டுகள்",
    nextTier: "அடுத்த நன்மைக்கான நாட்கள்",
    eligibleSchemes: "தகுதியான திட்டங்கள்",
    
    workerPortal: "தொழிலாளர் நல போர்டல்",
    workProviderPortal: "வேலை வழங்குநர் போர்டல்",
    supervisorPortal: "கண்காணிப்பாளர் போர்டல்",
    jobsites: "பணித்தளங்கள்",
    musterRoll: "வருகைப்பதிவு",
    addJobsite: "புதிய தளம் சேர்க்க",
    markPresent: "வருகை",
    markAbsent: "விடுப்பு",
    dailyRate: "தினசரி கூலி",
    action: "செயல்",
    status: "நிலை",
    date: "தேதி",
    viewDetails: "விவரங்களை காண்க",
    
    welfareBenefits: "BOCW நலத்திட்ட நன்மைகள்",
    unionMemberships: "தொழிற்சங்க வரலாறு",
    labourBoards: "மாநில நல வாரிய பதிவுகள்",
    coverageAmount: "பாதுகாப்பு தொகை",
    schemeType: "திட்ட வகை",
    requirement: "தேவைப்படும் மூப்பு",
    noSchemes: "தகுதியான திட்டங்கள் எதுவும் கிடைக்கவில்லை.",
    
    invalidMobile: "சரியான 10 இலக்க எண்ணை உள்ளிடவும்.",
    invalidPass: "கடவுச்சொல் குறைந்தது 6 எழுத்துகள் இருக்க வேண்டும்.",
    networkError: "சேவையகத்துடன் இணைக்க முடியவில்லை."
  },

  bn: {
    brandName: "সুরক্ষা গ্রিড",
    brandTagline: "জাতীয় সামাজিক সুরক্ষা পরিকাঠামো",
    subTagline: "অসংগঠিত শ্রমিকদের জন্য কর্মকালীন জ্যেষ্ঠতা এবং বিওসিডব্লিউ কল্যাণ সুবিধা।",
    
    worker: "শ্রমিক",
    workerDesc: "সুবিধা ও জ্যেষ্ঠতা ট্র্যাক করতে ইচ্ছুক অসংগঠিত শ্রমিক",
    workProvider: "কর্ম প্রদানকারী",
    workProviderDesc: "কর্মক্ষেত্র ও দৈনিক হাজিরা পরিচালনাকারী ঠিকাদার",
    supervisor: "তত্ত্বাবধায়ক",
    supervisorDesc: "কর্মক্ষেত্রের সম্মতি ও হাজিরা নিরীক্ষাকারী কর্মকর্তা",
    householdEmployer: "গৃহস্থ নিয়োগকর্তা",
    householdDesc: "রাঁধুনি, চালক ও গৃহকর্মীদের সরাসরি নিয়োগকারী নাগরিক",

    signIn: "সাইন ইন করুন",
    register: "ই-কেওয়াইসি নিবন্ধন",
    login: "লগ ইন",
    logout: "লগ আউট",
    welcomeBack: "স্বাগতম",
    selectRole: "আপনার ভূমিকা নির্বাচন করুন",
    mobileNumber: "মোবাইল নম্বর",
    password: "পাসওয়ার্ড",
    enterMobile: "১০ সংখ্যার মোবাইল নম্বর দিন",
    enterPassword: "পাসওয়ার্ড দিন",
    submitting: "প্রক্রিয়াকরণ চলছে...",
    backToRole: "ভূমিকা পরিবর্তন",
    needAccount: "অ্যাকাউন্ট নেই?",
    alreadyAccount: "ইতিমধ্যে নিবন্ধিত?",
    createAccount: "অ্যাকাউন্ট তৈরি করুন",
    demoCredentials: "ডেমো তথ্য উপলব্ধ",
    
    active: "সক্রিয়",
    verified: "যাচাইকৃত",
    statutory: "সংবিধিবদ্ধ",
    seniority: "কর্মকালীন জ্যেষ্ঠতা",
    daysWorked: "কাজের দিন",
    bocwYears: "বিওসিডব্লিউ বছর",
    nextTier: "পরবর্তী সুবিধার জন্য বাকি দিন",
    eligibleSchemes: "যোগ্য প্রকল্পসমূহ",
    
    workerPortal: "শ্রমিক কল্যাণ পোর্টাল",
    workProviderPortal: "কর্ম প্রদানকারী পোর্টাল",
    supervisorPortal: "তত্ত্বাবধায়ক পোর্টাল",
    jobsites: "সক্রিয় কর্মক্ষেত্র",
    musterRoll: "দৈনিক হাজিরা রোল",
    addJobsite: "নতুন কর্মক্ষেত্র যোগ করুন",
    markPresent: "উপস্থিত",
    markAbsent: "অনুপস্থিত",
    dailyRate: "দৈনিক মজুরি",
    action: "পদক্ষেপ",
    status: "অবস্থা",
    date: "তারিখ",
    viewDetails: "বিস্তারিত দেখুন",
    
    welfareBenefits: "বিওসিডব্লিউ কল্যাণমূলক সুবিধাসমূহ",
    unionMemberships: "ট্রেড ইউনিয়ন ইতিহাস",
    labourBoards: "রাজ্য কল্যাণ বোর্ড নিবন্ধন",
    coverageAmount: "কভারেজ পরিমাণ",
    schemeType: "প্রকল্পের ধরন",
    requirement: "প্রয়োজনীয় জ্যেষ্ঠতা",
    noSchemes: "বর্তমানে কোনো যোগ্য প্রকল্প নেই।",
    
    invalidMobile: "অনুগ্রহ করে সঠিক ১০ সংখ্যার মোবাইল নম্বর দিন।",
    invalidPass: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।",
    networkError: "সার্ভারে সংযোগ করা যায়নি।"
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("sg_lang") || "en";
  });

  useEffect(() => {
    localStorage.setItem("sg_lang", language);
  }, [language]);

  const t = (key) => {
    const langDict = translations[language] || translations.en;
    return langDict[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

export const LanguageSelector = ({ variant = "default" }) => {
  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: "en", label: "English" },
    { code: "hi", label: "हिन्दी" },
    { code: "mr", label: "मराठी" },
    { code: "ta", label: "தமிழ்" },
    { code: "bn", label: "বাংলা" }
  ];

  return (
    <div className="relative inline-flex items-center gap-1.5 bg-slate-900/60 backdrop-blur-md border border-slate-700/60 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-200 shadow-sm transition hover:border-slate-500">
      <GlobeIcon size={14} className="text-blue-400" />
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="bg-transparent border-none text-slate-100 outline-none cursor-pointer pr-1 text-xs font-semibold focus:ring-0"
        aria-label="Select Language"
      >
        {languages.map((l) => (
          <option key={l.code} value={l.code} className="bg-slate-900 text-slate-100">
            {l.label}
          </option>
        ))}
      </select>
    </div>
  );
};
