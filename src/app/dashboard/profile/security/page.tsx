"use client";

import React, { useState } from "react";
import { profileService } from "@/features/profile/services/profileService";
import toast from "react-hot-toast";

export default function SecurityPage() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const isMatch = password === confirmPassword && password.length > 0;
    const canSubmit = isMatch && !isLoading;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSubmit) return;

        setIsLoading(true);
        setMessage(null);

        try {
            const result = await profileService.updatePassword(password);
            let message = result.message;
            if (result.success) {
                setMessage({ type: "success", text: message });
                setPassword("");
                setConfirmPassword("");
                toast.success(message);
            } else {
                setMessage({ type: "error", text: message });
                toast.error(message)
            }
        } catch (error) {
            setMessage({ type: "error", text: "Impossible de mettre à jour le mot de passe." });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-12 px-6">
            <div className="mb-10 text-center">
                <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Sécurité du Compte</h1>
                <p className="text-slate-500 mt-2 text-sm">Gérez l'accès à votre compte en changeant votre mot de passe</p>
                <div className="h-1 w-12 bg-blue-600 mx-auto mt-6 rounded-full" />
            </div>

            <div className="bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-200/50 p-8 md:p-12 overflow-hidden relative">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 -mt-8 -mr-8 h-32 w-32 bg-blue-50 rounded-full blur-3xl opacity-50" />

                <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                    <div className="space-y-6">
                        {/* Nouveau mot de passe */}
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                Nouveau mot de passe
                            </label>
                            <div className="relative group">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500/20 focus:bg-white rounded-2xl px-5 py-4 text-sm transition-all duration-300 outline-none"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors p-2"
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Confirmer mot de passe */}
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                Confirmer le mot de passe
                            </label>
                            <div className="relative group">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className={`w-full bg-slate-50 border-2 rounded-2xl px-5 py-4 text-sm transition-all duration-300 outline-none ${confirmPassword && !isMatch ? "border-red-200 focus:border-red-500/20" : "border-transparent focus:border-blue-500/20 focus:bg-white"
                                        }`}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors p-2"
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {confirmPassword && !isMatch && (
                                <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider ml-1 animate-in fade-in slide-in-from-top-1">
                                    Les mots de passe ne correspondent pas
                                </p>
                            )}
                        </div>
                    </div>

                    {message && (
                        <div className={`p-4 rounded-2xl text-[11px] font-bold uppercase tracking-wider animate-in zoom-in-95 duration-300 ${message.type === "success" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                            }`}>
                            {message.text}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={!canSubmit}
                        className={`w-full py-5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 shadow-lg ${canSubmit
                            ? "bg-slate-900 text-white shadow-slate-900/20 hover:bg-black hover:-translate-y-1 active:scale-95"
                            : "bg-slate-100 text-slate-300 cursor-not-allowed shadow-none"
                            }`}
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Modification...</span>
                            </div>
                        ) : "Enregistrer les modifications"}
                    </button>
                </form>
            </div>

            <div className="mt-12 text-center">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    Mesupres / Rapport d'Activités &copy; 2026
                </p>
            </div>
        </div>
    );
}
