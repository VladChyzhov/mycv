import type { MasterResumeData, OverlayResumeData, Resume } from "./types"

// Lightweight runtime validation using zod available in the project
import { z } from "zod"
import Ajv, { ErrorObject } from "ajv"
import addFormats from "ajv-formats"
import schema from "./schema/resume.schema.json"

const itemSchema = z.object({
  year: z.string(),
  title: z.string(),
  company: z.string(),
  description: z.string(),
})

const languageSkillSchema = z.object({
  name: z.string(),
  level: z.string(),
})

const resumeContentSchema = z.object({
  name: z.string(),
  title: z.string(),
  downloadPdf: z.string(),
  downloadDocx: z.string(),
  statement: z.string(),
  workExperience: z.string(),
  education: z.string(),
  proSkills: z.string(),
  personalSkills: z.string(),
  hobbies: z.string(),
  languages: z.string(),
  certifications: z.string(),
  statementText: z.string(),
  workItems: z.array(itemSchema),
  educationItems: z.array(itemSchema),
  skills: z.array(z.string()),
  personalSkillsItems: z.array(z.string()),
  languageSkills: z.array(languageSkillSchema),
  certificationItems: z.array(z.string()),
  keyAchievements: z.array(z.string()).optional(),
  values: z.array(z.string()).optional(),
})

export const masterResumeSchema = z.object({
  ru: resumeContentSchema,
  en: resumeContentSchema,
  sv: resumeContentSchema,
})

export function validateMaster(data: unknown): MasterResumeData {
  const parsed = masterResumeSchema.parse(data)
  return parsed
}

export const overlayResumeSchema = z.object({
  ru: resumeContentSchema.partial().optional(),
  en: resumeContentSchema.partial().optional(),
  sv: resumeContentSchema.partial().optional(),
})

export function validateOverlay(data: unknown): OverlayResumeData {
  const parsed = overlayResumeSchema.parse(data)
  return parsed
}

// New: Ajv-based validation for multi-language Resume model
const ajv = new Ajv({ allErrors: true, strict: false })
addFormats(ajv)
const validateFn = ajv.compile(schema as any)

export function validateResume(data: unknown): { ok: boolean; errors?: string[] } {
  const valid = validateFn(data)
  if (valid) return { ok: true }
  const errors = (validateFn.errors as ErrorObject[] | null | undefined)?.map((e) =>
    `${e.instancePath || "/"} ${e.message ?? "invalid"}`
  )
  return { ok: false, errors: errors && errors.length ? errors : ["Invalid resume payload"] }
}


