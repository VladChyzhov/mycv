"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { generatePDF, generateATSPDF } from "@/lib/pdf-generator"
import { convertCVToDocx, convertCVDataToDocx } from "@/lib/md-to-docx"
import { buildResumeDomain } from "@/domain/resume/build"
import dynamic from "next/dynamic"
import LanguagesCard from "@/components/LanguagesCard"
import master from "@/domain/resume/data/master.json"

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

const { translations, positions } = buildResumeDomain()

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
    const byLang = positions[selectedPosition as keyof typeof positions] || positions.base
    return byLang[language]
  }

  // positions & translations are provided by the domain layer

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
                <LanguagesCard
                  items={(master as any)[language].languageSkills.map((skill: any) => ({
                    language: skill.name,
                    fluency: skill.level,
                  }))}
                />
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
