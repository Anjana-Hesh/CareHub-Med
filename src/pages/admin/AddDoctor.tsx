import { useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import { AdminContext } from '../../context/AdminContext'
import { toast } from 'react-toastify'
import { addDoctorService } from '../../services/admin'

const AddDoctor = () => {

  const [docImg , setDocImg] = useState(false)
  const [name , setName] = useState('')
  const [email , setEmail] = useState('')
  const [password , setPassword] = useState('')
  const [experience , setExperience] = useState('1 Year')
  const [fees , setFees] = useState('')
  const [about , setAbout] = useState('')
  const [speciality , setSpeciality] = useState('General Physician')
  const [degree , setDegree] = useState('')
  const [address1 , setAddress1] = useState('')
  const [address2 , setAddress2] = useState('')

  const {backendUrl , aToken} = useContext(AdminContext)

  const onSubmitHandler = async (event) => {
    event.preventDefault()

    try {
      
      console.log('aToken value:', aToken);
      console.log('aToken type:', typeof aToken);
      console.log('localStorage token:', localStorage.getItem('atoken'));
      
      if (!aToken) {
        return toast.error('Please login first')
      }

      if (!docImg) {
        return toast.error('Image not selected')
      }

      const formData = new FormData()

      formData.append('image', docImg)
      formData.append('name', name)
      formData.append('email', email)
      formData.append('password', password)
      formData.append('experience', experience)
      formData.append('fees', Number(fees))
      formData.append('about', about)
      formData.append('speciality', speciality)
      formData.append('degree', degree)
      formData.append('address', JSON.stringify({line1: address1, line2: address2}))

    
      console.log('Sending headers:', { atoken: aToken });

      // const { data } = await axios.post(
      //   `${backendUrl}/api/v1/admin/add-doctor`,
      //   formData,
      //   { headers: { atoken: aToken } }
      // );

      const data = await addDoctorService(formData)

      if (data.success) {
        toast.success(data.message)
        setDocImg(false)
        setName('')
        setEmail('')
        setPassword('')
        setFees('')
        setAbout('')
        setDegree('')
        setAddress1('')
        setAddress2('')
      } else {
        toast.error(data.message)
      }

    } catch (err) {
      console.error('Full error:', err);
      console.error('Error response:', err.response);
      
      if (err.response?.status === 401) {
        toast.error(err.response?.data?.message || 'Session expired. Please login again.');
      } else {
        toast.error('Failed to add doctor');
      }
    }
}

  return (
    <form onSubmit={onSubmitHandler} className="m-5 w-full">
      <p className="mb-5 text-2xl font-semibold text-gray-800 tracking-wide">Add Doctor</p>

      <div className="bg-white px-10 py-10 border border-gray-200 rounded-2xl w-full max-w-4xl shadow-md hover:shadow-lg transition-all duration-300 max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        
        {/* Upload Section */}
        <div className="flex items-center gap-5 mb-8 text-gray-600">
          <label htmlFor="doc-img" className="cursor-pointer hover:scale-105 transition-transform">
            <img className="w-20 h-20 bg-gray-100 border-2 border-dashed border-gray-300 rounded-full object-cover" src={docImg ? URL.createObjectURL(docImg) : assets.upload_area} alt="Upload area" />
          </label>
          <input onChange={(event) => setDocImg(event.target.files[0])} type="file" id="doc-img" hidden />
          <div>
            <p className="font-medium text-gray-800">Upload Doctor Picture</p>
            <p className="text-sm text-gray-500">Click the circle to select an image</p>
          </div>
        </div>

        {/* Input Fields */}
        <div className="flex flex-col lg:flex-row items-start gap-12 text-gray-700">
          
          {/* Left Column */}
          <div className="w-full lg:flex-1 flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <p>Doctor Name</p>
              <input onChange={(e) => setName(e.target.value)} value={name} className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" type="text" placeholder="Name" required />
            </div>

            <div className="flex flex-col gap-2">
              <p>Doctor Email</p>
              <input onChange={(e) => setEmail(e.target.value)} value={email} className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" type="email" placeholder="Email" required />
            </div>

            <div className="flex flex-col gap-2">
              <p>Doctor Password</p>
              <input onChange={(e) => setPassword(e.target.value)} value={password} className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" type="password" placeholder="Password" required />
            </div>

            <div className="flex flex-col gap-2">
              <p>Experience</p>
              <select onChange={(e) => setExperience(e.target.value)} value={experience} className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
                {Array.from({ length: 10 }, (_, i) => (
                  <option key={i + 1} value={`${i + 1} Year`}>
                    {i + 1} Year
                  </option>   // 1 year , 2 year , ....
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <p>Fees</p>
              <input onChange={(e) => setFees(e.target.value)} value={fees} className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" type="number" placeholder="Fees" required />
            </div>
          </div>

          {/* Right Column */}
          <div className="w-full lg:flex-1 flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <p>Speciality</p>
              <select onChange={(e) => setSpeciality(e.target.value)} value={speciality} className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
                <option value="General physician">General physician</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Pediatricians">Pediatricians</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Gastroenterologist">Gastroenterologist</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <p>Education</p>
              <input onChange={(e) => setDegree(e.target.value)} value={degree} className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" type="text" placeholder="Education" required />
            </div>

            <div className="flex flex-col gap-2">
              <p>Address</p>
              <input onChange={(e) => setAddress1(e.target.value)} value={address1} className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" type="text" placeholder="Address 1" required />
              <input  onChange={(e) => setAddress2(e.target.value)} value={address2}className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" type="text" placeholder="Address 2" required />
            </div>
          </div>
        </div>

        {/* About Doctor */}
        <div className="mt-6">
          <p className="mb-2 text-gray-800">About Doctor</p>
          <textarea onChange={(e) => setAbout(e.target.value)} value={about} className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Write about doctor" rows={5} required></textarea>
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <button type='submit' className="bg-[#5F6FFF] px-10 py-3 text-white rounded-full font-medium hover:bg-[#4d5df5] transition-all duration-300 shadow-md hover:shadow-lg active:scale-95">
            Add Doctor
          </button>
        </div>
      </div>
    </form>
  )
}

export default AddDoctor
