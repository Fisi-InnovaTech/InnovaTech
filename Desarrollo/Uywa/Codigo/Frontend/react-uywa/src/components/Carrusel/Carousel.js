import React from "react";
import Slider from "react-slick";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './carousel.css';
import { Container } from "@mui/material";


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
    <>
      <Box className="slider-container" sx={{position:'relative'}}>
        <Slider {...settings}>
        {images.map((src, index) => (
            <div key={index}>
              <img className="images-carousel" src={src} alt={`Slide ${index + 1}`} />
            </div>
          ))}
        </Slider>
      </Box>
      <Card sx={{ maxWidth: 180, height:230, padding:1, margin:2, position:'absolute' }}>
        <CardMedia
          component="img"
          alt="green iguana"
          height="80"
          image="/static/images/cards/contemplative-reptile.jpg"
        />
        <CardContent sx={{textAlign:'center'}}>
          <Typography gutterBottom variant="h3" component="div" margin={0}>
            wasaaaa
          </Typography>
          <Typography variant="body2" color="text.secondary">
              ayudaaaa
          </Typography>
        </CardContent>
      </Card>
    </>

  );
}

export default AutoPlay;
