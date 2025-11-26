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
    <div className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl text-center font-bold text-gray-900 mb-4">  
            Voices of Success
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto leading-relaxed">
            Hear from students who transformed their learning journey with us
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="group bg-gray-50 p-6 rounded-xl border border-gray-600 hover:border-gray-200 transition-all duration-300 cursor-grab"
            >
              {/* Rating */}
              <div className="flex mb-4">{renderStars(t.rating)}</div>

              {/* Content */}
              <p className="text-gray-800 mb-6 leading-relaxed text-[15px]">
                "{t.content}"
              </p>

              {/* Author */}
              <div className="flex items-center">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="h-12 w-12 rounded-full object-cover mr-4 border border-gray-200"
                />
                <div>
                  <h3 className="font-medium text-gray-900 text-[15px]">{t.name}</h3>
                  <p className="text-sm text-gray-400">{t.role}</p>
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