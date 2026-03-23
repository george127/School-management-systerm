"use client";

import { motion } from "framer-motion";

import Header from "./components/Header/HeaderPage";
import Navigation from "./components/Navigation/NavPage";
import LandingPage from "./components/landingPage/LandingPage";
import Footer from "./components/footer/Footer";

/* Animation Variants */

const pageVariant = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.8, ease: "easeInOut" },
  },
};

const sectionVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay,
      ease: "easeOut",
    },
  }),
};

export default function HomePage() {
  return (
    <motion.div
      variants={pageVariant}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div
        variants={sectionVariant}
        initial="hidden"
        animate="visible"
        custom={0.1}
      >
        <Header />
      </motion.div>

        <Navigation />

      {/* Landing Page */}
      <motion.div
        variants={sectionVariant}
        initial="hidden"
        animate="visible"
        custom={0.3}
      >
        <LandingPage />
      </motion.div>

      {/* Footer */}
      <motion.div
        variants={sectionVariant}
        initial="hidden"
        animate="visible"
        custom={0.4}
      >
        <Footer />
      </motion.div>
    </motion.div>
  );
}