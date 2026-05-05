const playSound = (path: string) => {
  if (typeof window !== "undefined") {
    const audio = new Audio(path);
    audio.volume = 0.4; // Volume à 40% pour ne pas agresser l'utilisateur
    audio.play().catch((err) => {
      // Le navigateur bloque parfois le son si l'utilisateur n'a pas encore interagi avec la page
      console.warn("Lecture audio bloquée par le navigateur :", err);
    });
  }
};

export const audioService = {
  playSuccessRecherche: () => playSound("/sounds/successed-295058.mp3"),
  playErrorValidation: () => playSound("/sounds/error-011-352286.mp3"),
};