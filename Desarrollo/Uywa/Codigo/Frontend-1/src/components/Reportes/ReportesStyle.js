import { colors } from "@mui/material";

export const styles = {
  container: {
    padding: '20px',
    marginTop: '150px'
  },
  searchBox: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '20px'
  },
  searchField: {
    flex: 1,
  },
  searchIcon: {
    backgroundColor: '#E52F60',
    borderRadius: '0 8px 8px 0',
    '&:hover': {
      backgroundColor: '#C22828',
    },
  },
  visibilityIcon: {
    backgroundColor: '#003049',
    borderRadius: '20px',
    '&:hover': {
      backgroundColor: '#495057',
    },
  },
  expandedContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  expandedBox:{
    width:"100%",
    gap:"20px",
    display:"flex",
    flexDirection: { xs: 'column', md: 'row' },
    justifyContent: "space-between",
    alignItems:"center"
  },
  description_report: {
    width: '500px',
    height: '200px',
    backgroundColor: colors.grey[200],
    borderRadius: '20px',
    padding: '15px'
  },
  image: {
    maxWidth: '400px',
    marginBottom: '20px',
    borderRadius: '30px',
    marginTop: { xs: '16px', md: '0' }
  },
  actionButton: {
    margin: '10px',
    backgroundColor: 'black',
    "&:hover": {
      backgroundColor: colors.grey[800]
    }
  },
  paginationBox: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '20px',
  },
  goToPageField: {
    width: 55,
    height: 37, // Fija la altura del TextField
    '& .MuiInputBase-root': {
      height: '100%', // Asegura que el contenido también tome toda la altura
    },
  }
};