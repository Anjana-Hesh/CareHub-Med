type ImageImport = string;

// 👉 All image imports
import appointment_img from './appointment_img.png';
import header_img from './header_img.png';
import group_profiles from './group_profiles.png';
import profile_pic from './profile_pic.png';
import contact_image from './contact_image.png';
import about_image from './about_image.png';
import logo from './logo.png';
import dropdown_icon from './dropdown_icon.svg';
import menu_icon from './menu_icon.svg';
import cross_icon from './cross_icon.png';
import chats_icon from './chats_icon.svg';
import verified_icon from './verified_icon.svg';
import arrow_icon from './arrow_icon.svg';
import info_icon from './info_icon.svg';
import upload_icon from './upload_icon.png';
import stripe_logo from './stripe_logo.png';
import razorpay_logo from './razorpay_logo.png';
import doc1 from './Anjana Doc.png';
import doc2 from './Tharusha Doc.png';
import doc3 from './Rethmi Doc.png';
import doc4 from './Wasana Doc.png';
import doc5 from './Sachini Doc.png';
import doc6 from './Nisal Doc.png';
import doc7 from './Dilmi Doc.png';
import doc8 from './Chathura Doc.png';
import doc9 from './Prabhadee Doc.png';
import doc10 from './docDinan.png';
import doc11 from './doc11.png';
import doc12 from './doc12.png';
import doc13 from './doc13.png';
import doc14 from './doc14.png';
import doc15 from './doc15.png';
import Dermatologist from './Dermatologist.svg';
import Gastroenterologist from './Gastroenterologist.svg';
import General_physician from './General_physician.svg';
import Gynecologist from './Gynecologist.svg';
import Neurologist from './Neurologist.svg';
import Pediatricians from './Pediatricians.svg';

// 🌟 Assets object
export const assets: Record<string, ImageImport> = {
  appointment_img,
  header_img,
  group_profiles,
  logo,
  chats_icon,
  verified_icon,
  info_icon,
  profile_pic,
  arrow_icon,
  contact_image,
  about_image,
  menu_icon,
  cross_icon,
  dropdown_icon,
  upload_icon,
  stripe_logo,
  razorpay_logo
};

// 🩺 Specialities
export interface Speciality {
  speciality: string;
  image: ImageImport;
}

export const specialityData: Speciality[] = [
  { speciality: 'General physician', image: General_physician },
  { speciality: 'Gynecologist', image: Gynecologist },
  { speciality: 'Dermatologist', image: Dermatologist },
  { speciality: 'Pediatricians', image: Pediatricians },
  { speciality: 'Neurologist', image: Neurologist },
  { speciality: 'Gastroenterologist', image: Gastroenterologist }
];

// 👩‍⚕️ Doctors
export interface Doctor {
  _id: string;
  name: string;
  image: ImageImport;
  speciality: string;
  degree: string;
  experience: string;
  about: string;
  fees: number;
  address: {
    line1: string;
    line2: string;
  };
}

export const doctors: Doctor[] = [
    {
        _id: 'doc1',
        name: 'Dr. Anjana Heshan',
        image: doc1,
        speciality: 'General physician',
        degree: 'MBBS',
        experience: '5 Years',
        about: 'Dr. Anjana specializes in **General medicine**, focusing on routine check-ups, managing chronic diseases, and promoting overall wellness and preventive care for adult patients.',
        fees: 5200, // LKR 5,200
        address: { line1: 'Ihala Omaththa, Digala', line2: 'Elpitiya' }
    },
    {
        _id: 'doc2',
        name: 'Dr. Tharusha Sandaruwan',
        image: doc2,
        speciality: 'Gynecologist',
        degree: 'MBBS',
        experience: '3 Years',
        about: 'Dr. Tharusha is a **Gynecologist**, dedicated to comprehensive women\'s reproductive health, including prenatal care, preventative screenings, and surgical procedures.',
        fees: 4000, // LKR 4,000
        address: { line1: 'Ella', line2: 'Kurudugaha' }
    },
    {
        _id: 'doc3',
        name: 'Dr. Sainsa Rethmi',
        image: doc3,
        speciality: 'Dermatologist',
        degree: 'MBBS',
        experience: '1 Years',
        about: 'Dr. Rethmi is a certified **Dermatologist**, specializing in diagnosing and treating conditions of the skin, hair, and nails, offering both cosmetic and medical treatments.',
        fees: 2500, // LKR 2,500
        address: { line1: 'Obada Ella', line2: 'Bandarawela.' }
    },
    {
        _id: 'doc4',
        name: 'Dr. Nethmi Wasana Jayasinghe',
        image: doc4,
        speciality: 'Pediatricians',
        degree: 'MBBS',
        experience: '5 Years',
        about: 'Dr. Jayasighe is a dedicated **Pediatrician**, providing expert medical care for infants, children, and adolescents, with a focus on growth monitoring, vaccinations, and developmental health.',
        fees: 5500, // LKR 5,500
        address: { line1: 'Diyapitagallana , nawadagala, ', line2: 'Elpitiya.' }
    },
    {
        _id: 'doc5',
        name: 'Dr. Sachini Thakshila',
        image: doc5,
        speciality: 'Gastroenterologist',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Sachini is a **Gastroenterologist**, specializing in the digestive system, including diagnosis and treatment of conditions affecting the stomach, intestines, liver, and pancreas.',
        fees: 4500, // LKR 4,500
        address: { line1: 'Diyathalawa,', line2: 'Bandarawela.' }
    },
    {
        _id: 'doc6',
        name: 'Dr. Nisal Sahansith',
        image: doc6,
        speciality: 'Neurologist',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Nisal is a skilled **Neurologist** who diagnoses and treats disorders of the brain, spinal cord, nerves, and muscles, such as stroke, epilepsy, and migraines.',
        fees: 4000, // LKR 4,000
        address: { line1: 'Wanduramba, mukalana, ', line2: 'Galle' }
    },
    {
        _id: 'doc7',
        name: 'Dr. Dilmi Kaushalya',
        image: doc7,
        speciality: 'General physician',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Dilmi specializes in **General medicine**, focusing on routine check-ups, managing chronic diseases, and promoting overall wellness and preventive care for adult patients.',
        fees: 3000, // LKR 3,000
        address: { line1: 'Unknown road, ', line2: 'Galle' }
    },
    {
        _id: 'doc8',
        name: 'Dr. Chathura Lakshan',
        image: doc8,
        speciality: 'Gynecologist',
        degree: 'MBBS',
        experience: '3 Years',
        about: 'Dr. Chathura is a **Gynecologist**, dedicated to comprehensive women\'s reproductive health, including prenatal care, preventative screenings, and surgical procedures.',
        fees: 4000, // LKR 4,000
        address: { line1: 'Jungle vibe', line2: 'Kurudugaha.' }
    },
    {
        _id: 'doc9',
        name: 'Dr. Prbhadee Induwara',
        image: doc9,
        speciality: 'Dermatologist',
        degree: 'MBBS',
        experience: '1 Years',
        about: 'Dr. Prbhadee is a certified **Dermatologist**, specializing in diagnosing and treating conditions of the skin, hair, and nails, offering both cosmetic and medical treatments.',
        fees: 2500, // LKR 2,500
        address: { line1: 'unknown junction,', line2: 'Galle. ' }
    },
    {
        _id: 'doc10',
        name: 'Dr. Dinan Themika',
        image: doc10,
        speciality: 'Pediatricians',
        degree: 'MBBS',
        experience: '2 Years',
        about: 'Dr. Dinan is a dedicated **Pediatrician**, providing expert medical care for infants, children, and adolescents, with a focus on growth monitoring, vaccinations, and developmental health.',
        fees: 3500, // LKR 3,500
        address: { line1: 'Unknown panthayka, ', line2: 'Galle. ' }
    },
    {
        _id: 'doc11',
        name: 'Dr. Charuka Hansaja',
        image: doc11,
        speciality: 'Neurologist',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Charuka is a skilled **Neurologist** who diagnoses and treats disorders of the brain, spinal cord, nerves, and muscles, such as stroke, epilepsy, and migraines.',
        fees: 4000, // LKR 4,000
        address: { line1: 'Dont know pradesh, ', line2: 'Galle. ' }
    },
    {
        _id: 'doc12',
        name: 'Dr. Kamesh de Silva',
        image: doc12,
        speciality: 'Neurologist',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Silva is a skilled **Neurologist** who diagnoses and treats disorders of the brain, spinal cord, nerves, and muscles, such as stroke, epilepsy, and migraines.',
        fees: 4000, // LKR 4,000
        address: { line1: 'Wathugedara, ', line2: 'Ambalangoda. ' }
    },
    {
        _id: 'doc13',
        name: 'Dr. Sasindu Denuwan',
        image: doc13,
        speciality: 'General physician',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Sasindu specializes in **General medicine**, focusing on routine check-ups, managing chronic diseases, and promoting overall wellness and preventive care for adult patients.',
        fees: 3000, // LKR 3,000
        address: { line1: 'Yakkalamulla, ', line2: 'Galle.' }
    },
    {
        _id: 'doc14',
        name: 'Dr. Thanuja Sammana',
        image: doc14,
        speciality: 'Gynecologist',
        degree: 'MBBS',
        experience: '3 Years',
        about: 'Dr. Thanuja is a **Gynecologist**, dedicated to comprehensive women\'s reproductive health, including prenatal care, preventative screenings, and surgical procedures.',
        fees: 4000, // LKR 4,000
        address: { line1: 'Ihala omaththa, Digala, ', line2: 'Elpitiyay' }
    },
    {
        _id: 'doc15',
        name: 'Dr. Vishwa Sudesh',
        image: doc15,
        speciality: 'Dermatologist',
        degree: 'MBBS',
        experience: '1 Years',
        about: 'Dr. Vishwa is a certified **Dermatologist**, specializing in diagnosing and treating conditions of the skin, hair, and nails, offering both cosmetic and medical treatments.',
        fees: 2500, // LKR 2,500
        address: { line1: 'Ihala Omaththa,  Mullakanda, ', line2: 'Elpitiya. ' }
    },
]