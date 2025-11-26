import React, { useState } from "react";

const LearningProcess = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const steps = [
    {
      title: "Course Enroll",
      description: "Choose from our wide range of courses and enroll with a single click. Browse our catalog, select your desired course, and get instant access to all learning materials."
    },
    {
      title: "Interactive Learning",
      description: "Engage with interactive content, videos, and hands-on exercises. Our platform offers a dynamic learning experience with quizzes, projects, and community discussions."
    },
    {
      title: "Test Assessment",
      description: "Test your knowledge with quizzes and practical assignments. Each course includes comprehensive assessments to ensure you've mastered the material before moving forward."
    },
    {
      title: "Certification",
      description: "Earn your certificate upon successful completion of the course. Share your achievement on professional networks and add it to your resume to advance your career."
    }
  ];

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? -1 : index);
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl text-center font-bold text-gray-900 mb-4">
            How Digital Padhai Works
          </h2>
          <p className="text-gray-600 text-center">
            Simple steps to start learning and earn your certification
          </p>
        </div>

        {/* Accordion Steps */}
        <div className="space-y-4 mb-12">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className={`border rounded-lg overflow-hidden transition-all duration-300     ${
                activeIndex === index ? 'border-blue-500 shadow-md' : 'border-gray-200'
              }`}
            >
              <button
                className="flex items-center justify-between w-full p-4 text-left focus:outline-none cursor-pointer"
                onClick={() => toggleAccordion(index)}
              >
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 cursor-pointer ${
                    activeIndex === index ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {index + 1}
                  </div>
                  <h3 className="font-medium text-gray-900 ">{step.title}</h3>
                </div>
                <svg 
                  className={`w-5 h-5 transition-transform duration-300 ${
                    activeIndex === index ? 'transform rotate-180 text-blue-600' : 'text-gray-400'
                  }`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ${
                  activeIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="p-4 pt-0 pl-12 text-gray-600">
                  <p>{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Browse Courses Button */}
        <div className="text-center">
          <a 
            href="/courses"
            className="inline-flex items-center bg-gray-900 hover:bg-gray-800 text-white text-base font-medium px-8 py-4 rounded-lg transition-colors duration-200"
          >
            Browse Courses
            
          </a>
        </div>
      </div>
    </section>
  );
};

export default LearningProcess;