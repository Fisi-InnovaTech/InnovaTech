// src/components/Reportes/ReportesStyle.js
export const styles = {
  container: {
    display: 'flex',
    flexDirection: "column",
    marginTop: '100px',
  },
  searchBox: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '20px',
    flexDirection: {xs: 'column', md: 'row', lg: 'row'}
  },
  searchField: {
    display: 'flex',
    width: {xs : '100%', md: '50%', lg: '30%'},
  },
  searchIcon: {
    height: '100%',
  },
};
