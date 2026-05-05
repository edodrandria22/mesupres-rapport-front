"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLogin } from "../hooks/useLogin";
import { APP_CONSTANTS, IMAGES } from "@/config/constants";

const loginSchema = z.object({
    email: z.string().email({ message: "Adresse email invalide." }),
    password: z.string().min(6, { message: "Le mot de passe doit faire au moins 6 caractères." }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

/**
 * Formulaire de connexion sobre et professionnel.
 */
export const LoginForm = () => {
    const { login, isLoading, isRedirecting, error, user } = useLogin();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const fillDefaultCredentials = (userType: 'admin' | 'user') => {
        if (userType === 'admin') {
            setValue('email', 'admin@gmail.com');
            setValue('password', 'adminadmin');
        } else {
            setValue('email', 'test@gmail.com');
            setValue('password', 'testtest');
        }
    };

    const onSubmit = (data: LoginFormValues) => {
        login(data);
    };

    /**
     * Écran de Bienvenue / Transition (Post-Login)
     * 100% Responsive & Pixel-Perfect
     */
    if (isRedirecting && user) {
        return (
            <div className="fixed inset-0 z-[100] bg-white flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-in fade-in duration-500">
                <div className="w-full max-w-[28rem] flex flex-col items-center text-center space-y-8 sm:space-y-10 animate-in zoom-in duration-700 ease-out">
                    {/* Brand Identity Headliner */}
                    <div className="animate-in slide-in-from-top-4 duration-1000 delay-100">
                        <img
                            src={IMAGES.LOGO_MESUPRES}
                            alt={`Logo ${APP_CONSTANTS.ministryName}`}
                            className="h-20 sm:h-24 w-auto mix-blend-multiply object-contain"
                        />
                    </div>

                    {/* Loader Élégant / Success Icon */}
                    <div className="relative">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-50 rounded-full flex items-center justify-center relative shadow-sm border border-green-100">
                            <div className="absolute inset-0 bg-green-200 rounded-full animate-ping opacity-25" />
                            <svg className="w-10 h-10 sm:w-12 sm:h-12 text-green-500 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        {/* Subtle secondary loader circle */}
                        <div className="absolute -inset-2 border-2 border-slate-50 border-t-blue-500 rounded-full animate-spin [animation-duration:3s]" />
                    </div>

                    <div className="space-y-4 sm:space-y-6">
                        <div className="space-y-2">
                            <p className="text-green-600 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.3em] opacity-80 animate-in slide-in-from-bottom-2 duration-700 delay-200">
                                Connexion réussie
                            </p>
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight leading-tight animate-in slide-in-from-bottom-3 duration-700 delay-300">
                                Bienvenue, <span className="text-blue-600 inline-block">{user.email.split('@')[0]}</span>
                            </h2>
                        </div>

                        <div className="h-[1px] w-12 bg-slate-100 mx-auto animate-in scale-x-0 duration-700 delay-400" />

                        <p className="text-sm sm:text-base text-slate-400 font-medium leading-relaxed max-w-[18rem] sm:max-w-none mx-auto animate-in slide-in-from-bottom-4 duration-700 delay-500">
                            Accès autorisé pour <br className="hidden sm:block" />
                            <span className="text-slate-900 font-bold uppercase tracking-wider text-xs sm:text-sm">{user.entite}</span>
                        </p>
                    </div>

                    {/* EliteBook Style Loading Indicator */}
                    <div className="flex justify-center items-center gap-3 pt-4 sm:pt-6">
                        {[0, 150, 300].map((delay, i) => (
                            <div
                                key={i}
                                className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full animate-bounce"
                                style={{ animationDelay: `${delay}ms` }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-sm p-8 bg-white border border-slate-100 rounded-lg shadow-sm space-y-6">
            <div className="space-y-1">
                <h1 className="text-xl font-bold text-gray-900">Connexion</h1>
                <p className="text-sm text-gray-500">
                    Entrez vos identifiants pour accéder à l'application.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-1">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700 block">
                        Adresse email
                    </label>
                    <input
                        {...register("email")}
                        id="email"
                        type="email"
                        placeholder="entite@mesupres.mg"
                        className={`w-full px-3 py-2 border rounded text-sm text-gray-900 placeholder-gray-400 transition-colors outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? "border-red-500" : "border-slate-200"
                            }`}
                        disabled={isLoading}
                    />
                    {errors.email && (
                        <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>
                    )}
                </div>

                <div className="space-y-1">
                    <label htmlFor="password" className="text-sm font-medium text-gray-700 block">
                        Mot de passe
                    </label>
                    <input
                        {...register("password")}
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        className={`w-full px-3 py-2 border rounded text-sm text-gray-900 placeholder-gray-400 transition-colors outline-none focus:ring-2 focus:ring-blue-500 ${errors.password ? "border-red-500" : "border-slate-200"
                            }`}
                        disabled={isLoading}
                    />
                    {errors.password && (
                        <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>
                    )}
                </div>

                {error && (
                    <div className="p-3 bg-red-50 border border-red-300 rounded">
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 bg-gray-900 hover:bg-black text-white text-sm font-semibold rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Connexion…
                        </>
                    ) : (
                        "Se connecter"
                    )}
                </button>
            </form>

            {/* <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => fillDefaultCredentials('admin')}
                        className="flex-1 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium rounded transition-colors"
                        disabled={isLoading}
                    >
                        Admin par défaut
                    </button>
                    <button
                        type="button"
                        onClick={() => fillDefaultCredentials('user')}
                        className="flex-1 px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-medium rounded transition-colors"
                        disabled={isLoading}
                    >
                        Utilisateur par défaut
                    </button>
                </div>
                <p className="text-xs text-gray-400 text-center">
                    Compte supérieur : utilisez un email contenant «&nbsp;admin&nbsp;»
                </p>
            </div> */}
            
        </div>
    );
};
