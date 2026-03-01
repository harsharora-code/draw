"use client";
import { Link } from "wouter";
import { Pencil } from "lucide-react";
import { Button } from "./button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground sketchy-border rotate-slight-left">
            <Pencil className="h-5 w-5" strokeWidth={2.5} />
          </div>
          <span className="font-sketch text-2xl font-bold tracking-tight">drawo</span>
        </Link>
        <nav className="flex items-center gap-6">
          <div className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#use-cases" className="hover:text-foreground transition-colors">Use Cases</a>
          </div>
          <Button 
            className="sketchy-border-primary font-bold hover:bg-primary/90 transition-transform hover:-translate-y-0.5"
            onClick={() => document.getElementById('waitlist-form')?.focus()}
          >
            Get Early Access
          </Button>
        </nav>
      </div>
    </header>
  );
}
