"use client";
import { motion } from "framer-motion";
import { Maximize, Users, Shapes, Zap } from "lucide-react";

export const features = [
  {
    name: "Infinite Canvas",
    description: "Never run out of space. Pan and zoom infinitely to map out entire systems or tiny details.",
    icon: Maximize,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    rotation: "rotate-slight-left"
  },
  {
    name: "Any Shape Imaginable",
    description: "Draw perfect rectangles, messy circles, or custom polygons. It understands what you mean.",
    icon: Shapes,
    color: "text-primary",
    bg: "bg-primary/10",
    rotation: "rotate-slight-right"
  },
  {
    name: "Multiplayer Magic",
    description: "Share a link and draw together in real-time. See cursors fly around as you collaborate.",
    icon: Users,
    color: "text-green-500",
    bg: "bg-green-500/10",
    rotation: "rotate-slight-left"
  },
  {
    name: "Lightning Fast",
    description: "Built on modern web tech, it loads instantly and renders thousands of shapes without a hiccup.",
    icon: Zap,
    color: "text-accent",
    bg: "bg-accent/10",
    rotation: "rotate-slight-right"
  }
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-muted/30 border-y border-border/50 relative">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-sketch text-3xl md:text-5xl font-bold mb-4">It just works. Beautifully.</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We stripped away the clunky menus and complex toolbars. What's left is a pure, unadulterated drawing experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <motion.div
              key={feature.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={`p-8 bg-card rounded-2xl sketchy-border hover:shadow-xl transition-all duration-300 ${feature.rotation}`}
            >
              <div className={`h-14 w-14 rounded-xl ${feature.bg} ${feature.color} flex items-center justify-center mb-6 sketchy-border`}>
                <feature.icon className="h-7 w-7" strokeWidth={2} />
              </div>
              <h3 className="font-sketch text-2xl font-bold mb-3 text-foreground">{feature.name}</h3>
              <p className="text-muted-foreground leading-relaxed text-base">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
