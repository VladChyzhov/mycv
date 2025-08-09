// Domain types for Resume data

export type LanguageCode = "ru" | "en" | "sv"

export interface ResumeItem {
  year: string
  title: string
  company: string
  description: string
}

export interface LanguageSkillItem {
  name: string
  level: string
}

// Full content for a resume view per language
export interface ResumeContent {
  // UI labels (kept for compatibility with presentational components)
  name: string
  title: string
  downloadPdf: string
  downloadDocx: string
  statement: string
  workExperience: string
  education: string
  proSkills: string
  personalSkills: string
  hobbies: string
  languages: string
  certifications: string

  // Content
  statementText: string
  workItems: ResumeItem[]
  educationItems: ResumeItem[]
  skills: string[]
  personalSkillsItems: string[]
  languageSkills: LanguageSkillItem[]
  certificationItems: string[]

  // Extra blocks used on page 2
  keyAchievements?: string[]
  values?: string[]
}

export type MasterResumeData = Record<LanguageCode, ResumeContent>

// Overlay can partially override per-language content
export type OverlayResumeData = Partial<Record<LanguageCode, Partial<ResumeContent>>>

// Position data shape used by the UI when a specific position is selected
export interface PositionViewData {
  title: string
  statementText: string
  workItems: ResumeItem[]
  educationItems: ResumeItem[]
  skills: string[]
  personalSkillsItems: string[]
  languageSkills: LanguageSkillItem[]
  certificationItems: string[]
  keyAchievements: string[]
  values: string[]
}

export type PositionsMap = Record<
  string,
  Record<LanguageCode, PositionViewData>
>

// =====================
// New multi-language domain model (does not break existing exports)
// =====================

export type MultiLangString = Record<LanguageCode, string>

export type MultiLang<T> = Record<LanguageCode, T>

export interface Basics {
  name: MultiLangString
  title: MultiLangString
  location: MultiLangString
  website: string
  phone: string
  email: string
  // Optional multi-language summary to be shown in basics
  summary?: MultiLangString
  labels: {
    downloadPdf: MultiLangString
    downloadDocx: MultiLangString
    statement: MultiLangString
    workExperience: MultiLangString
    education: MultiLangString
    proSkills: MultiLangString
    personalSkills: MultiLangString
    hobbies: MultiLangString
    languages: MultiLangString
    certifications: MultiLangString
  }
}

export interface ResumeItemML {
  year: string
  title: MultiLangString
  company: MultiLangString
  description: MultiLangString
}

export interface LanguageSkillML {
  name: MultiLangString
  level: string
}

export interface Resume {
  basics: Basics
  statementText: MultiLangString
  workItems: ResumeItemML[]
  educationItems: ResumeItemML[]
  skills: MultiLangString[]
  personalSkillsItems: MultiLangString[]
  languageSkills: LanguageSkillML[]
  certificationItems: MultiLangString[]
  keyAchievements?: MultiLangString[]
  values?: MultiLangString[]
  meta?: {
    order?: string[]
  }
}


