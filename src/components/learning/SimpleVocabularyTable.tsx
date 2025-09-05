'use client';

import { speakJapanese, getSpeechRate } from '@/utils/speech';
import { Volume2 } from 'lucide-react';

interface VocabularyWord {
  id: string;
  hiragana: string;
  kanji: string;
  meaning: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
}

interface SimpleVocabularyTableProps {
  words: VocabularyWord[];
  lessonTitle: string;
}


export default function SimpleVocabularyTable({ 
  words, 
  lessonTitle 
}: SimpleVocabularyTableProps) {
  // Hiển thị tất cả từ vựng không cần filter
  const filteredWords = words;

  return (
    <div className="simple-vocabulary-table">
      {/* Header */}
      <div className="table-header">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          📚 {lessonTitle}
        </h2>
        <p className="text-gray-600 mb-4">
          Tổng cộng: {words.length} từ vựng
        </p>
      </div>



      {/* Vocabulary Table */}
      <div className="table-container">
        <table className="vocabulary-table">
          <thead>
            <tr>
              <th className="hiragana-column">Hiragana</th>
              <th className="kanji-column">Kanji</th>
              <th className="meaning-column">Nghĩa tiếng Việt</th>
              <th className="action-column"></th>
            </tr>
          </thead>
          <tbody>
            {filteredWords.map((word) => (
              <tr key={word.id} className="vocabulary-row cursor-pointer" onClick={() => {
                const lessonNumber = parseInt(lessonTitle.replace('Bài ', ''));
                const rate = getSpeechRate(lessonNumber);
                speakJapanese(word.hiragana, rate);
              }}>
                <td className="hiragana-cell">
                  <span className="hiragana-text text-xl md:text-2xl hover:text-blue-600 transition-colors">{word.hiragana}</span>
                </td>
                <td className="kanji-cell">
                  {word.kanji ? (
                    <span className="kanji-text text-lg md:text-xl hover:text-blue-600 transition-colors">{word.kanji}</span>
                  ) : (
                    <span className="no-kanji">-</span>
                  )}
                </td>
                <td className="meaning-cell">
                  <span className="meaning-text">{word.meaning}</span>
                </td>
                <td className="action-cell">
                  <button
                    className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    <Volume2 size={20} className="text-gray-600 hover:text-blue-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>


      </div>


    </div>
  );
}
