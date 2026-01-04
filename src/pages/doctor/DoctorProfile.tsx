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

  useEffect(() => {
    if (initialProfileData) {
      setEditableData(initialProfileData)
    }
  }, [initialProfileData])

  useEffect(() => {
    if (dToken) {
      getProfileData()
    }
  }, [dToken])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditableData(prev => prev ? { ...prev, [name]: value } : null)
  }

  const handleAddressChange = (line: keyof ProfileAddress, value: string) => {
    setEditableData(prev => prev ? {
      ...prev,
      address: { ...prev.address, [line]: value }
    } : null)
  }

  const handleAvailabilityToggle = () => {
    setEditableData(prev => prev ? { ...prev, available: !prev.available } : null)
  }

  const updateProfile = async () => {
    if (!editableData) return

    try {
      const updateData = {
        address: editableData.address,
        fees: Number(editableData.fees),
        available: editableData.available,
        degree: editableData.degree,
        speciality: editableData.speciality,
        experience: editableData.experience,
        about: editableData.about,
      }

      const data = await updateDoctorService(updateData)

      if (data.success) {
        toast.success(data.message)
        setIsEdit(false)
        setProfileData(editableData)
      } else {
        toast.error(data.message)
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile.")
      console.error(error)
    }
  }

  const handleCancelEdit = () => {
    setIsEdit(false)
    if (initialProfileData) {
      setEditableData(initialProfileData)
    }
    toast.info("Editing cancelled. Changes reverted.")
  }

  if (!initialProfileData || !editableData) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center md:ml-70">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:py-10 sm:px-6 lg:px-8 md:ml-70 w-full ml-10">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
            🩺 Professional Profile
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Update your professional details and availability
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">

          {/* Profile Header with Image */}
          <div className="bg-linear-to-r from-indigo-600 to-indigo-800 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
              {/* Image */}
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white shadow-xl shrink-0">
                <img
                  className="w-full h-full object-cover"
                  src={editableData.image}
                  alt={editableData.name}
                />
              </div>

              {/* Info */}
              <div className="flex-1 text-center sm:text-left text-white space-y-3 sm:space-y-4 w-full">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold">{editableData.name}</h2>
                  <p className="text-indigo-200 text-sm mt-1">{editableData.email}</p>
                </div>

                {/* Credentials */}
                <div className="flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-3">
                  {isEdit ? (
                    <>
                      <input
                        type="text"
                        name="degree"
                        value={editableData.degree}
                        onChange={handleInputChange}
                        placeholder="Degree"
                        className="bg-white/90 text-indigo-700 px-3 py-1.5 rounded-lg text-sm w-36 sm:w-40 focus:ring-2 focus:ring-white"
                      />
                      <input
                        type="text"
                        name="speciality"
                        value={editableData.speciality}
                        onChange={handleInputChange}
                        placeholder="Speciality"
                        className="bg-white/90 text-indigo-700 px-3 py-1.5 rounded-lg text-sm w-36 sm:w-40 focus:ring-2 focus:ring-white"
                      />
                      <input
                        type="text"
                        name="experience"
                        value={editableData.experience}
                        onChange={handleInputChange}
                        placeholder="Experience"
                        className="bg-white/90 text-indigo-700 px-3 py-1.5 rounded-lg text-sm w-36 sm:w-40 focus:ring-2 focus:ring-white"
                      />
                    </>
                  ) : (
                    <>
                      <span className="bg-white/25 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                        {editableData.degree}
                      </span>
                      <span className="bg-white/25 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                        {editableData.speciality}
                      </span>
                      <span className="bg-white/25 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                        {editableData.experience}
                      </span>
                    </>
                  )}
                </div>

                {/* Availability */}
                <div className="flex items-center justify-center sm:justify-start gap-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editableData.available}
                      onChange={isEdit ? handleAvailabilityToggle : undefined}
                      disabled={!isEdit}
                      className="sr-only peer"
                    />
                    <div className="w-12 h-6 sm:w-14 sm:h-7 bg-white/30 rounded-full peer peer-checked:bg-green-500 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-6 sm:peer-checked:after:translate-x-full"></div>
                  </label>
                  <span className="text-sm font-medium">
                    {editableData.available ? 'Available' : 'Unavailable'}
                  </span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex flex-row sm:flex-col gap-3 mt-4 sm:mt-0 w-full sm:w-auto">
                {isEdit && (
                  <button
                    onClick={handleCancelEdit}
                    className="flex-1 sm:flex-none bg-white text-gray-700 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-100 transition"
                  >
                    Cancel
                  </button>
                )}
                <button
                  onClick={() => isEdit ? updateProfile() : setIsEdit(true)}
                  className="flex-1 sm:flex-none bg-green-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-green-700 transition shadow-md"
                >
                  {isEdit ? 'Save Changes' : 'Edit Profile'}
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6 sm:p-8 space-y-8">

            {/* About */}
            <div className="bg-gray-50 rounded-xl p-5 sm:p-6 border border-gray-200">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                About
              </h3>
              {isEdit ? (
                <textarea
                  name="about"
                  rows={4}
                  value={editableData.about}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-indigo-300 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-400 bg-white text-gray-700 resize-y min-h-[100px]"
                  placeholder="Write something about your practice..."
                />
              ) : (
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {editableData.about || "No description provided yet."}
                </p>
              )}
            </div>

            {/* Fee + Address */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Fee */}
              <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 flex items-center gap-3">
                  <div className="w-9 h-9 bg-green-600 rounded-lg flex items-center justify-center text-white">
                    $
                  </div>
                  Consultation Fee
                </h3>
                <div className="flex items-center gap-2 mt-2">
                  {isEdit ? (
                    <>
                      <span className="text-2xl font-bold text-green-700">{currency}</span>
                      <input
                        type="number"
                        name="fees"
                        value={editableData.fees}
                        onChange={handleInputChange}
                        className="text-2xl font-bold text-green-700 bg-white px-3 py-1.5 rounded-lg border border-green-300 focus:border-green-500 w-32 focus:outline-none"
                        min="0"
                      />
                    </>
                  ) : (
                    <p className="text-3xl font-bold text-green-700">
                      {currency} {editableData.fees}
                    </p>
                  )}
                </div>
              </div>

              {/* Address */}
              <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 flex items-center gap-3">
                  <div className="w-9 h-9 bg-purple-600 rounded-lg flex items-center justify-center text-white">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  Practice Location
                </h3>

                {isEdit ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editableData.address.line1}
                      onChange={e => handleAddressChange('line1', e.target.value)}
                      placeholder="Address Line 1"
                      className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:border-purple-500 focus:outline-none bg-white"
                    />
                    <input
                      type="text"
                      value={editableData.address.line2}
                      onChange={e => handleAddressChange('line2', e.target.value)}
                      placeholder="Address Line 2 / City, State, Zip"
                      className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:border-purple-500 focus:outline-none bg-white"
                    />
                  </div>
                ) : (
                  <div className="bg-white rounded-lg p-4 mt-2 border border-gray-100">
                    <p className="text-gray-800 font-medium">
                      {editableData.address.line1 || "Not set"}
                    </p>
                    <p className="text-gray-600 text-sm mt-1">
                      {editableData.address.line2 || "—"}
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