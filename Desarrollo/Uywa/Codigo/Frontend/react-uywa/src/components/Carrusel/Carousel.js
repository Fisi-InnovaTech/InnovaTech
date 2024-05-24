import React, { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import './carousel.css';


const images = [
  "https://images.unsplash.com/photo-1510272839903-5112a2e44bc6?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1616128417743-c3a6992a65e7?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1575550959106-5a7defe28b56?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
];

const AutoPlayCarousel = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const maxSteps = images.length;
  const timeoutRef = useRef(null);

  useEffect(() => {
    const handleNext = () => {
      setActiveStep((prevActiveStep) => (prevActiveStep + 1));
      setIsTransitioning(true);
    };

    timeoutRef.current = setTimeout(handleNext, 3000); // Cambia la imagen cada 3 segundos

    return () => clearTimeout(timeoutRef.current);
  }, [activeStep]);

  useEffect(() => {
    if (activeStep === maxSteps) {
      const timeout = setTimeout(() => {
        setIsTransitioning(false);
        setActiveStep(0);
      }, 1000); // La duración de la transición en ms

      return () => clearTimeout(timeout);
    }
  }, [activeStep, maxSteps]);

  return (
    <Box className="slider-container">
      <div className="slider-gradient" />
      <Box
        className={`slider-content ${isTransitioning ? '' : 'no-transition'}`}
        style={{ transform: `translateX(-${activeStep * 100}%)` }}
      >
        {images.map((src, index) => (
          <Box key={index} className="slider-item" style={{ backgroundImage: `url(${src})` }}>
            <img src={src} alt={`Slide ${index + 1}`} style={{ display: 'none' }} />
          </Box>
        ))}
        <Box className="slider-item" style={{ backgroundImage: `url(${images[0]})` }}>
          <img src={images[0]} alt={`Slide 1`} style={{ display: 'none' }} />
        </Box>
      </Box>
    </Box>
  );
};

export default AutoPlayCarousel;