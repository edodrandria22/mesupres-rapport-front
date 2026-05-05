import React, { useState } from "react";
import { User } from "@/features/auth/types";
import { MissingUsersTableProps } from "@/features/rapports/types/admin/manquants/adminManquants";
import { AppTableSkeleton } from "@/features/common/components/ui/AppTableSkeleton";
import { string } from "zod";
import { adminService } from "../../services/adminService";
import { Button } from '@/components/ui/button';
import toast from "react-hot-toast";
import { ConfirmEmailDialog } from "./ConfirmEmailDialog";
import { ConfirmAllEmailDialog } from "./ConfirmAllEmailDialog";

export const MissingUsersTable: React.FC<MissingUsersTableProps> = ({ users, isLoading , calendrierPeriod}) => {
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isConfirmAllDialogOpen, setIsConfirmAllDialogOpen] = useState(false);

    const handleSendEmail = (user: User) => {
        if (!calendrierPeriod) {
            toast.error('Aucune période de calendrier sélectionnée');
            return;
        }
        
        setSelectedUser(user);
        setIsConfirmDialogOpen(true);
    };

    const handleSendToAll = () => {
        if (!calendrierPeriod) {
            toast.error('Aucune période de calendrier sélectionnée');
            return;
        }
        
        if (users.length === 0) {
            toast.error('Aucun utilisateur à qui envoyer un email');
            return;
        }
        
        setIsConfirmAllDialogOpen(true);
    };

    const handleConfirmSend = async () => {
        if (!selectedUser || !calendrierPeriod) return;
        
        try {
            const result = await adminService.envoyerMail(selectedUser.email, calendrierPeriod);
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (selectedUser.emailCopie?.trim() && emailRegex.test(selectedUser.emailCopie)) {
                await adminService.envoyerMail(selectedUser.emailCopie, calendrierPeriod);
            }
            if (result.success) {
                toast.success(`Email envoyé avec succès à ${selectedUser.email}!`);
            } else {
                toast.error(result.error || 'Erreur lors de l\'envoi de l\'email');
            }
        } catch (error) {
            toast.error('Erreur lors de l\'envoi de l\'email');
        } finally {
            setIsConfirmDialogOpen(false);
            setSelectedUser(null);
        }
    };

    const handleConfirmSendAll = async () => {
        if (!calendrierPeriod || users.length === 0) return;
        
        try {
            const promises = users.map(user => adminService.envoyerMail(user.email, calendrierPeriod));
            const results = await Promise.all(promises);
            
            const successCount = results.filter(r => r.success).length;
            const errorCount = results.length - successCount;
            
            if (successCount > 0) {
                toast.success(`${successCount} email(s) envoyé(s) avec succès!`);
            }
            if (errorCount > 0) {
                toast.error(`${errorCount} email(s) n'ont pas pu être envoyé(s)`);
            }
        } catch (error) {
            toast.error('Erreur lors de l\'envoi des emails');
        } finally {
            setIsConfirmAllDialogOpen(false);
        }
    };

    const handleCloseDialog = () => {
        setIsConfirmDialogOpen(false);
        setSelectedUser(null);
    };

    const handleCloseAllDialog = () => {
        setIsConfirmAllDialogOpen(false);
    };

    return (
        <>
            {/* Bouton d'action groupée */}
            {!isLoading && users.length > 0 && (
                <div className="mb-4 flex justify-end">
                    <Button 
                        size="sm"
                        className="bg-red-600 hover:bg-red-700 text-white font-medium text-sm transition-colors flex items-center gap-2"
                        onClick={handleSendToAll}
                    >
                        <span>📢</span>
                        Envoyer à tous ({users.length})
                    </Button>
                </div>
            )}

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm shadow-slate-100">
                {isLoading ? (
                    <AppTableSkeleton rows={8} cols={3} />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead className="bg-slate-50/50 border-b border-slate-200 text-left">
                                <tr>
                                    <th className="p-5 text-[10px] font-bold uppercase border-r border-slate-200/50 tracking-wider text-slate-500">Nom de l'Entite</th>
                                    <th className="p-5 text-[10px] font-bold uppercase border-r border-slate-200/50 tracking-wider text-slate-500">Email Professionnel</th>
                                    <th className="p-5 text-[10px] font-bold uppercase border-r border-slate-200/50 tracking-wider text-slate-500">Action</th>

                                    {/* <th className="p-5 text-[10px] font-bold uppercase tracking-wider text-slate-500">Rôle</th> */}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {users.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="p-20 text-center text-slate-400 font-medium italic">
                                            Toutes les rapports ont été soumis pour cette période.
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((user: User) => (
                                        <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group/item">
                                            <td className="p-5 text-sm font-bold text-slate-900 border-r border-slate-100">{user.entite}</td>
                                            <td className="p-5 text-sm font-medium text-slate-400 border-r border-slate-100 italic">{user.email}</td>
                                            <td className="p-5 text-sm font-medium text-slate-400 border-r border-slate-100 italic">
                                                 <Button 
                                                    size="sm" 
                                                    variant="outline"
                                                    className="text-[10px] uppercase font-semibold bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 hover:border-blue-300 transition-colors"
                                                    onClick={() => handleSendEmail(user)}
                                                >
                                                    📧 Envoyer mail
                                                </Button>
                                            </td>

                                            {/* <td className="p-5 text-[9px] font-bold text-slate-300 uppercase tracking-widest">{user.role}</td> */}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal de confirmation pour un utilisateur */}
            {selectedUser && calendrierPeriod && (
                <ConfirmEmailDialog
                    isOpen={isConfirmDialogOpen}
                    onClose={handleCloseDialog}
                    onConfirm={handleConfirmSend}
                    user={selectedUser}
                    calendrierPeriod={calendrierPeriod}
                />
            )}

            {/* Modal de confirmation pour tous les utilisateurs */}
            {calendrierPeriod && (
                <ConfirmAllEmailDialog
                    isOpen={isConfirmAllDialogOpen}
                    onClose={handleCloseAllDialog}
                    onConfirm={handleConfirmSendAll}
                    users={users}
                    calendrierPeriod={calendrierPeriod}
                />
            )}
        </>
    );
};