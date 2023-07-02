import Image from "next/image";
import screenshot from "@/static/screenshot.png"
import problem from "@/static/problem.png"
import Link from "next/link";

export default function Home() {
  return <div className="px-4 md:px-8 md:py-4 flex flex-col gap-16">
    <div className="min-h-screen flex flex-col sm:flex-row items-center justify-center">
      <h1 className="text-4xl font-extrabold tracking-tight sm:mt-5 sm:text-6xl lg:mt-6 xl:text-6xl flex-1">
        <span className="block">Manage And Split Tasks</span>
        <span className="block pb-3 text-blue-500 sm:pb-5">With Absolute Freedom</span>
        <Link href="/login" className="text-4xl bg-black hover:bg-neutral-700 transition-colors mx-auto text-white font-bold py-2 px-4 rounded">
          Get Started
        </Link>
      </h1>
      <div className="flex flex-col items-center justify-center w-full flex-1">
        <Image src={screenshot} alt="TaskBUDDY" className="max-w-xl w-full object-contain object-left" />
      </div>
    </div>
    <div className="min-h-screen flex flex-col sm:flex-row-reverse items-center justify-center">
      <div className="flex flex-col flex-1">
        <h1 className="text-4xl font-extrabold tracking-tight sm:mt-5 sm:text-6xl lg:mt-6">
          The Problem
        </h1>
        <div className="flex flex-col gap-2 mt-4">
          <p> Your Team has a Task to do. </p>
          <p> You split the task among yourselves. </p>
          <p> You realise you want some part of the task from the other members to be completed to make progress on you part. </p>
          <p className="font-semibold">
            At This Point you wish for some mechanism to track the progress of the other team member.
          </p>
          <p>
            But because a simple solution didn't exist one member ends up taking up a significant part of the task for both of the team members.
          </p>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center w-full flex-1">
        <Image src={problem} alt="TaskBUDDY" className="max-w-xl w-full object-contain object-left" />
      </div>
    </div>
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-extrabold tracking-tight sm:mt-5 sm:text-6xl lg:mt-6">
        Created By
      </h1>
      <div className="flex flex-col gap-2 mt-4 items-center">
        <p className="text-xl text-blue-500"> <a href="https://www.linkedin.com/in/lohitaksha-malhotra-b84392201/">Lohitaksha Malhotra</a> </p>
        <p className="text-xl text-blue-500"> <a href="https://www.linkedin.com/in/ishan-pandey-15527717b/">Ishan Pandey</a> </p>
        <p className="text-xl text-blue-500"> <a href="https://www.linkedin.com/in/ankur-pandey07/">Ankur Pandey</a> </p>
      </div>
      <h3 className="text-2xl font-extrabold tracking-tight sm:mt-5 sm:text-4xl lg:mt-6">
        <span className="block">For a Hackathon</span>
        <span className="pb-3 text-blue-500 sm:pb-5">With ❤️  & ☕️</span>
        <span className="ml-2 text-blue-400 font-normal text-sm"><a href="https://unstop.com/p/silicon-valley-artificial-intelligence-hackathon-mercor-693462">Unstop Link</a></span>
      </h3>
    </div>
  </div>
}
