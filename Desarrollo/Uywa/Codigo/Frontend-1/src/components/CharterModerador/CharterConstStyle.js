export const charterCard = { 
  width: "200px",
  height: "250px",
  padding: "16px",
  margin: "32px",
  borderRadius: "13px",
  boxShadow: "0 3px 6px 3px rgba(0, 0, 0, .3)",
  transition: "transform 0.3s ease-in-out",
  "&:hover": {
    transform: "scale(1.05)",
  },
}

export const moderadorContainerImage = {
  position: "relative",
  width: "100vw",
  height: "30vh",
  marginTop: "70px",
}

export const moderadorTitle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  color: "white",
  transform: "translate(-50%, -50%)",
  fontSize: "clamp(3rem, 5vw, 5rem)",
  fontWeight: "bold",
}

export const moderadorCharterBox = { 
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  width: "100%",
}

