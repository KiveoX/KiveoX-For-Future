/* ==================================================
   KiveoX Training Forge - Shared App JS
   Version: 0.5.1
   Purpose:
   - Shared auth logic
   - Shared calculators
   - Shared localStorage tools
   - Multi-page translation fix for split HTML files
   ================================================== */

/* ==================================================
   SUPABASE CONFIG
   Note: The anon key is public in frontend Supabase apps.
   Real protection must be done with Supabase RLS policies.
   ================================================== */

const SUPABASE_URL = "https://uegvjoclsaldafsdcuqe.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlZ3Zqb2Nsc2FsZGFmc2RjdXFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyMjQ1NzYsImV4cCI6MjA5NzgwMDU3Nn0.Zfbedxjrus9lJ34OnvEE5sD01wKvw3kGpQGq6GYZIok";

let authMode = "login";
let kiveoxSupabase = null;

function qs(id) {
  return document.getElementById(id);
}

/* ==================================================
   TRANSLATION SYSTEM
   Works across index.html, vline.html, strength.html,
   back.html, upper.html, lower.html, booty.html,
   plans.html, meals.html, progress.html.
   ================================================== */

const I18N = {
  de: {
    home: "Home",
    library: "Training",
    plans: "Pläne",
    meals: "Meal Prep",
    progress: "Progress",
    loginSub: "Melde dich mit deinem KiveoX Account an.",
    signupSub: "Erstelle deinen KiveoX Account.",
    accountCreate: "Account erstellen",
    forgotPassword: "Passwort vergessen?",
    loggedIn: "Eingeloggt:",
    logout: "Logout"
  },
  en: {
    home: "Home",
    library: "Training",
    plans: "Plans",
    meals: "Meal Prep",
    progress: "Progress",
    loginSub: "Log in with your KiveoX account.",
    signupSub: "Create your KiveoX account.",
    accountCreate: "Create account",
    forgotPassword: "Forgot password?",
    loggedIn: "Logged in:",
    logout: "Logout"
  },
  ru: {
    home: "Главная",
    library: "Тренировки",
    plans: "Планы",
    meals: "Meal Prep",
    progress: "Прогресс",
    loginSub: "Войди в свой аккаунт KiveoX.",
    signupSub: "Создай аккаунт KiveoX.",
    accountCreate: "Создать аккаунт",
    forgotPassword: "Забыли пароль?",
    loggedIn: "Вошёл:",
    logout: "Выйти"
  },
  tr: {
    home: "Ana Sayfa",
    library: "Antrenman",
    plans: "Planlar",
    meals: "Meal Prep",
    progress: "İlerleme",
    loginSub: "KiveoX hesabınla giriş yap.",
    signupSub: "KiveoX hesabını oluştur.",
    accountCreate: "Hesap oluştur",
    forgotPassword: "Şifreni mi unuttun?",
    loggedIn: "Giriş:",
    logout: "Çıkış"
  },
  az: {
    home: "Ana səhifə",
    library: "Məşq",
    plans: "Planlar",
    meals: "Meal Prep",
    progress: "İrəliləyiş",
    loginSub: "KiveoX hesabınla daxil ol.",
    signupSub: "KiveoX hesabını yarat.",
    accountCreate: "Hesab yarat",
    forgotPassword: "Şifrəni unutdun?",
    loggedIn: "Daxil olub:",
    logout: "Çıxış"
  },
  fr: {
    home: "Accueil",
    library: "Training",
    plans: "Plans",
    meals: "Meal Prep",
    progress: "Progrès",
    loginSub: "Connecte-toi avec ton compte KiveoX.",
    signupSub: "Crée ton compte KiveoX.",
    accountCreate: "Créer un compte",
    forgotPassword: "Mot de passe oublié ?",
    loggedIn: "Connecté :",
    logout: "Déconnexion"
  },
  uk: {
    home: "Головна",
    library: "Тренування",
    plans: "Плани",
    meals: "Meal Prep",
    progress: "Прогрес",
    loginSub: "Увійди у свій акаунт KiveoX.",
    signupSub: "Створи акаунт KiveoX.",
    accountCreate: "Створити акаунт",
    forgotPassword: "Забули пароль?",
    loggedIn: "Увійшов:",
    logout: "Вийти"
  }
};

/*
  TEXT_I18N fixes the split-page problem.

  Your split pages currently have lots of normal text like:
  <h1>Core / V-Line Plan</h1>

  The old translator only translated:
  <a data-i18n="home">Home</a>

  This dictionary lets app.js translate normal text too.
*/
const TEXT_I18N = {
  "Home": {
    de: "Home", en: "Home", ru: "Главная", tr: "Ana Sayfa", az: "Ana səhifə", fr: "Accueil", uk: "Головна"
  },
  "Training": {
    de: "Training", en: "Training", ru: "Тренировки", tr: "Antrenman", az: "Məşq", fr: "Training", uk: "Тренування"
  },
  "Plans": {
    de: "Pläne", en: "Plans", ru: "Планы", tr: "Planlar", az: "Planlar", fr: "Plans", uk: "Плани"
  },
  "Pläne": {
    de: "Pläne", en: "Plans", ru: "Планы", tr: "Planlar", az: "Planlar", fr: "Plans", uk: "Плани"
  },
  "Progress": {
    de: "Progress", en: "Progress", ru: "Прогресс", tr: "İlerleme", az: "İrəliləyiş", fr: "Progrès", uk: "Прогрес"
  },
  "Core / V-Line": {
    de: "Core / V-Line", en: "Core / V-Line", ru: "Кор / V-Line", tr: "Core / V-Line", az: "Core / V-Line", fr: "Core / V-Line", uk: "Кор / V-Line"
  },
  "Forge Strength": {
    de: "Forge Strength", en: "Forge Strength", ru: "Forge Strength", tr: "Forge Strength", az: "Forge Strength", fr: "Forge Strength", uk: "Forge Strength"
  },
  "Back": {
    de: "Rücken", en: "Back", ru: "Спина", tr: "Sırt", az: "Kürək", fr: "Dos", uk: "Спина"
  },
  "Upper": {
    de: "Oberkörper", en: "Upper", ru: "Верх тела", tr: "Üst Vücut", az: "Yuxarı Bədən", fr: "Haut du corps", uk: "Верх тіла"
  },
  "Lower": {
    de: "Unterkörper", en: "Lower", ru: "Низ тела", tr: "Alt Vücut", az: "Aşağı Bədən", fr: "Bas du corps", uk: "Низ тіла"
  },
  "Booty": {
    de: "Booty", en: "Booty", ru: "Ягодицы", tr: "Kalça", az: "Glute", fr: "Fessiers", uk: "Сідниці"
  },
  "Login": {
    de: "Login", en: "Login", ru: "Войти", tr: "Giriş", az: "Daxil ol", fr: "Connexion", uk: "Увійти"
  },
  "Sign Up": {
    de: "Sign Up", en: "Sign Up", ru: "Регистрация", tr: "Kayıt ol", az: "Qeydiyyat", fr: "Créer un compte", uk: "Реєстрація"
  },
  "Eingeloggt:": {
    de: "Eingeloggt:", en: "Logged in:", ru: "Вошёл:", tr: "Giriş:", az: "Daxil olub:", fr: "Connecté :", uk: "Увійшов:"
  },
  "Logout": {
    de: "Logout", en: "Logout", ru: "Выйти", tr: "Çıkış", az: "Çıxış", fr: "Déconnexion", uk: "Вийти"
  },
  "Passwort": {
    de: "Passwort", en: "Password", ru: "Пароль", tr: "Şifre", az: "Şifrə", fr: "Mot de passe", uk: "Пароль"
  },
  "Passwort vergessen?": {
    de: "Passwort vergessen?", en: "Forgot password?", ru: "Забыли пароль?", tr: "Şifreni mi unuttun?", az: "Şifrəni unutdun?", fr: "Mot de passe oublié ?", uk: "Забули пароль?"
  },
  "Melde dich mit deinem KiveoX Account an.": {
    de: "Melde dich mit deinem KiveoX Account an.",
    en: "Log in with your KiveoX account.",
    ru: "Войди в свой аккаунт KiveoX.",
    tr: "KiveoX hesabınla giriş yap.",
    az: "KiveoX hesabınla daxil ol.",
    fr: "Connecte-toi avec ton compte KiveoX.",
    uk: "Увійди у свій акаунт KiveoX."
  },
  "← Back to Home": {
    de: "← Zurück zur Home",
    en: "← Back to Home",
    ru: "← Назад на главную",
    tr: "← Ana sayfaya dön",
    az: "← Ana səhifəyə qayıt",
    fr: "← Retour à l’accueil",
    uk: "← Назад на головну"
  },

  /* index.html */
  "KiveoX Training Forge": {
    de: "KiveoX Training Forge", en: "KiveoX Training Forge", ru: "KiveoX Training Forge", tr: "KiveoX Training Forge", az: "KiveoX Training Forge", fr: "KiveoX Training Forge", uk: "KiveoX Training Forge"
  },
  "Forge your body. Build your future.": {
    de: "Forge your body. Build your future.",
    en: "Forge your body. Build your future.",
    ru: "Закали своё тело. Построй своё будущее.",
    tr: "Vücudunu şekillendir. Geleceğini inşa et.",
    az: "Bədənini formalaşdır. Gələcəyini qur.",
    fr: "Forge ton corps. Construis ton avenir.",
    uk: "Загартуй своє тіло. Побудуй своє майбутнє."
  },
  "Open Training Library": {
    de: "Training Library öffnen", en: "Open Training Library", ru: "Открыть библиотеку", tr: "Antrenman kütüphanesini aç", az: "Məşq kitabxanasını aç", fr: "Ouvrir la bibliothèque", uk: "Відкрити бібліотеку"
  },
  "KiveoX Library": {
    de: "KiveoX Library", en: "KiveoX Library", ru: "Библиотека KiveoX", tr: "KiveoX Kütüphanesi", az: "KiveoX Kitabxanası", fr: "Bibliothèque KiveoX", uk: "Бібліотека KiveoX"
  },
  "Core System": {
    de: "Core System", en: "Core System", ru: "Система кора", tr: "Core Sistemi", az: "Core Sistemi", fr: "Système Core", uk: "Система кора"
  },
  "Lower abs, obliques, core stability and beginner-to-advanced progression.": {
    de: "Unterer Bauch, schräge Bauchmuskeln, Core-Stabilität und Progression von Beginner bis Advanced.",
    en: "Lower abs, obliques, core stability and beginner-to-advanced progression.",
    ru: "Нижний пресс, косые мышцы, стабильность кора и прогрессия от новичка до продвинутого.",
    tr: "Alt karın, oblikler, core stabilitesi ve başlangıçtan ileri seviyeye ilerleme.",
    az: "Aşağı qarın, yan qarın əzələləri, core sabitliyi və beginnerdən advanced səviyyəyə inkişaf.",
    fr: "Bas des abdos, obliques, stabilité du core et progression débutant à avancé.",
    uk: "Нижній прес, косі м’язи, стабільність кора і прогрес від новачка до просунутого."
  },
  "Open Core": {
    de: "Core öffnen", en: "Open Core", ru: "Открыть кор", tr: "Core aç", az: "Core aç", fr: "Ouvrir Core", uk: "Відкрити кор"
  },
  "Strength principles, BMI, calories, nutrition and weekly force-building structure.": {
    de: "Kraftprinzipien, BMI, Kalorien, Ernährung und wöchentliche Struktur für Kraftaufbau.",
    en: "Strength principles, BMI, calories, nutrition and weekly force-building structure.",
    ru: "Принципы силы, BMI, калории, питание и недельная структура для развития силы.",
    tr: "Güç prensipleri, BMI, kalori, beslenme ve haftalık kuvvet yapısı.",
    az: "Güc prinsipləri, BMI, kalori, qidalanma və həftəlik güc strukturu.",
    fr: "Principes de force, IMC, calories, nutrition et structure hebdomadaire de force.",
    uk: "Принципи сили, BMI, калорії, харчування і тижнева структура сили."
  },
  "Open Strength": {
    de: "Strength öffnen", en: "Open Strength", ru: "Открыть Strength", tr: "Strength aç", az: "Strength aç", fr: "Ouvrir Strength", uk: "Відкрити Strength"
  },
  "Back Training": {
    de: "Rückentraining", en: "Back Training", ru: "Тренировка спины", tr: "Sırt Antrenmanı", az: "Kürək Məşqi", fr: "Entraînement du dos", uk: "Тренування спини"
  },
  "Upper back, lat width, posture, spinal stability and wider visual shape.": {
    de: "Oberer Rücken, Lat-Breite, Haltung, Wirbelsäulenstabilität und breitere Optik.",
    en: "Upper back, lat width, posture, spinal stability and wider visual shape.",
    ru: "Верх спины, ширина широчайших, осанка, стабильность позвоночника и более широкая форма.",
    tr: "Üst sırt, lat genişliği, duruş, omurga stabilitesi ve daha geniş görünüm.",
    az: "Yuxarı kürək, lat genişliyi, duruş, onurğa sabitliyi və daha geniş görünüş.",
    fr: "Haut du dos, largeur des dorsaux, posture, stabilité de la colonne et silhouette plus large.",
    uk: "Верх спини, ширина найширших, постава, стабільність хребта і ширший вигляд."
  },
  "Open Back": {
    de: "Rücken öffnen", en: "Open Back", ru: "Открыть спину", tr: "Sırtı aç", az: "Kürəyi aç", fr: "Ouvrir dos", uk: "Відкрити спину"
  },
  "Upper Body": {
    de: "Oberkörper", en: "Upper Body", ru: "Верх тела", tr: "Üst Vücut", az: "Yuxarı Bədən", fr: "Haut du corps", uk: "Верх тіла"
  },
  "Chest, shoulders, arms, strong silhouette and balanced muscle growth.": {
    de: "Brust, Schultern, Arme, starke Silhouette und ausgewogener Muskelaufbau.",
    en: "Chest, shoulders, arms, strong silhouette and balanced muscle growth.",
    ru: "Грудь, плечи, руки, сильный силуэт и сбалансированный рост мышц.",
    tr: "Göğüs, omuzlar, kollar, güçlü siluet ve dengeli kas gelişimi.",
    az: "Sinə, çiyinlər, qollar, güclü siluet və balanslı əzələ inkişafı.",
    fr: "Poitrine, épaules, bras, silhouette forte et croissance musculaire équilibrée.",
    uk: "Груди, плечі, руки, сильний силует і збалансований ріст м’язів."
  },
  "Open Upper": {
    de: "Oberkörper öffnen", en: "Open Upper", ru: "Открыть верх", tr: "Üst vücudu aç", az: "Yuxarı bədəni aç", fr: "Ouvrir haut", uk: "Відкрити верх"
  },
  "Lower Body": {
    de: "Unterkörper", en: "Lower Body", ru: "Низ тела", tr: "Alt Vücut", az: "Aşağı Bədən", fr: "Bas du corps", uk: "Низ тіла"
  },
  "Quads, hamstrings, calves, glutes, power and athletic base.": {
    de: "Quads, Beinbeuger, Waden, Glutes, Power und athletische Basis.",
    en: "Quads, hamstrings, calves, glutes, power and athletic base.",
    ru: "Квадрицепсы, бицепс бедра, икры, ягодицы, сила и атлетическая база.",
    tr: "Quadriceps, hamstring, baldır, kalça, güç ve atletik temel.",
    az: "Quadriceps, hamstring, baldır, glute, güc və atletik baza.",
    fr: "Quadriceps, ischios, mollets, fessiers, puissance et base athlétique.",
    uk: "Квадрицепси, біцепс стегна, литки, сідниці, сила і атлетична база."
  },
  "Open Lower": {
    de: "Unterkörper öffnen", en: "Open Lower", ru: "Открыть низ", tr: "Alt vücudu aç", az: "Aşağı bədəni aç", fr: "Ouvrir bas", uk: "Відкрити низ"
  },
  "Booty Workout": {
    de: "Booty Workout", en: "Booty Workout", ru: "Тренировка ягодиц", tr: "Kalça Antrenmanı", az: "Glute Məşqi", fr: "Workout fessiers", uk: "Тренування сідниць"
  },
  "Glutes, hips, hamstrings, activation, pump and technique notes.": {
    de: "Glutes, Hüfte, Beinbeuger, Aktivierung, Pump und Technik-Hinweise.",
    en: "Glutes, hips, hamstrings, activation, pump and technique notes.",
    ru: "Ягодицы, бёдра, задняя поверхность бедра, активация, памп и техника.",
    tr: "Kalça, kalça eklemi, hamstring, aktivasyon, pump ve teknik notlar.",
    az: "Glute, omba, hamstring, aktivasiya, pump və texnika qeydləri.",
    fr: "Fessiers, hanches, ischios, activation, pump et notes techniques.",
    uk: "Сідниці, стегна, задня поверхня стегна, активація, памп і техніка."
  },
  "Open Booty": {
    de: "Booty öffnen", en: "Open Booty", ru: "Открыть ягодицы", tr: "Kalça aç", az: "Glute aç", fr: "Ouvrir fessiers", uk: "Відкрити сідниці"
  },
  "Own Training Plans": {
    de: "Eigene Trainingspläne", en: "Own Training Plans", ru: "Свои тренировочные планы", tr: "Kendi Antrenman Planların", az: "Öz Məşq Planların", fr: "Plans d’entraînement perso", uk: "Власні тренувальні плани"
  },
  "Create and save your own weekly training structure without touching the main index.": {
    de: "Erstelle und speichere deine eigene Wochenstruktur, ohne die main index zu verändern.",
    en: "Create and save your own weekly training structure without touching the main index.",
    ru: "Создавай и сохраняй свою недельную структуру, не трогая главный index.",
    tr: "Ana index dosyasına dokunmadan kendi haftalık antrenman yapını oluştur ve kaydet.",
    az: "Əsas index faylına toxunmadan öz həftəlik məşq strukturunu yarat və saxla.",
    fr: "Crée et sauvegarde ta structure hebdomadaire sans toucher à l’index principal.",
    uk: "Створюй і зберігай свою тижневу структуру, не змінюючи головний index."
  },
  "Planner": {
    de: "Planer", en: "Planner", ru: "Планер", tr: "Planlayıcı", az: "Planlayıcı", fr: "Planificateur", uk: "Планер"
  },
  "Simple protein-focused meal prep ideas for strength, fat loss and consistency.": {
    de: "Einfache proteinreiche Meal-Prep-Ideen für Kraft, Fettverlust und Konstanz.",
    en: "Simple protein-focused meal prep ideas for strength, fat loss and consistency.",
    ru: "Простые идеи meal prep с фокусом на белок для силы, жиросжигания и стабильности.",
    tr: "Güç, yağ kaybı ve devamlılık için protein odaklı basit meal prep fikirleri.",
    az: "Güc, yağ itkisi və davamlılıq üçün protein fokuslu sadə meal prep ideyaları.",
    fr: "Idées meal prep simples et riches en protéines pour force, perte de gras et régularité.",
    uk: "Прості protein-focused meal prep ідеї для сили, жироспалювання і стабільності."
  },
  "Nutrition": {
    de: "Ernährung", en: "Nutrition", ru: "Питание", tr: "Beslenme", az: "Qidalanma", fr: "Nutrition", uk: "Харчування"
  },
  "Progress Tracker": {
    de: "Progress Tracker", en: "Progress Tracker", ru: "Трекер прогресса", tr: "İlerleme Takibi", az: "İrəliləyiş İzləmə", fr: "Suivi des progrès", uk: "Трекер прогресу"
  },
  "Save weight, waist and notes locally for weekly progress checks.": {
    de: "Speichere Gewicht, Bauchumfang und Notizen lokal für wöchentliche Checks.",
    en: "Save weight, waist and notes locally for weekly progress checks.",
    ru: "Сохраняй вес, талию и заметки локально для еженедельных проверок.",
    tr: "Haftalık kontroller için kilo, bel ve notları yerel olarak kaydet.",
    az: "Həftəlik yoxlamalar üçün çəki, bel və qeydləri lokal saxla.",
    fr: "Sauvegarde poids, tour de taille et notes localement pour les bilans hebdomadaires.",
    uk: "Зберігай вагу, талію і нотатки локально для щотижневих перевірок."
  },
  "Tracker": {
    de: "Tracker", en: "Tracker", ru: "Трекер", tr: "Takip", az: "İzləmə", fr: "Suivi", uk: "Трекер"
  },
  "KiveoX Future": {
    de: "KiveoX Future", en: "KiveoX Future", ru: "Будущее KiveoX", tr: "KiveoX Gelecek", az: "KiveoX Gələcək", fr: "Futur KiveoX", uk: "Майбутнє KiveoX"
  },
  "Supplements": {
    de: "Supplements", en: "Supplements", ru: "Добавки", tr: "Takviyeler", az: "Əlavələr", fr: "Suppléments", uk: "Добавки"
  },
  "Later section for basics, guides and clear supplement information.": {
    de: "Späterer Bereich für Basics, Guides und klare Infos zu Supplements.",
    en: "Later section for basics, guides and clear supplement information.",
    ru: "Будущий раздел для основ, гайдов и понятной информации о добавках.",
    tr: "Temeller, rehberler ve net takviye bilgileri için gelecek bölüm.",
    az: "Əsaslar, bələdçilər və aydın əlavə məlumatları üçün gələcək bölmə.",
    fr: "Future section pour bases, guides et infos claires sur les suppléments.",
    uk: "Майбутній розділ для основ, гайдів і зрозумілої інформації про добавки."
  },
  "Coming Soon": {
    de: "Coming Soon", en: "Coming Soon", ru: "Скоро", tr: "Yakında", az: "Tezliklə", fr: "Bientôt", uk: "Скоро"
  },
  "Merch": {
    de: "Merch", en: "Merch", ru: "Мерч", tr: "Merch", az: "Merch", fr: "Merch", uk: "Мерч"
  },
  "Later section for KiveoX designs, drops and training gear.": {
    de: "Späterer Bereich für KiveoX Designs, Drops und Training Gear.",
    en: "Later section for KiveoX designs, drops and training gear.",
    ru: "Будущий раздел для дизайнов KiveoX, дропов и тренировочной экипировки.",
    tr: "KiveoX tasarımları, drop’lar ve antrenman ekipmanları için gelecek bölüm.",
    az: "KiveoX dizaynları, drop-lar və məşq geyimi üçün gələcək bölmə.",
    fr: "Future section pour designs KiveoX, drops et équipement training.",
    uk: "Майбутній розділ для дизайнів KiveoX, дропів і тренувального екіпу."
  },
  "KiveoX Brand": {
    de: "KiveoX Brand", en: "KiveoX Brand", ru: "Бренд KiveoX", tr: "KiveoX Marka", az: "KiveoX Brend", fr: "Marque KiveoX", uk: "Бренд KiveoX"
  },
  "Logo, design, identity and future project.": {
    de: "Logo, Design, Identity und Future-Projekt.",
    en: "Logo, design, identity and future project.",
    ru: "Логотип, дизайн, идентичность и будущий проект.",
    tr: "Logo, tasarım, kimlik ve gelecek proje.",
    az: "Logo, dizayn, identiklik və gələcək layihə.",
    fr: "Logo, design, identité et projet futur.",
    uk: "Логотип, дизайн, ідентичність і майбутній проєкт."
  },
  "Brand": {
    de: "Brand", en: "Brand", ru: "Бренд", tr: "Marka", az: "Brend", fr: "Marque", uk: "Бренд"
  },

  /* page generic */
  "Separate page for lower abs, obliques, deep core control and visible V-Line foundation.": {
    de: "Separate Seite für unteren Bauch, Obliques, tiefe Core-Kontrolle und sichtbare V-Line-Basis.",
    en: "Separate page for lower abs, obliques, deep core control and visible V-Line foundation.",
    ru: "Отдельная страница для нижнего пресса, косых мышц, глубокого контроля кора и основы V-Line.",
    tr: "Alt karın, oblikler, derin core kontrolü ve görünür V-Line temeli için ayrı sayfa.",
    az: "Aşağı qarın, obliques, dərin core kontrolu və görünən V-Line bazası üçün ayrı səhifə.",
    fr: "Page séparée pour bas des abdos, obliques, contrôle profond du core et base V-Line visible.",
    uk: "Окрема сторінка для нижнього преса, косих м’язів, глибокого контролю кора і основи V-Line."
  },
  "Most Important Point": {
    de: "Wichtigster Punkt", en: "Most Important Point", ru: "Самый важный пункт", tr: "En Önemli Nokta", az: "Ən Vacib Nöqtə", fr: "Point le plus important", uk: "Найважливіший пункт"
  },
  "The V-Line is not built by ab exercises alone. It becomes visible through": {
    de: "Die V-Line entsteht nicht nur durch Bauchübungen. Sie wird sichtbar durch",
    en: "The V-Line is not built by ab exercises alone. It becomes visible through",
    ru: "V-Line не строится только упражнениями на пресс. Она становится видимой благодаря",
    tr: "V-Line sadece karın egzersizleriyle oluşmaz. Şunlarla görünür olur:",
    az: "V-Line təkcə qarın məşqləri ilə yaranmır. O, bunlarla görünür olur:",
    fr: "La V-Line ne se construit pas seulement avec des abdos. Elle devient visible grâce à",
    uk: "V-Line не будується лише вправами на прес. Вона стає видимою завдяки"
  },
  "lower body fat, strong lower abs, trained obliques, posture and consistency": {
    de: "niedrigerem Körperfett, starken unteren Bauchmuskeln, trainierten Obliques, Haltung und Konstanz",
    en: "lower body fat, strong lower abs, trained obliques, posture and consistency",
    ru: "низкому проценту жира, сильному нижнему прессу, тренированным косым мышцам, осанке и постоянству",
    tr: "daha düşük yağ oranı, güçlü alt karın, gelişmiş oblikler, duruş ve devamlılık",
    az: "aşağı yağ faizi, güclü aşağı qarın, məşq olunmuş obliques, duruş və davamlılıq",
    fr: "moins de graisse corporelle, bas des abdos forts, obliques entraînés, posture et régularité",
    uk: "нижчому відсотку жиру, сильному нижньому пресу, тренованим косим м’язам, поставі і стабільності"
  },
  "Rule:": {
    de: "Regel:", en: "Rule:", ru: "Правило:", tr: "Kural:", az: "Qayda:", fr: "Règle :", uk: "Правило:"
  },
  "Level System": {
    de: "Level-System", en: "Level System", ru: "Система уровней", tr: "Seviye Sistemi", az: "Səviyyə Sistemi", fr: "Système de niveaux", uk: "Система рівнів"
  },
  "Beginner": {
    de: "Beginner", en: "Beginner", ru: "Новичок", tr: "Başlangıç", az: "Başlanğıc", fr: "Débutant", uk: "Новачок"
  },
  "Intermediate": {
    de: "Intermediate", en: "Intermediate", ru: "Средний", tr: "Orta", az: "Orta", fr: "Intermédiaire", uk: "Середній"
  },
  "Advanced": {
    de: "Advanced", en: "Advanced", ru: "Продвинутый", tr: "İleri", az: "İrəli", fr: "Avancé", uk: "Просунутий"
  },
  "Technique": {
    de: "Technik", en: "Technique", ru: "Техника", tr: "Teknik", az: "Texnika", fr: "Technique", uk: "Техніка"
  },
  "Technique Rules": {
    de: "Technik-Regeln", en: "Technique Rules", ru: "Правила техники", tr: "Teknik Kurallar", az: "Texnika Qaydaları", fr: "Règles techniques", uk: "Правила техніки"
  },
  "No momentum.": {
    de: "Kein Schwung.", en: "No momentum.", ru: "Без рывков.", tr: "Savurma yok.", az: "Sürət/silkələmə yoxdur.", fr: "Pas d’élan.", uk: "Без ривків."
  },
  "Brace before every rep.": {
    de: "Vor jeder Wiederholung Core anspannen.", en: "Brace before every rep.", ru: "Напрягай кор перед каждым повторением.", tr: "Her tekrardan önce core’u sık.", az: "Hər təkrardan əvvəl core-u sıx.", fr: "Gaine avant chaque répétition.", uk: "Напружуй кор перед кожним повтором."
  },

  /* strength */
  "Separate strength page for lifting principles, calculators and weekly force-building structure.": {
    de: "Separate Strength-Seite für Hebeprinzipien, Rechner und wöchentliche Kraftstruktur.",
    en: "Separate strength page for lifting principles, calculators and weekly force-building structure.",
    ru: "Отдельная страница силы для принципов подъёма, калькуляторов и недельной структуры.",
    tr: "Kaldırma prensipleri, hesaplayıcılar ve haftalık kuvvet yapısı için ayrı strength sayfası.",
    az: "Qaldırma prinsipləri, kalkulyatorlar və həftəlik güc strukturu üçün ayrı strength səhifəsi.",
    fr: "Page force séparée pour principes de lift, calculateurs et structure hebdomadaire.",
    uk: "Окрема сторінка сили для принципів ліфтингу, калькуляторів і тижневої структури."
  },
  "Lift Heavy": {
    de: "Schwer heben", en: "Lift Heavy", ru: "Поднимай тяжело", tr: "Ağır Kaldır", az: "Ağır Qaldır", fr: "Soulever lourd", uk: "Підіймай важко"
  },
  "Rest Longer": {
    de: "Länger pausieren", en: "Rest Longer", ru: "Отдыхай дольше", tr: "Daha Uzun Dinlen", az: "Daha Uzun Dincəl", fr: "Repos plus long", uk: "Відпочивай довше"
  },
  "Create Tension": {
    de: "Spannung aufbauen", en: "Create Tension", ru: "Создай напряжение", tr: "Gerilim Oluştur", az: "Gərginlik Yarat", fr: "Créer de la tension", uk: "Створи напругу"
  },
  "Protein + Calories": {
    de: "Protein + Kalorien", en: "Protein + Calories", ru: "Белок + калории", tr: "Protein + Kalori", az: "Protein + Kalori", fr: "Protéines + calories", uk: "Білок + калорії"
  },
  "Body Calculator": {
    de: "Body Calculator", en: "Body Calculator", ru: "Калькулятор тела", tr: "Vücut Hesaplayıcı", az: "Bədən Kalkulyatoru", fr: "Calculateur corporel", uk: "Калькулятор тіла"
  },
  "Calculate BMI": {
    de: "BMI berechnen", en: "Calculate BMI", ru: "Рассчитать BMI", tr: "BMI hesapla", az: "BMI hesabla", fr: "Calculer l’IMC", uk: "Розрахувати BMI"
  },
  "Your Result": {
    de: "Dein Ergebnis", en: "Your Result", ru: "Твой результат", tr: "Sonucun", az: "Nəticən", fr: "Ton résultat", uk: "Твій результат"
  },
  "Calorie Burn Calculator": {
    de: "Kalorienrechner", en: "Calorie Burn Calculator", ru: "Калькулятор калорий", tr: "Kalori Hesaplayıcı", az: "Kalori Kalkulyatoru", fr: "Calculateur de calories", uk: "Калькулятор калорій"
  },
  "Activity Level": {
    de: "Aktivitätslevel", en: "Activity Level", ru: "Уровень активности", tr: "Aktivite Seviyesi", az: "Aktivlik Səviyyəsi", fr: "Niveau d’activité", uk: "Рівень активності"
  },
  "Goal": {
    de: "Ziel", en: "Goal", ru: "Цель", tr: "Hedef", az: "Hədəf", fr: "Objectif", uk: "Ціль"
  },
  "Calculate Daily Calories": {
    de: "Tägliche Kalorien berechnen", en: "Calculate Daily Calories", ru: "Рассчитать дневные калории", tr: "Günlük kaloriyi hesapla", az: "Gündəlik kaloriyi hesabla", fr: "Calculer les calories quotidiennes", uk: "Розрахувати денні калорії"
  },
  "Estimated Daily Calories": {
    de: "Geschätzte tägliche Kalorien", en: "Estimated Daily Calories", ru: "Примерные дневные калории", tr: "Tahmini Günlük Kalori", az: "Təxmini Gündəlik Kalori", fr: "Calories quotidiennes estimées", uk: "Орієнтовні денні калорії"
  },

  /* back / upper / lower / booty / plans / meals / progress generic */
  "Back Goals": {
    de: "Rücken-Ziele", en: "Back Goals", ru: "Цели для спины", tr: "Sırt Hedefleri", az: "Kürək Hədəfləri", fr: "Objectifs dos", uk: "Цілі для спини"
  },
  "Growth Rules": {
    de: "Growth-Regeln", en: "Growth Rules", ru: "Правила роста", tr: "Gelişim Kuralları", az: "İnkişaf Qaydaları", fr: "Règles de croissance", uk: "Правила росту"
  },
  "Lower Body Plan": {
    de: "Unterkörper-Plan", en: "Lower Body Plan", ru: "План низа тела", tr: "Alt Vücut Planı", az: "Aşağı Bədən Planı", fr: "Plan bas du corps", uk: "План низу тіла"
  },
  "Booty Growth Rules": {
    de: "Booty Growth Regeln", en: "Booty Growth Rules", ru: "Правила роста ягодиц", tr: "Kalça Gelişim Kuralları", az: "Glute İnkişaf Qaydaları", fr: "Règles fessiers", uk: "Правила росту сідниць"
  },
  "Gym Glute Growth": {
    de: "Gym Glute Growth", en: "Gym Glute Growth", ru: "Рост ягодиц в зале", tr: "Gym Kalça Gelişimi", az: "Gym Glute İnkişafı", fr: "Croissance fessiers en salle", uk: "Ріст сідниць у залі"
  },
  "Home Booty Circuit": {
    de: "Home Booty Circuit", en: "Home Booty Circuit", ru: "Домашний круг для ягодиц", tr: "Ev Kalça Circuit", az: "Ev Glute Circuit", fr: "Circuit fessiers maison", uk: "Домашній круг для сідниць"
  },
  "Plan Builder": {
    de: "Plan Builder", en: "Plan Builder", ru: "Конструктор плана", tr: "Plan Oluşturucu", az: "Plan Qurucu", fr: "Créateur de plan", uk: "Конструктор плану"
  },
  "Plan Name": {
    de: "Planname", en: "Plan Name", ru: "Название плана", tr: "Plan Adı", az: "Plan Adı", fr: "Nom du plan", uk: "Назва плану"
  },
  "Days per Week": {
    de: "Tage pro Woche", en: "Days per Week", ru: "Дней в неделю", tr: "Haftalık Gün", az: "Həftəlik Gün", fr: "Jours par semaine", uk: "Днів на тиждень"
  },
  "Exercises / Notes": {
    de: "Übungen / Notizen", en: "Exercises / Notes", ru: "Упражнения / заметки", tr: "Egzersizler / Notlar", az: "Məşqlər / Qeydlər", fr: "Exercices / Notes", uk: "Вправи / нотатки"
  },
  "Save Plan": {
    de: "Plan speichern", en: "Save Plan", ru: "Сохранить план", tr: "Planı kaydet", az: "Planı saxla", fr: "Sauvegarder le plan", uk: "Зберегти план"
  },
  "Saved Plan": {
    de: "Gespeicherter Plan", en: "Saved Plan", ru: "Сохранённый план", tr: "Kayıtlı Plan", az: "Saxlanmış Plan", fr: "Plan sauvegardé", uk: "Збережений план"
  },
  "Ready Templates": {
    de: "Fertige Templates", en: "Ready Templates", ru: "Готовые шаблоны", tr: "Hazır Şablonlar", az: "Hazır Şablonlar", fr: "Templates prêts", uk: "Готові шаблони"
  },
  "Meal Prep": {
    de: "Meal Prep", en: "Meal Prep", ru: "Meal Prep", tr: "Meal Prep", az: "Meal Prep", fr: "Meal Prep", uk: "Meal Prep"
  },
  "Meal Prep Rules": {
    de: "Meal Prep Regeln", en: "Meal Prep Rules", ru: "Правила Meal Prep", tr: "Meal Prep Kuralları", az: "Meal Prep Qaydaları", fr: "Règles Meal Prep", uk: "Правила Meal Prep"
  },
  "Goal Adjustment": {
    de: "Ziel-Anpassung", en: "Goal Adjustment", ru: "Коррекция цели", tr: "Hedef Ayarı", az: "Hədəf Düzəlişi", fr: "Ajustement objectif", uk: "Корекція цілі"
  },
  "Add Entry": {
    de: "Eintrag hinzufügen", en: "Add Entry", ru: "Добавить запись", tr: "Kayıt ekle", az: "Qeyd əlavə et", fr: "Ajouter une entrée", uk: "Додати запис"
  },
  "Save Progress": {
    de: "Progress speichern", en: "Save Progress", ru: "Сохранить прогресс", tr: "İlerlemeyi kaydet", az: "İrəliləyişi saxla", fr: "Sauvegarder le progrès", uk: "Зберегти прогрес"
  },
  "Saved Entries": {
    de: "Gespeicherte Einträge", en: "Saved Entries", ru: "Сохранённые записи", tr: "Kayıtlı girişler", az: "Saxlanmış qeydlər", fr: "Entrées sauvegardées", uk: "Збережені записи"
  },
  "© 2026 KiveoX Training Forge. Forge your future. All rights reserved.": {
    de: "© 2026 KiveoX Training Forge. Forge your future. All rights reserved.",
    en: "© 2026 KiveoX Training Forge. Forge your future. All rights reserved.",
    ru: "© 2026 KiveoX Training Forge. Все права защищены.",
    tr: "© 2026 KiveoX Training Forge. Tüm hakları saklıdır.",
    az: "© 2026 KiveoX Training Forge. Bütün hüquqlar qorunur.",
    fr: "© 2026 KiveoX Training Forge. Tous droits réservés.",
    uk: "© 2026 KiveoX Training Forge. Усі права захищені."
  }
};

function rememberOriginalTextNodes(root) {
  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        const tag = parent.tagName.toLowerCase();
        if (["script", "style", "noscript", "textarea"].includes(tag)) return NodeFilter.FILTER_REJECT;
        if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );

  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);

  nodes.forEach(node => {
    if (!node.__kiveoxOriginalText) {
      node.__kiveoxOriginalText = node.nodeValue;
    }
  });
}

function translateTextNodes(root, lang) {
  rememberOriginalTextNodes(root);

  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        const tag = parent.tagName.toLowerCase();
        if (["script", "style", "noscript", "textarea"].includes(tag)) return NodeFilter.FILTER_REJECT;
        if (!node.__kiveoxOriginalText || !node.__kiveoxOriginalText.trim()) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );

  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);

  nodes.forEach(node => {
    const original = node.__kiveoxOriginalText;
    const clean = original.trim();
    const leading = original.match(/^\s*/)?.[0] || "";
    const trailing = original.match(/\s*$/)?.[0] || "";
    const translated = TEXT_I18N[clean]?.[lang];

    node.nodeValue = translated ? leading + translated + trailing : original;
  });
}

function translatePlaceholders(lang) {
  const placeholderMap = {
    "z. B. KiveoXUser": {
      de: "z. B. KiveoXUser",
      en: "e.g. KiveoXUser",
      ru: "например KiveoXUser",
      tr: "örn. KiveoXUser",
      az: "məs. KiveoXUser",
      fr: "ex. KiveoXUser",
      uk: "наприклад KiveoXUser"
    },
    "My Plan": {
      de: "Mein Plan",
      en: "My Plan",
      ru: "Мой план",
      tr: "Planım",
      az: "Mənim Planım",
      fr: "Mon plan",
      uk: "Мій план"
    },
    "Example: Pull / Push / Legs...": {
      de: "Beispiel: Pull / Push / Legs...",
      en: "Example: Pull / Push / Legs...",
      ru: "Пример: Pull / Push / Legs...",
      tr: "Örnek: Pull / Push / Legs...",
      az: "Nümunə: Pull / Push / Legs...",
      fr: "Exemple : Pull / Push / Legs...",
      uk: "Приклад: Pull / Push / Legs..."
    }
  };

  document.querySelectorAll("[placeholder]").forEach(el => {
    if (!el.dataset.originalPlaceholder) {
      el.dataset.originalPlaceholder = el.getAttribute("placeholder") || "";
    }
    const original = el.dataset.originalPlaceholder;
    const translated = placeholderMap[original]?.[lang];
    if (translated) el.setAttribute("placeholder", translated);
  });
}

function setLanguage(lang) {
  const supported = I18N[lang] ? lang : "de";
  localStorage.setItem("kiveoxLang", supported);
  document.documentElement.lang = supported;

  const t = I18N[supported] || I18N.de;

  /* data-i18n translation */
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    if (t[key]) el.textContent = t[key];
  });

  /* normal visible text translation */
  translateTextNodes(document.body, supported);
  translatePlaceholders(supported);

  /* language dropdown sync */
  const sel = qs("language-select");
  if (sel) sel.value = supported;

  /* auth modal state text */
  const sub = qs("auth-subtitle");
  if (sub) sub.textContent = authMode === "login" ? t.loginSub : t.signupSub;

  const forgot = qs("forgot-password-btn");
  if (forgot) forgot.textContent = t.forgotPassword;

  const loggedInLabel = document.querySelector("#auth-user-box span:first-child");
  if (loggedInLabel) loggedInLabel.textContent = t.loggedIn;
}

function initLanguage() {
  setLanguage(localStorage.getItem("kiveoxLang") || "de");
}

/* ==================================================
   SUPABASE AUTH
   ================================================== */

function isSupabaseConfigured() {
  return (
    SUPABASE_URL &&
    SUPABASE_ANON_KEY &&
    !SUPABASE_URL.includes("PASTE_YOUR") &&
    !SUPABASE_ANON_KEY.includes("PASTE_YOUR")
  );
}

function getSupabaseClient() {
  if (!isSupabaseConfigured()) return null;
  if (!window.supabase || !window.supabase.createClient) return null;

  if (!kiveoxSupabase) {
    kiveoxSupabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }

  return kiveoxSupabase;
}

function showAuthMessage(message, isError = false) {
  const box = qs("auth-message");
  if (!box) return;

  box.textContent = message;
  box.classList.toggle("error", isError);
  box.style.display = "block";
}

function clearAuthMessage() {
  const box = qs("auth-message");
  if (!box) return;

  box.textContent = "";
  box.classList.remove("error");
  box.style.display = "none";
}

function openAuthModal(mode = "login") {
  switchAuthMode(mode);
  qs("auth-modal")?.classList.add("active");
  setTimeout(() => qs("auth-email")?.focus(), 60);
}

function closeAuthModal() {
  qs("auth-modal")?.classList.remove("active");
  clearAuthMessage();
}

function switchAuthMode(mode) {
  authMode = mode;
  const isLogin = mode === "login";
  const lang = localStorage.getItem("kiveoxLang") || "de";
  const t = I18N[lang] || I18N.de;

  if (qs("auth-title")) qs("auth-title").textContent = isLogin ? TEXT_I18N["Login"][lang] || "Login" : TEXT_I18N["Sign Up"][lang] || "Sign Up";
  if (qs("auth-subtitle")) qs("auth-subtitle").textContent = isLogin ? t.loginSub : t.signupSub;
  if (qs("auth-submit-btn")) qs("auth-submit-btn").textContent = isLogin ? TEXT_I18N["Login"][lang] || "Login" : t.accountCreate;

  qs("auth-login-tab")?.classList.toggle("active", isLogin);
  qs("auth-signup-tab")?.classList.toggle("active", !isLogin);

  if (qs("forgot-password-btn")) qs("forgot-password-btn").style.display = isLogin ? "inline-block" : "none";
  if (qs("auth-username-field")) qs("auth-username-field").style.display = isLogin ? "none" : "block";
  if (qs("auth-username")) qs("auth-username").required = !isLogin;

  clearAuthMessage();
}

function normalizeUsername(value) {
  return (value || "")
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_\-.]/g, "")
    .slice(0, 24);
}

function fallbackDisplayName(user) {
  if (!user) return "";
  return (
    user.user_metadata?.display_name ||
    user.user_metadata?.username ||
    (user.email ? user.email.split("@")[0] : "KiveoX User")
  );
}

async function getDisplayName(user) {
  const client = getSupabaseClient();
  if (!client || !user) return fallbackDisplayName(user);

  try {
    const { data, error } = await client
      .from("profiles")
      .select("username, display_name")
      .eq("id", user.id)
      .maybeSingle();

    if (error) return fallbackDisplayName(user);
    return (data && (data.display_name || data.username)) || fallbackDisplayName(user);
  } catch {
    return fallbackDisplayName(user);
  }
}

async function saveUsername(user, username) {
  const client = getSupabaseClient();
  if (!client || !user || !username) return;

  try {
    await client
      .from("profiles")
      .upsert(
        {
          id: user.id,
          username,
          display_name: username,
          updated_at: new Date().toISOString()
        },
        { onConflict: "id" }
      );
  } catch (e) {
    console.warn(e);
  }
}

async function handleAuthSubmit(event) {
  event.preventDefault();

  const client = getSupabaseClient();
  const email = qs("auth-email")?.value.trim();
  const password = qs("auth-password")?.value || "";
  const username = normalizeUsername(qs("auth-username")?.value || "");

  if (!client) {
    showAuthMessage("Login ist gerade nicht verfügbar. Bitte versuche es später nochmal.", true);
    return;
  }

  if (password.length < 6) {
    showAuthMessage("Das Passwort muss mindestens 6 Zeichen haben.", true);
    return;
  }

  if (authMode === "signup" && username.length < 3) {
    showAuthMessage("Der Username muss mindestens 3 Zeichen haben.", true);
    return;
  }

  const btn = qs("auth-submit-btn");
  if (btn) btn.disabled = true;

  try {
    let result;

    if (authMode === "signup") {
      result = await client.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            display_name: username
          }
        }
      });
    } else {
      result = await client.auth.signInWithPassword({
        email,
        password
      });
    }

    if (result.error) {
      showAuthMessage("E-Mail oder Passwort ist nicht korrekt, oder der Account existiert bereits.", true);
      return;
    }

    if (authMode === "signup") {
      if (result.data?.user) await saveUsername(result.data.user, username);
      showAuthMessage("Account erstellt. Du kannst dich jetzt einloggen.");
      await updateAuthUI();
      switchAuthMode("login");
    } else {
      showAuthMessage("Login erfolgreich.");
      await updateAuthUI();
      setTimeout(closeAuthModal, 650);
    }
  } catch (e) {
    console.error(e);
    showAuthMessage("Es ist ein Fehler aufgetreten. Bitte versuche es später nochmal.", true);
  } finally {
    if (btn) btn.disabled = false;
  }
}

async function resetPassword() {
  const client = getSupabaseClient();
  const email = qs("auth-email")?.value.trim();

  if (!client) {
    showAuthMessage("Login ist gerade nicht verfügbar. Bitte versuche es später nochmal.", true);
    return;
  }

  if (!email) {
    showAuthMessage("Bitte zuerst deine E-Mail eingeben.", true);
    return;
  }

  const { error } = await client.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin + window.location.pathname
  });

  if (error) {
    showAuthMessage("Recovery konnte gerade nicht gestartet werden. Bitte später erneut versuchen.", true);
    return;
  }

  showAuthMessage("Recovery-Link wurde gesendet. Prüfe deine E-Mails.");
}

async function logoutUser() {
  const client = getSupabaseClient();
  if (client) await client.auth.signOut();
  await updateAuthUI(null);
}

async function updateAuthUI(forcedSession = undefined) {
  const client = getSupabaseClient();
  let session = forcedSession;

  if (session === undefined && client) {
    const { data } = await client.auth.getSession();
    session = data.session;
  }

  const user = session?.user || null;
  const name = user ? await getDisplayName(user) : "";

  if (qs("login-open-btn")) qs("login-open-btn").style.display = user ? "none" : "inline-block";
  if (qs("signup-open-btn")) qs("signup-open-btn").style.display = user ? "none" : "inline-block";
  if (qs("auth-user-box")) qs("auth-user-box").style.display = user ? "flex" : "none";

  if (qs("auth-user-name")) {
    qs("auth-user-name").textContent = name;
    qs("auth-user-name").title = user?.email || name;
  }
}

function initAuth() {
  const modal = qs("auth-modal");

  modal?.addEventListener("click", e => {
    if (e.target === modal) closeAuthModal();
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeAuthModal();
  });

  const client = getSupabaseClient();
  if (client) {
    client.auth.onAuthStateChange((_event, session) => updateAuthUI(session));
  }

  updateAuthUI();
}

/* ==================================================
   CALCULATORS
   ================================================== */

function calculateBMI() {
  const w = parseFloat(qs("weight")?.value);
  const h = parseFloat(qs("height")?.value) / 100;
  const age = parseFloat(qs("age")?.value);

  if (!w || !h) {
    alert("Bitte Gewicht und Größe eingeben.");
    return;
  }

  const bmi = w / (h * h);
  let cat = "Normalgewicht";

  if (bmi < 18.5) cat = "Untergewicht";
  else if (bmi < 25) cat = "Normalgewicht";
  else if (bmi < 30) cat = "Übergewicht";
  else cat = "Adipositas";

  if (qs("bmiNumber")) qs("bmiNumber").textContent = bmi.toFixed(1);
  if (qs("bmiCategory")) qs("bmiCategory").textContent = cat;
  if (qs("bmiExtraInfo")) qs("bmiExtraInfo").textContent = age ? `Alter: ${age}` : "";
  if (qs("bmiTip")) qs("bmiTip").textContent = "BMI ist eine grobe Orientierung. Muskelmasse, Kraft und Körperform separat bewerten.";
  if (qs("bmiResultBox")) qs("bmiResultBox").style.display = "block";
}

function calculateCalories() {
  const w = parseFloat(qs("weight")?.value);
  const h = parseFloat(qs("height")?.value);
  const age = parseFloat(qs("age")?.value);
  const activity = parseFloat(qs("activity")?.value || "1.55");
  const goal = qs("goal")?.value || "maintain";

  if (!w || !h || !age) {
    alert("Bitte Gewicht, Größe und Alter im Body Calculator eingeben.");
    return;
  }

  const bmr = 10 * w + 6.25 * h - 5 * age + 5;
  const daily = Math.round(bmr * activity);

  let target = daily;
  let goalText = "Maintenance: iss ungefähr deinen Verbrauch.";

  if (goal === "lose") {
    target = daily - 400;
    goalText = "Fettverlust: ca. 300-500 kcal unter Verbrauch starten.";
  }

  if (goal === "gain") {
    target = daily + 250;
    goalText = "Muskelaufbau: kleiner Überschuss, sauber tracken.";
  }

  if (qs("calorieNumber")) qs("calorieNumber").textContent = `${target} kcal`;
  if (qs("calorieInfo")) qs("calorieInfo").textContent = `Geschätzter Verbrauch: ${daily} kcal`;
  if (qs("goalInfo")) qs("goalInfo").textContent = goalText;
  if (qs("calorieResultBox")) qs("calorieResultBox").style.display = "block";
}

/* ==================================================
   LOCAL STORAGE: CUSTOM PLAN + PROGRESS
   ================================================== */

function saveCustomPlan() {
  const data = {
    name: qs("plan-name")?.value || "My Plan",
    days: qs("plan-days")?.value || "3",
    goal: qs("plan-goal")?.value || "Strength",
    notes: qs("plan-notes")?.value || ""
  };

  localStorage.setItem("kiveoxCustomPlan", JSON.stringify(data));
  renderCustomPlan();
}

function renderCustomPlan() {
  const box = qs("saved-plan");
  if (!box) return;

  const data = JSON.parse(localStorage.getItem("kiveoxCustomPlan") || "null");

  if (!data) {
    box.innerHTML = '<p class="muted">Noch kein eigener Plan gespeichert.</p>';
    return;
  }

  box.innerHTML = `
    <h3>${data.name}</h3>
    <p><span class="highlight">Ziel:</span> ${data.goal}</p>
    <p><span class="highlight">Trainingstage:</span> ${data.days} pro Woche</p>
    <p>${String(data.notes).replace(/\n/g, "<br>")}</p>
  `;
}

function saveProgress() {
  const entry = {
    date: new Date().toLocaleDateString("de-DE"),
    weight: qs("progress-weight")?.value || "",
    waist: qs("progress-waist")?.value || "",
    note: qs("progress-note")?.value || ""
  };

  const list = JSON.parse(localStorage.getItem("kiveoxProgress") || "[]");
  list.unshift(entry);

  localStorage.setItem("kiveoxProgress", JSON.stringify(list.slice(0, 20)));
  renderProgress();
}

function renderProgress() {
  const box = qs("progress-list");
  if (!box) return;

  const list = JSON.parse(localStorage.getItem("kiveoxProgress") || "[]");

  if (!list.length) {
    box.innerHTML = '<p class="muted">Noch keine Einträge gespeichert.</p>';
    return;
  }

  box.innerHTML = list
    .map(
      e => `
      <div class="tracker-row">
        <strong>${e.date}</strong>
        <p>Gewicht: ${e.weight || "-"} kg · Bauch: ${e.waist || "-"} cm</p>
        <p>${e.note || ""}</p>
      </div>
    `
    )
    .join("");
}

/* ==================================================
   INIT
   ================================================== */

function initPage() {
  initLanguage();
  initAuth();
  renderCustomPlan();
  renderProgress();
}

document.addEventListener("DOMContentLoaded", initPage);
