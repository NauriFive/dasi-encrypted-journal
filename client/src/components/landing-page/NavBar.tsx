import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useScrollNavbar } from "@/hooks/useScrollNavbar";
import Logo from "../Logo";
import { Button } from "../ui/button";
import { useMe } from "@/hooks/useMe";

const NavBar = () => {
  const navigate = useNavigate();
  const { showNavbar } = useScrollNavbar();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: user } = useMe();

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (!section) return;

    section.scrollIntoView({ behavior: "smooth", block: "start" });
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-4 pointer-events-none">
      <nav
        className={`flex items-center justify-between mx-auto max-w-7xl transition-all duration-500 pointer-events-auto ${
          showNavbar ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"
        }`}
      >
        {/* Logo */}
        <div className="flex-1 flex justify-start">
          <div className="flex items-center gap-3 bg-card border-4 border-foreground p-2 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-[-2deg]">
            <Logo />
            <button
              onClick={() => navigate("/")}
              className="text-2xl font-black hidden md:block text-foreground"
            >
              Dasi
            </button>
          </div>
        </div>

        {/* Desktop navigation */}
        <div className="hidden lg:flex gap-4 p-2 bg-card border-4 border-foreground rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <Button
            variant="ghost"
            className="font-black text-sm rounded-xl hover:bg-primary/10 text-foreground"
            onClick={() => scrollToSection("features")}
          >
            Features
          </Button>
          <Button
            variant="ghost"
            className="font-black text-sm rounded-xl hover:bg-secondary/10 text-foreground"
            onClick={() => scrollToSection("sparks")}
          >
            Sparks
          </Button>
          <Button
            variant="ghost"
            className="font-black text-sm rounded-xl hover:bg-accent/10 text-foreground"
            onClick={() => scrollToSection("contribute")}
          >
            Contribute
          </Button>
        </div>

        {/* Desktop right section */}
        <div className="flex-1 hidden lg:flex gap-4 justify-end">
            <Button 
              onClick={() => {
                if (user) {
                  navigate("/journal");
                } else {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
              className="bg-primary text-primary-foreground border-4 border-foreground rounded-2xl px-8 h-14 font-black text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
            >
              {user ? "Go to Journal 🚀" : "Open Journal 📖"}
            </Button>
        </div>

        {/* Mobile hamburger button */}
        <div className="flex lg:hidden bg-card border-4 border-foreground rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-foreground"
          >
            {mobileMenuOpen ? (
              <X className="size-6" />
            ) : (
              <Menu className="size-6" />
            )}
          </Button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:hidden mt-4 p-4 bg-card border-4 border-foreground rounded-[32px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] pointer-events-auto"
        >
          <div className="flex flex-col gap-2">
            <Button
              variant="ghost"
              className="justify-start font-black rounded-xl text-foreground"
              onClick={() => scrollToSection("features")}
            >
              Features
            </Button>
            <Button
              variant="ghost"
              className="justify-start font-black rounded-xl text-foreground"
              onClick={() => scrollToSection("sparks")}
            >
              Sparks
            </Button>
            <Button
              variant="ghost"
              className="justify-start font-black rounded-xl text-foreground"
              onClick={() => scrollToSection("contribute")}
            >
              Contribute
            </Button>
            <div className="h-1 bg-foreground/5 my-2 rounded-full" />
            <Button
              className="w-full bg-primary text-primary-foreground border-4 border-foreground rounded-xl h-14 font-black text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              onClick={() => {
                setMobileMenuOpen(false);
                if (user) {
                  navigate("/journal");
                } else {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
            >
              {user ? "Go to Journal 🚀" : "Open Journal 📖"}
            </Button>
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default NavBar;
