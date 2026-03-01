import WaitlistForm  from "../WaitlistForm";

export function CTA() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/5"></div>
      
      {/* Playful background blobs */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-[30rem] h-[30rem] bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-[30rem] h-[30rem] bg-accent/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="p-8 md:p-16 bg-card rounded-[3rem] sketchy-border shadow-2xl rotate-slight-right border-4 border-foreground">
          <h2 className="font-sketch text-4xl md:text-6xl font-bold mb-6 text-foreground">
            Ready to draw outside the lines?
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Join thousands of teams who have already traded their complex diagramming tools for a simpler, more expressive canvas.
          </p>
          
          <div className="rotate-slight-left bg-background p-4 rounded-xl sketchy-border inline-block w-full max-w-xl shadow-inner">
            <WaitlistForm />
          </div>
        </div>
      </div>
    </section>
  );
}
