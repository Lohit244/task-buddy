import Link from "next/link";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useState } from "react";
import { useAuth } from "@/context/authContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faBarsStaggered,
  faBars,
  faPenToSquare,
  faSearch,
  faCheck,
  faList,
  faHome,
} from "@fortawesome/free-solid-svg-icons";

export default function PageContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, login, logout } = useAuth();
  const [pageAnimRef, _] = useAutoAnimate();
  const [sidebarAnim, __] = useAutoAnimate((el, action, oldCoords, newCoords) => {
    let keyframes;
    if (action === 'add') {
      keyframes = [
        { transform: 'translateX(-30rem)', opacity: 0 },
        { transform: 'translateX(0px)', opacity: 1 }
      ]
    }
    if (action === 'remove') {
      keyframes = [
        { transform: 'translateX(0px)', opacity: 1 },
        { transform: 'translateX(-30rem)', opacity: 0 },
      ]
    }
    if (action === 'remain') {
      const deltaX = oldCoords!.left - newCoords!.left
      const deltaY = oldCoords!.top - newCoords!.top
      const start = { transform: `translate(${deltaX > 0 ? deltaX : 0}px, ${deltaY > 0 ? deltaY : 0}px)` }
      const end = { transform: `translate(0, 0)` }
      keyframes = [start, end]
    }
    return new KeyframeEffect(el, keyframes as any, { duration: 250, easing: 'ease-out' });
  })

  return (
    <div className="flex flex-col h-screen w-screen">
      <header className="py-2 px-4 border-slate-200 border">
        <div className="flex w-full items-center justify-center bg-white text-black font-bold py-2">
          <ul className="px-2 sm:px-4 flex items-center gap-4 w-full">
            <li
              className="block relative cursor-pointer"
              onClick={() => {
                setSidebarOpen(!sidebarOpen);
              }}
            >
              {sidebarOpen ? (
                <FontAwesomeIcon icon={faBarsStaggered} />
              ) : (
                <FontAwesomeIcon icon={faBars} />
              )}
            </li>
            <li className="flex flex-row w-full items-center justify-around">
              <Link href="/">
                <p className="font-bold hidden sm:block">TaskBuddy</p>
              </Link>
              <div className="flex-1 hidden sm:block" />
            </li>
            <div className="flex-1" />
            {user ? (
              <Link href="/assigned">{user.name}</Link>
            ) : (
              <Link href="/login">
                <p className="font-bold">Login</p>
              </Link>
            )}
          </ul>
        </div>
      </header>
      <div
        className="flex flex-row flex-1 ml-auto w-screen overflow-x-hidden"
        ref={sidebarAnim}
      >
        {sidebarOpen && (
          <Sidebar
            closeFunction={() => {
              setSidebarOpen(false);
            }}
          />
        )}
        <div className={`flex flex-col overflow-y-auto flex-1 pt-4 transition-all shadow-inner-md ml-auto `}>
          <div className="flex-1 h-max">
            <div className="min-h-screen" ref={pageAnimRef}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const Sidebar = ({ closeFunction }: { closeFunction: () => void }) => {
  const { user, logout } = useAuth();
  return (
    <div className="flex flex-col border w-full md:w-64 overflow-y-auto">
      <SidebarItem closeFunction={closeFunction} href="/" className="font-bold md:hidden">
        <FontAwesomeIcon icon={faHome} />
        Home
      </SidebarItem>
      <SidebarItem closeFunction={closeFunction} href="/new">
        <FontAwesomeIcon icon={faPenToSquare} />
        New Task
      </SidebarItem>
      <SidebarItem closeFunction={closeFunction} href="/assigned">
        <FontAwesomeIcon icon={faCheck} />
        Assigned Tasks
      </SidebarItem>
      <SidebarItem closeFunction={closeFunction} href="/created">
        <FontAwesomeIcon icon={faList} />
        Created Tasks
      </SidebarItem>
      <SidebarItem href="/search" closeFunction={closeFunction}>
        <FontAwesomeIcon icon={faSearch} />
        Search Users
      </SidebarItem>
      <div className="flex-1" />
      {user && (
        <SidebarItem
          closeFunction={closeFunction}
          onClick={() => {
            logout();
          }}
        >
          <FontAwesomeIcon icon={faUser} className="text-red-500" />
          <p className="text-red-500">Logout</p>
        </SidebarItem>
      )}
    </div>
  );
};

const SidebarItem = ({
  children,
  href,
  onClick,
  closeFunction,
  className,
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  closeFunction: () => void;
  className?: string;
}) => {
  const mainItem = (
    <div
      onClick={() => {
        if (onClick) {
          onClick();
        }
        closeFunction();
      }}
      className={"border-y border-gray-200 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-sm px-2 py-4 cursor-pointer transition-colors w-full flex items-center pl-12 sm:pl-[40vw] justify-start md:pl-12 gap-4 " + className}
    >
      {children}
    </div>
  );

  if (href) return <Link href={href}>{mainItem}</Link>;
  else return <>{mainItem}</>;
};
