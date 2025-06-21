"use client";

import { z } from "zod";
import Link from "next/link";
import { toast } from "sonner";
import { auth } from "@/firebase/client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { signIn, signUp } from "@/lib/actions/auth.action";
import FormField from "./FormField";

const authFormSchema = (type: FormType) =>
  z.object({
    name: type === "sign-up" ? z.string().min(3, "Name is required") : z.string().optional(),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(3, "Password must be at least 3 characters"),
  });

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();
  const formSchema = authFormSchema(type);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const isSignIn = type === "sign-in";

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      if (!isSignIn) {
        const { name, email, password } = data;
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        const result = await signUp({
          uid: userCredential.user.uid,
          name: name!,
          email,
          password,
        });

        if (!result.success) return toast.error(result.message);

        toast.success("Account created successfully. Please sign in.");
        router.push("/sign-in");
      } else {
        const { email, password } = data;
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const idToken = await userCredential.user.getIdToken();

        if (!idToken) return toast.error("Sign in failed. Try again.");

        await signIn({ email, idToken });
        toast.success("Signed in successfully.");
        router.push("/");
      }
    } catch (error) {
      toast.error(`There was an error: ${String(error)}`);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-16 p-8 rounded-2xl shadow-xl bg-white dark:bg-zinc-900">
      {/* Header - No Logo */}
      <div className="text-center space-y-1">
        <h2 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">
          AI Interview Coach
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Mock interviews with real-time voice feedback
        </p>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-5">
          {!isSignIn && (
            <FormField
              control={form.control}
              name="name"
              label="Full Name"
              placeholder="Enter your name"
              type="text"
            />
          )}

          <FormField
            control={form.control}
            name="email"
            label="Email"
            placeholder="Enter your email"
            type="email"
          />

          <FormField
            control={form.control}
            name="password"
            label="Password"
            placeholder="Enter your password"
            type="password"
          />

          <Button type="submit" className="w-full">
            {isSignIn ? "Sign In" : "Sign Up"}
          </Button>
        </form>
      </Form>

      {/* Switch Link */}
      <p className="mt-6 text-sm text-center text-zinc-600 dark:text-zinc-400">
        {isSignIn ? "Don't have an account?" : "Already have an account?"}
        <Link
          href={isSignIn ? "/sign-up" : "/sign-in"}
          className="ml-1 font-semibold text-user-primary hover:underline"
        >
          {isSignIn ? "Sign Up" : "Sign In"}
        </Link>
      </p>
    </div>
  );
};

export default AuthForm;
