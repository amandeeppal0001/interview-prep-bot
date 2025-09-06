import React from 'react';

function Summary() {
  // Dummy data to display the report. In a real app, this would come from a prop or API call.
  const overallScore = 8;
  const strengths = [
    "Clear logical flow in problem-solving.",
    "Provided strong, relevant examples to back up points.",
    "Demonstrated a good understanding of core concepts."
  ];
  const areasToImprove = [
    "Missed some key edge cases in the technical problem.",
    "Responses could be more concise to stay on time.",
    "Could have elaborated more on the 'why' behind certain technical decisions."
  ];
  const learningResources = [
    "Practice LeetCode array problems",
    "Review common system design patterns",
    "Read 'Cracking the Coding Interview' for behavioral tips"
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-lg p-10">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-6">Summary Report</h1>
        <p className="text-lg text-gray-600 text-center mb-10">Your Interview Highlights</p>

        {/* Overall Score */}
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Overall Score</h2>
          <div className="text-6xl font-extrabold text-green-500">{overallScore}/10</div>
        </div>

        {/* Strengths and Improvements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div>
            <h3 className="text-xl font-semibold text-green-600 mb-4">Strengths 💪</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              {strengths.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-red-600 mb-4">Areas to Improve 🤔</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              {areasToImprove.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Suggested Resources */}
        <div>
          <h3 className="text-xl font-semibold text-purple-600 mb-4">Suggested Learning Resources 📚</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            {learningResources.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Summary;