import { motion } from "framer-motion";
import { SparklesIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import AnimationContainer from "@/components/ui/animation-container";
import MaxWidthWrapper from "@/components/ui/max-width-container";
import { BentoCard, BentoGrid, CARDS } from "@/components/ui/bento-grid";
import MagicBadge from "@/components/ui/magic-badge";
import Footer from "@/components/landing-page/Footer";
import NavBar from "@/components/landing-page/NavBar";
import { SignInForm } from "@/components/signin/SignInForm";
import { Card } from "@/components/ui/card";

const DoodleSparkle = ({ className }: { className?: string }) => (
  <motion.svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn("w-8 h-8 text-primary/30", className)}
    animate={{ 
      rotate: [0, 15, -15, 0],
      scale: [1, 1.1, 0.9, 1]
    }}
    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
  >
    <path d="M12 3V6M12 18V21M6 12H3M21 12H18M18.364 5.63604L16.2426 7.75736M7.75736 16.2426L5.63604 18.364M18.364 18.364L16.2426 16.2426M7.75736 7.75736L5.63604 5.63604" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </motion.svg>
);

const DoodleHeart = ({ className }: { className?: string }) => (
  <motion.svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn("w-10 h-10 text-rose-400/30", className)}
    animate={{ 
      y: [0, -5, 0],
      rotate: [-5, 5, -5]
    }}
    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
  >
    <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </motion.svg>
);

const DoodleLoop = ({ className }: { className?: string }) => (
  <motion.svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn("w-20 h-20 text-blue-400/20", className)}
    animate={{ 
      rotate: [0, 360]
    }}
    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
  >
    <path d="M20 50C20 33.4315 33.4315 20 50 20C66.5685 20 80 33.4315 80 50C80 66.5685 66.5685 80 50 80C33.4315 80 20 66.5685 20 50Z" stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" strokeLinecap="round"/>
  </motion.svg>
);

const EntryCard = ({ 
  children, 
  rotation, 
  x, 
  y, 
  delay = 0,
  className 
}: { 
  children: React.ReactNode; 
  rotation: number; 
  x: string; 
  y: string; 
  delay?: number;
  className?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8, rotate: rotation, x, y }}
    animate={{ 
      opacity: 1, 
      scale: 1, 
      rotate: rotation,
      y
    }}
    transition={{ 
      duration: 0.5, 
      delay,
      ease: "easeOut"
    }}
    className={cn(
      "absolute hidden md:flex flex-col p-6 bg-linear-to-br from-card to-card/95 border border-primary/5 shadow-sm rounded-2xl w-56 z-0 pointer-events-none",
      className
    )}
  >
    {children}
  </motion.div>
);

const JournalCard = () => {
  return (
    <div className="relative w-full max-w-4xl min-h-[600px] flex items-center justify-center mt-12">
      {/* Hand-drawn doodles */}
      <DoodleSparkle className="absolute top-0 left-[20%] -rotate-12 opacity-20" />
      <DoodleHeart className="absolute bottom-10 left-[15%] rotate-12 opacity-20" />
      <DoodleLoop className="absolute top-[10%] right-[15%] opacity-20" />
      <DoodleSparkle className="absolute bottom-[20%] right-[20%] scale-150 text-yellow-400/20 rotate-45" />

      {/* Scattered entries */}
      <EntryCard rotation={-12} x="-220px" y="-150px" delay={0.4} className="shadow-2xl border-none">
        <span className="text-[10px] text-muted-foreground mb-2 font-bold uppercase tracking-widest opacity-50">Oct 12, 2023</span>
        <p className="text-sm font-heading leading-relaxed text-foreground/80 font-medium">Finally started the new project. Feeling nervous but excited! 🚀</p>
      </EntryCard>

      <EntryCard rotation={8} x="240px" y="-120px" delay={0.6} className="shadow-2xl border-none">
        <span className="text-[10px] text-muted-foreground mb-2 font-bold uppercase tracking-widest opacity-50">Nov 04, 2023</span>
        <p className="text-sm font-heading leading-relaxed text-foreground/80 font-medium">The weather was perfect today. Had the best coffee by the lake. ☕️</p>
      </EntryCard>

      <EntryCard rotation={-5} x="260px" y="140px" delay={0.8} className="shadow-2xl border-none">
        <span className="text-[10px] text-muted-foreground mb-2 font-bold uppercase tracking-widest opacity-50">Dec 21, 2023</span>
        <p className="text-sm font-heading leading-relaxed text-foreground/80 font-medium">Reflecting on this year. So much has changed. Grateful for the small wins.</p>
      </EntryCard>

      <EntryCard rotation={15} x="-240px" y="120px" delay={1.0} className="shadow-2xl border-none">
        <span className="text-[10px] text-muted-foreground mb-2 font-bold uppercase tracking-widest opacity-50">Jan 02, 2024</span>
        <p className="text-sm font-heading leading-relaxed text-foreground/80 font-medium">New Year's resolutions: 1. Write more. 2. Breathe deeper. ✨</p>
      </EntryCard>

      {/* Main Login Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md z-10"
      >
        <Card className="relative overflow-hidden border-none bg-linear-to-br from-card via-card to-card/95 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.15)] rounded-[2.5rem]">
          <div className="p-10">
            <div className="flex flex-col items-center text-center mb-8">
              <h2 className="text-4xl font-heading mb-2 text-primary">Dasi Journal</h2>
              <p className="text-muted-foreground font-medium">Your private sanctuary.</p>
            </div>
            <SignInForm className="max-w-none" />
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

const PromptCard = ({ 
  text, 
  borderColor, 
  rotation, 
  delay 
}: { 
  text: string; 
  borderColor: string; 
  rotation: number; 
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20, rotate: rotation }}
    whileInView={{ opacity: 1, y: 0, rotate: rotation }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    whileHover={{ 
      rotate: rotation,
      scale: 1.02,
      transition: { type: "spring", stiffness: 400, damping: 10 }
    }}
    className={cn(
      "relative w-full p-10 flex items-center justify-center text-center cursor-default group",
      "bg-linear-to-br from-card to-card shadow-2xl border-none",
      borderColor.replace('border-', 'bg-').replace('200', '50/20')
    )}
  >
    <p className="font-heading text-2xl text-foreground/80 leading-relaxed px-4">
      {text}
    </p>

    <div className="absolute top-4 left-1/2 -translate-x-1/2 opacity-10 group-hover:opacity-40 transition-opacity">
      <SparklesIcon className="size-5" />
    </div>
  </motion.div>
);

const PromptsSection = () => {
  const prompts = [
    { text: "What made you smile today?", borderColor: "border-yellow-200", rotation: -2 },
    { text: "Write about a song that feels like home.", borderColor: "border-rose-200", rotation: 1 },
    { text: "If today were a flavor, what would it be?", borderColor: "border-blue-200", rotation: -1 },
    { text: "Describe a dream you never want to forget.", borderColor: "border-emerald-200", rotation: 2 },
  ];

  return (
    <MaxWidthWrapper className="py-32">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="col-span-full mb-12 text-center md:text-left">
          <MagicBadge title="Inspiration" />
          <h2 className="text-5xl md:text-7xl font-heading mt-6">Never a blank page.</h2>
          <p className="text-xl text-muted-foreground mt-4 max-w-xl font-medium">
            Daily prompts to spark your reflection and keep the ink flowing.
          </p>
        </div>
        {prompts.map((p, i) => (
          <PromptCard key={i} {...p} delay={i * 0.1} />
        ))}
      </div>
    </MaxWidthWrapper>
  );
};

const MarkerStroke = ({ 
  className, 
  color = "text-primary/10", 
  delay = 0, 
  width = 100, 
  height = 20,
  strokeWidth = 12,
  path = "M0 10 Q25 5, 50 10 T100 10" 
}: { 
  className?: string, 
  color?: string, 
  delay?: number,
  width?: number,
  height?: number,
  strokeWidth?: number,
  path?: string
}) => (
  <svg
    viewBox={`0 0 ${width} ${height}`}
    preserveAspectRatio="none"
    className={cn("overflow-visible", className)}
  >
    <motion.path
      d={path}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      className={color}
      initial={{ pathLength: 0, opacity: 0 }}
      whileInView={{ pathLength: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.5, delay, ease: "easeInOut" }}
    />
  </svg>
);

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <NavBar />
      
      {/* ----------------------------------Hero Section---------------------------------- */}
      <div className="relative flex flex-col justify-center items-center pt-24 md:pt-36 overflow-hidden px-4">
        {/* Large Wobbly Marker Stroke Across Page - Moved Up */}
        <MarkerStroke 
          className="absolute top-[38%] left-0 w-[120vw] h-24 md:h-32 -rotate-1 opacity-40 -z-20" 
          color="text-yellow-200/60" 
          delay={0.2}
          width={1000}
          strokeWidth={16}
          path="M0 50 Q250 20, 500 50 T1000 50"
        />
        
        <AnimationContainer>
          <div className="flex flex-col items-center text-center mb-4">
            <h1 className="font-heading text-7xl md:text-[9rem] leading-none max-w-6xl tracking-tighter text-foreground font-bold">
              Write your{" "}
              <span className="relative inline-block mt-4 md:mt-0 px-4">
                heart out.
                <MarkerStroke 
                  className="absolute -bottom-2 left-0 w-full h-8 opacity-40 -z-10" 
                  color="text-primary/40" 
                  delay={0.8}
                  strokeWidth={12}
                  path="M0 10 Q50 0, 100 10"
                />
              </span>
            </h1>
            <p className="text-xl md:text-3xl text-muted-foreground mt-12 text-center max-w-2xl font-medium">
              The cozy, end-to-end encrypted home for your deepest thoughts and brightest days.
            </p>
          </div>
        </AnimationContainer>

        <JournalCard />
      </div>

      {/* ----------------------------------Prompts Section---------------------------------- */}
      <div className="relative overflow-hidden">
        {/* Thicker, longer wobbly accent strokes */}
        <MarkerStroke 
          className="absolute top-[15%] right-[-10%] w-[500px] h-24 rotate-12 opacity-30" 
          color="text-blue-200" 
          strokeWidth={14}
          width={500}
          path="M0 30 Q250 0, 500 30"
        />
        <MarkerStroke 
          className="absolute bottom-[20%] left-[-5%] w-[400px] h-20 -rotate-6 opacity-30" 
          color="text-rose-200" 
          strokeWidth={14}
          width={400}
          path="M0 20 Q200 40, 400 20"
        />
        <MarkerStroke 
          className="absolute top-[60%] right-[10%] w-[300px] h-16 -rotate-12 opacity-20" 
          color="text-yellow-200" 
          strokeWidth={12}
          width={300}
          path="M0 15 Q150 30, 300 15"
        />
        <PromptsSection />
      </div>

      {/* ----------------------------------Features section---------------------------------- */}
      <div className="relative overflow-hidden">
        <MarkerStroke 
          className="absolute top-[10%] left-[5%] w-[350px] h-20 rotate-[35deg] opacity-20" 
          color="text-emerald-200" 
          strokeWidth={14}
          width={350}
          path="M0 20 Q175 0, 350 20"
        />
        <MarkerStroke 
          className="absolute bottom-[5%] right-[0%] w-[450px] h-24 -rotate-3 opacity-20" 
          color="text-blue-200" 
          strokeWidth={14}
          width={450}
          path="M0 30 Q225 60, 450 30"
        />
        <MaxWidthWrapper className="pt-32 pb-32 relative z-10">
          <AnimationContainer delay={0.3}>
            <div className="flex flex-col w-full items-center justify-center py-12">
              <h2 className="text-center text-5xl md:text-7xl leading-tight font-heading text-foreground relative">
                Everything you need.
                <MarkerStroke 
                  className="absolute -bottom-6 left-0 w-full h-12 opacity-40" 
                  delay={0.5} 
                  strokeWidth={14}
                  path="M0 20 C200 0, 800 40, 1000 20"
                  width={1000}
                />
              </h2>
            </div>
          </AnimationContainer>
          
          <AnimationContainer delay={0.4}>
            <BentoGrid className="py-12">
              {CARDS.map((feature, idx) => (
                <BentoCard key={idx} {...feature} />
              ))}
            </BentoGrid>
          </AnimationContainer>
        </MaxWidthWrapper>
      </div>

      <Footer />
    </div>
  );
};

export default LandingPage;
