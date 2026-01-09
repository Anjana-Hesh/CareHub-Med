import { useContext, useState, type ChangeEvent, type FormEvent } from "react";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";
import { addDoctorService } from "../../services/admin";
import { assets } from "../../assets/assetsAdmin";
import { generateDoctorDescriptionService } from "../../services/doctor";

const AddDoctor: React.FC = () => {
  const [docImg, setDocImg] = useState<File | null>(null);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [experience, setExperience] = useState<string>("1 Year");
  const [fees, setFees] = useState<string>("");
  const [about, setAbout] = useState<string>("");
  const [speciality, setSpeciality] = useState<string>("General Physician");
  const [degree, setDegree] = useState<string>("");
  const [address1, setAddress1] = useState<string>("");
  const [address2, setAddress2] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const adminCtx = useContext(AdminContext);

  if (!adminCtx) {
    throw new Error("AdminContext not found (Provider missing)");
  }

  const { aToken } = adminCtx;

  const onSubmitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      if (!aToken) {
        return toast.error("Please login first");
      }

      if (!docImg) {
        return toast.error("Image not selected");
      }

      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("image", docImg);
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("experience", experience);
      formData.append("fees", fees);
      formData.append("about", about);
      formData.append("speciality", speciality);
      formData.append("degree", degree);
      formData.append(
        "address",
        JSON.stringify({
          line1: address1,
          line2: address2,
        })
      );

      const data = await addDoctorService(formData);

      if (data.success) {
        toast.success(data.message);
        setDocImg(null);
        setName("");
        setEmail("");
        setPassword("");
        setFees("");
        setAbout("");
        setDegree("");
        setAddress1("");
        setAddress2("");
      } else {
        toast.error(data.message);
      }
    } catch (err: any) {
      console.error("Full error:", err);

      if (err.response?.status === 401) {
        toast.error(
          err.response?.data?.message ||
            "Session expired. Please login again."
        );
      } else {
        toast.error("Failed to add doctor");
      }
    } finally {
      setIsSubmitting(false);
    }
  };


  const generateAboutWithAI = async () => {
    if (!name || !speciality || !experience || !degree) {
      return toast.error("Please fill Name, Speciality, Experience & Degree first");
    }

    try {
      setIsGenerating(true);

      const data = await generateDoctorDescriptionService({
        name,
        speciality,
        experience,
        degree,
      });

      if (data.success) {
        setAbout(data.description);
        toast.success("AI description generated ✨");
      } else {
        toast.error(data.message || "AI generation failed");
      }
    } catch (error: any) {
      console.error(error);
      toast.error("AI generation error");
    } finally {
      setIsGenerating(false);
    }
  };



  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50 lg:ml-70">
     
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 flex items-center gap-2">
                👨‍⚕️ <span className="hidden sm:inline">Add New Doctor</span><span className="sm:hidden">Add Doctor</span>
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-2 hidden sm:block">Complete the form below to onboard a new specialist to our platform</p>
            </div>
            <div className="hidden md:block">
              <img src={assets.doctor_illustration || ''} alt="Doctor Illustration" className="w-20 h-20 sm:w-32 sm:h-32 opacity-70" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="grid lg:grid-cols-12 gap-6 sm:gap-8">
          
          <div className="lg:col-span-3 hidden lg:block">
            <div className="sticky top-8 space-y-6">
              <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Quick Tips</h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Use high-quality profile images (min 300x300px)
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Ensure email is professional and unique
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Password must be at least 8 characters strong
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Add detailed 'About' for better patient engagement
                  </li>
                </ul>
              </div>
              <div className="bg-linear-to-r from-green-50 to-blue-50 rounded-2xl p-6 border border-green-200">
                <h3 className="text-lg font-semibold text-green-800 mb-2">✅ Requirements</h3>
                <p className="text-sm text-green-700">All fields marked with * are required. Upload valid medical credentials if needed.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-9">
            <form onSubmit={onSubmitHandler} className="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <div className="p-4 sm:p-6 md:p-8 ml-10">
               
                <div className="mb-6 sm:mb-10">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                    📸 Profile Picture
                  </h2>
                  <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-gray-600">
                    <label
                      htmlFor="doc-img"
                      className="relative cursor-pointer hover:scale-105 transition-transform group"
                    >
                      <div className="relative w-24 h-24 sm:w-28 sm:h-28 bg-linear-to-br from-gray-100 to-gray-200 border-2 border-dashed border-gray-300 rounded-full overflow-hidden group-hover:border-blue-400 transition-colors shadow-md">
                        {docImg ? (
                          <img
                            className="w-full h-full object-cover"
                            src={URL.createObjectURL(docImg)}
                            alt="Doctor Preview"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center w-full h-full text-center">
                            <img
                              className="w-10 h-10 opacity-50 mb-2"
                              src={assets.upload_area}
                              alt="Upload Icon"
                            />
                            <span className="text-xs text-gray-500">Upload</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </div>
                      </div>
                    </label>

                    <input
                      type="file"
                      id="doc-img"
                      hidden
                      accept="image/*"
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        if (e.target.files && e.target.files[0]) {
                          setDocImg(e.target.files[0]);
                        }
                      }}
                    />

                    <div className="flex-1 text-center sm:text-left">
                      <p className="font-medium text-gray-800 text-sm sm:text-base">Upload Doctor's Profile Picture</p>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1">Recommended: Square image, min 300x300px (JPEG/PNG)</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-10">
                  {/* Left Column */}
                  <div className="space-y-4 sm:space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center">
                        <span className="mr-2">👤</span> Doctor Name *
                      </label>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-3 sm:px-4 sm:py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm placeholder-gray-400 text-sm sm:text-base"
                        type="text"
                        placeholder="Enter doctor's full name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center">
                        <span className="mr-2">📧</span> Email Address *
                      </label>
                      <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-3 sm:px-4 sm:py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm placeholder-gray-400 text-sm sm:text-base"
                        type="email"
                        placeholder="doctor@example.com"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center">
                        <span className="mr-2">🔒</span> Password *
                      </label>
                      <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-3 sm:px-4 sm:py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm placeholder-gray-400 text-sm sm:text-base"
                        type="password"
                        placeholder="Enter a secure password (min 8 chars)"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center">
                        <span className="mr-2">⏱️</span> Years of Experience *
                      </label>
                      <select
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        className="w-full px-3 py-3 sm:px-4 sm:py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm bg-white text-sm sm:text-base"
                      >
                        {Array.from({ length: 50 }, (_, i) => (
                          <option key={i + 1} value={`${i + 1} Year${i + 1 > 1 ? 's' : ''}`}>
                            {i + 1} Year{i + 1 > 1 ? 's' : ''}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center">
                        <span className="mr-2">💰</span> Consultation Fees *
                      </label>
                      <input
                        value={fees}
                        onChange={(e) => setFees(e.target.value)}
                        className="w-full px-3 py-3 sm:px-4 sm:py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm placeholder-gray-400 text-sm sm:text-base"
                        type="number"
                        placeholder="e.g., 500"
                        min="0"
                        step="1"
                        required
                      />
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4 sm:space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center">
                        <span className="mr-2">🏥</span> Medical Speciality *
                      </label>
                      <select
                        value={speciality}
                        onChange={(e) => setSpeciality(e.target.value)}
                        className="w-full px-3 py-3 sm:px-4 sm:py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm bg-white text-sm sm:text-base"
                      >
                        <option value="General Physician">General Physician</option>
                        <option value="Gynecologist">Gynecologist</option>
                        <option value="Dermatologist">Dermatologist</option>
                        <option value="Pediatrician">Pediatrician</option>
                        <option value="Neurologist">Neurologist</option>
                        <option value="Gastroenterologist">Gastroenterologist</option>
                        <option value="Cardiologist">Cardiologist</option>
                        <option value="Orthopedist">Orthopedist</option>
                        <option value="Psychiatrist">Psychiatrist</option>
                        <option value="Ophthalmologist">Ophthalmologist</option>
                        <option value="ENT Specialist">ENT Specialist</option>
                        <option value="Dentist">Dentist</option>
                        <option value="Nephrologist">Nephrologist</option>
                        <option value="Oncologist">Oncologist</option>
                        <option value="Endocrinologist">Endocrinologist</option>
                        <option value="Pulmonologist">Pulmonologist</option>
                        <option value="Rheumatologist">Rheumatologist</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center">
                        <span className="mr-2">🎓</span> Education/Degree *
                      </label>
                      <input
                        value={degree}
                        onChange={(e) => setDegree(e.target.value)}
                        className="w-full px-3 py-3 sm:px-4 sm:py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm placeholder-gray-400 text-sm sm:text-base"
                        type="text"
                        placeholder="e.g., MBBS, MD in Cardiology"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center">
                        <span className="mr-2">📍</span> Address Line 1 *
                      </label>
                      <input
                        value={address1}
                        onChange={(e) => setAddress1(e.target.value)}
                        className="w-full px-3 py-3 sm:px-4 sm:py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm placeholder-gray-400 text-sm sm:text-base"
                        type="text"
                        placeholder="Street address, city, state"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center">
                        <span className="mr-2">📍</span> Address Line 2
                      </label>
                      <input
                        value={address2}
                        onChange={(e) => setAddress2(e.target.value)}
                        className="w-full px-3 py-3 sm:px-4 sm:py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm placeholder-gray-400 text-sm sm:text-base"
                        type="text"
                        placeholder="Additional details, ZIP code"
                      />
                    </div>
                  </div>
                </div>

                {/* About Section */}
                {/* <div className="space-y-3 mb-6 sm:mb-10">
                  <label className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center">
                    <span className="mr-2">📝</span> About Doctor *
                  </label>
                  <textarea
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    className="w-full px-3 py-3 sm:px-4 sm:py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm resize-none placeholder-gray-400 text-sm sm:text-base"
                    placeholder="Write a brief biography highlighting the doctor's expertise, experience, and patient care philosophy..."
                    rows={6}
                    required
                  />
                  <p className="text-xs sm:text-sm text-gray-500 flex items-center">
                    <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                    Max 1000 characters. Be descriptive to attract more patients.
                  </p>
                </div> */}

                {/* About Section */}
                <div className="space-y-3 mb-6 sm:mb-10">
                  <div className="flex justify-between items-center">
                    <label className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center">
                      <span className="mr-2">📝</span> About Doctor *
                    </label>

                    <button
                      type="button"
                      onClick={generateAboutWithAI}
                      disabled={isGenerating}
                      className={`text-xs sm:text-sm px-3 py-2 rounded-lg font-medium transition
                        ${
                          isGenerating
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                        }
                      `}
                    >
                      {isGenerating ? "✨ Generating..." : "🤖 Generate with AI"}
                    </button>
                  </div>

                  <textarea
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    className="w-full px-3 py-3 sm:px-4 sm:py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm resize-none placeholder-gray-400 text-sm sm:text-base"
                    placeholder="AI can generate this automatically or you can write manually..."
                    rows={6}
                    required
                  />

                  <p className="text-xs sm:text-sm text-gray-500">
                    AI generates a 50–100 word professional doctor description. You can edit it anytime.
                  </p>
                </div>


                {/* Submit Button */}
                <div className="flex justify-center sm:justify-end pt-4 sm:pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full sm:w-auto px-8 sm:px-12 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-all shadow-lg text-white
                      ${
                        isSubmitting
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700"
                      }
                    `}
                  >
                    {isSubmitting ? "⏳ Adding Doctor..." : "🚀 Add Doctor to Platform"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDoctor;