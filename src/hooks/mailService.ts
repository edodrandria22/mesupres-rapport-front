"use server"
import nodemailer from 'nodemailer';

export const sendRapportReminder = async (destinataire: string, typeRapport: string, dateLimite: string) => {
  
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT || '465'),
    secure: true, // true pour le port 465
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.MAIL_FROM,
    to: destinataire,
    subject: `Rappel - Envoi de votre rapport ${typeRapport} sur la plateforme Tatitra Mesupres`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <p>Madame, Monsieur,</p>
        <p>Rappel : la date limite d’envoi de votre rapport <strong>${typeRapport}</strong> est fixée au <strong>${dateLimite}</strong>.</p>
        <p>Lien : <a href="https://rapport.mesupres.mg">https://rapport.mesupres.mg</a></p>
        <p>À ce jour, sauf erreur de notre part, celui-ci n’a pas encore été reçu. Merci de bien vouloir le transmettre dans les meilleurs délais.</p>
        <p>Cordialement,<br><strong>Mesupres</strong></p>
        <br>
        <p style="font-size: 12px; color: #888;">N.B : Ne pas répondre à ce mail.</p>
      </div>
    `,
  };

  return await transporter.sendMail(mailOptions);
};