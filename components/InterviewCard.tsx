import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";

import { Button } from "./ui/button";
import DisplayTechIcons from "./DisplayTechIcons";

import { cn, getRandomInterviewCover } from "@/lib/utils";
import { getFeedbackByInterviewId } from "@/lib/actions/general.action";

const InterviewCard = async ({
  interviewId,
  userId,
  role,
  type,
  techstack,
  createdAt,
}: InterviewCardProps) => {
  const feedback =
    userId && interviewId
      ? await getFeedbackByInterviewId({
          interviewId,
          userId,
        })
      : null;

  const normalizedType = /mix/gi.test(type) ? "Mixed" : type;

  const badgeStyles: { [key: string]: string } = {
    Behavioral: "bg-green-100 text-green-700 border border-green-200",
    Mixed: "bg-purple-100 text-purple-700 border border-purple-200",
    Technical: "bg-blue-100 text-blue-700 border border-blue-200",
  };
  const badgeClass = badgeStyles[normalizedType] || badgeStyles.Mixed;

  const formattedDate = dayjs(
    feedback?.createdAt || createdAt || Date.now()
  ).format("MMM D, YYYY");

  const score = feedback?.totalScore || 0;
  const scoreColor = score >= 80 ? "text-green-600" : score >= 60 ? "text-yellow-600" : "text-red-600";

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
      {/* Card Header */}
      <div className="p-6">
        <div className="flex justify-between items-start">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                <Image
                    src={getRandomInterviewCover()}
                    alt="cover-image"
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                />
            </div>
            <div className={cn("px-3 py-1 rounded-full text-xs font-semibold", badgeClass)}>
                {normalizedType}
            </div>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mt-4 capitalize">
          {role} Interview
        </h3>

        <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
            <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                <span className={cn("font-semibold", scoreColor)}>
                    {feedback?.totalScore || "---"}/100
                </span>
            </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6 pt-0 flex-grow">
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
            {feedback?.finalAssessment ||
              "You haven't taken this interview yet. Take it now to improve your skills and get personalized feedback."}
          </p>
          <div className="flex items-center gap-2">
            <DisplayTechIcons techStack={techstack} />
          </div>
      </div>

      {/* Card Footer */}
      <div className="p-6 pt-0 mt-auto">
        <Button 
            asChild
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-sm transition-all"
          >
            <Link
              href={
                feedback
                  ? `/interview/${interviewId}/feedback`
                  : `/interview/${interviewId}`
              }
              className="flex items-center justify-center gap-2"
            >
              {feedback ? "View Feedback" : "Start Interview"}
            </Link>
          </Button>
      </div>
    </div>
  );
};

export default InterviewCard;
