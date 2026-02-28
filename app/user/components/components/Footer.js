import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-3 fixed w-full z-50 bottom-0">
      <div className=" mx-auto px-3 sm:px-4 lg:px-8">
        <div className="text-center">
          <Link
            href="/help"
            className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
          >
            Need help?
          </Link>
        </div>
      </div>
    </footer>
  )
}