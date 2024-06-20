import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

export default function ActionAreaCard() {
  return (
    <>
    <Card sx={{display:{xs:'',sm:'flex'}, flexWrap:'wrap', padding:3, marginY:3, maxWidth:{xs:'70vw',md:'60vw'}, alignContent:'center'}}>
        <CardMedia
              component="img"
              height="140"
              image="https://images.unsplash.com/photo-1622541228926-ead8a35fbdd7?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="mono-selva"
              sx={{ width:{md:'40%', xs:'100%'},objectFit:'cover', display:{xs:'flex', sm:'none'}}} 
        />
        <CardContent sx={{flex: 1}}>
          <Typography gutterBottom variant="h3" component="div">
            Quienes Somos
          </Typography>
          <Typography variant="body1" color="text.secondary">
          Somos una organización comprometida con la conservación de la biodiversidad en el Perú. En colaboración con el Servicio Nacional Forestal y de Fauna Silvestre (SERFOR), nos dedicamos a la lucha contra el tráfico ilegal de fauna silvestre y doméstica. 
          Nuestra misión es proteger y preservar la rica variedad de especies que habitan en nuestro país, garantizando que puedan vivir y prosperar en sus hábitats naturales.
          </Typography>
        </CardContent>
        <CardMedia
          component="img"
          height="300"
          image="https://images.unsplash.com/photo-1622541228926-ead8a35fbdd7?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="mono-selva"
          sx={{ width: "40%", objectFit:'cover', display:{xs:'none', sm:'flex'} }} 
        />
    </Card>
    <Card sx={{display:{xs:'',sm:'flex'}, flexWrap:'wrap', padding:3, marginY:3, maxWidth:{xs:'70vw',md:'60vw'}, alignContent:'center'}}>
        <CardMedia
            component="img"
            height="100%"
            image="https://peru.wcs.org/Portals/94/Imagenes%202022/_MG_5322.jpg"
            alt="quienes-somos"
            sx={{ width:{md:'40%', xs:'100%'},objectFit:'cover'}} 
        />
        <CardContent sx={{ flex: 1}}>
          <Typography gutterBottom variant="h3" component="div">
            Que hacemos
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Utilizamos tecnologías avanzadas y sistemas de alerta temprana para detectar y monitorear actividades sospechosas relacionadas con el tráfico ilegal de animales. 
            Nuestro sistema de vigilancia permite identificar patrones de movimiento y comercio que ponen en riesgo a la fauna silvestre, facilitando la intervención oportuna de las autoridades.

          </Typography>
        </CardContent>
    </Card>
    <Card sx={{display:{xs:'',sm:'flex'}, flexWrap:'wrap', padding:3, marginY:3, maxWidth:{xs:'70vw',md:'60vw'}, alignContent:'center'}}>
        <CardMedia
              component="img"
              height="140"
              image="https://cdn.www.gob.pe/uploads/document/file/3999196/Rescate%20de%20fauna%20silvestre_Entrega%20en%20custodia%20de%20gato%20silvestre%20del%20pajonal.jpg.jpg"
              alt="mono-selva"
              sx={{ width:{md:'40%', xs:'100%'},objectFit:'cover', display:{xs:'flex', sm:'none'}}} 
        />
        <CardContent sx={{flex: 1}}>
          <Typography gutterBottom variant="h3" component="div">
            Educación
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Creemos que la educación es clave para combatir el tráfico de fauna. Desarrollamos programas de sensibilización dirigidos a comunidades locales, escuelas y al público en general, con el objetivo de aumentar la conciencia sobre la importancia de proteger nuestra biodiversidad y los daños que causa el tráfico ilegal.

          </Typography>
        </CardContent>
        <CardMedia
          component="img"
          height="300"
          image="https://cdn.www.gob.pe/uploads/document/file/3999196/Rescate%20de%20fauna%20silvestre_Entrega%20en%20custodia%20de%20gato%20silvestre%20del%20pajonal.jpg.jpg"
          alt="mono-selva"
          sx={{ width: "40%", objectFit:'cover', display:{xs:'none', sm:'flex'} }} 
        />
    </Card>
    <Card sx={{display:{xs:'',sm:'flex'}, flexWrap:'wrap', padding:3, marginY:3, maxWidth:{xs:'70vw',md:'60vw'}, alignContent:'center'}}>
        <CardMedia
            component="img"
            height="100%"
            image="https://cdn.www.gob.pe/uploads/document/file/5172852/Foto%201.jpeg"
            alt="quienes-somos"
            sx={{ width:{md:'40%', xs:'100%'},objectFit:'cover'}} 
        />
        <CardContent sx={{ flex: 1}}>
          <Typography gutterBottom variant="h3" component="div">
            Alianzas 
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Trabajamos en estrecha colaboración con SERFOR, fuerzas del orden, ONGs, y comunidades locales. Estas alianzas estratégicas nos permiten coordinar esfuerzos y recursos para ser más efectivos en la prevención y persecución del tráfico de fauna. Juntos, diseñamos e implementamos estrategias para la conservación de especies y el fortalecimiento de la legislación contra el comercio ilegal de animales.

          </Typography>
        </CardContent>
    </Card>
    <Card sx={{display:{xs:'',sm:'flex'}, flexWrap:'wrap', padding:3, marginY:3, maxWidth:{xs:'70vw',md:'60vw'}, alignContent:'center'}}>
        <CardMedia
              component="img"
              height="140"
              image="https://cdn.www.gob.pe/uploads/document/file/3879882/DECOMISO%20DE%20ANINALES%20SILVESTRES%201.jfif.jfif"
              alt="mono-selva"
              sx={{ width:{md:'40%', xs:'100%'},objectFit:'cover', display:{xs:'flex', sm:'none'}}} 
        />
        <CardContent sx={{flex: 1}}>
          <Typography gutterBottom variant="h3" component="div">
            Rescate 
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Cuando se interceptan animales víctimas del tráfico ilegal, proporcionamos refugio, atención médica y rehabilitación para ayudarlos a recuperar su salud y, cuando es posible, reintegrarlos en sus hábitats naturales. Nuestro equipo de especialistas trabaja incansablemente para garantizar el bienestar de cada animal rescatado.

          </Typography>
        </CardContent>
        <CardMedia
          component="img"
          height="300"
          image="https://cdn.www.gob.pe/uploads/document/file/3879882/DECOMISO%20DE%20ANINALES%20SILVESTRES%201.jfif.jfif"
          alt="mono-selva"
          sx={{ width: "40%", objectFit:'cover', display:{xs:'none', sm:'flex'} }} 
        />
    </Card>
    <Card sx={{display:{xs:'',sm:'flex'}, flexWrap:'wrap', padding:3, marginY:3, maxWidth:{xs:'70vw',md:'60vw'}, alignContent:'center'}}>
        <CardMedia
            component="img"
            height="100%"
            image="https://cdn.www.gob.pe/uploads/document/file/4926067/IMG_20230602_105541.jpg"
            alt="quienes-somos"
            sx={{ width:{md:'40%', xs:'100%'},objectFit:'cover'}} 
        />
        <CardContent sx={{ flex: 1}}>
          <Typography gutterBottom variant="h3" component="div">
            Únete a Nosotros
          </Typography>
          <Typography variant="body1" color="text.secondary">
          La protección de la biodiversidad es una tarea compartida que define nuestro compromiso con el futuro del planeta. Juntos, podemos marcar la diferencia y asegurar un futuro seguro y próspero para la fauna del Perú.

          </Typography>
          <Typography variant="body1" color="text.secondary">
            Tu participación es fundamental para fortalecer la conservación de nuestros ecosistemas naturales y garantizar que nuestras especies más preciadas puedan prosperar. Únete a nuestra red dedicada y sé parte del movimiento para preservar la riqueza natural que nos define como nación.
          </Typography>
        </CardContent>
    </Card>
    </>
    
  );
}



