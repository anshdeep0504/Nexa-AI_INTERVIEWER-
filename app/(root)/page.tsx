import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import InterviewCard from "@/components/InterviewCard";
import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getInterviewsByUserId,
  getLatestInterviews,
} from "@/lib/actions/general.action";

async function Home() {
  const user = await getCurrentUser();

  const [userInterviews, allInterview] = await Promise.all([
    getInterviewsByUserId(user?.id!),
    getLatestInterviews({ userId: user?.id! }),
  ]);

  const hasPastInterviews = userInterviews?.length! > 0;
  const hasUpcomingInterviews = allInterview?.length! > 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Header / Hero Section */}
      <section className="relative px-6 py-20 sm:px-12 border-b border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-16">
          {/* Text Area */}
          <div className="text-center lg:text-left space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-sm text-blue-700 font-semibold tracking-wide shadow-sm">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
                Welcome to Nexa
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight text-gray-900">
                <span className="block">Nexa</span>
                <span className="block text-blue-600">AI Interview Platform</span>
              </h1>
            </div>
            <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Prepare for your next big opportunity with Nexa. Practice with AI-powered mock interviews, get instant feedback, and track your progress—all in a clean, professional environment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                asChild
                className="group relative px-8 py-4 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
              >
                <Link href="/interview" className="flex items-center gap-2">
                  Start Practicing
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </Button>
              <Button
                variant="outline"
                className="px-8 py-4 text-lg font-semibold border-2 border-blue-600 text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300"
              >
                Learn More
              </Button>
            </div>
            {/* Stats */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-700">500+</div>
                <div className="text-gray-500 text-sm">Interviews Conducted</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-700">95%</div>
                <div className="text-gray-500 text-sm">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-700">24/7</div>
                <div className="text-gray-500 text-sm">Available</div>
              </div>
            </div>
          </div>
          {/* Robot Image */}
          <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px] flex justify-center items-center">
            <div className="absolute inset-0 bg-blue-100 rounded-3xl blur-2xl" />
            <div className="relative w-full h-full flex justify-center items-center">
              <Image
                src="/robot.png"
                alt="Nexa AI Robot"
                fill
                style={{ objectFit: "contain" }}
                className="drop-shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </section>
      {/* Your Interviews */}
      <section className="px-6 sm:px-12 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Your Recent Interviews
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Track your progress and review past performances to continuously improve your skills.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {hasPastInterviews ? (
              userInterviews?.map((interview) => (
                <InterviewCard
                  key={interview.id}
                  userId={user?.id}
                  interviewId={interview.id}
                  role={interview.role}
                  type={interview.type}
                  techstack={interview.techstack}
                  createdAt={interview.createdAt}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 bg-blue-50 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-gray-700 mb-2">No Interviews Yet</h3>
                <p className="text-gray-400 mb-6">Start your first practice interview to begin your journey!</p>
                <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
                  <Link href="/interview">Start Your First Interview</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>
      {/* Explore Practice Interviews */}
      <section className="px-6 sm:px-12 py-20 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Explore Practice Interviews
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Choose from a variety of interview types and roles to practice with.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {hasUpcomingInterviews ? (
              allInterview?.map((interview) => (
                <InterviewCard
                  key={interview.id}
                  userId={user?.id}
                  interviewId={interview.id}
                  role={interview.role}
                  type={interview.type}
                  techstack={interview.techstack}
                  createdAt={interview.createdAt}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 bg-blue-50 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-gray-700 mb-2">No Available Interviews</h3>
                <p className="text-gray-400">Check back later for new interview opportunities.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
