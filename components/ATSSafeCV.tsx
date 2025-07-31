interface ATSSafeCVProps {
  language: string
  translations: any
}

export default function ATSSafeCV({ language, translations }: ATSSafeCVProps) {
  const t = translations[language]

  return (
    <>
      {/* Page 1 */}
      <div className="w-[210mm] h-[297mm] mx-auto bg-white p-8 text-black font-sans">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">{t.name}</h1>
          <p className="text-lg mb-2">{t.title}</p>
          <div className="text-sm space-y-1">
            <p>Stenungsund, Sweden</p>
            <p>+46 76 247 5916</p>
            <p>vlad.chyzhov78@gmail.com</p>
          </div>
        </div>

        {/* Professional Summary */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3">PROFESSIONAL SUMMARY</h2>
          <p className="text-sm leading-relaxed">
            {t.statementText}
          </p>
        </div>

        {/* Work Experience */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3">PROFESSIONAL EXPERIENCE</h2>
          {t.workItems.map((item: any, index: number) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold">{item.title}</h3>
                <span className="text-sm">{item.year}</span>
              </div>
              <p className="text-sm font-medium mb-2">{item.company}</p>
              <div className="text-sm leading-relaxed">
                {item.description.split('\n').map((line: string, lineIndex: number) => (
                  <p key={lineIndex} className="mb-1">{line.trim()}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Professional Skills */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3">CORE COMPETENCIES</h2>
          <div className="text-sm">
            {t.skills.map((skill: string, index: number) => (
              <span key={index}>
                {skill}{index < t.skills.length - 1 ? ', ' : ''}
              </span>
            ))}
          </div>
        </div>

        {/* Languages */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3">LANGUAGES</h2>
          <div className="text-sm">
            {t.languageSkills.map((skill: any, index: number) => (
              <span key={index}>
                {skill.name} - {skill.level}{index < t.languageSkills.length - 1 ? ', ' : ''}
              </span>
            ))}
          </div>
        </div>

        
      </div>

      {/* Page 2 */}
      <div className="w-[210mm] h-[297mm] mx-auto bg-white p-8 text-black font-sans print:break-before-page">
        {/* Education */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3">EDUCATION</h2>
          {t.educationItems.map((item: any, index: number) => (
            <div key={index} className="mb-3">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold">{item.title}</h3>
                <span className="text-sm">{item.year}</span>
              </div>
              <p className="text-sm">{item.company}</p>
              <p className="text-sm">{item.description}</p>
            </div>
          ))}
        </div>

        {/* Certifications */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3">CERTIFICATIONS</h2>
          <div className="text-sm">
            {t.certificationItems.map((item: string, index: number) => (
              <p key={index} className="mb-1">{item}</p>
            ))}
          </div>
        </div>

        {/* Personal Skills */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3">PERSONAL SKILLS</h2>
          <div className="text-sm">
            {t.personalSkillsItems.map((skill: string, index: number) => (
              <span key={index}>
                {skill}{index < t.personalSkillsItems.length - 1 ? ', ' : ''}
              </span>
            ))}
          </div>
        </div>

        {/* Hobbies & Interests */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3">HOBBIES & INTERESTS</h2>
          <div className="text-sm">
            <p>Sport, Family, Coding, AI, Reading</p>
          </div>
        </div>

                 {/* Key Achievements */}
         <div className="mb-6">
           <h2 className="text-lg font-bold mb-3">KEY ACHIEVEMENTS</h2>
           <ul className="text-sm list-disc pl-5 space-y-1">
             <li>50% Process Speed Increase via full ERP automation (2022)</li>
             <li>$150k MRR Turnover restored in 9 months post-COVID through e-commerce launch (2021)</li>
             <li>15% Average tax burden cut for 15 SMEs (2004-2020)</li>
           </ul>
         </div>

         {/* Values */}
         <div className="mb-6">
           <h2 className="text-lg font-bold mb-3">VALUES</h2>
           <div className="text-sm">
             <p>Lagom, Förtroende, Lifelong learning</p>
           </div>
         </div>
      </div>
    </>
  )
} 