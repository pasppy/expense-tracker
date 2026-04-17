"use client"
import Navbar from "@/components/navbar";
import { Spinner } from "@/components/ui/spinner";
import { Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [isPaused, setIsPaused] = useState(true);
  const videoRef = useRef();
  useEffect(() => {
    if (!isPaused)
      videoRef.current.play();
    else
      videoRef.current.pause();
  }, [isPaused]);

  return <div className="px-4 sm:px-8 md:px-12">
    <Navbar />
    <main>
      <div>
        <h1 className="font-bold leading-[9vw] text-[10vw] md:text-[9vw] pt-52 lg:pt-24 text-center">Track your <span className="text-vibe">money </span><br />like never before.</h1>

        {/* video */}
        <div className="relative mt-16  p-1 bg-vibe-foreground max-w-5xl mx-auto rounded-xl overflow-hidden">
          <div onClick={() => setIsPaused(prev => !prev)} className={`${isPaused ? "opacity-100" : "opacity-0"} absolute bg-black/30 inset-0`}>
            <div className="absolute bg-black p-4 inset-0 place-self-center rounded-full text-white">
              <Play />
            </div>
          </div>
          <video ref={videoRef} className="object-cover aspect-square md:aspect-auto rounded-xl" src="/app-demo.webm"></video>
        </div>
      </div>
    </main>

    <footer className="mt-8 flex justify-between py-4 border-t border-foreground">
      <p>Made by Nayedul Alam</p>
      {/* links */}
      <div className=" space-x-4">
        <a href="https://github.com/pasppy" target="_blank" className="hover:underline">Github</a>
        <a href="https://www.linkedin.com/in/nayedul-alam-26b4a6205/" target="_blank" className="hover:underline">Linkedin</a>
      </div>
    </footer>
  </div>
}