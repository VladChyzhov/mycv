import fs from "node:fs"
import path from "node:path"

import type { Resume, MultiLangString } from "../domain/resume/types"
import { buildResume } from "../domain/resume/build"

import masterData from "../domain/resume/data/master.json"
import accountingOverlay from "../domain/resume/data/overlays/accounting.sv-en.json"

type Lang = "sv" | "en" | "ru"
const langs: Lang[] = ["sv", "en", "ru"]

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

  const workLen = Math.max(
    sv.workItems?.length || 0,
    en.workItems?.length || 0,
    ru.workItems?.length || 0
  )
  const eduLen = Math.max(
    sv.educationItems?.length || 0,
    en.educationItems?.length || 0,
    ru.educationItems?.length || 0
  )
  const skillLen = Math.max(
    sv.skills?.length || 0,
    en.skills?.length || 0,
    ru.skills?.length || 0
  )
  const pskillLen = Math.max(
    sv.personalSkillsItems?.length || 0,
    en.personalSkillsItems?.length || 0,
    ru.personalSkillsItems?.length || 0
  )
  const certLen = Math.max(
    sv.certificationItems?.length || 0,
    en.certificationItems?.length || 0,
    ru.certificationItems?.length || 0
  )
  const langSkillLen = Math.max(
    sv.languageSkills?.length || 0,
    en.languageSkills?.length || 0,
    ru.languageSkills?.length || 0
  )
  const achLen = Math.max(
    sv.keyAchievements?.length || 0,
    en.keyAchievements?.length || 0,
    ru.keyAchievements?.length || 0
  )
  const valuesLen = Math.max(
    sv.values?.length || 0,
    en.values?.length || 0,
    ru.values?.length || 0
  )

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
    skills: Array.from({ length: skillLen }).map((_, i) => (
      ml((l) => getLangObj(l).skills?.[i] || "")
    )),
    personalSkillsItems: Array.from({ length: pskillLen }).map((_, i) => (
      ml((l) => getLangObj(l).personalSkillsItems?.[i] || "")
    )),
    languageSkills: Array.from({ length: langSkillLen }).map((_, i) => ({
      name: ml((l) => getLangObj(l).languageSkills?.[i]?.name || ""),
      level: sv.languageSkills?.[i]?.level || en.languageSkills?.[i]?.level || ru.languageSkills?.[i]?.level || "",
    })),
    certificationItems: Array.from({ length: certLen }).map((_, i) => (
      ml((l) => getLangObj(l).certificationItems?.[i] || "")
    )),
    keyAchievements: Array.from({ length: achLen }).map((_, i) => (
      ml((l) => getLangObj(l).keyAchievements?.[i] || "")
    )),
    values: Array.from({ length: valuesLen }).map((_, i) => (
      ml((l) => getLangObj(l).values?.[i] || "")
    )),
    meta: {
      order: [
        "basics",
        "workItems",
        "educationItems",
        "skills",
        "personalSkillsItems",
        "languageSkills",
        "certificationItems",
        "keyAchievements",
        "values",
      ],
    },
  }

  return resume
}

async function main() {
  const master = toResumeFromMaster(masterData)
  const overlay = accountingOverlay as any
  const outResume = buildResume(master, overlay, "sv")

  const outDir = path.resolve(process.cwd(), "out")
  fs.mkdirSync(outDir, { recursive: true })
  const outPath = path.join(outDir, "resume.sv.accounting.json")
  fs.writeFileSync(outPath, JSON.stringify(outResume, null, 2), "utf-8")
  console.log(`Wrote ${outPath}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})


