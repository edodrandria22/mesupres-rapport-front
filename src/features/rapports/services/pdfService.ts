import { jsPDF } from "jspdf";
// import html2canvas from "html2canvas";

export const pdfService = {
    /**
     * Génère un Blob PDF performant avec jsPDF.
     * Cette méthode offre un meilleur rendu du texte et un poids de fichier optimisé.
     */
    async generatePdfBlob(element: HTMLElement, filename: string, isLandscape: boolean = false): Promise<Blob> {
        const orientation = isLandscape ? 'l' : 'p';
        const doc = new jsPDF({
            orientation: orientation,
            unit: 'mm',
            format: 'a4',
            compress: true
        });

        const pageWidth = isLandscape ? 297 : 210;
        const margin = 10;
        const contentWidth = pageWidth - (margin * 2);

        // 1. On augmente significativement la windowWidth pour que le texte respire
        // Pour un tableau complexe, 1600px est une bonne base.
        const virtualWidth = 750; 

        return new Promise((resolve, reject) => {
            doc.html(element, {
                callback: (doc) => {
                    const pageCount = doc.getNumberOfPages();
                    
                    // 1. Calculer la hauteur d'une page A4 utile (en mm)
                    const pageHeight = isLandscape ? 210 : 297;
                    
                    // 2. Calculer la hauteur réelle du contenu convertie en mm
                    // Formule : (Pixels de l'élément * Largeur PDF) / Largeur virtuelle
                    const contentHeightMm = (element.offsetHeight * contentWidth) / virtualWidth;

                    // 3. Si la hauteur totale du contenu est inférieure à l'espace des pages précédentes
                    // on supprime la dernière page (on ajoute une marge de sécurité de 5mm)
                    const totalAvailableHeightBeforeLastPage = (pageCount - 1) * (pageHeight - margin);
                    
                    if (pageCount > 1 && contentHeightMm <= totalAvailableHeightBeforeLastPage) {
                        doc.deletePage(pageCount);
                    }

                    resolve(doc.output('blob'));
                },
                x: margin,
                y: margin,
                width: contentWidth,
                windowWidth: virtualWidth, // Fenêtre large pour éviter que les mots se touchent
                html2canvas: {
                    // 2. SUPPRIMER LE SCALE. jsPDF le calcule tout seul 
                    // via le rapport entre 'width' (277mm) et 'windowWidth' (1600px).
                    useCORS: true,
                    logging: false,
                    backgroundColor: "#ffffff",
                    letterRendering: true, // Aide à mieux séparer les lettres
                },
                autoPaging: 'text',
            });
        });
    }
};