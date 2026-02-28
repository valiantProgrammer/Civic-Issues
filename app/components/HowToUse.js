"use client";

import React, { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

// Images for the carousel
const HOW_TO_USE_STEPS = [
  { image: "/images/step1.jpg", description: "Step 1: Open the app and log in to your account." },
  { image: "/images/step2.jpg", description: "click on user" },
  { image: "/images/step3.jpg", description: "Step 2: Fill in the necessary details and sign up (to create account)" },
  { image: "/images/step4.jpg", description: "Step 3: Verify the email by OTP" },
  { image: "/images/step5.jpg", description: "Step 4: Now enter your email and password, then click on login button" },
  { image: "/images/step6.jpg", description: "Step 5: Click on the plus icon to report issues" },
  { image: "/images/step7.jpg", description: "Step 6: add media evidence first" },
  { image: "/images/step8.jpg", description: "select the category of the issue to be reported" },
  { image: "/images/step9.jpg", description: "Step7: Enter your live coordinate, or click on this icon to fetch your current location and coordinates. Fill other details and Submit the form." },
  { image: "/images/step10.jpg", description: "You can see your previously reported issues and track their progress for transperancy. Click on the issues to view the details." },
  { image: "/images/step11.jpg", description: "Click on the Image/video to view it." },
];

export default function HowToUse() {
  const [activeIndex, setActiveIndex] = useState(0);
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <section id="how" className="py-[10vh] md:py-[15vh] bg-black text-white">
      <div className="max-w-[90vw] mx-auto px-[5vw] text-center">
        <h3 className="text-[6vw] md:text-[3vw] font-bold mb-[3vh]">How To Use?</h3>
        <p className="mb-[5vh] text-[4vw] md:text-[1.2vw]">
          Follow our easy guide to report issues and see them resolved, step by step.
        </p>

        <div className="relative how-to-use-swiper-container">
          <button
            ref={prevRef}
            aria-label="Previous"
            type="button"
            className="custom-nav left-0 md:left-[-5vw] top-1/2 -translate-y-1/2 absolute z-20 w-[10vw] h-[10vw] md:w-[3vw] md:h-[3vw] rounded-full bg-white flex items-center justify-center focus:outline-none"
          >
            <svg className="w-7 h-7 text-gray-700" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <button
            ref={nextRef}
            aria-label="Next"
            type="button"
            className="custom-nav right-0 md:right-[-5vw] top-1/2 -translate-y-1/2 absolute z-20 w-[10vw] h-[10vw] md:w-[3vw] md:h-[3vw] rounded-full bg-white flex items-center justify-center focus:outline-none"
          >
            <svg className="w-7 h-7 text-gray-700" viewBox="0 0 24 24" fill="none">
              <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="overflow-hidden md:overflow-visible">
            <Swiper
              modules={[Navigation, Pagination]}
              onBeforeInit={(swiper) => {
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
              }}
              onSwiper={(s) => setActiveIndex(s.realIndex)}
              onSlideChange={(s) => setActiveIndex(s.realIndex)}
              loop={true}
              centeredSlides={true}
              slideToClickedSlide={true} // This makes neighboring slides clickable
              spaceBetween={20}
              slidesPerView={1}
              breakpoints={{
                768: { slidesPerView: 2, spaceBetween: 30 },
                1024: { slidesPerView: 3, spaceBetween: 40 },
              }}
              navigation={{
                prevEl: prevRef.current,
                nextEl: nextRef.current,
              }}
              pagination={{
                el: ".how-to-use-custom-pagination",
                clickable: true,
                renderBullet: (index, className) => <span class="${className}"></span>,
              }}
              className="py-6 how-to-use-swiper"
            >
              {HOW_TO_USE_STEPS.map((step, idx) => (
                <SwiperSlide key={idx} className="flex items-center justify-center">
                  <div className="flex flex-col items-center">
                    <div className="w-[60vw] md:w-[22vw] lg:w-[18vw] aspect-[9/16] bg-gray-800 rounded-lg shadow-lg overflow-hidden flex items-center justify-center">
                      <img
                        src={step.image}
                        alt={`Step ${idx + 1}`}
                        className="w-full h-full object-contain"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

        <div className="mt-[5vh]">
          <p className="text-gray-200 max-w-lg mx-auto text-[4vw] md:text-[1.2vw]">
            {HOW_TO_USE_STEPS[activeIndex].description}
          </p>
        </div>

      </div>
    </section>
  );
}