import { useContext, useEffect, useState, useCallback } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate, useParams } from 'react-router-dom';
import { assets } from '../assets/assets';
import RelatedDoctors from '../components/RelatedDoctors';
import { toast } from 'react-toastify';
import { bookAppointmentService } from '../services/auth';

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
    available: boolean;
    slots_booked: { [date: string]: string[] };
}

interface Slot {
    datetime: Date;
    time: string;
}

interface AppContextType {
    doctors: Doctor[];
    currencySymbol: string;
    backendUrl: string,
    token: string,
    getDoctorsData: () => Promise<void>
}

const Appointment = () => {
    const { docId } = useParams<{ docId: string }>();

    if (!docId) {
        return <div className="p-8 text-center text-gray-500">Invalid doctor ID</div>;
    }
    const { doctors, currencySymbol, backendUrl, token, getDoctorsData } = useContext(AppContext) as AppContextType;
    
    const navigate = useNavigate()

    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    const [docInfo, setDocInfo] = useState<Doctor | null>(null);
    const [docSlots, setDocSlots] = useState<Slot[][]>([]);
    const [slotIndex, setSlotIndex] = useState(0);
    const [slotTime, setSlotTime] = useState('');

    const fetchDocInfo = useCallback(() => {
        const foundDoc = doctors.find(doc => doc._id === docId);
        setDocInfo(foundDoc || null);
    }, [doctors, docId]);

    const getAvailableSlots = useCallback(() => {
        if (!docInfo) return;

        const today = new Date();
        const allSlots: Slot[][] = [];
        const appointmentDurationMinutes = 30;
        const officeStartTimeHour = 10;
        const officeEndTimeHour = 21;

        for (let i = 0; i < 7; i++) {
            const currentDate = new Date(today);
            currentDate.setDate(today.getDate() + i);

            let currentSlotTime = new Date(currentDate);
            currentSlotTime.setHours(officeStartTimeHour, 0, 0, 0);

            if (i === 0) {
                const now = new Date();
                let startHour = now.getHours();
                let startMinute = now.getMinutes();

                if (startMinute >= 30) {
                    startHour += 1;
                    startMinute = 0;
                } else {
                    startMinute = 30;
                }
                
                currentSlotTime.setHours(startHour, startMinute, 0, 0);
                
                if (currentSlotTime.getHours() < officeStartTimeHour) {
                    currentSlotTime.setHours(officeStartTimeHour, 0, 0, 0);
                }

                while (currentSlotTime <= now) {
                    currentSlotTime.setMinutes(currentSlotTime.getMinutes() + appointmentDurationMinutes);
                }
            }

            const endTime = new Date(currentDate);
            endTime.setHours(officeEndTimeHour, 0, 0, 0);

            const timeSlots: Slot[] = [];

            while (currentSlotTime < endTime) {
                const formattedTime = currentSlotTime.toLocaleTimeString([], { 
                    hour: 'numeric', 
                    minute: '2-digit',
                    hour12: true 
                });

                let day = currentDate.getDate()
                let month = currentDate.getMonth() + 1
                let year = currentDate.getFullYear()
                
                const slotDateStr = `${day}-${month}-${year}`
                const formattedSlotTime = formattedTime

                const isBooked = docInfo.slots_booked?.[slotDateStr]?.includes(formattedSlotTime) ?? false
                const isSlotAvailable = !isBooked

                if (isSlotAvailable) {
                    timeSlots.push({
                        datetime: new Date(currentSlotTime),
                        time: formattedTime
                    });
                }

                currentSlotTime.setMinutes(currentSlotTime.getMinutes() + appointmentDurationMinutes);
            }
            
            allSlots.push(timeSlots);
        }
        
        setDocSlots(allSlots);
    }, [docInfo]);

    const bookAppointment = async () => {
        if (!slotTime) {
            toast.error("Please select a time slot");
            return;
        }

        if (!token) {
            toast.warn("Login to book appointment")
            return navigate('/login')
        }

        try {
            const date = docSlots[slotIndex][0]?.datetime;
            if (!date) {
                toast.error("No date available");
                return;
            }

            let day = date.getDate()
            let month = date.getMonth() + 1
            let year = date.getFullYear()

            const slotDate = `${day}-${month}-${year}`

            // const { data } = await axios.post(`${backendUrl}/api/v1/user/book-appointment`, { docId, slotDate, slotTime }, { headers: { token } })
            const data = await bookAppointmentService(docId, slotDate, slotTime)

            if (data.success) {
                toast.success(data.message)
                getDoctorsData()
                navigate('/my-appointments')
            } else {
                toast.error(data.message)
            }

        } catch (error: any) {
            const message = error.response?.data?.message || error.message || 'Something went wrong';
            console.error(error)
            toast.error(message)
        }
    }

    useEffect(() => {
        fetchDocInfo();
    }, [fetchDocInfo]);

    useEffect(() => {
        getAvailableSlots();
    }, [getAvailableSlots]);

    if (!docInfo) {
        return <div className="p-8 text-center text-gray-500">Loading doctor details...</div>;
    }

    return (
        <div className='p-4 sm:p-8 bg-gray-50 min-h-screen'>
            
            <div className='flex flex-col sm:flex-row gap-4'>
                <div className='relative w-full sm:max-w-72'>
                    <img className='bg-[#5f6FFF] w-full sm:max-w-72 rounded-lg object-cover' src={docInfo.image} alt="Doctor" />
                </div>
                
                <div className='flex-1 border border-gray-200 rounded-lg p-6 sm:p-8 bg-white shadow-md mx-2 sm:mx-0 mt-[-80px] sm:mt-0 relative'>
                    <p className='flex items-center gap-2 text-2xl font-semibold text-gray-900'>
                        {docInfo.name}
                        <img className='w-5' src={assets.verified_icon} alt="Verified icon" />
                    </p>
                    <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
                        <p>{docInfo.degree} - <span className="font-medium">{docInfo.speciality}</span></p>
                        <span className='py-0.5 px-2 border border-blue-400 text-xs rounded-full text-blue-600'>{docInfo.experience}</span>
                    </div>

                    <div>
                        <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>
                            About <img className="w-4 h-4" src={assets.info_icon} alt="Info icon" /></p>
                        <p className='text-sm text-gray-500 max-w-[700px] mt-1 leading-relaxed'>{docInfo.about}</p>
                    </div>
                    
                    <p className='text-gray-500 font-medium mt-4 pt-3 border-t border-gray-100'>
                        Appointment fee: <span className='text-lg font-bold text-gray-700'>{currencySymbol} {docInfo.fees.toLocaleString()}</span>
                    </p>
                </div>
            </div>

            <div className='sm:ml-72 sm:pl-4 mt-8 font-medium text-gray-700 p-4 sm:p-0'>
                <p className="text-xl font-semibold text-gray-800">Booking Slots</p>
                
                <div className='flex gap-3 items-center w-full overflow-x-auto mt-4 pb-2 border-b-2 border-gray-100'>
                    {docSlots.length > 0 && docSlots.map((item, index) => {
                        const dateObj = item[0]?.datetime;
                        if (!dateObj) return null;

                        return (
                            <div 
                                onClick={() => { 
                                    setSlotIndex(index); 
                                    setSlotTime(''); 
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
                
                <button 
                    onClick={bookAppointment}
                    className={`text-white text-sm font-semibold px-14 py-3 rounded-full my-6 transition-opacity duration-300
                        ${slotTime 
                            ? 'bg-[#5f6FFF] hover:bg-indigo-700' 
                            : 'bg-gray-400 cursor-not-allowed opacity-80'
                        }`}
                >
                    Book an appointment
                </button>
            </div>

            <div className='sm:pl-4 pt-10'>
                <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
            </div>
            
        </div>
    );
};

export default Appointment;