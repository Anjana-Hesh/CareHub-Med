import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";
import { updateUserDataService } from "../services/auth";

interface AddressType {
  line1: string;
  line2: string;
}

interface UserDataType {
  name: string;
  email: string;
  phone: string;
  gender: string;
  dob: string;
  image: string;
  address: AddressType;
}

interface AppContextType {
  userData: UserDataType | null;
  setUserData: React.Dispatch<React.SetStateAction<UserDataType | null>>;
  loadUserProfileData: () => Promise<void>;
}

const MyProfile = () => {
  const { userData, setUserData, loadUserProfileData } = useContext(AppContext) as AppContextType;
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const updateProfile = async () => {
    if (!userData) return;
    
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("phone", userData.phone);
      formData.append("address", JSON.stringify(userData.address));
      formData.append("gender", userData.gender);
      formData.append("dob", userData.dob);
      if (image) formData.append("image", image);

      const data = await updateUserDataService(formData);

      if (data.success) {
        toast.success("Profile updated successfully");
        await loadUserProfileData();
        setIsEdit(false);
        setImage(null);
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-blue-500 text-6xl mb-4">👤</div>
          <p className="text-blue-800 text-xl">Loading profile...</p>
          <p className="text-blue-600 mt-2">Please wait while we load your information</p>
        </div>
      </div>
    );
  }

  const profileImage = userData.image || assets.upload_icon;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto p-6">
   
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900">My Profile</h1>
          <p className="text-blue-600 mt-2">Manage your personal information</p>
        </div>

  
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-blue-100">
     
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
            <div className="relative">
              {isEdit ? (
                <label className="cursor-pointer group">
                  <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-blue-200 group-hover:border-blue-400 transition-all">
                    <img
                      className="w-full h-full object-cover"
                      src={image ? URL.createObjectURL(image) : profileImage}
                      alt="Profile"
                      onError={(e) => {
                        e.currentTarget.src = assets.upload_icon;
                      }}
                    />
                  </div>
                  <div className="absolute inset-0 rounded-full bg-blue-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    <img className="w-10" src={assets.upload_icon} alt="Upload" />
                  </div>
                  <input
                    type="file"
                    hidden
                    onChange={(e) => e.target.files?.[0] && setImage(e.target.files[0])}
                  />
                </label>
              ) : (
                <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-blue-200">
                  <img
                    className="w-full h-full object-cover"
                    src={profileImage}
                    alt="Profile"
                    onError={(e) => {
                      e.currentTarget.src = assets.upload_icon;
                    }}
                  />
                </div>
              )}
            </div>

            <div className="flex-1 text-center md:text-left">
              {isEdit ? (
                <div>
                  <input
                    className="text-3xl font-bold text-blue-900 w-full p-3 border-b-2 border-blue-200 focus:border-blue-500 focus:outline-none"
                    value={userData.name}
                    onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                  />
                  <p className="text-blue-600 mt-3">{userData.email}</p>
                </div>
              ) : (
                <div>
                  <h1 className="text-3xl font-bold text-blue-900">{userData.name}</h1>
                  <p className="text-blue-600 mt-2">{userData.email}</p>
                </div>
              )}
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
              <h2 className="text-xl font-bold text-blue-800">Contact Information</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-1">Phone Number</label>
                {isEdit ? (
                  <input
                    className="w-full p-3 border border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition"
                    value={userData.phone}
                    onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                  />
                ) : (
                  <p className="p-3 bg-blue-50 rounded-lg text-blue-800">{userData.phone || "Not provided"}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-blue-700 mb-1">Address</label>
                {isEdit ? (
                  <div className="space-y-3">
                    <input
                      className="w-full p-3 border border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                      placeholder="Address Line 1"
                      value={userData.address?.line1 || ""}
                      onChange={(e) => setUserData({
                        ...userData,
                        address: { 
                          ...userData.address, 
                          line1: e.target.value 
                        }
                      })}
                    />
                    <input
                      className="w-full p-3 border border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                      placeholder="Address Line 2"
                      value={userData.address?.line2 || ""}
                      onChange={(e) => setUserData({
                        ...userData,
                        address: { 
                          ...userData.address, 
                          line2: e.target.value 
                        }
                      })}
                    />
                  </div>
                ) : (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-blue-800">{userData.address?.line1 || "No address provided"}</p>
                    <p className="text-blue-800">{userData.address?.line2}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
              <h2 className="text-xl font-bold text-blue-800">Basic Information</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-1">Gender</label>
                {isEdit ? (
                  <select
                    className="w-full p-3 border border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                    value={userData.gender}
                    onChange={(e) => setUserData({ ...userData, gender: e.target.value })}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                ) : (
                  <p className="p-3 bg-blue-50 rounded-lg text-blue-800">{userData.gender || "Not specified"}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-700 mb-1">Date of Birth</label>
                {isEdit ? (
                  <input
                    type="date"
                    className="w-full p-3 border border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                    value={userData.dob}
                    onChange={(e) => setUserData({ ...userData, dob: e.target.value })}
                  />
                ) : (
                  <p className="p-3 bg-blue-50 rounded-lg text-blue-800">{userData.dob || "Not specified"}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          {isEdit ? (
            <>
              <button
                onClick={() => {
                  setIsEdit(false);
                  setImage(null);
                  loadUserProfileData();
                }}
                className="px-8 py-3 border-2 border-blue-500 text-blue-600 font-medium rounded-full hover:bg-blue-50 transition-all duration-300"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={updateProfile}
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-full hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEdit(true)}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-full hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProfile;