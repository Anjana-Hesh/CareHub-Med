// import React, { useContext, useEffect, useState } from 'react'
// import { AppContext } from '../context/AppContext'
// import { useParams } from 'react-router-dom'
// import { assets } from '../assets/assets'
// import RelatedDoctors from '../components/RelatedDoctors'

// const Appointment = () => {

//   const {docId} = useParams()
//   const {doctors,currencySymbol} = useContext(AppContext)
//   const daysOfWeek = ['SUN' , 'MON' ,'TUE' , 'WED' , 'THU' , 'FRI' , 'SAT']

//   const [docInfo , setDocInfo] = useState(null)
//   const [docSlots , setDocSlots] = useState([])   // to get slots
//   const [slotIndex , setSlotIndex] = useState(0)  // slot index nb
//   const [slotTime , setSlotTime] = useState('')  // slot time

//   const fetchDocInfo = async () => {
//     const docInfo = doctors.find(doc => doc._id == docId)
//     setDocInfo(docInfo)
//     console.log(docInfo)
//   }

//   const getAvailableSlots = async () => {
//     setDocSlots([])

//     // getting current date --------
//     let today = new Date()

//     for(let i = 0 ; i < 7 ; i++){
//       // getting date with index...
//       let currentDate = new Date(today)
//       currentDate.setDate(today.getDate()+ i)

//       //setting end time of the date with index ...
//       let endTime = new Date()
//       endTime.setDate(today.getDate() + i)
//       endTime.setHours(21,0,0,0)

//       //setting hours ...
//       if(today.getDate() === currentDate.getDate()){
//         currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10)
//         currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
//       }else{
//         currentDate.setHours(10)
//         currentDate.setMinutes(0)
//       }

//       let timeSlots = []

//       while(currentDate < endTime){
//         let formattedTime = currentDate.toLocaleTimeString([] , {hour: '2-digit' , minute: '2-digit' , second: '2-digit'})

//         // add slots to array
//         timeSlots.push({
//           datetime: new Date(currentDate),
//           time: formattedTime
//         })

//         // increment current time by 30 minutes
//         currentDate.setMinutes(currentDate.getMinutes() + 30)
//       }
//       setDocSlots(prev => ([...prev, timeSlots]))
//     }
//   }

//   useEffect (() => {
//     fetchDocInfo()
//   } , [doctors , docId])

//   useEffect(() => {
//     getAvailableSlots()
//   },[docInfo])

//   useEffect(() => {
//     console.log(docSlots)
//   },[docSlots])

//     return docInfo && (
//       <div>
//           {/* ----------- Doctor details ----------- */}

//           <div className='flex flex-col sm:flex-row gap-4'>
//             <div>
//               <img className='bg-[#5f6FFF] w-full sm:max-w-72 rounded-lg' src={docInfo.image} alt="Doctor image" />
//             </div>
//             <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
//               {/* ----- Doc Info: name, degree , experiences -------- */}
//               <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>
//                 {docInfo.name}
//                 <img className='w-5' src={assets.verified_icon} 
//                 alt="verified icon" />
//               </p>
//               <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
//                 <p>{docInfo.degree} - {docInfo.speciality}</p>
//                 <button className='py-0.5 px-2 border text-xs rounded-full'>{docInfo.experience}</button>
//               </div>

//               {/* --------- Doctor about --------- */}
//               <div>
//                 <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>
//                   About <img src={assets.info_icon} alt="Info icon" /></p>
//                 <p className='text-sm text-gray-500 max-w-[700px] mt-1'>{docInfo.about}</p>
//               </div>
//               <p className='text-gray-500 font-medium mt-4'>
//                 Appointment fee {currencySymbol}: <span className='text-gray-600'>{docInfo.fees}</span>
//               </p>
//             </div>
//           </div>

//           {/*  ------------- Booking Slots ----------- */}
//           <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
//               <p>Booking Slots</p>
//               <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
//                 {
//                   docSlots.length && docSlots.map((item , index) => (
//                     <div onClick={() =>  setSlotIndex(index)} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-[#5f6FFF] text-white' : 'border border-gray-300'}`} key={index}>
//                       <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
//                       <p>{item[0] && item[0].datetime.getDate()}</p>
//                     </div>
//                   ))
//                 }
//               </div>

//               <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
//                 {docSlots.length && docSlots[slotIndex].map((item , index) =>(
//                   <p onClick={() => setSlotTime(item.time)} className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? 'bg-[#5f6FFF] text-white' : 'text-gray-400 border border-gray-300' }`} key={index}>
//                     {item.time.toLowerCase()}
//                   </p>
//                 ))}
//               </div>
//               <button className='bg-[#5f6FFF] text-white text-sm font-light px-14 py-3 rounded-full my-6'>Book an appointment</button>
//           </div>

//           {/* Listing related doctors */}
//           <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
//       </div>
//     )
// }

// export default Appointment

import React, { useContext, useEffect, useState, useCallback } from 'react';
import { AppContext } from '../context/AppContext';
import { useParams } from 'react-router-dom';
import { assets } from '../assets/assets';
import RelatedDoctors from '../components/RelatedDoctors';

// --- TypeScript Interfaces (Highly Recommended) ---
// Define the structure of the data for better type safety
interface Doctor {
    _id: string;
    name: string;
    speciality: string;
    image: string;
    degree: string;
    experience: string;
    about: string;
    fees: number;
    address: { line1: string, line2: string };
}

interface Slot {
    datetime: Date;
    time: string; // e.g., "10:00 AM"
}

interface AppContextType {
    doctors: Doctor[];
    currencySymbol: string;
}
// -------------------------------------------------

const Appointment = () => {
    // Type assertion for useParams in a real TS environment
    const { docId } = useParams<{ docId: string }>();
    // Use type assertion for context
    const { doctors, currencySymbol } = useContext(AppContext) as AppContextType;
    
    // Day names for display
    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    const [docInfo, setDocInfo] = useState<Doctor | null>(null);
    const [docSlots, setDocSlots] = useState<Slot[][]>([]);  // Array of arrays of Slots
    const [slotIndex, setSlotIndex] = useState(0);       // Selected day index (0-6)
    const [slotTime, setSlotTime] = useState('');        // Selected slot time string

    // Helper to fetch doctor information using useCallback
    const fetchDocInfo = useCallback(() => {
        // Use strict equality (===)
        const foundDoc = doctors.find(doc => doc._id === docId);
        setDocInfo(foundDoc || null);
        console.log("Doctor Info:", foundDoc);
    }, [doctors, docId]);

    // Helper to generate time slots using useCallback
    const getAvailableSlots = useCallback(() => {
        const today = new Date();
        const allSlots: Slot[][] = [];
        const appointmentDurationMinutes = 30;
        const officeStartTimeHour = 10; // 10:00 AM
        const officeEndTimeHour = 21;   // 9:00 PM (21:00)

        for (let i = 0; i < 7; i++) {
            const currentDate = new Date(today);
            currentDate.setDate(today.getDate() + i);

            let currentSlotTime = new Date(currentDate);
            currentSlotTime.setHours(officeStartTimeHour, 0, 0, 0); // Default start: 10:00 AM

            // Logic for TODAY (i === 0): Start at the next 30-min mark, but not before 10 AM
            if (i === 0) {
                const now = new Date();
                let startHour = now.getHours();
                let startMinute = now.getMinutes();

                // Determine the next half-hour interval (e.g., 3:15 PM -> 3:30 PM, 3:45 PM -> 4:00 PM)
                if (startMinute >= 30) {
                    startHour += 1;
                    startMinute = 0;
                } else {
                    startMinute = 30;
                }
                
                // Set the currentSlotTime to the calculated start
                currentSlotTime.setHours(startHour, startMinute, 0, 0);
                
                // If the calculated start is before 10 AM, reset to 10 AM
                if (currentSlotTime.getHours() < officeStartTimeHour) {
                    currentSlotTime.setHours(officeStartTimeHour, 0, 0, 0);
                }
                
                // If the currentSlotTime is still in the past, move it forward
                if (currentSlotTime <= now) {
                    // This logic ensures we're only calculating slots for the future
                    currentSlotTime = new Date(now.getTime() + appointmentDurationMinutes * 60000);
                    // Reset to the nearest half hour if necessary, though the above logic should handle it
                    const minutes = currentSlotTime.getMinutes();
                    currentSlotTime.setMinutes(minutes > 30 ? 60 : 30);
                }
            }


            // Set the end time for the current date (21:00 or 9:00 PM)
            const endTime = new Date(currentDate);
            endTime.setHours(officeEndTimeHour, 0, 0, 0);

            const timeSlots: Slot[] = [];

            while (currentSlotTime < endTime) {
                // Formatting time as 12-hour clock (e.g., "1:30 PM")
                const formattedTime = currentSlotTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                timeSlots.push({
                    datetime: new Date(currentSlotTime),
                    time: formattedTime
                });

                // Increment current time by 30 minutes
                currentSlotTime.setMinutes(currentSlotTime.getMinutes() + appointmentDurationMinutes);
            }
            
            // Collect slots for the current day
            allSlots.push(timeSlots);
        }
        
        // FIX: Set state once after loop completes (much more efficient)
        setDocSlots(allSlots);
    }, []); // No dependencies needed, as it uses local dates and constants

    // Effect to fetch doctor data on component load or docId/doctors list change
    useEffect(() => {
        fetchDocInfo();
    }, [fetchDocInfo]);

    // Effect to generate slots once doctor info is available
    useEffect(() => {
        if (docInfo) {
            getAvailableSlots();
        }
    }, [docInfo, getAvailableSlots]); // Regenerate slots if docInfo changes

    // Optional: Effect to log slots
    useEffect(() => {
        console.log("Generated Slots:", docSlots);
    }, [docSlots]);

    // Render nothing or a loading state if docInfo hasn't loaded yet
    if (!docInfo) {
        return <div className="p-8 text-center text-gray-500">Loading doctor details...</div>;
    }

    return (
        <div className='p-4 sm:p-8 bg-gray-50 min-h-screen'>
            
            {/* ----------- Doctor Details & Info Card ----------- */}
            <div className='flex flex-col sm:flex-row gap-4'>
                <div className='relative w-full sm:max-w-72'>
                    {/* Image */}
                    <img className='bg-[#5f6FFF] w-full sm:max-w-72 rounded-lg object-cover' src={docInfo.image} alt="Doctor" />
                </div>
                
                {/* Info Card - positioned to overlap/float */}
                <div className='flex-1 border border-gray-200 rounded-lg p-6 sm:p-8 bg-white shadow-md mx-2 sm:mx-0 mt-[-80px] sm:mt-0 relative'>
                    {/* ----- Doc Name, Verification, Degree -------- */}
                    <p className='flex items-center gap-2 text-2xl font-semibold text-gray-900'>
                        {docInfo.name}
                        <img className='w-5' src={assets.verified_icon} alt="Verified icon" />
                    </p>
                    <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
                        <p>{docInfo.degree} - <span className="font-medium">{docInfo.speciality}</span></p>
                        <span className='py-0.5 px-2 border border-blue-400 text-xs rounded-full text-blue-600'>{docInfo.experience}</span>
                    </div>

                    {/* --------- Doctor About --------- */}
                    <div>
                        <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>
                            About <img className="w-4 h-4" src={assets.info_icon} alt="Info icon" /></p>
                        <p className='text-sm text-gray-500 max-w-[700px] mt-1 leading-relaxed'>{docInfo.about}</p>
                    </div>
                    
                    {/* --------- Fee Info --------- */}
                    <p className='text-gray-500 font-medium mt-4 pt-3 border-t border-gray-100'>
                        Appointment fee: <span className='text-lg font-bold text-gray-700'>{currencySymbol} {docInfo.fees.toLocaleString()}</span>
                    </p>
                </div>
            </div>

            {/*  ------------- Booking Slots Section ----------- */}
            {/* The sm:ml-72/sm:pl-4 ensures this section aligns with the info card on desktop */}
            <div className='sm:ml-72 sm:pl-4 mt-8 font-medium text-gray-700 p-4 sm:p-0'>
                <p className="text-xl font-semibold text-gray-800">Booking Slots</p>
                
                {/* Date Selection Bar */}
                <div className='flex gap-3 items-center w-full overflow-x-auto mt-4 pb-2 border-b-2 border-gray-100'>
                    {docSlots.length > 0 && docSlots.map((item, index) => {
                        // Safely get the date from the first slot or return null
                        const dateObj = item[0]?.datetime;
                        if (!dateObj) return null;

                        return (
                            <div 
                                onClick={() => { 
                                    setSlotIndex(index); 
                                    setSlotTime(''); // Clear time selection on new date
                                }} 
                                className={`text-center py-2 px-3 min-w-16 rounded-lg cursor-pointer transition-all duration-200
                                    ${slotIndex === index 
                                        ? 'bg-[#5f6FFF] text-white shadow-lg' 
                                        : 'border border-gray-300 bg-white hover:bg-gray-50 text-gray-700'
                                    }`} 
                                key={index}
                            >
                                <p className="text-sm font-bold">{daysOfWeek[dateObj.getDay()]}</p>
                                <p className="text-xl font-bold">{dateObj.getDate()}</p>
                            </div>
                        );
                    })}
                </div>

                {/* Time Slot Display */}
                <div className='flex items-center gap-3 w-full overflow-x-auto mt-6 pb-2'>
                    {docSlots.length > 0 && docSlots[slotIndex] && docSlots[slotIndex].length > 0 ? (
                        docSlots[slotIndex].map((item, index) => (
                            <p 
                                onClick={() => setSlotTime(item.time)} 
                                className={`text-sm font-medium flex-shrink-0 px-5 py-2 rounded-full cursor-pointer transition-colors duration-200
                                    ${item.time === slotTime 
                                        ? 'bg-[#5f6FFF] text-white shadow-md' 
                                        : 'text-gray-600 border border-gray-300 hover:bg-gray-100' 
                                    }`} 
                                key={index}
                            >
                                {item.time}
                            </p>
                        ))
                    ) : (
                        <p className='text-gray-500 text-sm'>No time slots available for this day or time period.</p>
                    )}
                </div>
                
                {/* Book Button */}
                <button 
                    onClick={() => {
                        // Placeholder for actual booking logic (API call, navigation, etc.)
                        if(slotTime) {
                            alert(`Confirmed booking for Dr. ${docInfo.name} on ${docSlots[slotIndex][0].datetime.toDateString()} at ${slotTime}`);
                        } else {
                            alert('Please select a time slot before booking.');
                        }
                    }}
                    disabled={!slotTime}
                    className={`text-white text-sm font-semibold px-14 py-3 rounded-full my-6 transition-opacity duration-300
                        ${slotTime 
                            ? 'bg-[#5f6FFF] hover:bg-indigo-700' 
                            : 'bg-gray-400 cursor-not-allowed opacity-80'
                        }`}
                >
                    Book an appointment
                </button>
            </div>

            {/* --- */}
            
            {/* Listing related doctors */}
            <div className='sm:pl-4 pt-10'>
                {/* Note: Ensure RelatedDoctors handles the loading state of docInfo correctly */}
                <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
            </div>
            
        </div>
    );
};

export default Appointment;