// import Footer from './Footer'
import Link from "next/link";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/authContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faBarsStaggered,
  faBars,
  faPaperclip,
  faRightFromBracket,
  faUsers,
  faPenToSquare,
  faNewspaper,
  faSearch,
  faPen,
  faCheck,
  faTimeline,
  faList,
} from "@fortawesome/free-solid-svg-icons";

export default function PageContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, login, logout } = useAuth();
  const [pageAnimRef, _] = useAutoAnimate();
  const [sidebarAnim, __] = useAutoAnimate();

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
                <p className="font-bold">TaskBuddy</p>
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
        className="flex flex-row flex-1 w-screen overflow-x-hidden"
        ref={sidebarAnim}
      >
        {sidebarOpen && (
          <Sidebar
            closeFunction={() => {
              setSidebarOpen(false);
            }}
          />
        )}
        <div className="flex flex-col overflow-y-auto flex-1 pt-4 transition-all shadow-inner-md">
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
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  closeFunction: () => void;
}) => {
  const mainItem = (
    <div
      onClick={() => {
        if (onClick) {
          onClick();
        }
        closeFunction();
      }}
      className="border-y border-gray-200 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-sm px-2 py-4 cursor-pointer transition-colors w-full flex items-center pl-12 sm:pl-[40vw] justify-start md:pl-12 gap-4"
    >
      {children}
    </div>
  );

  if (href) return <Link href={href}>{mainItem}</Link>;
  else return <>{mainItem}</>;
};
