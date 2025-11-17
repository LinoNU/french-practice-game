const { useState } = React;
const { Trophy, RotateCcw, Check, X } = lucide;

const FrenchPracticeGame = () => {
  const [gameMode, setGameMode] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [options, setOptions] = useState([]);
  const [showCelebration, setShowCelebration] = useState(false);

  const vocabulary = {
    seasons: [
      { french: 'le printemps', english: 'spring' },
      { french: 'l\'été', english: 'summer' },
      { french: 'l\'automne', english: 'fall/autumn' },
      { french: 'l\'hiver', english: 'winter' }
    ],
    days: [
      { french: 'lundi', english: 'Monday' },
      { french: 'mardi', english: 'Tuesday' },
      { french: 'mercredi', english: 'Wednesday' },
      { french: 'jeudi', english: 'Thursday' },
      { french: 'vendredi', english: 'Friday' },
      { french: 'samedi', english: 'Saturday' },
      { french: 'dimanche', english: 'Sunday' }
    ],
    months: [
      { french: 'janvier', english: 'January' },
      { french: 'février', english: 'February' },
      { french: 'mars', english: 'March' },
      { french: 'avril', english: 'April' },
      { french: 'mai', english: 'May' },
      { french: 'juin', english: 'June' },
      { french: 'juillet', english: 'July' },
      { french: 'août', english: 'August' },
      { french: 'septembre', english: 'September' },
      { french: 'octobre', english: 'October' },
      { french: 'novembre', english: 'November' },
      { french: 'décembre', english: 'December' }
    ]
  };

  const numberWords = {
    0: 'zéro', 1: 'un', 2: 'deux', 3: 'trois', 4: 'quatre', 5: 'cinq',
    6: 'six', 7: 'sept', 8: 'huit', 9: 'neuf', 10: 'dix',
    11: 'onze', 12: 'douze', 13: 'treize', 14: 'quatorze', 15: 'quinze',
    16: 'seize', 17: 'dix-sept', 18: 'dix-huit', 19: 'dix-neuf', 20: 'vingt',
    21: 'vingt et un', 30: 'trente', 40: 'quarante', 50: 'cinquante',
    60: 'soixante', 70: 'soixante-dix', 80: 'quatre-vingts', 90: 'quatre-vingt-dix', 100: 'cent'
  };

  const generateNumberWord = (num) => {
    if (numberWords[num]) return numberWords[num];
    
    if (num < 70) {
      const tens = Math.floor(num / 10) * 10;
      const ones = num % 10;
      return ones === 1 ? `${numberWords[tens]} et un` : `${numberWords[tens]}-${numberWords[ones]}`;
    } else if (num < 80) {
      return `soixante-${numberWords[num - 60]}`;
    } else if (num < 100) {
      return `quatre-vingt-${numberWords[num - 80]}`;
    }
    return num.toString();
  };

  const generateQuestion = (mode) => {
    let question, correctAnswer, questionType;
    
    if (mode === 'numbers') {
      const num = Math.floor(Math.random() * 101);
      const frenchWord = generateNumberWord(num);
      
      if (Math.random() > 0.5) {
        question = `What number is "${frenchWord}"?`;
        correctAnswer = num.toString();
        questionType = 'input';
      } else {
        question = `How do you say ${num} in French?`;
        correctAnswer = frenchWord;
        questionType = 'input';
      }
    } else {
      const items = vocabulary[mode];
      const item = items[Math.floor(Math.random() * items.length)];
      
      if (Math.random() > 0.5) {
        question = `What does "${item.french}" mean in English?`;
        correctAnswer = item.english;
        questionType = 'multiple';
        
        const wrongAnswers = items
          .filter(i => i.english !== item.english)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map(i => i.english);
        setOptions([correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5));
      } else {
        question = `How do you say "${item.english}" in French?`;
        correctAnswer = item.french;
        questionType = 'multiple';
        
        const wrongAnswers = items
          .filter(i => i.french !== item.french)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map(i => i.french);
        setOptions([correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5));
      }
    }
    
    setCurrentQuestion({ question, correctAnswer, questionType, mode });
  };

  const checkAnswer = (answer) => {
    const isCorrect = answer.toLowerCase().trim() === currentQuestion.correctAnswer.toLowerCase().trim();
    
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    setTotalQuestions(prev => prev + 1);
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      
      if ((score + 1) % 5 === 0) {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 2000);
      }
    }
    
    setTimeout(() => {
      setFeedback(null);
      setUserAnswer('');
      generateQuestion(currentQuestion.mode);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && userAnswer.trim() && feedback === null) {
      checkAnswer(userAnswer);
    }
  };

  const resetGame = () => {
    setScore(0);
    setTotalQuestions(0);
    setFeedback(null);
    setUserAnswer('');
    if (gameMode) generateQuestion(gameMode);
  };

  const startGame = (mode) => {
    setGameMode(mode);
    setScore(0);
    setTotalQuestions(0);
    generateQuestion(mode);
  };

  if (!gameMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 p-8 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-2xl w-full">
          <h1 className="text-5xl font-bold text-center mb-4 text-gray-800">
            🇫🇷 French Practice Game
          </h1>
          <p className="text-center text-gray-600 mb-10 text-lg">
            Choose a topic to practice!
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={() => startGame('seasons')}
              className="bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white p-8 rounded-2xl text-2xl font-bold shadow-lg transform transition hover:scale-105"
            >
              🌸 Seasons
            </button>
            
            <button
              onClick={() => startGame('days')}
              className="bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white p-8 rounded-2xl text-2xl font-bold shadow-lg transform transition hover:scale-105"
            >
              📅 Days
            </button>
            
            <button
              onClick={() => startGame('months')}
              className="bg-gradient-to-r from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700 text-white p-8 rounded-2xl text-2xl font-bold shadow-lg transform transition hover:scale-105"
            >
              🗓️ Months
            </button>
            
            <button
              onClick={() => startGame('numbers')}
              className="bg-gradient-to-r from-pink-400 to-pink-600 hover:from-pink-500 hover:to-pink-700 text-white p-8 rounded-2xl text-2xl font-bold shadow-lg transform transition hover:scale-105"
            >
              🔢 Numbers
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 p-8">
      {showCelebration && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
          <div className="text-8xl animate-bounce">🎉</div>
        </div>
      )}
      
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => setGameMode(null)}
              className="bg-gray-200 hover:bg-gray-300 px-6 py-2 rounded-full font-semibold transition"
            >
              ← Back
            </button>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-2xl font-bold text-green-600">
                <Trophy className="w-8 h-8" />
                {score}/{totalQuestions}
              </div>
              
              <button
                onClick={resetGame}
                className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full transition"
              >
                <RotateCcw className="w-6 h-6" />
              </button>
            </div>
          </div>

          {currentQuestion && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  {currentQuestion.question}
                </h2>
              </div>

              {currentQuestion.questionType === 'input' ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full p-4 text-2xl border-4 border-gray-300 rounded-2xl focus:border-blue-500 focus:outline-none text-center"
                    placeholder="Type your answer..."
                    disabled={feedback !== null}
                    autoFocus
                  />
                  
                  <button
                    onClick={() => checkAnswer(userAnswe
