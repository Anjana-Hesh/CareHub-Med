import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='md:mx-10'>
        <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
            {/*  ---------- left section ---------- */}

            <div>
                <img className='mb-5 w-40' src={assets.logo} alt="Logo" />
                <p className='w-full md:w-2/3 text-gray-600 leading-6'>At CareMed, we believe everyone deserves access to quality healthcare. Our platform connects you with trusted doctors and specialists across various fields, making it easier than ever to book appointments, get consultations, and manage your health from the comfort of your home. With CareMed, you can track your medical history, receive timely reminders, and access personalized healthcare advice, all in one convenient place. Your health is our priority, and we are committed to providing a safe, reliable, and user-friendly experience for you and your family.</p>
            </div>

            {/* ------------ center section --------- */}

            <div>
                <p className='text-xl font-medium mb-5'>COMPANY</p>
                <ul className='flex flex-col gap-2 text-gray-600'>
                    <li>Home</li>
                    <li>About Us</li>
                    <li>Contact Us</li>
                    <li>Privacy Policy</li>
                </ul>
            </div>

            {/*  -------------- Right section --------- */}

            <div>
                <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
                <ul className='flex flex-col gap-2 text-gray-600'>
                    <li>+94 764810851</li>
                    <li>anjanaheshan76@gmail.com</li>
                </ul>
            </div>

        </div>
        <div>

            <hr />
            <p className='py-5 text-md text-center'>Copyright © 2025 - All Right Reserved.</p>
            <p className='text-sm text-center'>Created by: Anjana Heshan (Doc of care hub medical)</p>
        </div>
    </div>
  )
}

export default Footer