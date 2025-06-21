import dayjs from "dayjs";
import Link from "next/link";
import { redirect } from "next/navigation";

import {
  getFeedbackByInterviewId,
  getInterviewById,
} from "@/lib/actions/general.action";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const Feedback = async ({ params }: RouteParams) => {
  const { id } = await params;
  const user = await getCurrentUser();

  const interview = await getInterviewById(id);
  if (!interview) redirect("/");

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user?.id!,
  });

  const overallScore = feedback?.totalScore || 0;
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <section className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
            Interview Feedback
          </h1>
          <p className="text-lg text-gray-600 capitalize">
            {interview.role} Interview
          </p>
        </div>

        {/* Overall Score Card */}
        <div className="bg-white p-6 rounded-2xl shadow-md mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Overall Impression</h2>
            <p className="text-sm text-gray-500">
              {feedback?.createdAt
                ? dayjs(feedback.createdAt).format("MMM D, YYYY h:mm A")
                : "N/A"}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <p className={`text-4xl font-extrabold ${getScoreColor(overallScore)}`}>
              {overallScore}
            </p>
            <span className="text-2xl font-semibold text-gray-400">/ 100</span>
          </div>
        </div>

        {/* Final Assessment */}
        <div className="bg-white p-6 rounded-2xl shadow-md mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Final Assessment</h3>
          <p className="text-gray-700 leading-relaxed">{feedback?.finalAssessment || "No final assessment provided."}</p>
        </div>

        {/* Interview Breakdown */}
        <div className="bg-white p-6 rounded-2xl shadow-md mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Breakdown of the Interview</h3>
          <div className="space-y-6">
            {feedback?.categoryScores?.map((category, index) => (
              <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex-1">
                  <p className="font-bold text-lg text-gray-800">{category.name}</p>
                  <p className="text-gray-600 text-sm mt-1">{category.comment}</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                   <p className={`text-xl font-bold ${getScoreColor(category.score)}`}>{category.score}/100</p>
                   <Progress value={category.score} className="w-24 h-2" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strengths and Improvements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-green-500">✔</span> Strengths
            </h3>
            <ul className="list-disc list-inside space-y-2">
              {feedback?.strengths?.map((strength, index) => (
                <li key={index} className="text-gray-700">{strength}</li>
              ))}
            </ul>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-yellow-500">📈</span> Areas for Improvement
            </h3>
            <ul className="list-disc list-inside space-y-2">
              {feedback?.areasForImprovement?.map((area, index) => (
                <li key={index} className="text-gray-700">{area}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Button asChild variant="outline" className="text-gray-700 border-gray-300 hover:bg-gray-100 hover:text-gray-900 font-semibold py-3 px-6 rounded-lg">
            <Link href="/">
              Back to Dashboard
            </Link>
          </Button>

          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg">
            <Link href={`/interview/${id}`}>
              Retake Interview
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Feedback;
