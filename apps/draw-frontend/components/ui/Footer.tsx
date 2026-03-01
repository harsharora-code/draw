import { Pencil } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-muted/30 py-12 mt-20">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground sketchy-border opacity-80">
            <Pencil className="h-4 w-4" strokeWidth={2.5} />
          </div>
          <span className="font-sketch text-xl font-bold tracking-tight text-foreground/80">drawo</span>
        </div>
        
        <p className="text-sm text-muted-foreground text-center md:text-left">
          © {new Date().getFullYear()} drawo Inc. Made with messy lines and lots of love.
        </p>
        
        <div className="flex gap-4 text-sm text-muted-foreground">
          <a href="#" className="hover:text-foreground transition-colors">Twitter</a>
          <a href="#" className="hover:text-foreground transition-colors">GitHub</a>
          <a href="#" className="hover:text-foreground transition-colors">Discord</a>
        </div>
      </div>
    </footer>
  );
}
