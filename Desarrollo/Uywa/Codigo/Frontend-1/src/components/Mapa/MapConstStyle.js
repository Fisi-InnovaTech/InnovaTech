export const mapMark = {
  width:{ xs: "100%", md: "60%" },
  height:{ xs: "65vh", md: "85vh" },
  border: "1px solid #ccc",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
};

export const alertaContainer = {
  marginTop:"70px", 
  width:{xs:"100vw", md:"min(170rem, 100vw)"}, 
  paddingX:{xs:"3%", md:"10%"}, 
  display:"flex", 
  paddingY:"2%", 
  flexDirection:{ xs: "column-reverse", md: "row" }, 
  gap: "1rem",
  justifyContent: "center",
};

export const mapBotonBuscar = {
  marginTop: "1.5rem",
  backgroundColor: "#E52F60",
  borderRadius: "7px",
  color: "white",
  width: "270px",
  height: "45px",
  "&:hover": {
    backgroundColor: "#C22828",
  },
}

export const mapSearchAlert = {
  justifyContent: "center",
  paddingX: "2rem",
  paddingY: "15px",
  borderRadius: "12px",
  display: "flex",
  flexDirection: "column",
  border: "1px solid #ccc",
  backgroundColor: "rgb(248, 248, 248)",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
}