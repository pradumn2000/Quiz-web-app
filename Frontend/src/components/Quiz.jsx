import { useState, useEffect } from 'react';
import axios from 'axios'; 

const questionsData = [
    
  {
    "id": 1,
    "question": "What is React?",
    "options": ["Library", "Framework", "Language", "Database"],
    "answer": "Library"
  },
  {
    "id": 2,
    "question": "What is JSX?",
    "options": ["JavaScript XML", "JSON Extension", "React Directive", "HTML Variant"],
    "answer": "JavaScript XML"
  },
  {
    "id": 3,
    "question": "Which hook is used to manage state in a functional component?",
    "options": ["useState", "useEffect", "useReducer", "useContext"],
    "answer": "useState"
  },
  {
    "id": 4,
    "question": "Which method is used to render React elements?",
    "options": ["ReactDOM.render()", "React.render()", "render()", "DOMReact()"],
    "answer": "ReactDOM.render()"
  },
  {
    "id": 5,
    "question": "Which hook is used for side effects?",
    "options": ["useState", "useRef", "useEffect", "useMemo"],
    "answer": "useEffect"
  },
  {
    "id": 6,
    "question": "What does the 'key' prop help React with?",
    "options": ["Debugging", "Optimizing list rendering", "Adding new props", "Handling state"],
    "answer": "Optimizing list rendering"
  },
  {
    "id": 7,
    "question": "What is the virtual DOM?",
    "options": ["Copy of the real DOM", "Subset of components", "API to fetch DOM", "Template engine"],
    "answer": "Copy of the real DOM"
  },
  {
    "id": 8,
    "question": "Which lifecycle method is invoked after a component is rendered?",
    "options": ["componentDidMount", "render", "constructor", "shouldComponentUpdate"],
    "answer": "componentDidMount"
  },
  {
    "id": 9,
    "question": "What is the correct syntax to pass props?",
    "options": ["<Component prop=value />", "<Component.prop=value>", "<Component value.prop>", "Component(prop=value)"],
    "answer": "<Component prop=value />"
  },
  {
    "id": 10,
    "question": "Which of these is used for routing in React?",
    "options": ["React Router", "Redux", "MobX", "Axios"],
    "answer": "React Router"
  },
  {
    "id": 11,
    "question": "Which of these manages global state?",
    "options": ["Redux", "ReactDOM", "JSX", "Babel"],
    "answer": "Redux"
  },
  {
    "id": 12,
    "question": "Which hook returns a mutable ref object?",
    "options": ["useRef", "useEffect", "useReducer", "useMemo"],
    "answer": "useRef"
  },
  {
    "id": 13,
    "question": "What is Babel used for?",
    "options": ["Transpiling JSX", "Routing", "State management", "Styling"],
    "answer": "Transpiling JSX"
  },
  {
    "id": 14,
    "question": "Which CSS-in-JS library is commonly used with React?",
    "options": ["Styled-components", "Bootstrap", "Tailwind", "Sass"],
    "answer": "Styled-components"
  },
  {
    "id": 15,
    "question": "What is useContext used for?",
    "options": ["Access global state", "Handle side effects", "Format JSON", "Connect backend"],
    "answer": "Access global state"
  },
  {
    "id": 16,
    "question": "Which of the following is not a React hook?",
    "options": ["useEffect", "useReducer", "useFetch", "useState"],
    "answer": "useFetch"
  },
  {
    "id": 17,
    "question": "Which tool is used to debug React code?",
    "options": ["React Developer Tools", "Redux Inspector", "Postman", "Webpack"],
    "answer": "React Developer Tools"
  },
  {
    "id": 18,
    "question": "What does React use to identify elements in lists?",
    "options": ["Keys", "IDs", "Props", "Refs"],
    "answer": "Keys"
  },
  {
    "id": 19,
    "question": "Which function is used to update state?",
    "options": ["setState", "getState", "useEffect", "render"],
    "answer": "setState"
  },
  {
    "id": 20,
    "question": "What is React primarily used for?",
    "options": ["Building user interfaces", "Database design", "API creation", "Backend services"],
    "answer": "Building user interfaces"
  }
]

;

// Helper function to shuffle options (Fisher-Yates)
const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export default function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [quizComplete, setQuizComplete] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(''); // Added to track submission status

  // Load and shuffle questions
  useEffect(() => {
    if (Array.isArray(questionsData) && questionsData.length > 0) {
      const shuffledQuestions = questionsData.map((q) => ({
        ...q,
        options: shuffleArray(q.options),
      }));
      setQuestions(shuffledQuestions);
    } else {
      console.error("Error: Invalid question format. Make sure questionsData is an array.");
      setQuestions([]);
    }
  }, []);

  // Handle option selection
  const handleOptionClick = (option) => {
    setSelected(option);
    setShowFeedback(true);
  };

  // Handle moving to the next question or finishing
  const handleNext = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
  
    const isCorrect = selected === questions[current].answer;
    const updatedAnswers = [
      ...answers,
      {
        question: questions[current].question,
        selected,
        correct: questions[current].answer,
        isCorrect,
      },
    ];
  
    let newScore = score;
    if (isCorrect) {
      newScore = score + 1;
      setScore(newScore);
    }
  
    setAnswers(updatedAnswers);
    setShowFeedback(false);
  
    if (current >= questions.length - 1) {
      setQuizComplete(true);
      // Send score to backend
      try {
        const userId = localStorage.getItem('userId'); // Assuming userId is stored
        if (userId) {
          setSubmitStatus('Submitting score...');
          // Use the scores endpoint which is set up to handle score updates
          const response = await axios.post('http://localhost:1814/api/v2/Quizdb/scores', {
            userId,
            score: newScore,
          });
          
          console.log('Score submitted successfully:', response.data);
          setSubmitStatus('Score submitted successfully!');
        } else {
          console.warn('No userId found in localStorage');
          setSubmitStatus('Unable to submit score: No user ID found');
        }
      } catch (err) {
        console.error('Error submitting score:', err);
        setSubmitStatus(`Error submitting score: ${err.message}`);
      }
    } else {
      setSelected(null);
      setCurrent(current + 1);
    }
  
    setIsProcessing(false);
  };

  // Reset quiz
  const resetQuiz = () => {
    setCurrent(0);
    setScore(0);
    setSelected(null);
    setAnswers([]);
    setQuizComplete(false);
    setShowFeedback(false);
    setSubmitStatus('');

    // Re-shuffle questions
    const shuffledQuestions = questionsData.map((q) => ({
      ...q,
      options: shuffleArray(q.options),
    }));
    setQuestions(shuffledQuestions);
  };

  // Loading or error state
  if (questions.length === 0) {
    return (
      <div className="max-w-xl mx-auto mt-10 p-6 text-center">
        {questionsData ? 'Error loading questions.' : 'Loading questions...'}
      </div>
    );
  }

  // Quiz complete state
  if (quizComplete) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-6 shadow-lg border rounded bg-white">
        <h2 className="text-2xl font-bold text-center mb-4">Quiz Complete!</h2>
        <p className="text-lg mt-2 text-center font-semibold">
          Your Score: {score} / {questions.length} ({((score / questions.length) * 100).toFixed(2)}%)
        </p>

        {submitStatus && (
          <p className={`text-center mt-2 ${submitStatus.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
            {submitStatus}
          </p>
        )}

        <div className="w-full bg-gray-200 rounded-full h-4 mt-4">
          <div
            className="bg-black h-4 rounded-full"
            style={{ width: `${(score / questions.length) * 100}%` }}
          ></div>
        </div>

        <div className="mt-6 space-y-4">
          {answers.map((ans, index) => (
            <div
              key={index}
              className={`p-4 border rounded ${ans.isCorrect ? 'bg-green-50' : 'bg-red-50'}`}
            >
              <p className="font-semibold">
                Q{index + 1}: {ans.question}
              </p>
              <p className={`mt-1 ${ans.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                Your Answer: {ans.selected}
              </p>
              {!ans.isCorrect && (
                <p className="text-green-600">Correct Answer: {ans.correct}</p>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={resetQuiz}
          className="mt-6 px-4 py-2 bg-black text-white rounded hover:bg-gray-900 w-full"
        >
          Restart Quiz
        </button>
      </div>
    );
  }

  // Quiz in progress
  return (
    <div className="max-w-xl mx-auto mt-10 p-6 shadow-lg border rounded bg-white">
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-gray-500">
          Question {current + 1} of {questions.length}
        </span>
        <span className="text-sm font-medium">Score: {score}</span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div
          className="bg-black h-2 rounded-full"
          style={{ width: `${((current + 1) / questions.length) * 100}%` }}
        ></div>
      </div>

      <h2 className="text-xl font-semibold mb-4">{questions[current].question}</h2>

      <ul className="space-y-2">
        {questions[current].options.map((option, index) => (
          <li
            key={index}
            onClick={() => handleOptionClick(option)}
            className={`p-3 border rounded cursor-pointer transition-colors ${
              selected === option ? 'bg-gray-500 text-white' : 'hover:bg-gray-100'
            }`}
          >
            {option}
            {showFeedback && selected === option && (
              <span
                className={`ml-2 ${
                  option === questions[current].answer ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {option === questions[current].answer ? '✓ Correct' : '✗ Incorrect'}
              </span>
            )}
          </li>
        ))}
      </ul>

      <button
        onClick={handleNext}
        disabled={selected === null || isProcessing}
        className="mt-6 px-4 py-2 bg-black text-white rounded disabled:opacity-50 hover:bg-gray-900 w-full"
      >
        {isProcessing
          ? 'Processing...'
          : current === questions.length - 1
          ? 'Finish Quiz'
          : 'Next Question'}
      </button>
    </div>
  );
}


