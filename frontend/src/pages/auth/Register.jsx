import { useNavigate, Link } from "react-router-dom";
import { Rocket, Users, Briefcase, TrendingUp } from "lucide-react";
import loginHero from "../../assets/images/register-hero.jpg";

function Register() {
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Registration failed");
      return;
    }

    // after successful register
localStorage.setItem("temp_user_id", data.user_id);

navigate("/complete-profile");
  };

  return (
    <div className="min-h-screen flex bg-[#f6f7fb] relative overflow-hidden">

      {/* BACKGROUND BLURS */}
      <div className="absolute top-[-120px] left-[-120px] w-[300px] h-[300px] bg-indigo-200 rounded-full blur-3xl opacity-20" />
      <div className="absolute bottom-[-120px] right-[-120px] w-[350px] h-[350px] bg-blue-200 rounded-full blur-3xl opacity-20" />

      {/* LEFT PANEL (NOW SAME AS LOGIN) */}
      <div className="hidden lg:flex lg:w-1/2 relative h-screen items-center justify-center bg-[#eaf0ff] overflow-hidden">

        <div className="absolute inset-0 bg-black/5" />

        <div className="relative z-10 flex flex-col items-center justify-center text-center px-10 py-6 h-full">

          {/* ICON */}
          <div className="mb-4">
            <div className="w-16 h-16 flex items-center justify-center bg-white/30 rounded-2xl shadow-md backdrop-blur">
              <Rocket size={28} className="text-gray-700" />
            </div>
          </div>

          {/* IMAGE */}
          <div className="relative mb-5">
            <div className="w-56 h-56 rounded-3xl overflow-hidden shadow-xl border border-white/30">
              <img
                src={loginHero}
                alt="Register Hero"
                className="w-full h-full object-cover"
              />
            </div>

            {/* floating badge */}
            <div className="absolute -top-3 -right-3 w-12 h-12 bg-amber-400 rounded-full flex items-center justify-center shadow-md animate-bounce">
              <TrendingUp size={20} className="text-amber-900" />
            </div>
          </div>

          {/* TEXT */}
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Start Your Journey
          </h2>

          <p className="text-gray-600 text-sm max-w-xs mb-6">
            Build your career with top companies and unlock opportunities
          </p>

          {/* STATS */}
          <div className="grid grid-cols-3 gap-4 w-full max-w-sm">

            <div className="text-center">
              <div className="w-10 h-10 bg-white/30 rounded-lg flex items-center justify-center mx-auto mb-1">
                <Users size={18} className="text-gray-700" />
              </div>
              <p className="text-xs text-gray-600">500+ Students</p>
            </div>

            <div className="text-center">
              <div className="w-10 h-10 bg-white/30 rounded-lg flex items-center justify-center mx-auto mb-1">
                <Briefcase size={18} className="text-gray-700" />
              </div>
              <p className="text-xs text-gray-600">100+ Companies</p>
            </div>

            <div className="text-center">
              <div className="w-10 h-10 bg-white/30 rounded-lg flex items-center justify-center mx-auto mb-1">
                <TrendingUp size={18} className="text-gray-700" />
              </div>
              <p className="text-xs text-gray-600">85% Placed</p>
            </div>

          </div>

        </div>
      </div>

      {/* RIGHT PANEL (UNCHANGED STYLE BUT CLEANED) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 h-screen overflow-hidden">

        <div className="w-full max-w-md">

          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-10 relative">

            <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-500 rounded-t-3xl" />

            {/* HEADER */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-800">
                Create Account
              </h2>
              <p className="text-gray-500 text-sm mt-2">
                It’s quick and easy
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-5">

              <input
                name="name"
                placeholder="Full name"
                className="w-full p-3.5 rounded-xl bg-gray-50 border border-gray-200
                focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:bg-white"
                required
              />

              <input
                name="email"
                placeholder="Email"
                className="w-full p-3.5 rounded-xl bg-gray-50 border border-gray-200
                focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:bg-white"
                required
              />

              <input
                name="password"
                type="password"
                placeholder="Password"
                className="w-full p-3.5 rounded-xl bg-gray-50 border border-gray-200
                focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:bg-white"
                required
              />

              <button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3.5 rounded-xl transition shadow-md">
                Create Account
              </button>

            </form>

            {/* FOOTER */}
            <p className="text-center mt-6 text-sm text-gray-500">
              Already have account?{" "}
              <Link to="/" className="text-indigo-500 font-medium">
                Login
              </Link>
            </p>

          </div>
        </div>
      </div>

    </div>
  );
}

export default Register;