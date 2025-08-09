interface LanguagesCardProps {
  items: { language: string; fluency?: string }[]
}

export default function LanguagesCard({ items }: LanguagesCardProps) {
  if (!items || items.length === 0) return null
  return (
    <div className="space-y-3">
      {items.map((item, idx) => (
        <div key={`${item.language}-${idx}`} className="flex justify-between items-center">
          <span className="text-xs text-gray-700">{item.language}</span>
          {item.fluency && (
            <div className="text-xs font-medium text-sky-400 bg-sky-50 px-2 py-1 rounded">{item.fluency}</div>
          )}
        </div>
      ))}
    </div>
  )
}