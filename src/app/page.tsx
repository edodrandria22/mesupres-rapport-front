"use client"; // Obligatoire pour les animations

import Link from "next/link";
import { IMAGES } from "@/config/constants";
import { motion } from "framer-motion"; // Importation de motion

export default function HomePage() {
  const currentYear = new Date().getFullYear();

  // Variantes pour les listes (les 3 blocs info)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 } // Animation en cascade
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <main className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden">
      
      {/* Header avec apparition en fondu vers le bas */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-100"
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <img src={IMAGES.LOGO_REPOBLIKA} alt="Logo" className="h-10 w-auto mix-blend-multiply" />
            <div className="h-6 w-[1px] bg-slate-200" />
            <img src={IMAGES.LOGO_MESUPRES} alt="Logo" className="h-10 w-auto mix-blend-multiply" />
          </div>
          <Link href="/login" className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors uppercase tracking-widest">
            Se connecter
          </Link>
        </div>
      </motion.header>

      <section className="pt-30 pb-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Texte : Arrivée par la gauche */}
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-8"
          >
          <div className="space-y-4">
              <span className="flex flex-col text-blue-600 font-bold text-xs uppercase tracking-[0.3em]">
                Plateforme
              
                <span className="text-red-600 font-bold text-lg mt-[-2px] tracking-normal">
                  TATITRA MESUPRES
                </span>
              </span>
              
              <br />

              <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-[1.1]">
                Centralisez vos <br />
                <span className="text-slate-400">Rapports d'activités</span>
              </h1>
              <p className="text-lg text-slate-500 max-w-lg leading-relaxed font-medium">
                Une solution moderne pour la collecte, le suivi, et l'archivage numérique des activités du MESUPRES.
              </p>
          </div>
                          
            <div className="flex items-center gap-6 pt-4">
              <Link href="/login" className="px-10 py-5 bg-slate-900 hover:bg-black text-white font-bold text-sm uppercase tracking-widest rounded-full transition-all shadow-xl shadow-slate-200 hover:scale-105 active:scale-95 inline-block">
                Se connecter
              </Link>
            </div>
          </motion.div>

          {/* Illustration : Effet de flottement continu */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            // "justify-center" centre la carte elle-même sur mobile
            className="relative flex justify-center lg:justify-end"
          >
            <motion.div 
              animate={{ y: [0, -15, 0] }} 
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              // On ajoute "flex justify-center" ici pour centrer le contenu de la carte
              className="bg-white border border-slate-100 rounded-[32px] p-8 md:p-10 lg:p-12 shadow-2xl shadow-slate-100 w-full max-w-md md:max-w-lg lg:max-w-xl flex justify-center items-center"
            >
              <img 
                src={IMAGES.LOGO_MESUPRES} 
                alt="Logo MESUPRES" 
                // "mx-auto" est la clé pour centrer une image horizontalement
                className="w-full max-w-[260px] md:max-w-[360px] lg:max-w-[440px] h-auto object-contain mx-auto" 
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Section Info : Apparition au scroll (Viewport) */}
      <section className="py-24 bg-slate-50">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="max-w-7xl mx-auto px-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* {[
              { title: "Centralisation", color: "blue", desc: "Regroupez tous vos rapports d'activités sur une interface unique." },
              { title: "Rapidité", color: "green", desc: "Saisie optimisée et exportation automatique en PDF." },
              { title: "Conformité", color: "orange", desc: "Respect des standards administratifs et archivage pérenne." } */}
              {[{
                  title: "Centralisation",
                  color: "blue",
                  desc: "Regroupez tous vos rapports d'activités sur une interface unique.",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  )
                },
                {
                  title: "Rapidité",
                  color: "green",
                  desc: "Saisie optimisée et exportation automatique en PDF.",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  )
                },
                {
                  title: "Conformité",
                  color: "orange",
                  desc: "Respect des standards administratifs et archivage pérenne.",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.040L3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622l-1.382-3.016z" />
                    </svg>
                  )
                }

            ].map((item, i) => (
              <motion.div 
                key={i}
                variants={itemVariants}
                whileHover={{ y: -10 }} // Petit effet au survol
                className="bg-white p-10 rounded-3xl border border-slate-100 shadow-sm space-y-4 hover:shadow-md transition-shadow"
              >
                <div className={`w-12 h-12 bg-${item.color}-50 text-${item.color}-600 rounded-xl flex items-center justify-center`}>
                  {/* Icônes ici */}
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
                <p className="text-slate-500 text-sm font-medium">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <footer className="py-12 border-t border-slate-100 text-center">
        <p className="text-slate-400 text-[10px] uppercase tracking-[0.4em] font-medium">
          © {currentYear} — DSINT-MESUPRES
        </p>
      </footer>
    </main>
  );
}