import Agent from "@/components/Agent";
import { getCurrentUser } from "@/lib/actions/auth.action";

const Page = async () => {
  const user = await getCurrentUser();

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-extrabold text-gray-900">
        Interview Generation
      </h1>

      <Agent
        userName={user?.name!}
        userId={user?.id}
        type="generate"
      />
    </div>
  );
};

export default Page;
