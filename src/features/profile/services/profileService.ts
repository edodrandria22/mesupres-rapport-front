/**
 * Service pour la gestion du profil utilisateur.
 */
export const profileService = {
    /**
     * Met à jour le mot de passe de l'utilisateur.
     * Appelle l'API backend pour changer le mot de passe.
     * @param password Le nouveau mot de passe
     */
    updatePassword: async (password: string) => {
        try {
            const response = await fetch("/api/utilisateurs/changerMdp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ mdp:password }),
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    message: data.message ||data.error|| "Une erreur est survenue lors de la mise à jour du mot de passe."
                };
            }

            return {
                success: true,
                message: "Le mot de passe a été mis à jour avec succès."
            };
        } catch (error) {
            // console.error("Erreur profileService.updatePassword:", error);
            const message = (error as any).error|| (error as any).message || "Impossible de contacter le serveur. Veuillez réessayer plus tard.";
            return {
                success: false,
                message: message
            };
        }
    }
};
