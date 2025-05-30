import React from "react";
import Slider from "react-slick";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './carousel.css';

const images = [
  "https://images.unsplash.com/photo-1510272839903-5112a2e44bc6?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1616128417743-c3a6992a65e7?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1575550959106-5a7defe28b56?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
];

function AutoPlay() {
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    pauseOnHover: false,
    swipe: false,
    speed: 1000,
    autoplaySpeed: 5000,
    cssEase: "linear",
  };
  
  return (
    <Box>
      <Box sx={{position:'absolute', height:"70%", width:{xs:'80%', md:'50%'},mt:'70px', py:'5%',px:'10%', zIndex:2, textAlign:{xs:'center', md:'start'}, alignContent:'center'}}>
        <Typography color={'white'} sx={{fontSize:'6vw', fontWeight: 'bold', width:'100%', lineHeight:1.1}}>AYUDANOS A SALVAR NUESTRA FAUNA!</Typography>
        <Typography color={'white'} sx={{display:{xs:'none', sm:'flex'}, fontSize:'1.3vw', width:{xs:'100%', md:'80%'}, mt:3}}>
          Juntos podemos detener el maltrato y la explotación de nuestros animales silvestres. Reporta cualquier incidente y se parte del cambio.
        </Typography>
        <Typography color={'white'} sx={{display:{xs:'flex', sm:'none'}, my:2, justifyContent:'center'}}>Bienvenido a UYWA</Typography>
      </Box>
      <Box sx={{
        position: 'absolute',
        zIndex: 1,
        background: 'linear-gradient(to right, rgba(0, 0, 0, 1) 0%, rgba(50, 50, 50, 0) 80%)',
        width: '80%',
        height:'100%'
      }}>
      </Box>
      <Box className="slider-container" sx={{position:'relative'}} data-testid="carousel">  
        <Slider {...settings}>
          {images.map((src) => (
            <div key={src}>
              <img className="images-carousel" src={src} alt="Wildlife conservation" />
            </div>
          ))}
        </Slider>
      </Box>
    </Box>
  );
}

export default AutoPlay;