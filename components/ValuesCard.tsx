export default function ValuesCard() {
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white rounded-lg shadow-md p-4 border border-gray-100">
        <h2 className="text-base font-bold text-sky-400 mb-4 tracking-wide">VALUES</h2>
        <div className="space-y-3">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-sm font-bold text-sky-400">Lagom</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-sm font-bold text-sky-400">Förtroende</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-sm font-bold text-sky-400">Lifelong learning</div>
          </div>
        </div>
      </div>
    </div>
  )
} 