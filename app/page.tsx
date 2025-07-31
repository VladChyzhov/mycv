"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { generatePDF, generateATSPDF } from "@/lib/pdf-generator"
import { convertCVToDocx, convertCVDataToDocx } from "@/lib/md-to-docx"
import dynamic from "next/dynamic"

const ATSSafeCV = dynamic(() => import("@/components/ATSSafeCV"), {
  ssr: false
})
import {
  Phone,
  Mail,
  MapPin,
  Download,
  Globe,
  Languages,
  Upload,
  Star,
  Briefcase,
  GraduationCap,
  User,
  Heart,
  Camera,
  Plane,
  Music,
  Code,
  Brain,
  Circle,
  Users,
  Activity,
  BookOpen,
} from "lucide-react"

const translations = {
  ru: {
    name: "Владислав Чижов",
    title: "Консультант по бизнес-трансформации и финансам",
    downloadPdf: "Скачать PDF",
    downloadDocx: "Скачать DOCX",
    statement: "РЕЗЮМЕ",
    workExperience: "ОПЫТ РАБОТЫ",
    education: "ОБРАЗОВАНИЕ",
    proSkills: "ПРОФЕССИОНАЛЬНЫЕ НАВЫКИ",
    personalSkills: "ЛИЧНЫЕ КАЧЕСТВА",
    hobbies: "ХОББИ И ИНТЕРЕСЫ",
    languages: "ЯЗЫКИ",
    certifications: "СЕРТИФИКАТЫ",

    statementText:
      "Лидер бизнес-трансформации с 20+ годами опыта, обеспечивающий прибыльный рост для торговых и промышленных МСП. Создаю системы учета/KPI на основе данных и автоматизирую рабочие процессы с помощью Python и ERP. Увеличил выручку до $1.8 млн ARR, сократил налоговую нагрузку на 15%, повысил скорость процессов на 50%. Готов повторить успех по всей Скандинавии.",

    workItems: [
      {
        year: "2024-2025",
        title: "Консультант по развитию бизнеса",
        company: "Vysotsky Consulting, Швеция",
        description:
          "• Провел коучинг для 20+ владельцев МСП; средний EBITDA вырос на 26% за 3 месяца\n• Устранил узкие места в процессах (VSM) → время выполнения ↓ 18%\n• Разработал системы OKR/KPI; внедрил в шести компаниях",
      },
      {
        year: "2010-2022",
        title: "Собственник / Генеральный директор",
        company: "Частное торговое предприятие, Украина",
        description:
          "• Масштабировал компанию до 15 сотрудников, 1000+ SKU, $1.8 млн ARR\n• Внедрил 1C ERP + Excel VBA; время ручной отчетности ↓ 70%\n• Запустил омниканальные продажи; оборот ↑ до $150 тыс. MRR за девять месяцев",
      },
      {
        year: "2004-2010",
        title: "Фриланс-консультант по финансам",
        company: "Украина",
        description: "• Создал управленческий и налоговый учет для 15 МСП; платежи ↓ 15%\n• Обучил 40+ бухгалтеров/владельцев IFRS и BI-дашбордам",
      },
      {
        year: "2006-2007",
        title: "Директор по экспортным продажам",
        company: "LLC AzovElitStroy",
        description: "Закрыл контракты на $2 млн на сталь и газовые баллоны",
      },
      {
        year: "2000-2006",
        title: "Бухгалтерия и финансы",
        company: "Azov Steel Group",
        description: "Провел 30 аудитов цепочки поставок; потери ↓ 12%",
      },
    ],

    educationItems: [
      {
        year: "2000",
        title: "Магистр экономики (SeQF 7)",
        company: "PSTU",
        description: "Бизнес-экономика",
      },
      {
        year: "1999",
        title: "Бакалавр экономики (SeQF 6)",
        company: "PSTU",
        description: "Экономика",
      },
      {
        year: "2000-2002",
        title: "Аспирантура (незавершенная)",
        company: "PSTU",
        description: "Организация планирования и экономика предприятия",
      },
    ],

    skills: [
      "Цифровая автоматизация процессов",
      "Управленческий и налоговый учет",
      "KPI и дизайн дашбордов",
      "Оптимизация затрат и налогов",
      "Организационный дизайн",
      "Анализ данных и прогнозирование",
      "Коучинг и лидерство команды",
    ],

    personalSkillsItems: [
      "Лидерство",
      "Коммуникация", 
      "Креативность",
      "Организация",
      "Управление",
    ],

    languageSkills: [
      { name: "Swedish", level: "B1" },
      { name: "English", level: "B2" },
      { name: "Ukrainian", level: "C2" },
      { name: "Russian", level: "C2" },
    ],

    certificationItems: [
      "Консультант по развитию бизнеса — Vysotsky Consulting (2025)",
      "Специалист по AI-автоматизации — n8n, LangChain, ChatGPT API (2025)",
      "Python для бизнес-аналитики — Coursera (2024)",
      "UX/UI и веб-дизайн — Udemy (2023)",
    ],
  },

  en: {
    name: "Vladyslav Chyzhov",
    title: "Business Transformation & Finance Consultant",
    downloadPdf: "Download PDF",
    downloadDocx: "Download DOCX",
    statement: "RESUME",
    workExperience: "WORK EXPERIENCE",
    education: "EDUCATION",
    proSkills: "PROFESSIONAL SKILLS",
    personalSkills: "PERSONAL SKILLS",
    hobbies: "HOBBIES AND INTERESTS",
    languages: "LANGUAGES",
    certifications: "CERTIFICATIONS",

    statementText:
      "Business-transformation leader with 20+ years driving profitable growth for trading & industrial SMEs. Build data-driven accounting/KPI systems and automate workflows with Python & ERP. Scaled revenue to $1.8M ARR, cut tax burden 15%, boosted process speed 50%. Ready to replicate success across Scandinavia.",

    workItems: [
      {
        year: "2024-2025",
        title: "Business Development Consultant",
        company: "Vysotsky Consulting, Sweden",
        description:
          "• Coached 20+ SME owners; average EBITDA up 26% in 3 months\n• Removed process bottlenecks (VSM) → lead-time ↓ 18%\n• Designed OKR/KPI suites; rolled out in six companies",
      },
      {
        year: "2010-2022",
        title: "Owner / Chief Executive Officer",
        company: "Private Trading Enterprise, Ukraine",
        description:
          "• Scaled firm to 15 FTE, 1000+ SKU, $1.8M ARR\n• Deployed 1C ERP + Excel VBA; manual reporting time ↓ 70%\n• Launched omnichannel sales; turnover ↑ to $150K MRR in nine months",
      },
      {
        year: "2004-2010",
        title: "Freelance Finance Consultant",
        company: "Ukraine",
        description: "• Built management & tax accounting for 15 SMEs; payments ↓ 15%\n• Trained 40+ accountants/owners in IFRS and BI dashboards",
      },
      {
        year: "2006-2007",
        title: "Export Sales Director",
        company: "LLC AzovElitStroy",
        description: "Closed $2M steel & gas-cylinder contracts",
      },
      {
        year: "2000-2006",
        title: "Accounting & Finance",
        company: "Azov Steel Group",
        description: "Led 30 supply-chain audits; losses ↓ 12%",
      },
    ],

    educationItems: [
      {
        year: "2000",
        title: "MSc Business Economics (SeQF 7)",
        company: "PSTU",
        description: "Business Economics",
      },
      {
        year: "1999",
        title: "BSc Economics (SeQF 6)",
        company: "PSTU",
        description: "Economics",
      },
      {
        year: "2000-2002",
        title: "PhD coursework (incomplete)",
        company: "PSTU",
        description: "Organisation Planning & Enterprise Economics",
      },
    ],

    skills: [
      "Digital Process Automation",
      "Management & Tax Accounting",
      "KPI & Dashboard Design",
      "Cost & Tax Optimisation",
      "Organisational Design",
      "Data Analytics & Forecasting",
      "Coaching & Team Leadership",
    ],

    personalSkillsItems: [
      "Leadership",
      "Communication",
      "Creativity", 
      "Organization",
      "Management",
    ],

    languageSkills: [
      { name: "Swedish", level: "B1" },
      { name: "English", level: "B2" },
      { name: "Ukrainian", level: "C2" },
      { name: "Russian", level: "C2" },
    ],

    certificationItems: [
      "Business Development Consultant — Vysotsky Consulting (2025)",
      "AI-Automation Specialist — n8n, LangChain, ChatGPT API (2025)",
      "Python for Business Analytics — Coursera (2024)",
      "UX/UI & Web Design — Udemy (2023)",
    ],
  },

  sv: {
    name: "Vladyslav Chyzhov",
    title: "Affärstransformations- och Finanskonsult",
    downloadPdf: "Ladda ner PDF",
    downloadDocx: "Ladda ner DOCX",
    statement: "CV",
    workExperience: "ARBETSLIVSERFARENHET",
    education: "UTBILDNING",
    proSkills: "PROFESSIONELLA FÄRDIGHETER",
    personalSkills: "PERSONLIGA EGENSKAPER",
    hobbies: "HOBBYER OCH INTRESSEN",
    languages: "SPRÅK",
    certifications: "CERTIFIERINGAR",

    statementText:
      "Affärstransformationsledare med 20+ års erfarenhet av att driva lönsam tillväxt för handels- och industriföretag. Bygger datadrivna redovisnings-/KPI-system och automatiserar arbetsflöden med Python och ERP. Skalade intäkter till $1.8M ARR, minskade skattebördan med 15%, ökade processhastigheten med 50%. Redo att replikera framgång över hela Skandinavien.",

    workItems: [
      {
        year: "2024-2025",
        title: "Affärsutvecklingskonsult",
        company: "Vysotsky Consulting, Sverige",
        description:
          "• Coachade 20+ småföretagare; genomsnittlig EBITDA upp 26% på 3 månader\n• Eliminerade processflaskhalsar (VSM) → ledtid ↓ 18%\n• Utformade OKR/KPI-system; implementerade i sex företag",
      },
      {
        year: "2010-2022",
        title: "Ägare / VD",
        company: "Privat handelsföretag, Ukraina",
        description:
          "• Skalade företaget till 15 anställda, 1000+ artiklar, $1.8M ARR\n• Implementerade 1C ERP + Excel VBA; manuell rapporteringstid ↓ 70%\n• Lanserade omnikanal-försäljning; omsättning ↑ till $150K MRR på nio månader",
      },
      {
        year: "2004-2010",
        title: "Frilans finanskonsult",
        company: "Ukraina",
        description: "• Byggde ekonomistyrning och skatteredovisning för 15 småföretag; betalningar ↓ 15%\n• Tränade 40+ revisorer/ägare i IFRS och BI-dashboarder",
      },
      {
        year: "2006-2007",
        title: "Exportförsäljningsdirektör",
        company: "LLC AzovElitStroy",
        description: "Stängde $2M kontrakt för stål och gasflaskor",
      },
      {
        year: "2000-2006",
        title: "Redovisning och finans",
        company: "Azov Steel Group",
        description: "Ledde 30 leverantörskedje-revisioner; förluster ↓ 12%",
      },
    ],

    educationItems: [
      {
        year: "2000",
        title: "Magisterexamen Företagsekonomi (SeQF 7)",
        company: "PSTU",
        description: "Företagsekonomi",
      },
      {
        year: "1999",
        title: "Kandidatexamen Ekonomi (SeQF 6)",
        company: "PSTU",
        description: "Ekonomi",
      },
      {
        year: "2000-2002",
        title: "Forskarutbildning (ofullständig)",
        company: "PSTU",
        description: "Organisationsplanering och företagsekonomi",
      },
    ],

    skills: [
      "Digital processautomatisering",
      "Ekonomistyrning och skatteredovisning",
      "KPI och dashboard-design",
      "Kostnads- och skatteoptimering",
      "Organisationsdesign",
      "Dataanalys och prognoser",
      "Coaching och teamledning",
    ],

    personalSkillsItems: [
      "Ledarskap",
      "Kommunikation",
      "Kreativitet",
      "Organisation", 
      "Ledning",
    ],

    languageSkills: [
      { name: "Svenska", level: "B1" },
      { name: "Engelska", level: "B2" },
      { name: "Ukrainska", level: "C2" },
      { name: "Ryska", level: "C2" },
    ],

    certificationItems: [
      "Affärsutvecklingskonsult — Vysotsky Consulting (2025)",
      "AI-automationsspecialist — n8n, LangChain, ChatGPT API (2025)",
      "Python för affärsanalys — Coursera (2024)",
      "UX/UI och webbdesign — Udemy (2023)",
    ],
  },
}

export default function CVPage() {
  const [language, setLanguage] = useState<"ru" | "en" | "sv">("sv")
  const [profilePhoto, setProfilePhoto] = useState<string>("/images/profile-photo.png")
  const [showPhoto, setShowPhoto] = useState<boolean>(true)
  const [showATSMode, setShowATSMode] = useState<boolean>(false)
  const [isClient, setIsClient] = useState<boolean>(false)
  const [selectedPosition, setSelectedPosition] = useState<string>("base")

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const photoData = e.target?.result as string
        setProfilePhoto(photoData)
        // Сохраняем в localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('profilePhoto', photoData)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  // Устанавливаем флаг клиента
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Загружаем сохраненную фотографию при инициализации
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPhoto = localStorage.getItem('profilePhoto')
      if (savedPhoto) {
        setProfilePhoto(savedPhoto)
      }
    }
  }, [])

  const t = translations[language]

  // Функция для получения данных текущей должности
  const getCurrentPositionData = () => {
    return positionData[selectedPosition as keyof typeof positionData] || positionData.base
  }

  // Данные для разных должностей
  const positionData = {
    base: {
      title: t.title,
      statementText: t.statementText,
      workItems: t.workItems,
      educationItems: t.educationItems,
      skills: t.skills,
      personalSkillsItems: t.personalSkillsItems,
      languageSkills: t.languageSkills,
      certificationItems: t.certificationItems,
      keyAchievements: [
        "50% Process Speed Increase via full ERP automation (2022)",
        "$150k MRR Turnover restored in 9 months post-COVID through e-commerce launch (2021)",
        "15% Average tax burden cut for 15 SMEs (2004-2020)"
      ],
      values: ["Lagom", "Förtroende", "Lifelong learning"]
    },
    accountant: {
      title: "Accountant – Order-to-Cash (Internship Applicant)",
      statementText: "Analytical accountant with 18+ years hands-on experience across Order-to-Cash (O2C), accounts receivable, credit control and master-data governance for trading and industrial SMEs. Expert user of ERP/finance suites (Visma, 1C ERP, SAP FI) and MS Office (Excel Power Query, VBA). Proven record of accelerating cash collection ↑ 20%, reducing overdue receivables ↓ 15% and building collaborative workflows with Sales & Customer-Service teams. Fluent in English (B2) and Swedish (B1). Eager to bring strong process mindset and customer focus to SKF's global finance hub.",
      workItems: [
        {
          title: "Business Development / Finance Consultant",
          company: "Vysotsky Consulting, Sweden",
          year: "2024 – Present",
          description: "• Designed unified AR dashboards (Excel Power BI) → aged-debtor visibility ↑ 100%\n• Automated reminder & dunning letters in Visma/ERP; average DSO ↓ 8 days\n• Trained sales teams (20+ users) on credit limits, dispute coding and cash-application rules"
        },
        {
          title: "Owner / CFO",
          company: "Private Trading Enterprise, Ukraine",
          year: "2010 – 2022",
          description: "• Managed full O2C cycle: credit vetting, invoicing, cash application, dispute resolution\n• Implemented 1C ERP module 'Trade + AR'; manual postings ↓ 70%\n• Maintained customer master data for 250 accounts; pricing & tax codes 100% accurate\n• Collaborated daily with Sales & Logistics to release blocked orders and secure revenue flow"
        },
        {
          title: "Freelance Accounting Consultant",
          company: "Ukraine",
          year: "2004 – 2010",
          description: "• Set up AR ledgers for 15 SMEs; configured payment terms & ageing reports in ERP\n• Developed Excel-based cash-collection tracker adopted by all clients\n• Delivered workshops on IFRS 9 impairment and bad-debt provisioning"
        },
        {
          title: "Export Sales Director",
          company: "LLC AzovElitStroy",
          year: "2006-2007",
          description: "• Negotiated payment terms, secured $2M contracts"
        },
        {
          title: "Accounting & Finance",
          company: "Azov Steel Group",
          year: "2000-2006",
          description: "• Reconciled 30+ supplier & customer accounts, variance errors ↓ 12%"
        }
      ],
      educationItems: [
        {
          title: "MSc Business Economics (SeQF 7)",
          company: "PSTU, Ukraine",
          year: "2000",
          description: "Accounting & Finance"
        },
        {
          title: "BSc Economics (SeQF 6)",
          company: "PSTU, Ukraine",
          year: "1999",
          description: "Economics"
        },
        {
          title: "PhD coursework (incomplete)",
          company: "PSTU",
          year: "2000-2002",
          description: "Organisation Planning & Enterprise Economics"
        }
      ],
      skills: ["Order-to-Cash Cycle & AR Collections", "Credit Risk & Customer Master Data", "Period-End Closing & Reconciliations", "ERP / Finance Systems (Visma, 1C ERP, SAP FI)", "Advanced Excel (Power Pivot, VBA) & Power BI", "Cross-functional Collaboration (Sales, Logistics)", "Continuous Improvement (Lean, VSM)"],
      personalSkillsItems: ["Customer-Centric", "Quality-Driven", "Team Player", "Continuous Improvement", "Lagom"],
      languageSkills: [
        { name: "Swedish", level: "B1" },
        { name: "English", level: "B2" },
        { name: "Ukrainian", level: "C2" },
        { name: "Russian", level: "C2" }
      ],
      certificationItems: [
        "2025 Business Development Consultant — Vysotsky Consulting",
        "2025 AI-Automation Specialist — n8n, LangChain, ChatGPT API",
        "2024 Python for Business Analytics — Coursera",
        "2023 UX/UI & Web Design — Udemy"
      ],
      keyAchievements: [
        "↑ 20% Acceleration of cash collection after introducing automated dunning in ERP",
        "↓ 15% Reduction in overdue AR > 60 days via redesigned credit-block workflow",
        "100% On-time month-end AR close for 48 consecutive periods"
      ],
      values: ["Customer-Centric", "Quality-Driven", "Team Player", "Continuous Improvement", "Lagom"]
    }
  }

  const downloadPDF = async () => {
    if (typeof window === 'undefined') return
    
    const result = await generatePDF({ language })
    
    if (result.success) {
      console.log(`PDF generated successfully: ${result.filename}`)
    } else {
      console.error("PDF generation failed:", result.error)
    }
  }

  const downloadDOCX = async () => {
    if (typeof window === 'undefined') return
    
    const result = await convertCVDataToDocx(t, language)
    
    if (result.success) {
      console.log("DOCX generated successfully")
    } else {
      console.error("DOCX generation failed:", result.error)
    }
  }

  const downloadATSPDF = async () => {
    if (typeof window === 'undefined') return
    
    const result = await generateATSPDF({ language, translations })
    
    if (result.success) {
      console.log(`ATS PDF generated successfully: ${result.filename}`)
    } else {
      console.error("ATS PDF generation failed:", result.error)
    }
  }

  const renderStars = (level: number) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`w-3 h-3 ${i < level ? "fill-sky-400 text-sky-400" : "text-gray-300"}`} />
        ))}
      </div>
    )
  }

  const renderCEFR = (level: string) => {
    return (
      <div className="text-xs font-medium text-sky-400 bg-sky-50 px-2 py-1 rounded">
        {level}
      </div>
    )
  }

  const renderProgressBar = (level: number) => {
    return (
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-sky-400 h-2 rounded-full transition-all duration-300 progress-bar-fill" 
          data-width={level}
        ></div>
      </div>
    )
  }

  return (
    <div className="a4-container font-inter">
      {/* Language Selector & PDF Download Button - Hidden in print */}
      <div className="fixed top-6 right-6 z-10 flex flex-col gap-4 print:hidden">
        {/* Position Selector */}
        <Card className="p-3 bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <Briefcase className="w-4 h-4 text-sky-500" />
            <span className="text-sm font-medium text-gray-700">
              {language === "sv" ? "Position" : language === "en" ? "Position" : "Должность"}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <Button
              variant={selectedPosition === "base" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPosition("base")}
              className={`text-xs px-3 py-2 ${
                selectedPosition === "base" ? "bg-sky-500 text-white hover:bg-sky-600" : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              {language === "sv" ? "Bas" : language === "en" ? "Base" : "Базовое"}
            </Button>
            <Button
              variant={selectedPosition === "accountant" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPosition("accountant")}
              className={`text-xs px-3 py-2 ${
                selectedPosition === "accountant" ? "bg-sky-500 text-white hover:bg-sky-600" : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              {language === "sv" ? "Revisor" : language === "en" ? "Accountant" : "Бухгалтер"}
            </Button>
          </div>
        </Card>
        <Card className="p-3 bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="flex items-center gap-3">
            <Languages className="w-4 h-4 text-sky-500" />
            <div className="flex bg-gray-100 rounded-lg overflow-hidden">
              <Button
                variant={language === "sv" ? "default" : "ghost"}
                size="sm"
                onClick={() => setLanguage("sv")}
                className={`rounded-none text-sm px-4 py-2 ${
                  language === "sv" ? "bg-sky-500 text-white hover:bg-sky-600" : "hover:bg-gray-200 text-gray-700"
                }`}
              >
                SV
              </Button>
              <Button
                variant={language === "en" ? "default" : "ghost"}
                size="sm"
                onClick={() => setLanguage("en")}
                className={`rounded-none text-sm px-4 py-2 ${
                  language === "en" ? "bg-sky-500 text-white hover:bg-sky-600" : "hover:bg-gray-200 text-gray-700"
                }`}
              >
                EN
              </Button>
              <Button
                variant={language === "ru" ? "default" : "ghost"}
                size="sm"
                onClick={() => setLanguage("ru")}
                className={`rounded-none text-sm px-4 py-2 ${
                  language === "ru" ? "bg-sky-500 text-white hover:bg-sky-600" : "hover:bg-gray-200 text-gray-700"
                }`}
              >
                RU
              </Button>
            </div>
          </div>
        </Card>

        {/* PDF Download Button */}
        {isClient && (
          <Button
            onClick={downloadPDF}
            className="bg-sky-500 hover:bg-sky-600 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200 shadow-lg"
          >
            <Download className="w-4 h-4 mr-2" />
            {t.downloadPdf}
          </Button>
        )}

        {/* DOCX Download Button */}
        {isClient && (
          <Button
            onClick={downloadDOCX}
            className="bg-green-500 hover:bg-green-600 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200 shadow-lg"
          >
            <Download className="w-4 h-4 mr-2" />
            {t.downloadDocx}
          </Button>
        )}

        {/* Photo Toggle Button */}
        <Button
          onClick={() => setShowPhoto(!showPhoto)}
          className="bg-purple-500 hover:bg-purple-600 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200 shadow-lg"
        >
          <Camera className="w-4 h-4 mr-2" />
          {showPhoto ? 
            (language === "ru" ? "Скрыть фото" : language === "sv" ? "Dölj foto" : "Hide photo") :
            (language === "ru" ? "Показать фото" : language === "sv" ? "Visa foto" : "Show photo")
          }
        </Button>

        {/* ATS Safe CV Button */}
        <Button
          onClick={() => setShowATSMode(!showATSMode)}
          className="bg-red-500 hover:bg-red-600 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200 shadow-lg"
        >
          <Download className="w-4 h-4 mr-2" />
          ATS Safe CV
        </Button>

        {/* ATS PDF Download Button */}
        {showATSMode && isClient && (
          <Button
            onClick={downloadATSPDF}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200 shadow-lg"
          >
            <Download className="w-4 h-4 mr-2" />
            {language === "sv" ? "Ladda ner ATS PDF" : language === "en" ? "Download ATS PDF" : "Скачать ATS PDF"}
          </Button>
        )}
      </div>

      {/* ATS Safe CV Mode */}
      {showATSMode ? (
        <ATSSafeCV language={language} translations={translations} />
      ) : (
        <>
          {/* Page 1 */}
          <div data-page="1" className="w-[210mm] h-[297mm] mx-auto bg-white print:w-full print:h-auto overflow-hidden">
        <div className="h-full flex flex-col">
          {/* Header Section */}
          <div className="grid grid-cols-5 h-64">
            {/* Photo Section */}
            {showPhoto && (
              <div className="col-span-2 bg-sky-100 p-6 flex items-center justify-center relative group rounded-full aspect-square w-48 h-48 mx-auto mt-8">
                <img
                  src={profilePhoto || "/placeholder.svg"}
                  alt={t.name}
                  className="w-full h-full object-cover object-top absolute inset-0 rounded-full"
                  crossOrigin="anonymous"
                />
                {/* Photo Upload Button - Hidden in print */}
                <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer print:hidden z-10">
                  <Upload className="w-6 h-6 text-white" />
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" title="Upload profile photo" />
                </label>
              </div>
            )}

            {/* Statement and Contact Info */}
            <div className={`p-6 flex flex-col ${showPhoto ? 'col-span-3 justify-between' : 'col-span-5 justify-center h-64'}`}>
              {showPhoto ? (
                <>
                  {/* Statement */}
                  <div className="mb-4 mt-6">
                    <p className={`text-xs text-gray-700 ${language === "ru" ? "leading-[1.4]" : "leading-[1.6]"}`}>{getCurrentPositionData().statementText}</p>
                  </div>

                  {/* Contact Info */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-sky-400 rounded-full flex items-center justify-center">
                          <Globe className="w-2.5 h-2.5 text-white" />
                        </div>
                        <span className="text-gray-700">vladchyzhov.com</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-sky-400 rounded-full flex items-center justify-center">
                          <Phone className="w-2.5 h-2.5 text-white" />
                        </div>
                        <span className="text-gray-700">+46 76 247 5916</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-sky-400 rounded-full flex items-center justify-center">
                          <Mail className="w-2.5 h-2.5 text-white" />
                        </div>
                        <span className="text-gray-700">vlad.chyzhov78@gmail.com</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-sky-400 rounded-full flex items-center justify-center">
                          <MapPin className="w-2.5 h-2.5 text-white" />
                        </div>
                        <span className="text-gray-700">Stenungsund, Sweden</span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  {/* Statement */}
                  <div className="mb-8 mt-8 text-justify max-w-md">
                    <p className={`text-xs text-gray-700 ${language === "ru" ? "leading-[1.4]" : "leading-[1.6]"}`}>{getCurrentPositionData().statementText}</p>
                  </div>

                  {/* Contact Info */}
                  <div className="grid grid-cols-2 gap-3 text-xs max-w-md">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-sky-400 rounded-full flex items-center justify-center">
                          <Globe className="w-2.5 h-2.5 text-white" />
                        </div>
                        <span className="text-gray-700">vladchyzhov.com</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-sky-400 rounded-full flex items-center justify-center">
                          <Phone className="w-2.5 h-2.5 text-white" />
                        </div>
                        <span className="text-gray-700">+46 76 247 5916</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-sky-400 rounded-full flex items-center justify-center">
                          <Mail className="w-2.5 h-2.5 text-white" />
                        </div>
                        <span className="text-gray-700">vlad.chyzhov78@gmail.com</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-sky-400 rounded-full flex items-center justify-center">
                          <MapPin className="w-2.5 h-2.5 text-white" />
                        </div>
                        <span className="text-gray-700">Stenungsund, Sweden</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Name Section */}
          <div className="w-full bg-sky-500/40 backdrop-blur-sm h-20 mt-2">
            <h1 className="px-6 py-2 text-white text-2xl font-bold uppercase">
              {t.name}
            </h1>
            <p className="px-6 pb-2 text-white text-sm opacity-90">
              {getCurrentPositionData().title}
            </p>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-5 flex-1">
            {/* Left Column */}
            <div className="col-span-3 p-6 space-y-6">
              {/* Work Experience */}
              <div>
                <div className="flex items-center gap-3 mb-4 pl-4">
                  <div className="w-8 h-8 bg-sky-400 rounded-full flex items-center justify-center">
                    <Briefcase className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-sky-400 tracking-wide">{t.workExperience}</h2>
                </div>

                <div className="space-y-8">
                  {getCurrentPositionData().workItems.slice(0, 6).map((item, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center w-16">
                        <div className="text-xs font-bold text-gray-600">{item.year}</div>
                        <div className="w-2.5 h-2.5 bg-sky-400 rounded-full mt-2"></div>
                        {index < 5 && <div className="w-0.5 h-16 bg-sky-200 mt-2"></div>}
                      </div>
                      <div className="flex-1 -mt-1">
                        <h3 className="font-bold text-gray-800 text-sm mb-3">{item.title}</h3>
                        <p className="text-xs text-gray-400 mb-4 font-medium">{item.company}</p>
                        <div className="text-xs text-gray-700 leading-relaxed">
                          {item.description.split('\n').map((line, lineIndex) => (
                            <div key={lineIndex} className="mb-2">
                              {line.trim()}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>


            </div>

            {/* Right Column */}
            <div className="col-span-2 p-6 space-y-6">
              {/* Professional Skills */}
              <div className="bg-white rounded-lg shadow-md p-4 border border-gray-100">
                <h2 className="text-base font-bold text-sky-400 mb-4 tracking-wide">{t.proSkills}</h2>
                <div className="space-y-3">
                  {getCurrentPositionData().skills.map((skill, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-sky-400 rounded-full mr-3 flex-shrink-0"></div>
                      <span className="text-xs text-gray-700">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Personal Skills */}
              <div className="bg-white rounded-lg shadow-md p-4 border border-gray-100">
                <h2 className="text-base font-bold text-sky-400 mb-4 tracking-wide">{t.personalSkills}</h2>
                <div className="space-y-3">
                  {getCurrentPositionData().personalSkillsItems.map((skill, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-sky-400 rounded-full mr-3 flex-shrink-0"></div>
                      <span className="text-xs text-gray-700">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div className="bg-white rounded-lg shadow-md p-4 border border-gray-100">
                <h2 className="text-base font-bold text-sky-400 mb-4 tracking-wide">{t.languages}</h2>
                <div className="space-y-3">
                  {getCurrentPositionData().languageSkills.map((skill, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-xs text-gray-700">{skill.name}</span>
                      {renderCEFR(skill.level)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Page 2 */}
      <div
        data-page="2"
        className="w-[210mm] h-[297mm] mx-auto bg-white print:w-full print:h-auto print:break-before-page overflow-hidden"
      >
        <div className="h-full">
          {/* Main Content */}
          <div className="grid grid-cols-5 h-full">
            {/* Left Column */}
            <div className="col-span-3 p-6 space-y-6">
              {/* Education */}
              <div>
                <div className="flex items-center gap-3 mb-4 pl-4">
                  <div className="w-8 h-8 bg-sky-400 rounded-full flex items-center justify-center">
                    <GraduationCap className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-sky-400 tracking-wide">{t.education}</h2>
                </div>

                <div className="space-y-4">
                  {getCurrentPositionData().educationItems.map((item, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="flex flex-col items-center w-16">
                        <div className="text-xs font-bold text-gray-600">{item.year}</div>
                        <div className="w-2.5 h-2.5 bg-sky-400 rounded-full mt-1"></div>
                        {index < t.educationItems.length - 1 && <div className="w-0.5 h-12 bg-sky-200 mt-1"></div>}
                      </div>
                      <div className="flex-1 -mt-1">
                        <h3 className="font-bold text-gray-800 text-sm mb-2">{item.title}</h3>
                        <p className="text-xs text-gray-400 mb-3 font-medium">{item.company}</p>
                        <div className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">{item.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>



              {/* Certifications */}
              <div>
                <div className="flex items-center gap-3 mb-4 pl-4">
                  <div className="w-8 h-8 bg-sky-400 rounded-full flex items-center justify-center">
                    <GraduationCap className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-sky-400 tracking-wide">{t.certifications}</h2>
                </div>

                <div className="space-y-2">
                  {getCurrentPositionData().certificationItems.map((item, index) => (
                    <div key={index} className="flex items-start gap-4 pl-7">
                      <div className="w-1.5 h-1.5 bg-sky-400 rounded-full mt-1.5 flex-shrink-0"></div>
                      <p className="text-xs text-gray-700 leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </div>



              {/* Hobbies */}
              <div className="mt-4">
                <div className="flex items-center gap-3 mb-4 pl-4">
                  <div className="w-8 h-8 bg-sky-400 rounded-full flex items-center justify-center">
                    <Heart className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-sky-400 tracking-wide">{t.hobbies}</h2>
                </div>

                <div className="grid grid-cols-5 gap-4">
                  <div className="text-center">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-2 mx-auto">
                      <Activity className="w-5 h-5 text-gray-600" />
                    </div>
                    <p className="text-xs text-gray-600">
                      {language === "sv" ? "Sport" : language === "en" ? "Sport" : "Спорт"}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-2 mx-auto">
                      <Users className="w-5 h-5 text-gray-600" />
                    </div>
                    <p className="text-xs text-gray-600">
                      {language === "sv" ? "Familj" : language === "en" ? "Family" : "Семья"}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-2 mx-auto">
                      <Code className="w-5 h-5 text-gray-600" />
                    </div>
                    <p className="text-xs text-gray-600">
                      {language === "sv" ? "Kodning" : language === "en" ? "Coding" : "koding"}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-2 mx-auto">
                      <Brain className="w-5 h-5 text-gray-600" />
                    </div>
                    <p className="text-xs text-gray-600">
                      {language === "sv" ? "AI" : language === "en" ? "AI" : "ИИ"}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-2 mx-auto">
                      <BookOpen className="w-5 h-5 text-gray-600" />
                    </div>
                    <p className="text-xs text-gray-600">
                      {language === "sv" ? "Läsning" : language === "en" ? "Reading" : "Чтение"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="col-span-2 p-6 space-y-6">

              {/* Key Achievements */}
              <div className="bg-white rounded-lg shadow-md p-4 border border-gray-100">
                <h2 className="text-base font-bold text-sky-400 mb-4 tracking-wide">
                  {language === "sv"
                    ? "NYCKELRESULTAT"
                    : language === "en"
                      ? "KEY ACHIEVEMENTS"
                      : "КЛЮЧЕВЫЕ ДОСТИЖЕНИЯ"}
                </h2>
                <div className="space-y-3">
                  {getCurrentPositionData().keyAchievements.slice(0, 3).map((achievement, index) => (
                    <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-xs text-gray-600 leading-relaxed">
                        {achievement}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Values */}
              <div className="bg-white rounded-lg shadow-md p-4 border border-gray-100">
                <h2 className="text-base font-bold text-sky-400 mb-4 tracking-wide">
                  {language === "sv" ? "VÄRDEN" : language === "en" ? "VALUES" : "ЦЕННОСТИ"}
                </h2>
                <div className="space-y-3">
                  {getCurrentPositionData().values.map((value, index) => (
                    <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm font-bold text-sky-400">
                        {value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
        </>
      )}
    </div>
  )
}
