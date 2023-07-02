import { useAuth } from "@/context/authContext";
import { Spinner, Tabs } from "flowbite-react";
import { HiUserCircle, HiUserAdd } from "react-icons/hi"
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAutoAnimate } from "@formkit/auto-animate/react";

export default function Login() {
  const { user, login, register, authLoading, authError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const router = useRouter();
  const [aniimRef, _] = useAutoAnimate()

  useEffect(() => {
    let t: NodeJS.Timeout;
    if (user) {
      t = setTimeout(() => {
        router.push("/");
      }, 500);
    }
    return () => {
      if (t) {
        clearTimeout(t);
      }
    };
  })

  const handleLogin = async () => {
    await login(email, password);
  }

  const handleRegister = async () => {
    await register(name, email, password);
  }

  if (user) {
    return <div className="min-h-[70vh] flex flex-col items-center justify-center">
      <div className="font-bold text-2xl">Logged in</div>
      <div className="text-neutral-800">Redirecting to Home Page</div>
      <Spinner />
    </div>
  }
  return (
    <div className="flex flex-col min-h-screen items-center justify-center">
      <div className="border border-neutral-200 rounded-lg p-4 w-full sm:w-96" ref={aniimRef}>
        {authError && <div className="bg-red-500 text-white rounded-lg p-2 m-2">{authError}</div>}
        <Tabs.Group aria-label="Login/Register Tabs" style="fullWidth">
          <Tabs.Item active title="Login" icon={HiUserCircle}>
            <form className="flex flex-col gap-4" onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}>
              <div className="flex flex-col gap-2">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  className="border border-neutral-200 rounded-lg p-2"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  className="border border-neutral-200 rounded-lg p-2"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
              </div>
              <button
                className="bg-blue-500 text-white rounded-lg p-2 hover:bg-blue-600 transition-colors duration-200 disabled:border-slate-500 disabled:hover:bg-slate-600"
                onClick={handleLogin}
                disabled={authLoading}
              >
                Login
                {authLoading && <Spinner className="ml-2" />}
              </button>
            </form>
          </Tabs.Item>
          <Tabs.Item title="Register" icon={HiUserAdd}>
            <form className="flex flex-col gap-4" onSubmit={(e) => {
              e.preventDefault();
              handleRegister();
            }}>
              <div className="flex flex-col gap-2">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  className="border border-neutral-200 rounded-lg p-2"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  className="border border-neutral-200 rounded-lg p-2"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  className="border border-neutral-200 rounded-lg p-2"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
              </div>
              <button
                className="bg-blue-500 text-white rounded-lg p-2 hover:bg-blue-600 transition-colors duration-200 disabled:border-slate-500 disabled:hover:bg-slate-600"
                onClick={handleRegister}
                disabled={authLoading}
              >
                Register
                {authLoading && <Spinner className="ml-2" />}
              </button>
            </form>
          </Tabs.Item>
        </Tabs.Group>
      </div>
    </div>
  )
}

