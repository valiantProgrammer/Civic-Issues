"use client";

import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.subject) newErrors.subject = "Subject is required";
    if (!formData.message) newErrors.message = "Message is required";
    else if (formData.message.length < 10)
      newErrors.message = "Message must be at least 10 characters";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setIsLoading(true);
      try {
        // Simulate form submission
        await new Promise((resolve) => setTimeout(resolve, 1500));
        toast.success("Thank you! Your message has been sent successfully.");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } catch (error) {
        toast.error("Failed to send message. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const contactMethods = [
    {
      icon: "📧",
      title: "Email",
      value: "support@civicsaathi.com",
      description: "Send us your queries and we'll respond within 24 hours",
    },
    {
      icon: "📱",
      title: "Phone",
      value: "+91 1800-CIVIC-HELP",
      description: "Call us during business hours (9 AM - 6 PM)",
    },
    {
      icon: "💬",
      title: "Live Chat",
      value: "Chat with our team",
      description: "Available 24/7 for urgent support queries",
    },
    {
      icon: "🏢",
      title: "Address",
      value: "Civic Headquarters",
      description: "123 Smart City Road, New Delhi, India - 110001",
    },
  ];

  return (
    <div className="font-sans bg-gray-50 text-gray-900 min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-pink-600 to-purple-800 text-white py-16 px-4 md:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6">Contact Us</h1>
            <p className="text-xl md:text-2xl mb-4">We&apos;d Love to Hear From You</p>
            <p className="text-lg">Have questions or feedback? Reach out to our team anytime.</p>
          </div>
        </section>

        {/* Contact Methods Grid */}
        <section className="max-w-6xl mx-auto px-4 md:px-8 py-16">
          <h2 className="text-4xl font-bold text-center mb-12 text-purple-600">Get in Touch</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactMethods.map((method, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition">
                <div className="text-5xl mb-4">{method.icon}</div>
                <h3 className="text-2xl font-bold mb-2 text-gray-800">{method.title}</h3>
                <p className="font-semibold text-purple-600 mb-2">{method.value}</p>
                <p className="text-gray-700 text-sm">{method.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="max-w-6xl mx-auto px-4 md:px-8 pb-16">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-3xl font-bold mb-6 text-gray-800">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block font-semibold text-gray-700 mb-2">
                    Your Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className={`w-full p-3 border rounded-lg outline-none focus:ring-2 ${
                      errors.name
                        ? "border-red-500 focus:ring-red-300"
                        : "border-gray-300 focus:ring-purple-500"
                    }`}
                    disabled={isLoading}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className={`w-full p-3 border rounded-lg outline-none focus:ring-2 ${
                      errors.email
                        ? "border-red-500 focus:ring-red-300"
                        : "border-gray-300 focus:ring-purple-500"
                    }`}
                    disabled={isLoading}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="subject" className="block font-semibold text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    id="subject"
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="How can we help?"
                    className={`w-full p-3 border rounded-lg outline-none focus:ring-2 ${
                      errors.subject
                        ? "border-red-500 focus:ring-red-300"
                        : "border-gray-300 focus:ring-purple-500"
                    }`}
                    disabled={isLoading}
                  />
                  {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
                </div>

                <div>
                  <label htmlFor="message" className="block font-semibold text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your message here..."
                    rows="5"
                    className={`w-full p-3 border rounded-lg outline-none focus:ring-2 resize-none ${
                      errors.message
                        ? "border-red-500 focus:ring-red-300"
                        : "border-gray-300 focus:ring-purple-500"
                    }`}
                    disabled={isLoading}
                  />
                  {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition disabled:bg-gray-400 flex justify-center items-center"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </button>
              </form>
            </div>

            {/* Info Section */}
            <div className="space-y-8">
              <div className="bg-purple-50 rounded-xl p-8">
                <h3 className="text-2xl font-bold mb-4 text-purple-600">📍 Office Hours</h3>
                <p className="text-gray-700 mb-2"><strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM</p>
                <p className="text-gray-700 mb-2"><strong>Saturday:</strong> 10:00 AM - 4:00 PM</p>
                <p className="text-gray-700"><strong>Sunday & Holidays:</strong> Closed</p>
              </div>

              <div className="bg-blue-50 rounded-xl p-8">
                <h3 className="text-2xl font-bold mb-4 text-blue-600">❓ Quick Support</h3>
                <p className="text-gray-700 mb-4">
                  For immediate assistance with your reported issues, log into your account and use the in-app chat feature or check the FAQ section.
                </p>
              </div>

              <div className="bg-green-50 rounded-xl p-8">
                <h3 className="text-2xl font-bold mb-4 text-green-600">🚀 Stay Updated</h3>
                <p className="text-gray-700 mb-4">
                  Subscribe to our newsletter for updates on features, improvements, and community alerts.
                </p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700">Subscribe</button>
                </div>
              </div>

              <div className="bg-yellow-50 rounded-xl p-8">
                <h3 className="text-2xl font-bold mb-4 text-yellow-600">💼 Business Inquiries</h3>
                <p className="text-gray-700">
                  For partnerships, media inquiries, or business opportunities, please email us at <strong>business@civicsaathi.com</strong>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Social Media Section */}
        <section className="bg-purple-50 py-16 px-4 md:px-8">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-8 text-purple-600">Follow Us</h2>
            <p className="text-lg text-gray-700 mb-8">Join our community and stay connected on social media</p>
            <div className="flex justify-center gap-6 flex-wrap">
              <a href="#" className="text-4xl hover:scale-110 transition">📘 Facebook</a>
              <a href="#" className="text-4xl hover:scale-110 transition">𝕏 Twitter</a>
              <a href="#" className="text-4xl hover:scale-110 transition">📷 Instagram</a>
              <a href="#" className="text-4xl hover:scale-110 transition">▶️ YouTube</a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
