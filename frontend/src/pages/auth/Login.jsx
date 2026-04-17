import { useNavigate, Link } from "react-router-dom";
import collegeLogo from "../../assets/images/college-logo.png";
import collegePic1 from "../../assets/images/pic1.jpg";

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

      console.log("LOGIN RESPONSE:", data);

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      // ✅ ALWAYS extract user safely
      const user = data.user;

      if (!user) {
        alert("User data not received");
        return;
      }

      console.log("ROLE:", user.role);

      // ✅ STORE
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("user_id", user.user_id);
      localStorage.setItem("role", user.role);
      localStorage.setItem("name", user.name);

      // ✅ NAVIGATE (VERY IMPORTANT FIX BELOW)
      if (user.role === "admin") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/student";
      }

    } catch (err) {
      console.log("FULL ERROR:", err);
      alert("Server not reachable");
    }
  };

  return (
    <div className="min-h-screen flex bg-white relative overflow-hidden">

      {/* LEFT PANEL - Professional Full Image Overlay */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 text-white overflow-hidden shadow-2xl z-10">
        
        {/* Background Image with Sleek Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={collegePic1} 
            alt="Campus Building" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-900/40 mix-blend-multiply" />
          <div className="absolute inset-0 bg-indigo-900/20" />
        </div>



        {/* Bottom: Clean Typography & Stats */}
        <div className="relative z-10 max-w-lg mb-8">
          <span className="inline-block py-1 px-3 rounded-full bg-white/10 border border-white/20 text-xs font-semibold tracking-wider text-indigo-100 mb-6 backdrop-blur-md">
            EMPOWERING CAREERS
          </span>
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight text-white">
            Launch Your Future <br />With Top Companies.
          </h1>
          <p className="text-slate-300 mb-10 text-lg leading-relaxed max-w-md">
            Join the official campus recruitment platform to track your applications, discover new opportunities, and connect directly with industry leaders.
          </p>
          
          {/* Minimalist Stats */}
          <div className="flex gap-10 border-t border-white/20 pt-8">
            <div>
              <p className="text-4xl font-black text-white mb-1 tracking-tight">500<span className="text-indigo-400">+</span></p>
              <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Students Placed</p>
            </div>
            <div>
              <p className="text-4xl font-black text-white mb-1 tracking-tight">100<span className="text-indigo-400">+</span></p>
              <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Recruiters</p>
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
            <div className="text-center mb-10">
              <div className="flex justify-center mb-6">
                <img 
                  src={collegeLogo} 
                  alt="Cummins College Logo" 
                  className="h-16 sm:h-20 w-auto object-contain" 
                />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">
                Welcome Back
              </h2>
              <p className="text-gray-500 text-sm mt-2">
                Login to your official placement account
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