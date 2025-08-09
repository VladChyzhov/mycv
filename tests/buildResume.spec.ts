import { test, expect } from "vitest"
import masterRaw from "../domain/resume/data/master.json"
import accounting from "../domain/resume/data/overlays/accounting.sv-en.json"
import administrative from "../domain/resume/data/overlays/administrative.sv-en.json"
import { buildResume } from "../domain/resume/build"
import { validateResume } from "../domain/resume/validate"
import type { Resume, MultiLangString } from "../domain/resume/types"

type Lang = "sv" | "en" | "ru"

function ml(picker: (lang: Lang) => string): MultiLangString {
  return {
    sv: picker("sv") ?? "",
    en: picker("en") ?? "",
    ru: picker("ru") ?? "",
  }
}

function toResumeFromMaster(raw: any): Resume {
  const sv = raw.sv || {}
  const en = raw.en || {}
  const ru = raw.ru || {}

  const getLangObj = (lang: Lang) => (lang === "sv" ? sv : lang === "en" ? en : ru)

  const maxLen = (a?: any[], b?: any[], c?: any[]) => Math.max(a?.length || 0, b?.length || 0, c?.length || 0)
  const workLen = maxLen(sv.workItems, en.workItems, ru.workItems)
  const eduLen = maxLen(sv.educationItems, en.educationItems, ru.educationItems)
  const skillLen = maxLen(sv.skills, en.skills, ru.skills)
  const pskillLen = maxLen(sv.personalSkillsItems, en.personalSkillsItems, ru.personalSkillsItems)
  const certLen = maxLen(sv.certificationItems, en.certificationItems, ru.certificationItems)
  const langSkillLen = maxLen(sv.languageSkills, en.languageSkills, ru.languageSkills)
  const achLen = maxLen(sv.keyAchievements, en.keyAchievements, ru.keyAchievements)
  const valuesLen = maxLen(sv.values, en.values, ru.values)

  const resume: Resume = {
    basics: {
      name: ml((l) => getLangObj(l).name),
      title: ml((l) => getLangObj(l).title),
      location: ml(() => "Stenungsund, Sweden"),
      website: "vladchyzhov.com",
      phone: "+46 76 247 5916",
      email: "vlad.chyzhov78@gmail.com",
      labels: {
        downloadPdf: ml((l) => getLangObj(l).downloadPdf),
        downloadDocx: ml((l) => getLangObj(l).downloadDocx),
        statement: ml((l) => getLangObj(l).statement),
        workExperience: ml((l) => getLangObj(l).workExperience),
        education: ml((l) => getLangObj(l).education),
        proSkills: ml((l) => getLangObj(l).proSkills),
        personalSkills: ml((l) => getLangObj(l).personalSkills),
        hobbies: ml((l) => getLangObj(l).hobbies),
        languages: ml((l) => getLangObj(l).languages),
        certifications: ml((l) => getLangObj(l).certifications),
      },
    },
    statementText: ml((l) => getLangObj(l).statementText),
    workItems: Array.from({ length: workLen }).map((_, i) => ({
      year: sv.workItems?.[i]?.year || en.workItems?.[i]?.year || ru.workItems?.[i]?.year || "",
      title: ml((l) => getLangObj(l).workItems?.[i]?.title || ""),
      company: ml((l) => getLangObj(l).workItems?.[i]?.company || ""),
      description: ml((l) => getLangObj(l).workItems?.[i]?.description || ""),
    })),
    educationItems: Array.from({ length: eduLen }).map((_, i) => ({
      year: sv.educationItems?.[i]?.year || en.educationItems?.[i]?.year || ru.educationItems?.[i]?.year || "",
      title: ml((l) => getLangObj(l).educationItems?.[i]?.title || ""),
      company: ml((l) => getLangObj(l).educationItems?.[i]?.company || ""),
      description: ml((l) => getLangObj(l).educationItems?.[i]?.description || ""),
    })),
    skills: Array.from({ length: skillLen }).map((_, i) => ml((l) => getLangObj(l).skills?.[i] || "")),
    personalSkillsItems: Array.from({ length: pskillLen }).map((_, i) => ml((l) => getLangObj(l).personalSkillsItems?.[i] || "")),
    languageSkills: Array.from({ length: langSkillLen }).map((_, i) => ({
      name: ml((l) => getLangObj(l).languageSkills?.[i]?.name || ""),
      level: sv.languageSkills?.[i]?.level || en.languageSkills?.[i]?.level || ru.languageSkills?.[i]?.level || "",
    })),
    certificationItems: Array.from({ length: certLen }).map((_, i) => ml((l) => getLangObj(l).certificationItems?.[i] || "")),
    keyAchievements: Array.from({ length: achLen }).map((_, i) => ml((l) => getLangObj(l).keyAchievements?.[i] || "")),
    values: Array.from({ length: valuesLen }).map((_, i) => ml((l) => getLangObj(l).values?.[i] || "")),
    meta: { order: ["basics", "workItems", "educationItems", "skills"] },
  }
  return resume
}

test("build accounting (sv) passes validation and matches snapshot", () => {
  const resume = toResumeFromMaster(masterRaw)
  const out = buildResume(resume, accounting, "sv")
  const valid = validateResume(out)
  expect(valid.ok, JSON.stringify(valid.errors)).toBe(true)
  expect(out).toMatchSnapshot()
})

test("build administrative (sv) passes validation and matches snapshot", () => {
  const resume = toResumeFromMaster(masterRaw)
  const out = buildResume(resume, administrative, "sv")
  const valid = validateResume(out)
  expect(valid.ok, JSON.stringify(valid.errors)).toBe(true)
  expect(out).toMatchSnapshot()
})


