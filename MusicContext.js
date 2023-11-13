import React, { createContext, useState } from 'react';

export const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
  const [isMusicPlaying, setIsMusicPlaying] = useState(true);

  const toggleMusic = () => {
    setIsMusicPlaying((prev) => !prev);
  };

  return (
    <MusicContext.Provider value={{ isMusicPlaying, toggleMusic }}>
      {children}
    </MusicContext.Provider>
  );
};
