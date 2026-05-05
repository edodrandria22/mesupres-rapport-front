/**
 * Formate une date en : "DD Mois YYYY" (ex: 01 Janvier 2026)
 */
export const formatLongDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    }).replace(/^\w/, (c) => c.toUpperCase()); // Met la première lettre du mois en majuscule
};
