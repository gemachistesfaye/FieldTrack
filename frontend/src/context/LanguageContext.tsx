import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'am';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

export const translations: Record<Language, Record<string, string>> = {
  en: {
    // Brand & App
    appName: 'FieldSync',
    headerTitle: 'Field Operations Command',
    online: 'Online',
    offline: 'Offline',
    onlineDirect: 'Online (Direct Backend Link)',
    offlineLocal: 'Offline (Local Dexie Storage)',
    syncReconcile: 'All changes reconcile directly with PostgreSQL',
    syncOfflineSaved: 'Changes are safely stored locally in browser IndexedDB',

    // Navigation
    navDashboard: 'Dashboard',
    navMyReports: 'My Reports',
    navAllReports: 'All Reports',
    navWorkflow: 'Workflow Board',
    navAnalytics: 'Analytics',
    navActivity: 'Activity Log',
    navTeam: 'Team Directory',
    navSync: 'Offline Sync',
    navSettings: 'Settings',
    navLogIncident: 'Log Incident',
    navProfile: 'My Profile',
    signOut: 'Sign Out',

    // Roles
    roleFieldWorker: 'Field Technician',
    roleCoordinator: 'Coordinator',
    roleAdmin: 'Administrator',
    roleDescFieldWorker: 'Submits field incidents, collects GPS telemetry, and manages local offline drafts.',
    roleDescCoordinator: 'Triages incoming incidents, reviews severity, assigns technicians, and manages workflow.',
    roleDescAdmin: 'Maintains system users, oversees cloud infrastructure, security policies, and audits.',

    // Common Actions
    newReport: 'New Report',
    newIncidentReport: 'New Incident Report',
    saveDraft: 'Save as Local Draft',
    submitReport: 'Submit Incident Report',
    cancel: 'Cancel',
    save: 'Save',
    saveChanges: 'Save Changes',
    refresh: 'Refresh',
    search: 'Search...',
    filter: 'Filter',
    inspect: 'Inspect',
    details: 'Details',
    viewAll: 'View All',
    actions: 'Actions',
    close: 'Close',
    assign: 'Assign',
    update: 'Update',
    delete: 'Delete',

    // Report Statuses
    statusDraft: 'Draft',
    statusSubmitted: 'Submitted',
    statusAssigned: 'Assigned',
    statusInProgress: 'In Progress',
    statusResolved: 'Resolved',
    statusRejected: 'Rejected',

    // Priorities
    priorityLow: 'Low',
    priorityMedium: 'Medium',
    priorityHigh: 'High',
    priorityCritical: 'Critical',

    // Categories
    catWater: 'Water Point',
    catMachinery: 'Machinery',
    catElectrical: 'Electrical',
    catInfrastructure: 'Infrastructure',
    catSafety: 'Safety Hazard',
    catOutage: 'Service Outage',
    allCategories: 'All Categories',
    allStatuses: 'All Statuses',

    // Field Worker Dashboard
    techCommand: 'Field Technician Command',
    welcomeBack: 'Welcome back',
    techSubtitle: 'Field incident reporting and local draft synchronization.',
    myRecentReports: 'My Recent Incident Reports',
    myRecentDesc: 'Incident logs and infrastructure fault submissions filed by your account',
    networkStatus: 'Network Status',
    offlineQueue: 'Offline Queue',
    statusDistribution: 'Report Status Distribution',
    queueLink: 'Queue',
    noIncidentsFound: 'No incident reports found',
    noIncidentsDesc: 'Use the button below or in the header to submit your first incident.',

    // Coordinator Dashboard
    coordCommand: 'Regional Dispatch & Triage Command',
    coordWelcome: 'Field Operations Triage',
    coordSubtitle: 'Real-time incident dispatch, crew assignment, and lifecycle monitoring.',
    unassignedIncidents: 'Unassigned Incident Queue',
    assignModalTitle: 'Assign Incident Report',
    assignTo: 'Assign To Technician',
    selectTechnician: 'Select field technician...',

    // Admin Dashboard
    adminCommand: 'Full Audit & Governance Authority',
    adminWelcome: 'System Administration Console',
    adminSubtitle: 'Platform telemetry, user directory governance, and system security controls.',
    telemetryHealth: 'System Telemetry & Health',
    rosterBreakdown: 'Personnel & Role Distribution',
    activeUsers: 'Active Personnel',

    // Settings & Profile
    settingsTitle: 'Profile & Settings',
    settingsSubtitle: 'Manage personal profile, password security, appearance, language, and system configuration.',
    tabProfile: 'Profile & Account',
    tabSecurity: 'Password & Security',
    tabAppearance: 'Appearance & Language',
    tabSystem: 'System & Storage',

    // Profile Tab
    accountInfo: 'Account Information',
    accountInfoDesc: 'Your personal identification and organization role credentials.',
    fullName: 'Full Name',
    emailAddress: 'Email Address',
    roleLabel: 'Assigned Role',
    accountStatus: 'Account Status',
    activeStatus: 'Active & Verified',
    memberSince: 'Member Since',
    updateProfileBtn: 'Update Profile',
    profileUpdatedSuccess: 'Profile updated successfully!',

    // Security Tab
    changePasswordTitle: 'Change Password',
    changePasswordDesc: 'Update your login password to maintain strong account protection.',
    currentPassword: 'Current Password',
    newPassword: 'New Password',
    confirmNewPassword: 'Confirm New Password',
    passwordRequirement: 'Password must be at least 8 characters long.',
    changePasswordBtn: 'Change Password',
    passwordMismatch: 'New passwords do not match.',
    passwordChangedSuccess: 'Password changed successfully! Previous sessions have been revoked.',

    // Appearance & Language Tab
    appearanceTitle: 'Appearance Mode',
    appearanceDesc: 'Choose your visual preference for the FieldSync workspace.',
    themeLight: 'Light Mode',
    themeLightDesc: 'Clean, high-contrast crisp daytime view',
    themeDark: 'Dark Mode',
    themeDarkDesc: 'Reduced eye strain for low-light & night operations',
    themeSystem: 'System Default',
    themeSystemDesc: 'Automatically follows your operating system preference',

    languageTitle: 'Language / ቋንቋ',
    languageDesc: 'Select your preferred interface language across the platform.',
    langEnglish: 'English (English)',
    langAmharic: 'Amharic (አማርኛ)',
    langSelectedNotice: 'Language updated and saved.',

    // Offline / System Tab
    offlineSyncTitle: 'Offline Synchronization Policy',
    offlineSyncDesc: 'Configure automated reconciliation thresholds for IndexedDB',
    backgroundSync: 'Background Auto-Reconciliation',
    backgroundSyncDesc: 'Automatically push queued local drafts when device reconnects to network',
    maxRetry: 'Maximum Sync Retry Threshold',
    maxRetryDesc: 'Number of retry cycles before marking a report as synchronization failed',
    purgeCache: 'Purge Synchronized Local Cache',
    purgeCacheDesc: 'Keep browser IndexedDB storage light by archiving synchronized records',
    purgeCacheBtn: 'Purge Cache',
  },

  am: {
    // Brand & App
    appName: 'ፊልድሲንክ',
    headerTitle: 'የመስክ ስራዎች አመራር',
    online: 'መስመር ላይ',
    offline: 'ከመስመር ውጭ',
    onlineDirect: 'መስመር ላይ (ከዋናው አገልጋይ ጋር የተገናኘ)',
    offlineLocal: 'ከመስመር ውጭ (በስልክ/ኮምፒውተር ላይ የተቀመጠ)',
    syncReconcile: 'ሁሉም መረጃዎች በቀጥታ ከመረጃ ቋቱ ጋር ይገናኛሉ',
    syncOfflineSaved: 'መረጃዎች ያለ ኢንተርኔት በደህንነት ተቀምጠዋል',

    // Navigation
    navDashboard: 'ዳሽቦርድ',
    navMyReports: 'የእኔ ሪፖርቶች',
    navAllReports: 'ሁሉም ሪፖርቶች',
    navWorkflow: 'የስራ ሂደት ሰሌዳ',
    navAnalytics: 'ትንታኔዎች',
    navActivity: 'የእንቅስቃሴ መዝገብ',
    navTeam: 'የቡድን አባላት',
    navSync: 'ከመስመር ውጭ ማመሳሰል',
    navSettings: 'ቅንብሮች',
    navLogIncident: 'አደጋ መዝግብ',
    navProfile: 'መገለጫዬ',
    signOut: 'ውጣ',

    // Roles
    roleFieldWorker: 'የመስክ ቴክኒሻን',
    roleCoordinator: 'አስተባባሪ',
    roleAdmin: 'አስተዳዳሪ',
    roleDescFieldWorker: 'የመስክ አደጋዎችን ይመዘግባል፣ የጂፒኤስ መገኛ መረጃ ይሰበስባል፣ ከመስመር ውጭ ረቂቆችን ያስተዳድራል።',
    roleDescCoordinator: 'የሚገቡ አደጋዎችን ይገመግማል፣ ቴክኒሻኖችን ይመድባል፣ የስራ ሂደትን ይመራል።',
    roleDescAdmin: 'ተጠቃሚዎችን ያስተዳድራል፣ የስርዓት ደህንነትንና ፖሊሲዎችን ይቆጣጠራል።',

    // Common Actions
    newReport: 'አዲስ ሪፖርት',
    newIncidentReport: 'አዲስ የአደጋ ሪፖርት',
    saveDraft: 'እንደ ረቂቅ አስቀምጥ',
    submitReport: 'ሪፖርቱን አስገባ',
    cancel: 'ይቅር',
    save: 'አስቀምጥ',
    saveChanges: 'ለውጦችን አስቀምጥ',
    refresh: 'አድስ',
    search: 'ፈልግ...',
    filter: 'አጣራ',
    inspect: 'መርምር',
    details: 'ዝርዝሮች',
    viewAll: 'ሁሉንም እይ',
    actions: 'እርምጃዎች',
    close: 'ዝጋ',
    assign: 'መድብ',
    update: 'አሻሽል',
    delete: 'ሰርዝ',

    // Report Statuses
    statusDraft: 'ረቂቅ',
    statusSubmitted: 'የቀረበ',
    statusAssigned: 'የተመደበ',
    statusInProgress: 'በሂደት ላይ',
    statusResolved: 'የተፈታ',
    statusRejected: 'ውድቅ የተደረገ',

    // Priorities
    priorityLow: 'ዝቅተኛ',
    priorityMedium: 'መካከለኛ',
    priorityHigh: 'ከፍተኛ',
    priorityCritical: 'አጣዳፊ / ወሳኝ',

    // Categories
    catWater: 'የውሃ ነጥብ',
    catMachinery: 'ማሽነሪ',
    catElectrical: 'ኤሌክትሪክ',
    catInfrastructure: 'መሰረተ ልማት',
    catSafety: 'የደህንነት አደጋ',
    catOutage: 'የአገልግሎት መቋረጥ',
    allCategories: 'ሁሉም ዘርፎች',
    allStatuses: 'ሁሉም ሁኔታዎች',

    // Field Worker Dashboard
    techCommand: 'የመስክ ቴክኒሻን መቆጣጠሪያ',
    welcomeBack: 'እንኳን ደህና መጡ',
    techSubtitle: 'የመስክ አደጋ ሪፖርት ማቅረቢያ እና ከመስመር ውጭ ረቂቅ ማመሳሰያ።',
    myRecentReports: 'የቅርብ ጊዜ ሪፖርቶቼ',
    myRecentDesc: 'በእርስዎ መለያ የቀረቡ የመሰረተ ልማት ብልሽት እና የአደጋ ሪፖርቶች',
    networkStatus: 'የኔትወርክ ሁኔታ',
    offlineQueue: 'ከመስመር ውጭ ወረፋ',
    statusDistribution: 'የሪፖርቶች የስራ ደረጃ ስርጭት',
    queueLink: 'ወረፋ',
    noIncidentsFound: 'ምንም ሪፖርት አልተገኘም',
    noIncidentsDesc: 'የመጀመሪያዎን ሪፖርት ለማስገባት ከታች ወይም ከላይ ያለውን አዝራር ይጠቀሙ።',

    // Coordinator Dashboard
    coordCommand: 'የክልል ስምሪትና መገምገሚያ ማዕከል',
    coordWelcome: 'የስራዎች ግምገማና ስምሪት',
    coordSubtitle: 'የአደጋዎች ክትትል፣ የቴክኒሻን ስምሪት እና የቀጥታ ሂደት ክትትል።',
    unassignedIncidents: 'ያልተመደቡ አደጋዎች ወረፋ',
    assignModalTitle: 'አደጋን ለቴክኒሻን መድብ',
    assignTo: 'ለቴክኒሻን መድብ',
    selectTechnician: 'የመስክ ቴክኒሻን ይምረጡ...',

    // Admin Dashboard
    adminCommand: 'ሙሉ የኦዲት እና አስተዳደር ስልጣን',
    adminWelcome: 'የስርዓት አስተዳደር መቆጣጠሪያ',
    adminSubtitle: 'የስርዓት ጤና፣ የተጠቃሚዎች መዝገብ አስተዳደር እና የደህንነት ቁጥጥር።',
    telemetryHealth: 'የስርዓቱ ጤና እና መረጃ',
    rosterBreakdown: 'የሰራተኞች እና የሚና ስርጭት',
    activeUsers: 'ንቁ ሰራተኞች',

    // Settings & Profile
    settingsTitle: 'መገለጫ እና ቅንብሮች',
    settingsSubtitle: 'የግል መገለጫዎን፣ የይለፍ ቃልዎን፣ ገጽታዎን፣ ቋንቋዎን እና የስርዓት ቅንብሮችን ያስተዳድሩ።',
    tabProfile: 'መገለጫ እና መለያ',
    tabSecurity: 'የይለፍ ቃል እና ደህንነት',
    tabAppearance: 'ገጽታ እና ቋንቋ',
    tabSystem: 'ስርዓት እና ማከማቻ',

    // Profile Tab
    accountInfo: 'የመለያ መረጃ',
    accountInfoDesc: 'የእርስዎ የግል መለያ እና በድርጅቱ ውስጥ ያለዎት ሚና ዝርዝር።',
    fullName: 'ሙሉ ስም',
    emailAddress: 'የኢሜይል አድራሻ',
    roleLabel: 'የተሰጠ ሚና',
    accountStatus: 'የመለያ ሁኔታ',
    activeStatus: 'ንቁ እና የተረጋገጠ',
    memberSince: 'የተመዘገቡበት ቀን',
    updateProfileBtn: 'መገለጫ አሻሽል',
    profileUpdatedSuccess: 'መገለጫዎ በተሳካ ሁኔታ ተሻሽሏል!',

    // Security Tab
    changePasswordTitle: 'የይለፍ ቃል ቀይር',
    changePasswordDesc: 'የመለያዎን ደህንነት ለመጠበቅ አዲስ ጠንካራ የይለፍ ቃል ያስገቡ።',
    currentPassword: 'የአሁኑ የይለፍ ቃል',
    newPassword: 'አዲስ የይለፍ ቃል',
    confirmNewPassword: 'አዲሱን የይለፍ ቃል አረጋግጥ',
    passwordRequirement: 'የይለፍ ቃል ቢያንስ 8 ፊደላት ወይም ቁጥሮች መሆን አለበት።',
    changePasswordBtn: 'የይለፍ ቃል ቀይር',
    passwordMismatch: 'አዲሶቹ የይለፍ ቃሎች አይመሳሰሉም።',
    passwordChangedSuccess: 'የይለፍ ቃልዎ በተሳካ ሁኔታ ተቀይሯል! የቀድሞ ክፍለ-ጊዜዎች ተዘግተዋል።',

    // Appearance & Language Tab
    appearanceTitle: 'የገጽታ ሁነታ',
    appearanceDesc: 'የፊልድሲንክ መተግበሪያውን ቀለማት ይምረጡ።',
    themeLight: 'ብሩህ ሁነታ (Light)',
    themeLightDesc: 'ለቀን ስራ ምቹ የሆነ ንጹህና ደማቅ እይታ',
    themeDark: 'ጨለማ ሁነታ (Dark)',
    themeDarkDesc: 'ለዓይን እረፍት የሚሰጥ የምሽት እይታ',
    themeSystem: 'የስርዓቱ ምርጫ (System)',
    themeSystemDesc: 'የስልክዎን ወይም የኮምፒውተርዎን ምርጫ በራስ-ሰር ይከተላል',

    languageTitle: 'ቋንቋ ይምረጡ (Language)',
    languageDesc: 'በመተግበሪያው ውስጥ የሚጠቀሙበትን ቋንቋ ይምረጡ።',
    langEnglish: 'English (እንግሊዝኛ)',
    langAmharic: 'አማርኛ (Amharic)',
    langSelectedNotice: 'ቋንቋው ተቀይሮ ተቀምጧል።',

    // Offline / System Tab
    offlineSyncTitle: 'ከመስመር ውጭ ማመሳሰያ ፖሊሲ',
    offlineSyncDesc: 'የአካባቢ ማከማቻ እና የማመሳሰያ ደንቦችን ያስተካክሉ',
    backgroundSync: 'በራስ-ሰር ከበስተጀርባ ማመሳሰል',
    backgroundSyncDesc: 'ኢንተርኔት ሲገኝ የተቀመጡ ረቂቆችን በራስ-ሰር ይልካል',
    maxRetry: 'ከፍተኛው የድጋሚ ሙከራ መጠን',
    maxRetryDesc: 'ሪፖርት አልተላከም ከመባሉ በፊት የሚደረግ ሙከራ ብዛት',
    purgeCache: 'የተመሳሰለ የአካባቢ ማከማቻን አጽዳ',
    purgeCacheDesc: 'ስልኩ እንዳይጨናነቅ የተላኩ መረጃዎችን ያጸዳል',
    purgeCacheBtn: 'ማከማቻ አጽዳ',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'fieldsync_language';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (saved === 'am' || saved === 'en') return saved;
    } catch {
      // Fallback
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
      document.documentElement.lang = lang;
    } catch {
      // Local storage disabled or error
    }
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    const langDict = translations[language];
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    // Fallback to English
    return translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
