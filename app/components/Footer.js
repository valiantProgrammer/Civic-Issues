export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 text-center py-6 px-4">
      <div className="max-w-7xl mx-auto text-gray-700">
        {/* Contact Information */}
        <p className="text-sm md:text-base mb-2">
          Contact Us:
          <a
            href="mailto:civic.saathi.2025@gmail.com"
            className="ml-2 font-semibold text-purple-600 hover:underline"
          >
            civic.saathi.2025@gmail.com
          </a>
        </p>

        {/* Copyright Notice */}
        <p className="text-xs md:text-sm text-gray-500">
          &copy; 2025 Civic Saathi. All rights reserved.
        </p>
      </div>
    </footer>
  );
}