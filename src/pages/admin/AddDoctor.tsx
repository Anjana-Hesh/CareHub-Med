import { useContext, useState, type ChangeEvent, type FormEvent } from "react";
import { assets } from "../../assets/assets";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";
import { addDoctorService } from "../../services/admin";

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
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="m-5 w-full">
      <p className="mb-5 text-2xl font-semibold text-gray-800 tracking-wide">
        Add Doctor
      </p>

      <div className="bg-white px-10 py-10 border border-gray-200 rounded-2xl w-full max-w-4xl shadow-md hover:shadow-lg transition-all duration-300 max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
     
        <div className="flex items-center gap-5 mb-8 text-gray-600">
          <label
            htmlFor="doc-img"
            className="cursor-pointer hover:scale-105 transition-transform"
          >
            <img
              className="w-20 h-20 bg-gray-100 border-2 border-dashed border-gray-300 rounded-full object-cover"
              src={
                docImg
                  ? URL.createObjectURL(docImg)
                  : assets.upload_area
              }
              alt="Upload"
            />
          </label>

          <input
            type="file"
            id="doc-img"
            hidden
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              if (e.target.files && e.target.files[0]) {
                setDocImg(e.target.files[0]);
              }
            }}
          />

          <div>
            <p className="font-medium text-gray-800">Upload Doctor Picture</p>
            <p className="text-sm text-gray-500">
              Click the circle to select an image
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-12 text-gray-700">

          <div className="w-full lg:flex-1 flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <p>Doctor Name</p>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border rounded-lg px-3 py-2"
                type="text"
                placeholder="Name"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <p>Doctor Email</p>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border rounded-lg px-3 py-2"
                type="email"
                placeholder="Email"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <p>Doctor Password</p>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border rounded-lg px-3 py-2"
                type="password"
                placeholder="Password"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <p>Experience</p>
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="border rounded-lg px-3 py-2"
              >
                {Array.from({ length: 10 }, (_, i) => (
                  <option key={i + 1} value={`${i + 1} Year`}>
                    {i + 1} Year
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <p>Fees</p>
              <input
                value={fees}
                onChange={(e) => setFees(e.target.value)}
                className="border rounded-lg px-3 py-2"
                type="number"
                placeholder="Fees"
                required
              />
            </div>
          </div>

          <div className="w-full lg:flex-1 flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <p>Speciality</p>
              <select
                value={speciality}
                onChange={(e) => setSpeciality(e.target.value)}
                className="border rounded-lg px-3 py-2"
              >
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
              <input
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                className="border rounded-lg px-3 py-2"
                type="text"
                placeholder="Education"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <p>Address</p>
              <input
                value={address1}
                onChange={(e) => setAddress1(e.target.value)}
                className="border rounded-lg px-3 py-2"
                type="text"
                placeholder="Address 1"
                required
              />
              <input
                value={address2}
                onChange={(e) => setAddress2(e.target.value)}
                className="border rounded-lg px-3 py-2"
                type="text"
                placeholder="Address 2"
                required
              />
            </div>
          </div>
        </div>

        <div className="mt-6">
          <p className="mb-2 text-gray-800">About Doctor</p>
          <textarea
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg"
            placeholder="Write about doctor"
            rows={5}
            required
          ></textarea>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="bg-[#5F6FFF] px-10 py-3 text-white rounded-full font-medium"
          >
            Add Doctor
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddDoctor;
