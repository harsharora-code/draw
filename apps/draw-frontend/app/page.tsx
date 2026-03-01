"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import  WaitlistForm from "../components/WaitlistForm";
import { Pencil } from "lucide-react";

export default function Home() {
  return (
    // <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
    //   <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
       <section className="relative overflow-hidden pt-24 pb-32 sm:pt-32 sm:pb-40 lg:pb-48">
      <div className="absolute top-20 left-10 hidden lg:block opacity-20 pointer-events-none">
        <svg width="120" height="120" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M10,50 Q30,10 50,50 T90,50" className="text-primary"/>
          <circle cx="20" cy="20" r="5" />
          <rect x="70" y="70" width="15" height="15" transform="rotate(15 70 70)" />
        </svg>
      </div>
      <div className="absolute bottom-20 right-10 hidden lg:block opacity-20 pointer-events-none">
        <svg width="150" height="150" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10,90 L50,10 L90,90 Z" strokeDasharray="5,5" className="text-accent" />
          <path d="M30,50 Q50,70 70,50" />
        </svg>
      </div>

      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl"
        >
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary mb-8 sketchy-border rotate-slight-left">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
            Private Beta Opening Soon
          </div>
          
          <h1 className="font-sketch text-5xl font-extrabold tracking-tight text-foreground sm:text-7xl mb-6">
            Draw anything. <br />
            <span className="text-primary relative inline-block">
              Understand everything.
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-accent" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0,5 Q50,10 100,5" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
              </svg>
            </span>
          </h1>
          
          <p className="mx-auto mt-6 max-w-2xl text-lg sm:text-xl text-muted-foreground leading-relaxed mb-10">
            A limitless digital canvas with a handcrafted feel. Outline complex engineering architectures, 
            wireframe your next app, or just brainstorm chaotic ideas—all in a tool that feels like a real whiteboard.
          </p>
          
          <WaitlistForm />
        </motion.div>

        {/* Mockup UI illustration */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mx-auto mt-20 max-w-5xl"
        >
          <div className="relative rounded-2xl bg-card p-2 shadow-2xl shadow-black/5 ring-1 ring-border/50 sketchy-border">
            <div className="absolute top-4 left-4 flex gap-2">
              <div className="h-3 w-3 rounded-full bg-destructive/80"></div>
              <div className="h-3 w-3 rounded-full bg-accent/80"></div>
              <div className="h-3 w-3 rounded-full bg-green-500/80"></div>
            </div>
            <div className="mt-8 aspect-[16/9] w-full rounded-xl bg-[#fafafa] border-2 border-dashed border-border flex items-center justify-center overflow-hidden relative">
              
              {/* Pseudo drawing elements inside the mockup */}
              <div className="absolute top-1/4 left-1/4 w-32 h-24 border-2 border-primary rounded-lg sketchy-border rotate-slight-left flex items-center justify-center bg-white shadow-sm">
                <span className="font-sketch font-bold text-primary">Database</span>
              </div>
              
              <div className="absolute top-1/4 right-1/4 w-32 h-24 border-2 border-blue-500 rounded-full sketchy-border rotate-slight-right flex items-center justify-center bg-white shadow-sm">
                <span className="font-sketch font-bold text-blue-500">API Server</span>
              </div>
              
              <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 w-40 h-16 border-2 border-accent rounded-sm sketchy-border flex items-center justify-center bg-white shadow-sm">
                <span className="font-sketch font-bold text-accent-foreground">Frontend App</span>
              </div>

              {/* Connecting sketchy lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                <path d="M 35% 30% C 45% 25%, 65% 25%, 75% 30%" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="5,5" className="text-muted-foreground" />
                <path d="M 35% 35% C 40% 50%, 45% 60%, 50% 66%" stroke="currentColor" strokeWidth="2" fill="none" className="text-muted-foreground" />
                <path d="M 75% 35% C 70% 50%, 65% 60%, 50% 66%" stroke="currentColor" strokeWidth="2" fill="none" className="text-muted-foreground" />
              </svg>

              <div className="absolute bottom-6 right-6">
                <div className="h-10 w-10 bg-primary text-white rounded-full flex items-center justify-center shadow-lg sketchy-border cursor-pointer">
                  <Pencil className="h-5 w-5" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
    //   </main>
    // </div>
  );
}
