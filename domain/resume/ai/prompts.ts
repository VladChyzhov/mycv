export const SUPPORTED_LANGS = ["sv", "en", "ru"] as const

export const JSON_TRANSFORMER_PROMPT =
  "You are a JSON transformer. Output ONLY valid JSON matching the attached schema. Do not invent facts. Keep length <= 18 words per bullet. Start bullets with a verb. Languages: sv|en|ru."


