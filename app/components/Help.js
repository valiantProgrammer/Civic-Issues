export default function Help() {
  return (
    
      <main className="lg:max-w-[calc(100vw - 7rem)] px-3 sm:px-4 lg:px-8 py-8 sm:py-12 pb-20">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8">
          <div className="space-y-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">How to Report an Issue</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Click the floating + button to add a new report</li>
              <li>Take a photo of the issue</li>
              <li>Provide a description and location</li>
              <li>Submit your report</li>
            </ul>
          </div>
        </div>
      </main>
  );
}