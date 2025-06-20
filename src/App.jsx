import { useState } from 'react'
import './App.css'
import React, { useRef } from "react";
import { useScroll, useTransform } from "framer-motion";
import pricingPng from '/pricing.png'
import prosPng from '/pros.png';
import schedulingPng from '/scheduling.png';
// ignore import errors for now
// eslint-disable-next-line
import { motion, useMotionValueEvent } from "framer-motion";
import { Logo } from './Logo';

export default function App() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Slide boundaries (in scroll progress)
  const slide1End = 1 / 7;
  const slide2End = 3 / 4;

  // Background color interpolation
  const bgColor = useTransform(scrollYProgress, [1 / 4 / 10, slide1End, slide2End], [
    "#0ab463",
    "#ffffff",
    "#ffffff",
  ]);

  const imagesContainerRef = useRef(null);
  const { scrollY } = useScroll()
  const [activeImage, setActiveImage] = useState(-1);

  // use function instead
  const x = useTransform(() => {
    const start = imagesContainerRef.current?.parentElement?.offsetTop || 0;
    const end = (imagesContainerRef.current?.parentElement?.scrollHeight || 100) / 5 * 1;
    const allPauses = [[1, 1.2], [2, 2.2], [3, 3.2]]; // Define pauses as pairs of [start, end]
    const slowDownsStartsAt = allPauses.map(pause => pause[0] - 0.2);
    let y = scrollY.get();
    let f = (Math.max(0, y - start) / end);

    for (let slowDownStart of slowDownsStartsAt) {
      const range = 0.2;
      if (f > slowDownStart && f <= slowDownStart + range) {
        const f2 = f - slowDownStart;
        f -= f2 ** 2.5; // slow down to 50% speed
        console.log("f2 * f2", f2 * f2, "f", f);
      }
      if (f >= slowDownStart + range) {
        f -= range ** 2.5;
      }
    }
    for (let pause of allPauses) {
      let [startPause, endPause] = pause;
      if (f >= endPause) {
        f -= (endPause - startPause); // slow down to 50% speed 
      } else if (f > startPause && f < endPause) {
        f = startPause;
        setTimeout(() => { setActiveImage(allPauses.indexOf(pause)) }); // set active image based on pause index
      }
    }

    let cqw = f * -100;
    if (cqw < -300) {
      cqw = -300;
    }
    return cqw + 'cqw';
  });

  return (
    <motion.div
      className='nunito-font'
      ref={containerRef}
      style={{
        background: bgColor,
        transition: "background 0.5s",
        width: "100cqw",
      }}
    >
      {/* Slide 1 */}
      <section className="slide slide1 slide-in">
        <Logo />
        <h1>Affordable lawn care services at the click of a button!</h1>
      </section>

      {/* Slide 2 */}
      <section className="slide slide2">
        <div className="sticky-container" ref={imagesContainerRef}>
          <h2 className='sticky-title'><span>How it works?</span></h2>
          <motion.div className="images-row" style={{ x: x }}>
            <div className={"image-container" + (activeImage === 0 ? " active" : "")}>
              <motion.img
                src={pricingPng}
                alt={`View Pricing`}
                className={"slide-img"}
                draggable={false}
              />
              <h3><span className='step-number'>1</span>View Pricing</h3>
            </div>
            <div className={"image-container" + (activeImage === 1 ? " active" : "")}>
              <motion.img
                src={schedulingPng}
                alt={`Choose The date`}
                className={"slide-img"}
                draggable={false}
              />
              <h3><span className='step-number'>2</span>Choose The Date</h3>
            </div>
            <div className={"image-container" + (activeImage === 2 ? " active" : "")}>
              <motion.img
                src={prosPng}
                alt={`Let our pros do the work`}
                className={"slide-img"}
                draggable={false}
              />
              <h3><span className='step-number'>3</span>Let Our Pros Do The Work</h3>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Slide 3 */}
      <section className="slide slide3">
        <form novalidate="true" className='form'>
          <div>
            <div >
              <div className='form-title'>
                Get a quick and easy price.<br />E&zwnj;nter y&zwnj;our s&zwnj;treet a&zwnj;ddress
              </div>
              <div >
                <div className='form-input'>
                  <input required="" autocomplete="off" type="search" name="search" id="search" placeholder="1234 Main S&zwnj;treet..." />
                </div>
                <div>
                  <button type="submit" className='submit' >
                    <span>See My Price</span>
                  </button>
                </div>
              </div>
            </div>
            <div>

              <div>
              </div>
            </div>
          </div>
        </form>
        <div className='form-disclaimer'>
          <div >
            🔒 Your information is secure.
          </div>
        </div>
      </section>
    </motion.div>
  );
}
