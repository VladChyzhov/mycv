import { test, expect } from "vitest"
import { buildResume } from "../build"
import type { Resume } from "../types"

const master: Resume = {
  basics: {
    name: { sv: "Namn", en: "Name", ru: "Имя" },
    title: { sv: "Titel", en: "Title", ru: "Заголовок" },
    location: { sv: "Stockholm", en: "Stockholm", ru: "Стокгольм" },
    website: "example.com",
    phone: "+1",
    email: "me@example.com",
    labels: {
      downloadPdf: { sv: "Ladda PDF", en: "Download PDF", ru: "Скачать PDF" },
      downloadDocx: { sv: "Ladda DOCX", en: "Download DOCX", ru: "Скачать DOCX" },
      statement: { sv: "CV", en: "Resume", ru: "Резюме" },
      workExperience: { sv: "Erfarenhet", en: "Experience", ru: "Опыт" },
      education: { sv: "Utbildning", en: "Education", ru: "Образование" },
      proSkills: { sv: "Färdigheter", en: "Skills", ru: "Навыки" },
      personalSkills: { sv: "Personliga", en: "Personal", ru: "Личные" },
      hobbies: { sv: "Hobby", en: "Hobbies", ru: "Хобби" },
      languages: { sv: "Språk", en: "Languages", ru: "Языки" },
      certifications: { sv: "Certifikat", en: "Certifications", ru: "Сертификаты" },
    },
  },
  statementText: { sv: "Sammanfattning", en: "Summary", ru: "Саммари" },
  workItems: [
    {
      year: "2024",
      title: { sv: "Titel 1", en: "Title 1", ru: "Заголовок 1" },
      company: { sv: "Bolag", en: "Company", ru: "Компания" },
      description: { sv: "", en: "", ru: "" },
    },
  ],
  educationItems: [],
  skills: [
    { sv: "Bas", en: "Base", ru: "База" },
  ],
  personalSkillsItems: [],
  languageSkills: [],
  certificationItems: [],
  keyAchievements: [],
  values: [],
  meta: {
    order: ["basics", "skills", "workItems", "educationItems"],
  },
}

const overlay = {
  basics: {
    labels: {
      languages: "Språk (ändrad)",
    },
    summary: {
      sv: "Ny sammanfattning",
    },
  },
  keywords: {
    k1: { sv: "nyckel 1", en: "key 1", ru: "ключ 1" },
    k2: "universal",
  },
  bullets: [
    { sv: "punkt A", en: "bullet A", ru: "пункт A" },
    { sv: "punkt B", en: "bullet B", ru: "пункт B" },
    { sv: "punkt C", en: "bullet C", ru: "пункт C" },
    { sv: "punkt D", en: "bullet D", ru: "пункт D" },
  ],
}

test("buildResume applies overlay overrides and bullets in sv", () => {
  const res = buildResume(master, overlay, "sv")
  expect(res.basics.labels.languages.sv).toBe("Språk (ändrad)")
  expect(res.basics.summary?.sv).toBe("Ny sammanfattning")
  // keywords appended
  const skillStrings = res.skills.map((s) => s.sv)
  expect(skillStrings).toEqual(expect.arrayContaining(["nyckel 1", "universal"]))
  // bullets appended to first work item
  expect(res.workItems[0].description.sv).toContain("• punkt A")
  expect(res.workItems[0].description.sv).toContain("• punkt B")
  expect(res.workItems[0].description.sv).toContain("• punkt C")
  // order preserved from meta.order
  const keys = Object.keys(res)
  const basicsIdx = keys.indexOf("basics")
  const skillsIdx = keys.indexOf("skills")
  const workIdx = keys.indexOf("workItems")
  const eduIdx = keys.indexOf("educationItems")
  expect(basicsIdx).toBeLessThan(skillsIdx)
  expect(skillsIdx).toBeLessThan(workIdx)
  expect(workIdx).toBeLessThan(eduIdx)
})


