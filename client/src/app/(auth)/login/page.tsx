import Link from "next/link";

export default function LoginPage() {
  return (
    <main
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: "linear-gradient(135deg, #14532d 0%, #166534 40%, #15803d 70%, #ca8a04 100%)",
      }}
    >
      <div className="glass rounded-3xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/">
            <span className="text-4xl cursor-pointer">🌉</span>
          </Link>
          <h1 className="text-white text-3xl font-black mt-2">Welcome Back</h1>
          <p className="text-green-200 text-sm mt-1">Login to your Daraja account</p>
        </div>

        <form className="space-y-4">
          <div>
            <label className="text-green-100 text-sm font-medium block mb-1">Email Address</label>
            <input
              type="email"
              placeholder="your@email.com"
              className="w-full bg-white bg-opacity-10 border border-white border-opacity-20 rounded-xl px-4 py-3 text-white placeholder-green-300 focus:outline-none focus:border-yellow-400 transition-all"
            />
          </div>
          <div>
            <label className="text-green-100 text-sm font-medium block mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full bg-white bg-opacity-10 border border-white border-opacity-20 rounded-xl px-4 py-3 text-white placeholder-green-300 focus:outline-none focus:border-yellow-400 transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-400 text-green-900 font-black py-4 rounded-xl text-lg hover:bg-yellow-300 hover:scale-105 transition-all mt-2"
          >
            Login 🚀
          </button>
        </form>

        <p className="text-center text-green-200 text-sm mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-yellow-400 font-bold hover:text-yellow-300">
            Register here
          </Link>
        </p>
      </div>
    </main>
  );
}
{