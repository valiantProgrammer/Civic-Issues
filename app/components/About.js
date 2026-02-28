export default function About() {
  return (
    <section id="about" className="py-[10vh] md:py-[15vh] bg-black text-white">
      <div className="max-w-[90vw] mx-auto px-[5vw]">
        <h3 className="text-[6vw] md:text-[2vw] font-bold mb-[3vh]">About Our Site</h3>
        <p className="text-[4vw] md:text-[1.2vw] leading-relaxed">
          Every day, people in our city walk past potholes, flickering streetlights, or overflowing bins — small problems that add up to big frustrations. Most of the time, we notice them, shake our heads, and move on, wondering if anyone will ever fix them.
          <br /><br />
          That’s where our platform comes in. We believe that change begins with a single tap on your phone. See an issue? Snap a photo, share a few words, and we’ll make sure it reaches the right hands at the right time.
          <br /><br />
          For citizens, it means your voice is finally heard. For administrators, it means a clear, real-time view of what needs attention and where. Together, it means a cleaner, safer, and smarter city— because when the community and the government work hand-in-hand, fixing our city becomes everyone’s win.
        </p>
      </div>
    </section>
  );
}