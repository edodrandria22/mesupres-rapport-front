import { LoginForm } from "@/features/auth/components/LoginForm";
import { IMAGES } from "@/config/constants";
import Image from "next/image";
import Link from "next/link";

/**
 * Page de connexion moderne avec illustration.
 */
export default function LoginPage() {
    const currentYear = new Date().getFullYear();

    return (
        <main className="min-h-screen flex bg-white relative overflow-hidden">
            {/* Lien de retour discret */}
            <Link
                href="/"
                className="absolute top-8 left-8 flex items-center gap-2 text-sm text-slate-400 hover:text-slate-900 transition-colors z-50 group font-medium"
            >
                <span className="transition-transform group-hover:-translate-x-1">←</span>
                <span>Retour à l&apos;accueil</span>
            </Link>

            {/* Côté gauche : Illustration (Visible uniquement sur les tablettes/PC) */}
            <div className="hidden lg:flex lg:w-1/2 bg-gray-50 flex-col items-center justify-center p-12 border-r border-gray-100">
                <div className="max-w-md w-full space-y-8 text-center">
                    <div className="relative w-full aspect-square max-w-[400px] mx-auto opacity-90 hover:opacity-100 transition-opacity">
                        <Image
                            src={IMAGES.ILLUSTRATION_LOGIN}
                            alt="Illustration"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                    <div className="space-y-3">
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                            Rapports d'activités
                        </h1>
                        <p className="text-gray-500 text-lg">
                            Générez et centralisez vos rapports en quelques clics.
                        </p>
                    </div>
                </div>
            </div>

            {/* Côté droit : Formulaire */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 bg-white">
                <div className="flex flex-col items-center gap-6 mb-10">
                    <div className="flex items-center gap-6">
                        <img src={IMAGES.LOGO_REPOBLIKA} alt="Logo" className="h-12 w-auto mix-blend-multiply" />
                        <div className="h-10 w-[1px] bg-slate-200" />
                        <img src={IMAGES.LOGO_MESUPRES} alt="Logo" className="h-12 w-auto mix-blend-multiply" />
                    </div>
                    <div className="text-center space-y-1">
                        <h2 className="text-[10px] font-bold uppercase text-slate-400 tracking-[0.2em]">
                            Ministère de l&apos;Enseignement Supérieur et de la Recherche Scientifique
                        </h2>
                        {/* <p className="text-[9px] font-medium text-slate-300 uppercase tracking-widest">
                            Direction des Systèmes d&apos;Information  (DSINT)
                        </p> */}
                    </div>
                </div>

                <LoginForm />
                <br />

                <div className="text-center">
                    <p className="text-xs text-gray-400">
                        © {currentYear} - DSINT - MESUPRES
                    </p>
                </div>
            </div>
        </main>
    );
}
