import { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify'
import { updateDoctorService } from '../../services/doctor'


interface ProfileAddress {
  line1: string
  line2: string
}

interface ProfileData {
  name: string
  email: string
  image: string
  degree: string
  speciality: string
  experience: string
  about: string
  fees: string | number
  available: boolean
  address: ProfileAddress
}

interface DoctorContextType {
  dToken: string
  profileData: ProfileData | false
  setProfileData: (value: ProfileData | ((prev: ProfileData) => ProfileData)) => void
  getProfileData: () => Promise<void>
}

interface AppContextType {
  currency: string
}

const DoctorProfile = () => {
  const doctorContext = useContext(DoctorContext) as DoctorContextType | null
  const appContext = useContext(AppContext) as AppContextType | null

  if (!doctorContext || !appContext) {
    return (
      <div className="text-center py-10 text-gray-500">
        Initializing...
      </div>
    )
  }

  const { profileData: initialProfileData, dToken, setProfileData, getProfileData } = doctorContext
  const { currency } = appContext

  const [editableData, setEditableData] = useState<ProfileData | null>(null)
  const [isEdit, setIsEdit] = useState(false)

  // Initialize editableData when profileData loads
  useEffect(() => {
    if (initialProfileData) {
      setEditableData(initialProfileData)
    }
  }, [initialProfileData])

  // Fetch profile data on component mount
  useEffect(() => {
    if (dToken) {
      getProfileData()
    }
  }, [dToken])


  // Handler for all standard field changes (e.g., degree, about, fees)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditableData(prev => prev ? { ...prev, [name]: value } : null);
  };

  // Handler for address fields
  const handleAddressChange = (line: keyof ProfileAddress, value: string) => {
    setEditableData(prev => prev ? { 
      ...prev, 
      address: { ...prev.address, [line]: value } 
    } : null);
  };
  
  // Handler for the availability toggle
  const handleAvailabilityToggle = () => {
    setEditableData(prev => prev ? { ...prev, available: !prev.available } : null);
  };


  const updateProfile = async () => {
    if (!editableData) return

    try {
      // Create the payload for the backend service
      const updateData = {
        address: editableData.address,
        // Convert fees to a Number, as the API likely expects it.
        fees: Number(editableData.fees), 
        available: editableData.available,
        
        // Include all newly editable profile details
        degree: editableData.degree,
        speciality: editableData.speciality,
        experience: editableData.experience,
        about: editableData.about,
      }

      const data = await updateDoctorService(updateData)

      if (data.success) {
        toast.success(data.message)
        setIsEdit(false)
        // Update the global context state with the saved data
        setProfileData(editableData) 
      } else {
        toast.error(data.message)
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile.")
      console.error(error)
    }
  }

  // Handle exiting edit mode (reverting changes)
  const handleCancelEdit = () => {
    setIsEdit(false);
    // Revert local state to the global context state
    if (initialProfileData) {
        setEditableData(initialProfileData);
    }
    toast.info("Editing cancelled. Changes reverted.");
  };


  if (!initialProfileData || !editableData) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center ml-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-50 py-12 px-4 ml-70 w-full'>
      <div className='max-w-5xl mx-auto'>
        
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-4xl font-bold text-gray-800 mb-2'>
            🩺 Professional Profile Management
          </h1>
          <p className='text-gray-600'>Manage your professional information and availability for appointments.</p>
        </div>

        {/* Main Card */}
        <div className='bg-white rounded-2xl shadow-2xl overflow-hidden'>
          
          {/* Profile Header with Image */}
          <div className='bg-indigo-700 p-8 relative'>
            <div className='flex flex-col md:flex-row items-center gap-6'>
              
              {/* Image (Read-Only for now) */}
              <div className='w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl'>
                <img 
                  className='w-full h-full object-cover' 
                  src={editableData.image} 
                  alt={editableData.name} 
                />
              </div>

              <div className='text-center md:text-left flex-1 text-white'>
                <h2 className='text-3xl font-bold mb-2'>{editableData.name}</h2>
                <p className='text-sm text-indigo-200 mb-4'>{editableData.email}</p>

                {/* Editable Professional Info */}
                <div className='flex flex-wrap items-center justify-center md:justify-start gap-3'>
                  {isEdit ? (
                    <>
                        <input
                            type="text"
                            name="degree"
                            placeholder="Degree"
                            value={editableData.degree}
                            onChange={handleInputChange}
                            className="bg-white text-indigo-700 px-4 py-1 rounded-lg text-sm font-medium w-32 focus:ring-2 focus:ring-indigo-300"
                        />
                         <input
                            type="text"
                            name="speciality"
                            placeholder="Speciality"
                            value={editableData.speciality}
                            onChange={handleInputChange}
                            className="bg-white text-indigo-700 px-4 py-1 rounded-lg text-sm font-medium w-32 focus:ring-2 focus:ring-indigo-300"
                        />
                         <input
                            type="text"
                            name="experience"
                            placeholder="Experience"
                            value={editableData.experience}
                            onChange={handleInputChange}
                            className="bg-white text-indigo-700 px-4 py-1 rounded-lg text-sm font-medium w-32 focus:ring-2 focus:ring-indigo-300"
                        />
                    </>
                  ) : (
                    <>
                        <span className='bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-medium'>
                          {editableData.degree}
                        </span>
                        <span className='bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-medium'>
                          {editableData.speciality}
                        </span>
                        <span className='bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-medium'>
                          {editableData.experience}
                        </span>
                    </>
                  )}
                </div>
                
                {/* Availability Toggle */}
                <div className='flex items-center justify-center md:justify-start gap-2 mt-4'>
                  <label className='relative inline-flex items-center cursor-pointer'>
                    <input 
                      type='checkbox'
                      checked={editableData.available}
                      onChange={isEdit ? handleAvailabilityToggle : undefined}
                      disabled={!isEdit}
                      className='sr-only peer'
                    />
                    {/* 🟢 FIXED: Removed extra dot from className. */}
                    <div className='w-14 h-7 bg-white/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[""] after:absolute after:top-0.5 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-500'></div>
                  </label>
                  <span className='text-sm font-semibold'>
                    {editableData.available ? 'Available for Appointments' : 'Currently Unavailable'}
                  </span>
                </div>
              </div>

              {/* Edit/Save/Cancel Button Group */}
              <div className='flex gap-3'>
                {isEdit && (
                    <button
                        onClick={handleCancelEdit}
                        className='bg-white text-gray-700 px-5 py-2.5 rounded-lg font-semibold hover:bg-gray-200 transition-all shadow-lg'
                    >
                        Cancel
                    </button>
                )}
                <button
                    onClick={() => isEdit ? updateProfile() : setIsEdit(true)}
                    className='bg-green-500 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-green-600 transition-all shadow-lg'
                >
                    {isEdit ? 'Save Changes' : 'Edit Profile'}
                </button>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className='p-8 space-y-8'>
            
            {/* About Section */}
            <div className='bg-gray-50 rounded-xl p-6 border-2 border-gray-200'>
              <div className='flex items-center gap-2 mb-3'>
                <svg className='w-6 h-6 text-indigo-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                </svg>
                <h3 className='text-xl font-bold text-gray-800'>About</h3>
              </div>
              {isEdit ? (
                <textarea
                    name="about"
                    rows={4}
                    value={editableData.about}
                    onChange={handleInputChange}
                    className='w-full p-3 border-2 border-indigo-300 rounded-lg focus:border-indigo-500 focus:outline-none bg-white text-gray-700'
                    placeholder="Provide a brief professional summary..."
                />
              ) : (
                <p className='text-gray-700 leading-relaxed'>
                  {editableData.about}
                </p>
              )}
            </div>
            
            <hr className="border-gray-200" />
            
            {/* Details Section */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>

                {/* Appointment Fee */}
                <div className='bg-green-50 rounded-xl p-6 border-2 border-green-200'>
                  <div className='flex items-center gap-3 mb-2'>
                    <div className='w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center'>
                      <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                      </svg>
                    </div>
                    <h3 className='text-xl font-bold text-gray-800'>Consultation Fee</h3>
                  </div>

                  {isEdit ? (
                    <div className="flex items-center gap-2 mt-3">
                        <span className='text-2xl font-bold text-green-700'>{currency}</span>
                        <input 
                          type='number'
                          name="fees"
                          className='text-2xl font-bold text-green-700 bg-white px-3 py-1 rounded-lg border-2 border-green-300 focus:border-green-500 focus:outline-none w-32'
                          onChange={handleInputChange} 
                          value={editableData.fees}
                        />
                    </div>
                  ) : (
                    <p className='text-3xl font-bold text-green-700 mt-3'>
                      {currency} {editableData.fees}
                    </p>
                  )}
                </div>

                {/* Address Section */}
                <div className='bg-purple-50 rounded-xl p-6 border-2 border-purple-200'>
                  <div className='flex items-center gap-3 mb-2'>
                    <div className='w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center'>
                      <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                      </svg>
                    </div>
                    <h3 className='text-xl font-bold text-gray-800'>Practice Location</h3>
                  </div>
                  
                  {isEdit ? (
                    <div className='space-y-3 mt-3'>
                      <input 
                        type='text'
                        className='w-full px-4 py-2 border-2 border-purple-300 rounded-lg focus:border-purple-500 focus:outline-none bg-white text-gray-700'
                        placeholder='Address Line 1'
                        onChange={(e) => handleAddressChange('line1', e.target.value)} 
                        value={editableData.address.line1}
                      />
                      <input 
                        type='text'
                        className='w-full px-4 py-2 border-2 border-purple-300 rounded-lg focus:border-purple-500 focus:outline-none bg-white text-gray-700'
                        placeholder='Address Line 2 (City, State, Zip)'
                        onChange={(e) => handleAddressChange('line2', e.target.value)} 
                        value={editableData.address.line2}
                      />
                    </div>
                  ) : (
                    <div className='bg-white rounded-lg p-4 mt-3 border border-gray-100'>
                      <p className='text-gray-700 font-medium'>
                        {editableData.address.line1}
                      </p>
                      <p className='text-gray-600 text-sm'>
                        {editableData.address.line2}
                      </p>
                    </div>
                  )}
                </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorProfile