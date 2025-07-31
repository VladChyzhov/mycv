import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx"

interface MarkdownToDocxOptions {
  inputPath: string
  outputPath: string
}

interface CVData {
  name: string
  title: string
  statementText: string
  workItems: Array<{
    year: string
    title: string
    company: string
    description: string
  }>
  educationItems: Array<{
    year: string
    title: string
    company: string
    description: string
  }>
  skills: string[]
  personalSkillsItems: string[]
  languageSkills: Array<{
    name: string
    level: string
  }>
  certificationItems: string[]
}

export const convertMarkdownToDocx = async ({ inputPath, outputPath }: MarkdownToDocxOptions) => {
  try {
    // Read the markdown file
    const response = await fetch(inputPath)
    const markdownContent = await response.text()

    // Parse markdown content
    const paragraphs = parseMarkdown(markdownContent)

    // Create document
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: paragraphs,
        },
      ],
    })

    // Generate and save the document
    const buffer = await Packer.toBuffer(doc)
    
    // Create download link
    const blob = new Blob([buffer], { 
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
    })
    
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = outputPath
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    return { success: true, message: "DOCX file generated successfully" }
  } catch (error) {
    console.error("Error converting markdown to DOCX:", error)
    return { success: false, error: error as Error }
  }
}

const parseMarkdown = (content: string) => {
  const lines = content.split("\n")
  const paragraphs: Paragraph[] = []

  for (const line of lines) {
    const trimmedLine = line.trim()
    
    if (!trimmedLine) {
      // Empty line - add spacing
      paragraphs.push(new Paragraph({}))
      continue
    }

    if (trimmedLine.startsWith("# ")) {
      // H1 heading
      paragraphs.push(
        new Paragraph({
          text: trimmedLine.substring(2),
          heading: HeadingLevel.HEADING_1,
        })
      )
    } else if (trimmedLine.startsWith("## ")) {
      // H2 heading
      paragraphs.push(
        new Paragraph({
          text: trimmedLine.substring(3),
          heading: HeadingLevel.HEADING_2,
        })
      )
    } else if (trimmedLine.startsWith("### ")) {
      // H3 heading
      paragraphs.push(
        new Paragraph({
          text: trimmedLine.substring(4),
          heading: HeadingLevel.HEADING_3,
        })
      )
    } else if (trimmedLine.startsWith("- ")) {
      // Bullet point
      paragraphs.push(
        new Paragraph({
          text: trimmedLine.substring(2),
          bullet: {
            level: 0,
          },
        })
      )
    } else if (trimmedLine.startsWith("  - ")) {
      // Nested bullet point
      paragraphs.push(
        new Paragraph({
          text: trimmedLine.substring(4),
          bullet: {
            level: 1,
          },
        })
      )
    } else {
      // Regular paragraph
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: trimmedLine,
              size: 24, // 12pt
            }),
          ],
        })
      )
    }
  }

  return paragraphs
}

// Function to convert CV data to DOCX
export const convertCVDataToDocx = async (cvData: CVData, language: string) => {
  try {
    const paragraphs: Paragraph[] = []

    // Header
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: cvData.name,
            size: 32,
            bold: true,
          }),
        ],
        spacing: { after: 200 },
      })
    )

    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: cvData.title,
            size: 24,
            color: "666666",
          }),
        ],
        spacing: { after: 400 },
      })
    )

    // Contact Info
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "Stenungsund, Sweden | +46 76 247 5916 | vlad.chyzhov78@gmail.com",
            size: 20,
          }),
        ],
        spacing: { after: 400 },
      })
    )

    // Professional Summary
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: language === "ru" ? "ПРОФЕССИОНАЛЬНОЕ РЕЗЮМЕ" : 
                  language === "sv" ? "PROFESSIONELLT CV" : "PROFESSIONAL SUMMARY",
            size: 28,
            bold: true,
          }),
        ],
        spacing: { after: 200 },
      })
    )

    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: cvData.statementText,
            size: 20,
          }),
        ],
        spacing: { after: 400 },
      })
    )

    // Work Experience
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: language === "ru" ? "ОПЫТ РАБОТЫ" : 
                  language === "sv" ? "ARBETSLIVSERFARENHET" : "WORK EXPERIENCE",
            size: 28,
            bold: true,
          }),
        ],
        spacing: { after: 200 },
      })
    )

    // Add work items
    cvData.workItems.forEach((item) => {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${item.year} - ${item.title}`,
              size: 24,
              bold: true,
            }),
          ],
          spacing: { after: 100 },
        })
      )

      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: item.company,
              size: 20,
              color: "666666",
            }),
          ],
          spacing: { after: 100 },
        })
      )

      // Split description by newlines and add as bullet points
      const descriptionLines = item.description.split('\n')
      descriptionLines.forEach((line) => {
        if (line.trim()) {
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: line.trim(),
                  size: 20,
                }),
              ],
              bullet: {
                level: 0,
              },
              spacing: { after: 100 },
            })
          )
        }
      })

      paragraphs.push(new Paragraph({ spacing: { after: 200 } }))
    })

    // Education
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: language === "ru" ? "ОБРАЗОВАНИЕ" : 
                  language === "sv" ? "UTBILDNING" : "EDUCATION",
            size: 28,
            bold: true,
          }),
        ],
        spacing: { after: 200 },
      })
    )

    // Add education items
    cvData.educationItems.forEach((item) => {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${item.year} - ${item.title}`,
              size: 24,
              bold: true,
            }),
          ],
          spacing: { after: 100 },
        })
      )

      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: item.company,
              size: 20,
              color: "666666",
            }),
          ],
          spacing: { after: 100 },
        })
      )

      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: item.description,
              size: 20,
            }),
          ],
          spacing: { after: 200 },
        })
      )
    })

    // Professional Skills
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: language === "ru" ? "ПРОФЕССИОНАЛЬНЫЕ НАВЫКИ" : 
                  language === "sv" ? "PROFESSIONELLA FÄRDIGHETER" : "PROFESSIONAL SKILLS",
            size: 28,
            bold: true,
          }),
        ],
        spacing: { after: 200 },
      })
    )

    cvData.skills.forEach((skill) => {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `• ${skill}`,
              size: 20,
            }),
          ],
          spacing: { after: 100 },
        })
      )
    })

    paragraphs.push(new Paragraph({ spacing: { after: 200 } }))

    // Languages
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: language === "ru" ? "ЯЗЫКИ" : 
                  language === "sv" ? "SPRÅK" : "LANGUAGES",
            size: 28,
            bold: true,
          }),
        ],
        spacing: { after: 200 },
      })
    )

    cvData.languageSkills.forEach((skill) => {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${skill.name} - ${skill.level}`,
              size: 20,
            }),
          ],
          spacing: { after: 100 },
        })
      )
    })

    paragraphs.push(new Paragraph({ spacing: { after: 200 } }))

    // Certifications
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: language === "ru" ? "СЕРТИФИКАТЫ" : 
                  language === "sv" ? "CERTIFIERINGAR" : "CERTIFICATIONS",
            size: 28,
            bold: true,
          }),
        ],
        spacing: { after: 200 },
      })
    )

    cvData.certificationItems.forEach((cert) => {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `• ${cert}`,
              size: 20,
            }),
          ],
          spacing: { after: 100 },
        })
      )
    })

    // Create document
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: paragraphs,
        },
      ],
    })

    // Generate and save the document
    const buffer = await Packer.toBuffer(doc)
    
    // Create download link
    const blob = new Blob([buffer], { 
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
    })
    
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `CV_Vladyslav_Chyzhov_${language.toUpperCase()}.docx`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    return { success: true, message: "DOCX file generated successfully" }
  } catch (error) {
    console.error("Error converting CV data to DOCX:", error)
    return { success: false, error: error as Error }
  }
}

// Function to convert CV markdown to DOCX
export const convertCVToDocx = async () => {
  return await convertMarkdownToDocx({
    inputPath: "/cv.md",
    outputPath: "CV_Vladyslav_Chyzhov.docx"
  })
} 