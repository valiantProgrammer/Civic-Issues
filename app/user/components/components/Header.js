import Link from 'next/link';
import Image from 'next/image';
export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 lg:right-64 z-40 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-start items-center h-16">
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3">
            <Image
                            src="/images/logo.png"
                            alt="Civic Saathi Logo"
                            width={100}
                            height={100}
                            className="w-[12vw] h-[12vw] md:w-[3.5vw] md:h-[3.5vw]"
                        />
                        <h1 className="text-xl font-bold text-slate-800 tracking-tight">Civic साथी</h1>
          </Link>
        </div>
      </div>
    </header>
  );
}