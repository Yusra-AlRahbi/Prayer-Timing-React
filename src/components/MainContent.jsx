
// eslint-disable-next-line no-unused-vars
import React from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import Divider  from '@mui/material/Divider';
import Prayer from '../components/prayer';

//IMPORT IMAGES
import MuscatBack from '../assets/images/MuscatBack.jpg';
import Nizwa4 from '../assets/images/Nizwa3.jpg';
import Salalah from '../assets/images/Salalah.jpg';
import Sur from '../assets/images/Sur1.jpg';
import Fajr from '../assets/images/Fajr.png';
import Dhuhr from '../assets/images/Dhuhr.png';
import Asr from '../assets/images/Asr.png';
import Maghrib from '../assets/images/Maghrib.png'; 
import Isha from '../assets/images/Isha.png';
import { Select ,FormControl,MenuItem,InputLabel, Box,} from '@mui/material';
import axios from 'axios';
import { useState,useEffect } from 'react';
import moment from 'moment';
import "moment/dist/locale/ar"
moment.locale("ar");
import "./clockCss.css";

export default  function MainContent() {

  //STATES

  //ANALOG CLOCK
  const[clockDegree,setClockDegree] =useState([]);

  const [nextPrayerIndex ,setNextPrayerIndex]= useState(3);

  const [timings,setTimings] = useState({
    "Fajr": "05:04",
    "Dhuhr": "11:55",
    "Asr": "14:59",
    "Maghrib": "17:22",
    "Isha": "18:39",
  });

  const [remainingTime, setRemainingTime] = useState("");

  const [selectCity,setSelectedCity] = useState({
    displayName: 'مسقط',
    apiName: 'Muscat',
    background: `${MuscatBack}`,
  });

  const  [today,setToday] = useState("");

  const avilableCities = [
    {
      displayName:"مسقط",
      apiName: "Muscat",
      background: `${MuscatBack}`, 
    },
    {
      displayName:"نزوى",
      apiName: "Nizwa",
      background: `${Nizwa4}`,
    },
    {
      displayName:"صور",
      apiName: "Sur",
      background: `${Sur}`,
    },
    {
      displayName:"صلالة",
      apiName: "Salalah",
      background: `${Salalah}`,
    },
  ];

  const prayersArray = [
    {key: "Fajr", displayName: "الفجر"},
    {key: "Dhuhr", displayName: "الظهر"},
    {key: "Asr", displayName: "العصر"},
    {key: "Maghrib", displayName: "المغرب"},
    {key: "Isha", displayName: "العشاء"},
  ];


  const getTiming = async ()=>{
    console.log("Calling the api");
    const response = await axios.get(`https://api.aladhan.com/v1/timingsByCity/:date?country=OM&city=${selectCity.apiName}`);
    console.log(" Data",response.data.data.timings);
    setTimings(response.data.data.timings);
  }
  useEffect(()=>{
    getTiming();
    const t = moment();
    setToday(t.format("MMM Do YYYY| hh:mm"));
    console.log("the time is ", t.format(""));

    const h = t.hours();
    const min =t.minute();
    const hrToDegree = 30*h+min/2;
    const minToDegree = 6*min;

    setClockDegree([hrToDegree,minToDegree]);
    
  },[selectCity]);

 useEffect(()=>{
   let interval = setInterval(()=>{
     console.log ("calling timer");
     setUpCountDownTimer();
   },1000);
   const t = moment();
   setToday(t.format("MMM Do YYYY | hh:mm"));
   return()=>{
     clearInterval(interval);
    };
 },[timings]);

const setUpCountDownTimer =()=>{
   const momentNow = moment();
   let prayerIndex = 0;
   if (
      momentNow.isAfter(moment(timings["Fajr"],"hh:mm")) && 
      momentNow.isBefore(moment(timings["Dhuhr"],"hh:mm"))
      ){
        prayerIndex = 1;
      }else if (
        momentNow.isAfter(moment(timings["Dhuhr"],"hh:mm")) && 
        momentNow.isBefore(moment(timings["Asr"],"hh:mm"))
        ){
          prayerIndex = 2;
        }else if (
          momentNow.isAfter(moment(timings["Asr"],"hh:mm")) && 
          momentNow.isBefore(moment(timings["Maghrib"],"hh:mm"))
          ){
            prayerIndex = 3;
          }else if (
            momentNow.isAfter(moment(timings["Maghrib"],"hh:mm")) && 
            momentNow.isBefore(moment(timings["Isha"],"hh:mm"))
            ){
             prayerIndex = 4;
            }
            else{
                prayerIndex = 0;
              }

              setNextPrayerIndex(prayerIndex);

              //Now after knowing what the next prayer is , we can set up the countdown timer by getting the prayers time 
              const nextPrayerObject = prayersArray[prayerIndex];
              const nextPrayerTime = timings[nextPrayerObject.key];
              const nextPrayerTimeMoment = moment(nextPrayerTime,"hh:mm");
              console.log ("next prayer time isss ",nextPrayerTime);

              let reminingTime = moment(nextPrayerTime,"hh:mm").diff(momentNow);


              if(reminingTime < 0){
                 const midnight = moment("23:59:59","hh:mm:ss").diff(momentNow);
                 const fajrToMidnight = nextPrayerTimeMoment.diff(
                   moment("00:00:00","hh:mm:ss")
                  );
                 const totalDiffrentce = midnight + fajrToMidnight;
                 reminingTime = totalDiffrentce;
                 console.log("remmining time is ", reminingTime);
              }
             

              const durationRemainingTime = moment.duration(reminingTime);
              setRemainingTime(`${durationRemainingTime.hours()}:${durationRemainingTime.minutes()}:${durationRemainingTime.seconds()}`)
              console.log("duration iss",
               durationRemainingTime.hours(),
               durationRemainingTime.minutes(),
               durationRemainingTime.seconds()
             );
};
  const handleCityChange= (event)=>{
    const cityOpject = avilableCities.find((city)=>{
      return city.apiName == event.target.value;
    })
    console.log("The new value is ",event.target.value);
    setSelectedCity(cityOpject);
   
  };
  return (
    <>
       <div className='background'
       style = {{
                  backgroundImage:`url(${selectCity.background})`
                 }}
       >
        <div className = "overlay"
        >
           {/* TOP ROW */}
           <Grid container spacing={0}>
              <Grid xs={6}>
                 <Box sx={{marginRight:10}}>
                     {/* <Clock/> */}
                     <div className="clockDev" style={{marginTop: "20px"}}>
                        <div className="hourHand"style={{"transform":`rotate(${clockDegree[0]}deg)`}}></div>
                        <div className="minHand"style={{"transform":`rotate(${clockDegree[1]}deg)`}}></div>
  
                        <div className="number">
                         <div className="number No1">1</div>
                         <div className="number No2">2</div>
                         <div className="number No3">3</div>
                         <div className="number No4">4</div>
                         <div className="number No5">5</div>
                         <div className="number No6">6</div>
                         <div className="number No7">7</div>
                         <div className="number No8">8</div>
                         <div className="number No9">9</div>
                         <div className="number No10">10</div>
                         <div className="number No11">11</div>
                         <div className="number No12">12</div>
                       </div>
                     </div>
                 </Box>
                     
                     <h2 style={{color:'azure',marginRight:10, marginBottom:20}}>{today}</h2>

                          {/* SELECT CITY */}
                      <FormControl style={{width:"60%", marginRight:10}}>
                            <InputLabel id={"demo-simple-select-lable"}> 
                              <span style={{color:'white'}}> اخـــتر الــمدينة</span>
                            </InputLabel>
                            <Select 
                                 style={{color:"white"}}
                                 labelId={"demo-simple-select-lable"}
                                 id={"demo-simple-select"}
                                 onChange={handleCityChange}
                                 >
                                  {avilableCities.map((city)=>{
                                     return(
                                       <MenuItem
                                           value={city.apiName}
                                           key={city.apiName}
                                           >
                                           {city.displayName}
                                        </MenuItem>
                                      );
                                   })}
                                </Select>
                           </FormControl>
                   
                    <h1 style={{color:'whitesmoke',marginRight:10 , marginTop:25}}>{selectCity.displayName}</h1>
                </Grid>
             <Grid sx={6}>
               <div style={{color:'whitesmoke',marginTop:"20px"}}>
                 <h2>المتبقي من الوقت حتى صلاة {prayersArray[nextPrayerIndex].displayName}</h2>
                 <h1>{remainingTime}</h1>
               </div>
             </Grid>
           </Grid>
               {/* == TOP ROW ==*/}

             <Divider style={{borderColor: "white", opacity: "0.1"}}/>
    
             {/* PRAYERS CARDS */}
           <Grid 
             container 
             spacing={2}
             justifyContent={"space-around"}
             style={{marginTop:"50px" , marginRight:"10px" ,marginLeft:"10px"}}
              > 
                    <Grid item xs={12} sm={6} md={4} lg={2}>  
                      <Prayer 
                        name={"الـــفجر"} 
                        time={timings.Fajr} 
                        image={Fajr}     
                     />
                   </Grid>
                   <Grid item xs={12} sm={6} md={4} lg={2}>  
                      <Prayer 
                        name={"الــــظهر"} 
                        time={timings.Dhuhr} 
                        image={Dhuhr}
                     />
                   </Grid>
                   <Grid item xs={12} sm={6} md={4} lg={2}>
                      <Prayer 
                        name={"الـــعصر"} 
                        time={timings.Asr} 
                        image={Asr}
                     />
                   </Grid>
                   <Grid item xs={12} sm={6} md={4} lg={2}>  
                      <Prayer 
                        name={"الـــــمغرب"} 
                        time={timings.Maghrib} 
                        image={Maghrib}
                     />
                   </Grid>
                   <Grid item xs={12} sm={6} md={4} lg={2}>  
                     <Prayer 
                        name={"الــــــعشاء"} 
                        time={timings.Isha} 
                        image={Isha}
                      />
                   </Grid>
              </Grid> 
          
           {/* ==PRAYERS CARDS== */}    

        </div>
    </div>

    </>
  );
}
