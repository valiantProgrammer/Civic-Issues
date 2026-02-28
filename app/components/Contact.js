export default function Contact() {
  return (
    <section id="contact" className="py-[10vh] md:py-[15vh] bg-gray-100">
      <div className="max-w-[90vw] mx-auto px-[5vw]">
        <h3 className="text-[6vw] md:text-[2vw] font-bold mb-[5vh] text-center">Need Help?</h3>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-[2vh]">
          <input
            type="text"
            placeholder="Name"
            className="p-[2vh] border rounded-lg text-[4vw] md:text-[1vw]"
          />
          <input
            type="email"
            placeholder="Email"
            className="p-[2vh] border rounded-lg text-[4vw] md:text-[1vw]"
          />
          <textarea
            placeholder="Message"
            rows="4"
            className="p-[2vh] border rounded-lg md:col-span-2 text-[4vw] md:text-[1vw]"
          ></textarea>
          <button className="md:col-span-2 px-[3vw] py-[2vh] bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition text-[4.5vw] md:text-[1.5vw]">
            Send
          </button>
        </form>
      </div>
    </section>
  );
}