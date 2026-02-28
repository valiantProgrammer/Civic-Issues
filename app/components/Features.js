"use client";

import React, { useState, useRef } from "react"; // FIX 1: Corrected 'auseState' to 'useState'
import Image from 'next/image'; // FIX 2: Imported the Next.js Image component
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const FEATURES = [
  { title: "Visual Evidence", description: "Upload a panoramic photo or video to give administrators a comprehensive view of the issue site for better context and easier locating.", image: "/images/visual_evidence.png" },
  { title: "Live Coordinates Checker", description: "Precise, real-time GPS tagging for swift and accurate departmental response.", image: "/images/location.png" },
  { title: "Track Progress", description: "Monitor the status of your complaints in real time (Pending, Reviewed, Rejected, Actions Taken), for full transparency.", image: "/images/status.png" },
  { title: "3-Step Verification", description: "A robust workflow (AI pre-assessment, Admin review, Head approval) ensures all reports are valid before action is taken. ", image: "/images/verification.png" },
];

export default function Features() {
  const [activeIndex, setActiveIndex] = useState(0);
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <section id="features" className="py-[10vh] md:py-[15vh] bg-gradient-to-r from-yellow-100 via-white to-purple-100">
      <div className="max-w-[90vw] mx-auto px-[5vw] text-center">
        <h2 className="text-[6vw] md:text-[3vw] font-extrabold text-gray-900 mb-[4vh]">Our Interactive Features</h2>

        <div className="relative features-swiper-container">
          <button
            ref={prevRef}
            aria-label="Previous"
            type="button"
            className="custom-nav left-[5%] md:left-[-5vw] top-1/2 -translate-y-1/2 absolute z-20 w-[10vw] h-[10vw] md:w-[3vw] md:h-[3vw] rounded-full bg-white flex items-center justify-center focus:outline-none"
          >
            <svg className="w-7 h-7 text-gray-700" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            ref={nextRef}
            aria-label="Next"
            type="button"
            className="custom-nav right-[5%] md:right-[-5vw] top-1/2 -translate-y-1/2 absolute z-20 w-[10vw] h-[10vw] md:w-[3vw] md:h-[3vw] rounded-full bg-white flex items-center justify-center focus:outline-none"
          >
            <svg className="w-7 h-7 text-gray-700" viewBox="0 0 24 24" fill="none">
              <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="overflow-hidden md:overflow-visible">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              onBeforeInit={(swiper) => {
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
              }}
              onSlideChange={(s) => setActiveIndex(s.realIndex)}
              loop
              centeredSlides
              slideToClickedSlide={true}
              slidesPerView={1}
              breakpoints={{
                768: { slidesPerView: 3 },
              }}
              navigation={{
                prevEl: prevRef.current,
                nextEl: nextRef.current,
              }}
              pagination={{
                el: ".features-custom-pagination",
                clickable: true,
                renderBullet: (index, className) => <span class="${className}"></span>,
              }}
              autoplay={{
                delay: 3500,
                disableOnInteraction: false,
              }}
              simulateTouch={true}
              className="py-6 features-swiper"
            >
              {FEATURES.map((f, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <SwiperSlide key={f.title} className="flex items-center justify-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={`ball ${isActive ? "ball--active" : "ball--inactive"} w-[50vw] h-[50vw] md:w-[25vw] md:h-[25vw] bg-white rounded-full overflow-hidden flex items-center justify-center relative`}
                      >
                        {/* FIX 3: Replaced <img> with optimized <Image> component */}
                        <Image
                          src={f.image}
                          alt={f.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 50vw, 25vw"
                        />
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        </div>

        <div className="mt-[5vh]">
          <h3 className="font-bold text-[5vw] md:text-[2vw] text-gray-900">{FEATURES[activeIndex]?.title}</h3>
          <p className="mt-3 text-gray-600 max-w-xs md:max-w-xl mx-auto text-[4vw] md:text-[1.2vw]">{FEATURES[activeIndex]?.description}</p>
        </div>

      </div>
    </section>
  );
}