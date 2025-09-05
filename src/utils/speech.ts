export const getSpeechRate = (lessonNumber: number): number => {
  if (lessonNumber >= 1 && lessonNumber <= 5) {
    return 0.6; // Reduce by 40%
  } else {
    return 0.8; // Reduce by 20%
  }
};

export const speakJapanese = (text: string, rate: number = 1.0) => {
  if (!window.speechSynthesis) {
    console.warn("Web Speech API not supported in this browser.");
    return;
  }

  // Extract only Hiragana and Katakana characters
  const japaneseOnlyText = text.replace(/[^\u3040-\u309F\u30A0-\u30FF]/g, '');

  if (japaneseOnlyText.length === 0) {
    console.log("No Japanese kana found in text, skipping pronunciation:", text);
    return;
  }

  // Cancel any ongoing speech to avoid overlapping
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(japaneseOnlyText); // Use the filtered text
  utterance.lang = 'ja-JP'; // Set language to Japanese
  utterance.rate = rate; // Set the speech rate

  // Optional: Try to find a specific Japanese voice
  // This part can be uncommented if more control over voice is needed,
  // but it's generally handled well by the browser/OS default for 'ja-JP'.
  // window.speechSynthesis.onvoiceschanged = () => {
  //   const voices = window.speechSynthesis.getVoices();
  //   const japaneseVoice = voices.find(voice => voice.lang === 'ja-JP' || voice.lang === 'ja_JP');
  //   if (japaneseVoice) {
  //     utterance.voice = japaneseVoice;
  //   }
  // };
  // // If voices are already loaded, set it immediately
  // const voices = window.speechSynthesis.getVoices();
  // const japaneseVoice = voices.find(voice => voice.lang === 'ja-JP' || voice.lang === 'ja_JP');
  // if (japaneseVoice) {
  //   utterance.voice = japaneseVoice;
  // }


  window.speechSynthesis.speak(utterance);
};
