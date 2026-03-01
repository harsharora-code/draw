"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, GraduationCap, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

const useCases = [
  {
    id: "engineering",
    label: "Engineering",
    icon: Code2,
    title: "System Architecture & Flow",
    description: "Ditch the rigid diagramming tools. Quickly sketch out database schemas, microservice architectures, and state machines with your team before writing a single line of code.",
    mockupContent: (
      <div className="w-full h-full flex items-center justify-center relative p-8">
        <div className="w-32 h-20 border-2 border-primary rounded-md absolute top-8 left-12 flex items-center justify-center sketchy-border bg-white shadow-sm">
           <span className="font-sketch font-bold text-primary">Client</span>
        </div>
        <div className="w-32 h-20 border-2 border-accent rounded-md absolute top-8 right-12 flex items-center justify-center sketchy-border bg-white shadow-sm">
           <span className="font-sketch font-bold text-accent-foreground">Auth API</span>
        </div>
        <div className="w-40 h-24 border-2 border-blue-500 rounded-md absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center justify-center sketchy-border bg-white shadow-sm">
           <span className="font-sketch font-bold text-blue-500">Main DB</span>
        </div>
        
        {/* Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
          <path d="M 25% 25% C 40% 25%, 60% 25%, 75% 25%" stroke="hsl(var(--foreground))" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />
          <path d="M 25% 30% C 30% 50%, 40% 70%, 50% 70%" stroke="hsl(var(--foreground))" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />
          <path d="M 75% 30% C 70% 50%, 60% 70%, 50% 70%" stroke="hsl(var(--foreground))" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />
        </svg>
      </div>
    )
  },
  {
    id: "education",
    label: "Education",
    icon: GraduationCap,
    title: "Concept Mapping & Tutoring",
    description: "Explain complex concepts visually. Teachers and students use the infinite canvas to break down math problems, map historical events, or brainstorm essays.",
    mockupContent: (
      <div className="w-full h-full flex items-center justify-center relative p-8">
        <div className="w-48 h-16 border-2 border-green-500 rounded-full absolute top-12 left-1/2 -translate-x-1/2 flex items-center justify-center sketchy-border bg-white shadow-sm">
           <span className="font-sketch font-bold text-green-600 text-lg">Photosynthesis</span>
        </div>
        <div className="w-32 h-16 border-2 border-blue-400 rounded-full absolute bottom-16 left-12 flex items-center justify-center sketchy-border bg-white shadow-sm">
           <span className="font-sketch font-bold text-blue-500">Water</span>
        </div>
        <div className="w-32 h-16 border-2 border-yellow-500 rounded-full absolute bottom-16 right-12 flex items-center justify-center sketchy-border bg-white shadow-sm">
           <span className="font-sketch font-bold text-yellow-600">Sunlight</span>
        </div>
        <div className="w-32 h-16 border-2 border-gray-400 rounded-full absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center justify-center sketchy-border bg-white shadow-sm">
           <span className="font-sketch font-bold text-gray-600">CO2</span>
        </div>
        
        {/* Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
          <path d="M 25% 65% C 35% 50%, 45% 40%, 50% 30%" stroke="hsl(var(--foreground))" strokeWidth="2" fill="none" strokeDasharray="4,4" />
          <path d="M 75% 65% C 65% 50%, 55% 40%, 50% 30%" stroke="hsl(var(--foreground))" strokeWidth="2" fill="none" strokeDasharray="4,4" />
          <path d="M 50% 75% L 50% 30%" stroke="hsl(var(--foreground))" strokeWidth="2" fill="none" strokeDasharray="4,4" />
        </svg>
      </div>
    )
  },
  {
    id: "business",
    label: "Business",
    icon: Briefcase,
    title: "Process Flows & Strategy",
    description: "Map out customer journeys, marketing funnels, and organizational charts that people actually want to look at. Say goodbye to rigid, boring corporate diagrams.",
    mockupContent: (
      <div className="w-full h-full flex items-center justify-center relative p-8">
        <div className="w-24 h-24 border-2 border-primary rotate-45 absolute left-12 flex items-center justify-center bg-white shadow-sm sketchy-border">
           <span className="-rotate-45 font-sketch font-bold text-primary text-sm text-center leading-tight">Start<br/>Here</span>
        </div>
        <div className="w-36 h-16 border-2 border-foreground absolute left-1/2 -translate-x-1/2 flex items-center justify-center bg-white shadow-sm sketchy-border">
           <span className="font-sketch font-bold text-foreground">User Signs Up</span>
        </div>
        <div className="w-24 h-24 border-2 border-accent rounded-full absolute right-12 flex items-center justify-center bg-white shadow-sm sketchy-border">
           <span className="font-sketch font-bold text-accent-foreground">Profit!</span>
        </div>
        
        {/* Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
          <path d="M 28% 50% L 38% 50%" stroke="hsl(var(--foreground))" strokeWidth="3" fill="none" markerEnd="url(#arrowhead)" />
          <path d="M 62% 50% L 75% 50%" stroke="hsl(var(--foreground))" strokeWidth="3" fill="none" markerEnd="url(#arrowhead)" />
        </svg>
      </div>
    )
  }
];

export function UseCases() {
  const [activeTab, setActiveTab] = useState(useCases[0].id);
  const activeData = useCases.find(uc => uc.id === activeTab) || useCases[0];

  return (
    <section id="use-cases" className="py-24 overflow-hidden">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-sketch text-3xl md:text-5xl font-bold mb-4">Built for every mind.</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Whether you're debugging code or teaching history, visual communication transcends boundaries.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Tabs Sidebar */}
          <div className="w-full lg:w-1/3 flex flex-row lg:flex-col gap-4 overflow-x-auto pb-4 lg:pb-0 hide-scrollbar">
            {useCases.map((uc) => (
              <button
                key={uc.id}
                onClick={() => setActiveTab(uc.id)}
                className={cn(
                  "flex items-center gap-4 px-6 py-4 rounded-xl text-left whitespace-nowrap transition-all duration-200 sketchy-border min-w-fit lg:min-w-0",
                  activeTab === uc.id 
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 rotate-slight-right border-primary" 
                    : "bg-card hover:bg-muted text-foreground border-border/50"
                )}
              >
                <uc.icon className={cn("h-6 w-6", activeTab === uc.id ? "text-primary-foreground" : "text-muted-foreground")} />
                <span className="font-sketch text-xl font-bold">{uc.label}</span>
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="w-full lg:w-2/3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-card rounded-3xl p-6 md:p-10 border border-border/50 shadow-xl sketchy-border rotate-slight-left"
              >
                <h3 className="font-sketch text-3xl font-bold mb-4 text-foreground">{activeData.title}</h3>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  {activeData.description}
                </p>
                
                <div className="aspect-[16/9] w-full rounded-2xl bg-[#fafafa] border-2 border-dashed border-border overflow-hidden relative">
                   {/* Define Arrowhead marker for SVGs globally inside this block for simplicity */}
                  <svg width="0" height="0" className="absolute">
                    <defs>
                      <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--foreground))" />
                      </marker>
                    </defs>
                  </svg>
                  {activeData.mockupContent}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
