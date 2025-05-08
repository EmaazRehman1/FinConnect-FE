import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
// import { useTheme } from "@/components/ThemeProvider";
import { motion } from "framer-motion";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { UserDropdown } from '../dashboard/UserDropdown';
import { useUser } from '@/context/UserContextProvider';

export default function Navbar() {
  //   const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const {user}=useUser()
  const navigate = useNavigate()
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-blur:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <motion.div
            initial={{ rotate: -10, scale: 0.9 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-gradient-to-r from-blue-600 to-cyan-400 h-8 w-8 rounded-lg flex items-center justify-center">
              <span className="font-bold text-white">FC</span>
            </div>
          </motion.div>
          <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">FinConnect</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/" className={navigationMenuTriggerStyle()}>
                    Home
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/pricing" className={navigationMenuTriggerStyle()}>
                  Pricing
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/about" className={navigationMenuTriggerStyle()}>
                  About
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>


          {user?.isAuthenticated ? (
            <UserDropdown />
          ) : (

            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600">
                  Sign Up
                </Button>
              </Link>
              {/* <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle theme"
              className="rounded-full"
              //   onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              theme
              </Button> */}
            </div>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center gap-2">
          {/* <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            className="rounded-full"
            // onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            theme
          </Button> */}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="md:hidden border-t"
        >
          <div className="container py-4 flex flex-col gap-4">
            <Link
              to="/"
              className="px-4 py-2 hover:bg-accent rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/pricing"
              className="px-4 py-2 hover:bg-accent rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              to="/about"
              className="px-4 py-2 hover:bg-accent rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>


            <div className="flex items-center gap-2 pt-2 border-t">
              <Link to="/login" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full">
                  Login
                </Button>
              </Link>
              <Link to="/register" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
}