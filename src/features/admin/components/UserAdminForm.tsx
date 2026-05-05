"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { adminService } from "@/features/admin/services/adminService";
import { RoleSelect } from "../../config/components/RoleSelect";

const userAdminSchema = z.object({
    entite: z.string().min(2, "L'entité doit faire au moins 2 caractères"),
    email: z.string().email("Adresse email invalide"),
    emailCopie: z.string().email("Adresse email invalide").optional(),
    mdp: z.string().min(6, "6 caractères minimum"),
    idRole: z.string().min(1, "Veuillez choisir un rôle"),
    rang: z.string().refine((v) => !isNaN(Number(v)) && Number(v) >= 0, { message: "Le rang doit être ≥ 0" }),
    sigle: z.string().min(2, "Le sigle doit faire au moins 2 caractères"),
});

type UserAdminFormValues = z.infer<typeof userAdminSchema>;

interface UserAdminFormProps {
    onSuccess: () => void;
    onCancel: () => void;
}

export const UserAdminForm: React.FC<UserAdminFormProps> = ({ onSuccess, onCancel }) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<UserAdminFormValues>({
        resolver: zodResolver(userAdminSchema),
        defaultValues: {
            idRole: ""
        }
    });

    const onSubmit = async (data: UserAdminFormValues) => {
        setIsLoading(true);
        setError(null);

        // Payload final avec les clés exactes
        const payload = {
            ...data,
            idRole: Number(data.idRole),
            rang: Number(data.rang),
            sigle: data.sigle || "",
            emailCopie: data.emailCopie || "",
        };

        // console.log("Payload envoyé:", payload);

        try {
            await adminService.createUser(payload);
            onSuccess();
        } catch (err: any) {
            setError(err.message || "Erreur lors de la création");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white border border-slate-300 rounded-lg shadow-sm p-8 max-w-sm w-full animate-fade-in">
            <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Nouvel Utilisateur</h2>
                <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-medium">Administration système</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-widest block">Entité / Nom</label>
                    <input
                        {...register("entite")}
                        type="text"
                        placeholder="Ex: DSINT ou Jean Paul"
                        className={`w-full px-3 py-2 border rounded text-sm text-slate-900 placeholder-slate-400 transition-colors outline-none focus:ring-1 focus:ring-slate-900 ${errors.entite ? "border-red-500" : "border-slate-300"}`}
                    />
                    {errors.entite && <p className="text-[10px] text-red-600 font-bold">{errors.entite.message}</p>}
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-widest block">Email</label>
                    <input
                        {...register("email")}
                        type="email"
                        placeholder="votre@email.com"
                        className={`w-full px-3 py-2 border rounded text-sm text-slate-900 placeholder-slate-400 transition-colors outline-none focus:ring-1 focus:ring-slate-900 ${errors.email ? "border-red-500" : "border-slate-300"}`}
                    />
                    {errors.email && <p className="text-[10px] text-red-600 font-bold">{errors.email.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-widest block">Mot de passe</label>
                        <input
                            {...register("mdp")}
                            type="password"
                            placeholder="••••••••"
                            className={`w-full px-3 py-2 border rounded text-sm text-slate-900 placeholder-slate-400 transition-colors outline-none focus:ring-1 focus:ring-slate-900 ${errors.mdp ? "border-red-500" : "border-slate-300"}`}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-widest block">Rang</label>
                        <input
                            {...register("rang")}
                            type="number"
                            min={0}
                            placeholder="0"
                            className={`w-full px-3 py-2 border rounded text-sm text-slate-900 placeholder-slate-400 transition-colors outline-none focus:ring-1 focus:ring-slate-900 ${errors.rang ? "border-red-500" : "border-slate-300"}`}
                        />
                        {errors.rang && <p className="text-[10px] text-red-600 font-bold">{errors.rang.message}</p>}
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-widest block">Sigle</label>
                        <input
                            {...register("sigle")}
                            type="text"
                            placeholder="SIG"
                            className={`w-full px-3 py-2 border rounded text-sm text-slate-900 placeholder-slate-400 transition-colors outline-none focus:ring-1 focus:ring-slate-900 ${errors.sigle ? "border-red-500" : "border-slate-300"}`}
                        />
                        {errors.sigle && <p className="text-[10px] text-red-600 font-bold">{errors.sigle.message}</p>}
                    </div>
                </div>

                <div className="space-y-1">
                    <RoleSelect
                        value={watch("idRole")}
                        onChange={(val) => setValue("idRole", val, { shouldValidate: true })}
                        error={errors.idRole?.message}
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-widest block">Email</label>
                    <input
                        {...register("emailCopie")}
                        type="email"
                        placeholder="exemple@gmail.com"
                        className={`w-full px-3 py-2 border rounded text-sm text-slate-900 placeholder-slate-400 transition-colors outline-none focus:ring-1 focus:ring-slate-900 ${errors.emailCopie ? "border-red-500" : "border-slate-300"}`}
                    />
                    {errors.emailCopie && <p className="text-[10px] text-red-600 font-bold">{errors.emailCopie.message}</p>}
                </div>

                {error && (
                    <div className="p-2 bg-red-50 border border-red-200 rounded text-center">
                        <p className="text-[10px] text-red-700 font-bold">{error}</p>
                    </div>
                )}

                <div className="flex gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 py-2.5 px-4 border border-slate-300 hover:bg-slate-50 text-slate-600 text-[10px] font-bold uppercase tracking-widest rounded transition-colors"
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 py-2.5 px-4 bg-slate-900 hover:bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded transition-colors disabled:opacity-50"
                    >
                        {isLoading ? "Envoi..." : "Créer"}
                    </button>
                </div>
            </form>
        </div>
    );
};
