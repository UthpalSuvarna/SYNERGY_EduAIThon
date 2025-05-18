"use client"
import Image from "next/image";
import { useSession } from "next-auth/react";
import { signIn, signOut } from "next-auth/react";
import HeroSection from "@/components/landing/hero";
import { HeroImage } from "@/components/landing/image";

function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="w-full flex justify-between items-center p-4 bg-gray-800 text-white">
      <div className="text-lg font-bold">LearningRoom.</div>
      <div>
        {session ? (
          <button
            onClick={() => signOut()}
            className="px-4 py-2 bg-red-500 rounded hover:bg-red-600"
          >
            Sign Out
          </button>
        ) : (
          <button
            onClick={() => signIn()}
            className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
          >
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
}

export default function Home() {
  const { data: session, status } = useSession();
  return (
    <>
      <Navbar />
      <HeroSection />
      <HeroImage />
    </>
  );
}