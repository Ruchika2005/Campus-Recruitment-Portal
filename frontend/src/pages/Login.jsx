import { useNavigate, Link } from "react-router-dom";
import { GraduationCap, Award, TrendingUp, Users, Briefcase } from "lucide-react";
import loginHero from "../assets/images/login-hero.jpg";

function Login() {
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      const user = data.user;

      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/student", {
          state: {
            user_id: user.user_id,
            name: user.name,
            email: user.email,
          },
        });
      }
    } catch {
      alert("Server not reachable");
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f6f7fb] relative overflow-hidden">

      {/* Background soft blobs */}
      <div className="absolute top-[-120px] left-[-120px] w-[300px] h-[300px] bg-indigo-200 rounded-full blur-3xl opacity-20" />
      <div className="absolute bottom-[-120px] right-[-120px] w-[350px] h-[350px] bg-blue-200 rounded-full blur-3xl opacity-20" />

      {/* LEFT PANEL */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden h-screen items-center justify-center bg-[#eaf0ff]">

        <div className="absolute inset-0 bg-black/5" />

        <div className="relative z-10 flex flex-col items-center justify-center text-center px-10 py-6 h-full">

          {/* Logo */}
          <div className="mb-4">
            <div className="w-16 h-16 flex items-center justify-center bg-white/30 backdrop-blur rounded-2xl shadow-md">
              <GraduationCap size={30} className="text-gray-700" />
            </div>
          </div>

          {/* IMAGE */}
          <div className="relative mb-5">
            <div className="w-56 h-56 rounded-3xl overflow-hidden shadow-xl border border-white/30">
              <img
                src={loginHero}
                alt="Students celebrating success"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Award badge */}
            <div className="absolute -top-3 -right-3 w-12 h-12 bg-amber-400 rounded-full flex items-center justify-center shadow-md animate-bounce">
              <Award size={20} className="text-amber-900" />
            </div>
          </div>

          {/* TEXT */}
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Start Your Career Journey
          </h2>

          <p className="text-gray-600 text-sm max-w-xs mb-6">
            Connect with top companies and unlock amazing opportunities
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

      {/* RIGHT PANEL */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 h-screen overflow-hidden">

        <div className="w-full max-w-md">

          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-10 relative">

            {/* accent line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-500 rounded-t-3xl" />

            {/* HEADER */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-800">
                Welcome Back
              </h2>
              <p className="text-gray-500 text-sm mt-2">
                Login to your account
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">

              {/* EMAIL */}
              <div>
                <label className="text-sm text-gray-600 mb-2 block">
                  Email Address
                </label>
                <input
                  name="email"
                  placeholder="Enter your email"
                  className="w-full p-3.5 rounded-xl bg-gray-50 border border-gray-200
                  focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:bg-white
                  transition-all"
                  required
                />
              </div>

              {/* PASSWORD */}
              <div>
                <label className="text-sm text-gray-600 mb-2 block">
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  className="w-full p-3.5 rounded-xl bg-gray-50 border border-gray-200
                  focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:bg-white
                  transition-all"
                  required
                />
              </div>

              {/* OPTIONS */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-gray-600">
                  <input type="checkbox" className="accent-indigo-600" />
                  Remember me
                </label>

                <a href="#" className="text-indigo-500 hover:underline">
                  Forgot password?
                </a>
              </div>

              {/* BUTTON */}
              <button
                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3.5 rounded-xl transition shadow-md"
              >
                Login
              </button>

            </form>

            {/* FOOTER */}
            <p className="text-center mt-6 text-sm text-gray-500">
              New user?{" "}
              <Link to="/register" className="text-indigo-500 font-medium">
                Create account
              </Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;