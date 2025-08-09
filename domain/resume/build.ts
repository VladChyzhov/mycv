import type { LanguageCode, Resume, MultiLangString, MasterResumeData, OverlayResumeData, PositionsMap, PositionViewData } from "./types"
import { validateMaster, validateOverlay } from "./validate"
import masterJson from "./data/master.json"
import accountingOverlay from "./data/overlays/accounting.sv-en.json"
import administrativeOverlay from "./data/overlays/administrative.sv-en.json"

// Build a localized Resume from master + overlay
export function buildResume(master: Resume, overlay: any, lang: "sv" | "en" | "ru"): Resume {
  // 1) Shallow clone base
  const result: Resume = JSON.parse(JSON.stringify(master))

  // 2) basics.labels[lang] overrides + basics.summary[lang]
  if (overlay?.basics?.labels) {
    for (const [key, value] of Object.entries(overlay.basics.labels)) {
      if (typeof value === "string") {
        ;(result.basics.labels as any)[key] = patchLang(result.basics.labels[key as keyof typeof result.basics.labels] as MultiLangString, lang, value)
      }
    }
  }
  if (overlay?.basics?.summary && typeof overlay.basics.summary[lang] === "string") {
    const summary = result.basics.summary ?? ({ sv: "", en: "", ru: "" } as MultiLangString)
    summary[lang] = overlay.basics.summary[lang]
    result.basics.summary = summary
  }

  // 3) Append overlay.keywords.* to skills as keywords (single mlString each)
  if (overlay?.keywords) {
    const keys = Object.keys(overlay.keywords)
    keys.forEach((k) => {
      const ml: MultiLangString = { sv: "", en: "", ru: "" }
      // Если overlay.keywords[k] — это мульти-язычная строка
      const v = overlay.keywords[k]
      if (v && typeof v === "object") {
        ml.sv = v.sv ?? ""
        ml.en = v.en ?? ""
        ml.ru = v.ru ?? ""
      } else if (typeof v === "string") {
        // Если дано только одно значение — кладём во все языки одинаково
        ml.sv = v
        ml.en = v
        ml.ru = v
      }
      result.skills.push(ml)
    })
  }

  // 4) Take 3–6 overlay bullet templates (lang) and append to first work entry
  if (overlay?.bullets && Array.isArray(overlay.bullets)) {
    const bullets = overlay.bullets
      .map((b: any) => (typeof b === "object" ? b[lang] : b))
      .filter((s: any) => typeof s === "string" && s.trim().length > 0)
      .slice(0, 6)
    const selected = bullets.slice(0, Math.max(3, Math.min(6, bullets.length)))
    if (selected.length && result.workItems?.length) {
      const first = result.workItems[0]
      const appended = (first.description[lang] ? first.description[lang] + "\n" : "") + selected.map((s: string) => `• ${s}`).join("\n")
      first.description[lang] = appended
    }
  }

  // 5) Keep section order from master.meta.order if provided
  if (master.meta?.order && Array.isArray(master.meta.order)) {
    // Порядок секций: поддерживаем известные ключи
    const order = master.meta.order
    const reordered: Partial<Resume> = { basics: result.basics }
    for (const key of order) {
      if (key in result) {
        ;(reordered as any)[key] = (result as any)[key]
      }
    }
    // Добавим всё, что не было перечислено, в конце
    for (const key of Object.keys(result)) {
      if (!(key in reordered)) {
        ;(reordered as any)[key] = (result as any)[key]
      }
    }
    return reordered as Resume
  }

  return result
}

function patchLang(target: MultiLangString, lang: LanguageCode, value: string): MultiLangString {
  const res = { ...target }
  res[lang] = value
  return res
}

// ----------------------------
// Back-compat API used by app/page.tsx
// ----------------------------

function deepMerge<T extends object>(base: T, overlay: Partial<T>): T {
  const result: any = Array.isArray(base) ? [...(base as any)] : { ...(base as any) }
  for (const [key, value] of Object.entries(overlay)) {
    if (value === undefined) continue
    const baseValue = (result as any)[key]
    if (Array.isArray(baseValue) && Array.isArray(value)) {
      ;(result as any)[key] = value
    } else if (
      baseValue && typeof baseValue === "object" &&
      value && typeof value === "object" && !Array.isArray(value)
    ) {
      ;(result as any)[key] = deepMerge(baseValue, value as any)
    } else {
      ;(result as any)[key] = value
    }
  }
  return result as T
}

export interface BuildResult {
  translations: MasterResumeData
  positions: PositionsMap
}

export function buildResumeDomain(): BuildResult {
  const master = validateMaster(masterJson as unknown as MasterResumeData)
  const overlays: Record<string, OverlayResumeData> = {
    accountant: validateOverlay(accountingOverlay as unknown as OverlayResumeData),
    administrative: validateOverlay(administrativeOverlay as unknown as OverlayResumeData),
  }

  const positions: PositionsMap = {}
  const positionKeys = ["base", ...Object.keys(overlays)] as const

  positionKeys.forEach((positionKey) => {
    if (positionKey === "base") {
      ;(positions as any)[positionKey] = mapMasterToPosition(master)
    } else {
      const overlay = overlays[positionKey]
      const merged: MasterResumeData = {
        ru: deepMerge(master.ru, overlay.ru ?? {}),
        en: deepMerge(master.en, overlay.en ?? {}),
        sv: deepMerge(master.sv, overlay.sv ?? {}),
      }
      ;(positions as any)[positionKey] = mapMasterToPosition(merged)
    }
  })

  return { translations: master, positions }
}

function mapMasterToPosition(data: MasterResumeData): Record<LanguageCode, PositionViewData> {
  const map: any = {}
  ;(["ru", "en", "sv"] as LanguageCode[]).forEach((lang) => {
    const c = data[lang]
    map[lang] = {
      title: c.title,
      statementText: c.statementText,
      workItems: c.workItems,
      educationItems: c.educationItems,
      skills: c.skills,
      personalSkillsItems: c.personalSkillsItems,
      languageSkills: c.languageSkills,
      certificationItems: c.certificationItems,
      keyAchievements: c.keyAchievements ?? [],
      values: c.values ?? [],
    } as PositionViewData
  })
  return map
}


