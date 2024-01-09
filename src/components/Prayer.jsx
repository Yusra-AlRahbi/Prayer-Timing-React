import React from 'react';
import Card  from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia  from '@mui/material/CardMedia';
import Typography  from '@mui/material/Typography';

export default function Prayer({name , time , image }) {
  return (
     <>
        <Card sx={{width: {xs:150 , sm:200 , md: 220, lg:250}}}>
          <CardMedia component= "img"
             sx={{ height:"70%"}}
             src={image}
           />
         <CardContent>
             <Typography gutterBottom variant='h5' component="div">
                 {name}
             </Typography>
             <Typography variant='h3' color='dark'>
                 {time}
             </Typography>
          </CardContent>
       </Card>
     </>
   
  );
}
