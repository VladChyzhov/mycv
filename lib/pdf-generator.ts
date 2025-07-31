// Dynamic imports will be used instead of static imports

interface PDFGeneratorOptions {
  language: string
  onProgress?: (message: string) => void
}

export const generatePDF = async ({ language, onProgress }: PDFGeneratorOptions) => {
  // Import html2canvas and jsPDF dynamically
  const html2canvas = (await import("html2canvas")).default
  const jsPDF = (await import("jspdf")).default

  // A4 dimensions in pixels at 300 DPI for high quality
  const A4_WIDTH_PX = 2480
  const A4_HEIGHT_PX = 3508

  // A4 dimensions in mm for jsPDF
  const A4_WIDTH_MM = 210
  const A4_HEIGHT_MM = 297

  // Enhanced canvas options for better quality
  const canvasOptions = {
    scale: 3,
    useCORS: true,
    allowTaint: true,
    backgroundColor: "#ffffff",
    width: A4_WIDTH_PX / 3,
    height: A4_HEIGHT_PX / 3,
    scrollX: 0,
    scrollY: 0,
    windowWidth: A4_WIDTH_PX / 3,
    windowHeight: A4_HEIGHT_PX / 3,
    removeContainer: true,
    imageTimeout: 15000,
    logging: false,
  }

  try {
    // Hide control elements during PDF generation
    const controlElements = document.querySelectorAll(".print\\:hidden")
    controlElements.forEach((el) => {
      ;(el as HTMLElement).style.display = "none"
    })

    // Show loading state
    const loadingToast = document.createElement("div")
    loadingToast.className =
      "fixed top-4 left-1/2 transform -translate-x-1/2 bg-sky-500 text-white px-6 py-3 rounded-lg z-50 text-sm font-medium"
    loadingToast.textContent =
      language === "sv" ? "Genererar PDF..." : language === "en" ? "Generating PDF..." : "Создание PDF..."
    document.body.appendChild(loadingToast)

    // Get page elements
    const page1 = document.querySelector('[data-page="1"]') as HTMLElement
    const page2 = document.querySelector('[data-page="2"]') as HTMLElement

    if (!page1 || !page2) {
      throw new Error("Page elements not found")
    }

    // Create PDF with high quality settings
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
      precision: 16,
    })

    // Capture page 1 with retry mechanism
    let canvas1: HTMLCanvasElement | undefined
    let attempts = 0
    const maxAttempts = 3

    while (attempts < maxAttempts) {
      try {
        canvas1 = await html2canvas(page1, canvasOptions)
        break
      } catch (error) {
        attempts++
        if (attempts === maxAttempts) throw error
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }

    // Add page 1 to PDF with proper scaling
    if (canvas1) {
      const imgData1 = canvas1.toDataURL("image/jpeg", 0.95)
      pdf.addImage(imgData1, "JPEG", 0, 0, A4_WIDTH_MM, A4_HEIGHT_MM, undefined, "FAST")
    }

    // Update loading message
    loadingToast.textContent =
      language === "sv"
        ? "Bearbetar sida 2..."
        : language === "en"
          ? "Processing page 2..."
          : "Обработка страницы 2..."

    // Add new page
    pdf.addPage()

    // Capture page 2 with retry mechanism
    let canvas2: HTMLCanvasElement | undefined
    attempts = 0

    while (attempts < maxAttempts) {
      try {
        canvas2 = await html2canvas(page2, canvasOptions)
        break
      } catch (error) {
        attempts++
        if (attempts === maxAttempts) throw error
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }

    // Add page 2 to PDF with proper scaling
    if (canvas2) {
      const imgData2 = canvas2.toDataURL("image/jpeg", 0.95)
      pdf.addImage(imgData2, "JPEG", 0, 0, A4_WIDTH_MM, A4_HEIGHT_MM, undefined, "FAST")
    }

    // Update loading message
    loadingToast.textContent =
      language === "sv" ? "Slutför PDF..." : language === "en" ? "Finalizing PDF..." : "Завершение PDF..."

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().slice(0, 10)
    const filename = `CV_Vladyslav_Chyzhov_${language.toUpperCase()}_${timestamp}.pdf`

    // Add metadata to PDF
    pdf.setProperties({
      title: `CV - Vladyslav Chyzhov (${language.toUpperCase()})`,
      subject: "Professional Resume",
      author: "Vladyslav Chyzhov",
      creator: "CV Generator",
    })

    // Download PDF
    pdf.save(filename)

    // Success message
    loadingToast.textContent =
      language === "sv" ? "PDF nedladdad!" : language === "en" ? "PDF downloaded!" : "PDF скачан!"
    loadingToast.className = loadingToast.className.replace("bg-sky-500", "bg-green-500")

    // Remove loading toast after delay
    setTimeout(() => {
      if (document.body.contains(loadingToast)) {
        document.body.removeChild(loadingToast)
      }
    }, 2000)

    // Restore control elements
    controlElements.forEach((el) => {
      ;(el as HTMLElement).style.display = ""
    })

    return { success: true, filename }
  } catch (error) {
    console.error("Error generating PDF:", error)

    // Error message
    const errorToast = document.createElement("div")
    errorToast.className =
      "fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg z-50 text-sm font-medium"
    errorToast.textContent =
      language === "sv"
        ? "Fel vid PDF-generering"
        : language === "en"
          ? "PDF generation error"
          : "Ошибка создания PDF"
    document.body.appendChild(errorToast)

    setTimeout(() => {
      if (document.body.contains(errorToast)) {
        document.body.removeChild(errorToast)
      }
    }, 3000)

    // Restore control elements in case of error
    const controlElements = document.querySelectorAll(".print\\:hidden")
    controlElements.forEach((el) => {
      ;(el as HTMLElement).style.display = ""
    })

    return { success: false, error: error as Error }
  }
}

interface ATSPDFGeneratorOptions {
  language: string
  translations: any
  onProgress?: (message: string) => void
}

export const generateATSPDF = async ({ language, translations, onProgress }: ATSPDFGeneratorOptions) => {
  // Import html2canvas and jsPDF dynamically
  const html2canvas = (await import("html2canvas")).default
  const jsPDF = (await import("jspdf")).default

  // A4 dimensions in pixels at 300 DPI for high quality
  const A4_WIDTH_PX = 2480
  const A4_HEIGHT_PX = 3508

  // A4 dimensions in mm for jsPDF
  const A4_WIDTH_MM = 210
  const A4_HEIGHT_MM = 297

  // Enhanced canvas options for better quality
  const canvasOptions = {
    scale: 3,
    useCORS: true,
    allowTaint: true,
    backgroundColor: "#ffffff",
    width: A4_WIDTH_PX / 3,
    height: A4_HEIGHT_PX / 3,
    scrollX: 0,
    scrollY: 0,
    windowWidth: A4_WIDTH_PX / 3,
    windowHeight: A4_HEIGHT_PX / 3,
    removeContainer: true,
    imageTimeout: 15000,
    logging: false,
  }

  try {
    // Show loading state
    const loadingToast = document.createElement("div")
    loadingToast.className =
      "fixed top-4 left-1/2 transform -translate-x-1/2 bg-sky-500 text-white px-6 py-3 rounded-lg z-50 text-sm font-medium"
    loadingToast.textContent =
      language === "sv" ? "Genererar ATS PDF..." : language === "en" ? "Generating ATS PDF..." : "Создание ATS PDF..."
    document.body.appendChild(loadingToast)

    // Create temporary container for ATS CV
    const tempContainer = document.createElement("div")
    tempContainer.style.position = "absolute"
    tempContainer.style.left = "-9999px"
    tempContainer.style.top = "0"
    tempContainer.style.width = "210mm"
    tempContainer.style.height = "297mm"
    tempContainer.style.backgroundColor = "white"
    tempContainer.style.padding = "32px"
    tempContainer.style.fontFamily = "sans-serif"
    tempContainer.style.color = "black"
    tempContainer.style.fontSize = "14px"
    tempContainer.style.lineHeight = "1.4"
    document.body.appendChild(tempContainer)

    const t = translations[language]

    // Generate ATS CV content
    tempContainer.innerHTML = `
      <div style="margin-bottom: 24px;">
        <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 8px;">${t.name}</h1>
        <p style="font-size: 18px; margin-bottom: 8px;">${t.title}</p>
        <div style="font-size: 14px;">
          <p>Stenungsund, Sweden</p>
          <p>+46 76 247 5916</p>
          <p>vlad.chyzhov78@gmail.com</p>
        </div>
      </div>

      <div style="margin-bottom: 24px;">
        <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 12px;">PROFESSIONAL SUMMARY</h2>
        <p style="font-size: 14px; line-height: 1.6;">${t.statementText}</p>
      </div>

      <div style="margin-bottom: 24px;">
        <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 12px;">PROFESSIONAL EXPERIENCE</h2>
        ${t.workItems.map((item: any) => `
          <div style="margin-bottom: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
              <h3 style="font-weight: bold;">${item.title}</h3>
              <span style="font-size: 14px;">${item.year}</span>
            </div>
            <p style="font-size: 14px; font-weight: 500; margin-bottom: 8px;">${item.company}</p>
            <div style="font-size: 14px; line-height: 1.6;">
              ${item.description.split('\n').map((line: string) => `<p style="margin-bottom: 4px;">${line.trim()}</p>`).join('')}
            </div>
          </div>
        `).join('')}
      </div>

      <div style="margin-bottom: 24px;">
        <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 12px;">CORE COMPETENCIES</h2>
        <div style="font-size: 14px;">
          ${t.skills.map((skill: string) => skill).join(', ')}
        </div>
      </div>

      <div style="margin-bottom: 24px;">
        <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 12px;">LANGUAGES</h2>
        <div style="font-size: 14px;">
          ${t.languageSkills.map((skill: any) => `${skill.name} - ${skill.level}`).join(', ')}
        </div>
      </div>
    `

    // Create PDF
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
      precision: 16,
    })

    // Capture first page
    const canvas1 = await html2canvas(tempContainer, canvasOptions)
    const imgData1 = canvas1.toDataURL("image/jpeg", 0.95)
    pdf.addImage(imgData1, "JPEG", 0, 0, A4_WIDTH_MM, A4_HEIGHT_MM, undefined, "FAST")

    // Update loading message
    loadingToast.textContent =
      language === "sv"
        ? "Bearbetar sida 2..."
        : language === "en"
          ? "Processing page 2..."
          : "Обработка страницы 2..."

    // Generate second page content
    tempContainer.innerHTML = `
      <div style="margin-bottom: 24px;">
        <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 12px;">EDUCATION</h2>
        ${t.educationItems.map((item: any) => `
          <div style="margin-bottom: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px;">
              <h3 style="font-weight: bold;">${item.title}</h3>
              <span style="font-size: 14px;">${item.year}</span>
            </div>
            <p style="font-size: 14px;">${item.company}</p>
            <p style="font-size: 14px;">${item.description}</p>
          </div>
        `).join('')}
      </div>

      <div style="margin-bottom: 24px;">
        <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 12px;">CERTIFICATIONS</h2>
        <div style="font-size: 14px;">
          ${t.certificationItems.map((item: string) => `<p style="margin-bottom: 4px;">${item}</p>`).join('')}
        </div>
      </div>

      <div style="margin-bottom: 24px;">
        <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 12px;">PERSONAL SKILLS</h2>
        <div style="font-size: 14px;">
          ${t.personalSkillsItems.map((skill: string) => skill).join(', ')}
        </div>
      </div>

      <div style="margin-bottom: 24px;">
        <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 12px;">HOBBIES & INTERESTS</h2>
        <div style="font-size: 14px;">
          <p>Sport, Family, Coding, AI, Reading</p>
        </div>
      </div>

      <div style="margin-bottom: 24px;">
        <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 12px;">KEY ACHIEVEMENTS</h2>
        <ul style="font-size: 14px; padding-left: 20px; margin: 0;">
          <li style="margin-bottom: 4px;">50% Process Speed Increase via full ERP automation (2022)</li>
          <li style="margin-bottom: 4px;">$150k MRR Turnover restored in 9 months post-COVID through e-commerce launch (2021)</li>
          <li style="margin-bottom: 4px;">15% Average tax burden cut for 15 SMEs (2004-2020)</li>
        </ul>
      </div>

      <div style="margin-bottom: 24px;">
        <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 12px;">VALUES</h2>
        <div style="font-size: 14px;">
          <p>Lagom, Förtroende, Lifelong learning</p>
        </div>
      </div>
    `

    // Add new page
    pdf.addPage()

    // Capture second page
    const canvas2 = await html2canvas(tempContainer, canvasOptions)
    const imgData2 = canvas2.toDataURL("image/jpeg", 0.95)
    pdf.addImage(imgData2, "JPEG", 0, 0, A4_WIDTH_MM, A4_HEIGHT_MM, undefined, "FAST")

    // Update loading message
    loadingToast.textContent =
      language === "sv" ? "Slutför PDF..." : language === "en" ? "Finalizing PDF..." : "Завершение PDF..."

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().slice(0, 10)
    const filename = `ATS_CV_Vladyslav_Chyzhov_${language.toUpperCase()}_${timestamp}.pdf`

    // Add metadata to PDF
    pdf.setProperties({
      title: `ATS CV - Vladyslav Chyzhov (${language.toUpperCase()})`,
      subject: "Professional Resume - ATS Optimized",
      author: "Vladyslav Chyzhov",
      creator: "CV Generator",
    })

    // Download PDF
    pdf.save(filename)

    // Success message
    loadingToast.textContent =
      language === "sv" ? "ATS PDF nedladdad!" : language === "en" ? "ATS PDF downloaded!" : "ATS PDF скачан!"
    loadingToast.className = loadingToast.className.replace("bg-sky-500", "bg-green-500")

    // Remove loading toast after delay
    setTimeout(() => {
      if (document.body.contains(loadingToast)) {
        document.body.removeChild(loadingToast)
      }
    }, 2000)

    // Clean up temporary container
    document.body.removeChild(tempContainer)

    return { success: true, filename }
  } catch (error) {
    console.error("Error generating ATS PDF:", error)

    // Error message
    const errorToast = document.createElement("div")
    errorToast.className =
      "fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg z-50 text-sm font-medium"
    errorToast.textContent =
      language === "sv"
        ? "Fel vid ATS PDF-generering"
        : language === "en"
          ? "ATS PDF generation error"
          : "Ошибка создания ATS PDF"
    document.body.appendChild(errorToast)

    setTimeout(() => {
      if (document.body.contains(errorToast)) {
        document.body.removeChild(errorToast)
      }
    }, 3000)

    // Clean up temporary container in case of error
    const tempContainer = document.querySelector('[style*="position: absolute"][style*="left: -9999px"]')
    if (tempContainer) {
      document.body.removeChild(tempContainer)
    }

    return { success: false, error: error as Error }
  }
} 