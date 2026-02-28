import Navbar from '../user/components/components/Navbar.js'
import Footer from '../user/components/components/Footer.js'
import Link from 'next/link'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-3 lg:ml-64 sm:px-4 lg:px-8 py-8 sm:py-12 pb-20">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Contact Manager</h1>
          <p className="text-gray-600 mb-4 sm:mb-6">
            This is a placeholder contact page. Here you would provide contact information for city officials or department managers.
          </p>
          <div className="space-y-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Contact Information</h2>
            <div className="space-y-2 text-gray-600">
              <p><strong>City Hall:</strong> (+91) 123-4567</p>
              <p><strong>Public Works:</strong> (+91) 123-4568</p>
              <p><strong>Emergency:</strong> 112</p>
              <p><strong>Email:</strong> civic.saathi.2025@gmail.com</p>
            </div>
            <div className="pt-4">
              <Link
                href="/"
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}