import { Quote, Star } from 'lucide-react';

const CourseTestimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Aarav Koirala",
      role: "CS Student",
      avatar: "https://i.pinimg.com/736x/2a/cf/9a/2acf9a571bfc454d37877e2c5a136bda.jpg",
      content: "Thanks to the structured courses and practice tests, I completed my first full-stack project confidently!",
      rating: 5
    },
    {
      id: 2,
      name: "Mina Shrestha",
      role: "Student",
      avatar: "https://i.pinimg.com/736x/d1/5f/bb/d15fbb3cf5c8ef690818ce562ae19f8d.jpg",
      content: "The MCQ quizzes helped me identify weak areas and improve my understanding before the final exam. Highly recommend!",
      rating: 4
    },
    {
      id: 3,
      name: "Rajan Thapa",
      role: "Computer Science Student",
      avatar: "https://i.pinimg.com/736x/6d/5c/10/6d5c10630d17b5ecc3d22198289d2f5b.jpg",
      content: "I was able to complete 2 courses in a month thanks to the bite-sized lessons and progress tracking. Learning has never been this efficient!",
      rating: 5
    }
  ];

  const renderStars = (rating) => (
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
      />
    ))
  );

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Success Stories from Our Students</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Our students gain skills, confidence, and results. Here's what they say about their journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="relative bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
            >
              {/* Quote Icon */}
              <Quote className="absolute -top-4 -left-4 h-10 w-10 text-gray-200 opacity-40" />

              {/* Rating */}
              <div className="flex mb-4">{renderStars(t.rating)}</div>

              {/* Content */}
              <p className="text-gray-700 mb-6 leading-relaxed text-sm sm:text-base">
                {t.content}
              </p>

              {/* Author */}
              <div className="flex items-center">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="h-14 w-14 rounded-full object-cover mr-4 border-2 border-gray-200"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{t.name}</h3>
                  <p className="text-sm text-gray-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseTestimonials;
