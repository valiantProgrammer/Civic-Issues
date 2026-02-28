import Link from 'next/link';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 lg:right-64 z-40 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-start items-center h-16">
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">CI</span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">Civic साथी</h1>
          </Link>
        </div>
      </div>
    </header>
  );
}