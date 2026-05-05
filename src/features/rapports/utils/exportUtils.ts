import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/**
 * Exports a DOM element to a high-fidelity PDF.
 * @param elementId The ID of the HTML element to capture.
 * @param filename The name of the resulting PDF file.
 */
export const exportToPdf = async (elementId: string, filename: string) => {
    const element = document.getElementById(elementId);
    if (!element) {
        // console.error(`Element with ID ${elementId} not found.`);
        throw new Error(`Element with ID ${elementId} not found.`);
    }

    try {
        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: "#ffffff",
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4",
        });

        // Utilise ceci pour garantir des valeurs numériques valides
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const imgHeightInPdf = (imgProps.height * pdfWidth) / imgProps.width;

        // Rendu sécurisé
        pdf.addImage(
            imgData,
            "PNG",
            0,
            0,
            Number(pdfWidth) || 0,
            Number(imgHeightInPdf) || 0,
            undefined,
            "FAST"
        );

        pdf.save(filename);
    } catch (error) {
        // console.error("Error generating PDF:", error);
        throw error;
    }
};
/**
 * Exports a DOM element to a high-fidelity Word document (.doc).
 * @param elementId The ID of the HTML element to capture.
 * @param filename The name of the resulting Word file.
 * @param isLandscape Whether to use landscape orientation (default: false).
 */
export const exportToWord = async (elementId: string, filename: string, isLandscape: boolean = false) => {
    const element = document.getElementById(elementId);
    if (!element) {
        // console.error(`Element with ID ${elementId} not found.`);
        throw new Error(`Element with ID ${elementId} not found.`);
    }

    // 1. Conversion de toutes les images en Base64 pour qu'elles soient "embarquées"
    const convertImagesToBase64 = async (parent: HTMLElement) => {
        const imgs = parent.getElementsByTagName('img');
        for (const img of Array.from(imgs)) {
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(img, 0, 0);
                img.src = canvas.toDataURL("image/png");
                // On fixe la largeur pour Word
                img.setAttribute('width', '60'); 
            }
        }
    };

    const clone = element.cloneNode(true) as HTMLElement;
    await convertImagesToBase64(clone);

    const htmlContent = clone.innerHTML;

    // 2. Préparation du document avec un style spécifique pour Word
    const fileContent = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
            <meta charset='utf-8'>
            <style>
                /* Style pour simuler le Flexbox que Word ne comprend pas */
                .header-table { width: 100%; border: none; margin-bottom: 20pt; }
                .header-table td { border: none; vertical-align: middle; }
                p { margin: 0; padding: 0; }
                /* Style pour l'orientation du document */
                @page { 
                    ${isLandscape ? 'size: 297mm 210mm; /* landscape */' : 'size: 210mm 297mm; /* portrait */'}
                    margin: 15mm 12mm;
                }
                body { 
                    ${isLandscape 
                        ? 'width: 250mm; height: 180mm; margin: 15mm auto; /* paysage centré */' 
                        : 'width: 210mm; height: 297mm; margin: 0; /* portrait */'}
                    padding: 0; 
                    font-family: Arial, sans-serif;
                    font-size: 12px;
                }
            </style>
        </head>
        <body>
            ${htmlContent}
        </body>
        </html>
    `;

    const blob = new Blob(['\ufeff', fileContent], { type: 'application/msword' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename + ".doc";
    link.click();
};