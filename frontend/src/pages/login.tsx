import { useAuth } from "@/context/authContext";
import { Label, Spinner, Tabs, TextInput } from "flowbite-react";
import { HiUserCircle, HiUserAdd } from "react-icons/hi"
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPen, faUser } from "@fortawesome/free-solid-svg-icons";

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
        router.push("/assigned");
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
      <div className="font-bold text-2xl">Logged In</div>
      <div className="text-neutral-800">Redirecting To Your Assigned Tasks</div>
      <Spinner />
    </div>
  }
  return (
    <div className="flex flex-col min-h-screen items-center justify-center px-2 sm:px-4">
      <div className="border border-neutral-200 rounded-lg p-4 w-full sm:w-96" ref={aniimRef}>
        {authError && <div className="bg-red-500 text-white rounded-lg p-2 m-2">{authError}</div>}
        <Tabs.Group aria-label="Login/Register Tabs" style="fullWidth">
          <Tabs.Item active title="Login" icon={HiUserCircle}>
            <form className="flex flex-col gap-4" onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}>
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <TextInput
                  type="email"
                  id="email"
                  addon={<FontAwesomeIcon icon={faEnvelope} />}
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
                <Label htmlFor="password">Password</Label>
                <TextInput
                  type="password"
                  id="password"
                  required
                  addon={<FontAwesomeIcon icon={faPen} />}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
              </div>
              <button
                className="bg-blue-500 text-white rounded-lg p-2 hover:bg-blue-600 transition-colors duration-200 disabled:bg-slate-500 disabled:hover:bg-slate-600"
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
                <Label htmlFor="name">Name</Label>
                <TextInput
                  type="text"
                  id="name"
                  addon={<FontAwesomeIcon icon={faUser} />}
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
                <Label htmlFor="email">Email</Label>
                <TextInput
                  type="email"
                  id="email"
                  addon={<FontAwesomeIcon icon={faEnvelope} />}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
                <Label htmlFor="password">Password</Label>
                <TextInput
                  type="password"
                  id="password"
                  addon={<FontAwesomeIcon icon={faPen} />}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
              </div>
              <button
                className="bg-blue-500 text-white rounded-lg p-2 hover:bg-blue-600 transition-colors duration-200 disabled:bg-slate-500 disabled:hover:bg-slate-600"
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

