import { test, expect } from "vitest"
import { validateResume } from "../domain/resume/validate"

test("invalid resume fails with readable errors", () => {
  const invalid: any = {
    basics: {
      // missing required labels and fields
      name: { sv: "", en: "", ru: "" },
      title: { sv: "", en: "", ru: "" },
      location: { sv: "", en: "", ru: "" },
      website: 123, // wrong type
      phone: "+1",
      email: "not-an-email",
    },
    // missing most required arrays
  }

  const res = validateResume(invalid)
  expect(res.ok).toBe(false)
  expect(res.errors && res.errors.join("\n")).toContain("/basics/website must be string")
  expect(res.errors && res.errors.join("\n")).toContain("/ must have required property 'workItems'")
})


