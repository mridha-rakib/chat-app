import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState, useTransition } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { useRef } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { User, AtSign, Mail, Lock } from "lucide-react";
import { useSignupMutation } from "@/lib/store/api/userApi";
import { useRouter } from "next/navigation";

export const signUpSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Full name must be at least 2 characters")
      .max(50, "Full name must not exceed 50 characters")
      .regex(/^[a-zA-Z\s]+$/, "Full name can only contain letters and spaces"),

    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username must not exceed 20 characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores"
      )
      .transform((val) => val.toLowerCase()),

    email: z.string().email("Please enter a valid email address"),

    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(100, "Password must not exceed 100 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),

    confirmPassword: z.string(),

    gender: z.enum(["male", "female"], "Gender must be either male or female"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof signUpSchema>;

export default function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [signup, { isLoading }] = useSignupMutation();
  const router = useRouter();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      gender: "male",
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    startTransition(async () => {
      try {
        const result = await signup(data).unwrap();
        toast.success("Account created successfully! Welcome to ChatApp!", {
          duration: 4000,
          position: "top-center",
        });
        router.push("/home");
      } catch (error: unknown) {
        console.error("Signup error:", error);

        let errorMessage = "Something went wrong. Please try again.";

        if (error && typeof error === "object" && "data" in error) {
          const errorWithData = error as { data?: { message?: string } };
          errorMessage = errorWithData.data?.message || errorMessage;
        } else if (error instanceof Error) {
          errorMessage = error.message;
        } else if (typeof error === "string") {
          errorMessage = error;
        }

        toast.error(errorMessage, {
          duration: 4000,
          position: "top-center",
        });
      }
    });
  };

  const isSubmitting = isPending || isLoading;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
          <div className="grid gap-2">
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                      Name
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                        <Input
                          placeholder="your full name"
                          className="!h-[48px] pl-10 py-3 rounded-lg border border-slate-200 bg-slate-50 focus:border-primary focus:ring-2 focus:ring-primary/10"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* Username Field */}
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                      Username
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <AtSign className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                        <Input
                          placeholder="Username"
                          className="!h-[48px] pl-10 py-3 rounded-lg border border-slate-200 bg-slate-50 focus:border-primary focus:ring-2 focus:ring-primary/10"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* Email Field */}
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                      Email
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                        <Input
                          placeholder="r@gmail.com"
                          type="email"
                          className="!h-[48px] pl-10 py-3 rounded-lg border border-slate-200 bg-slate-50 focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:opacity-50"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Password Field */}
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                        <Input
                          placeholder="Create a password"
                          type={showPassword ? "text" : "password"}
                          className="!h-[48px] pl-10 pr-10 py-3 rounded-lg border border-slate-200 bg-slate-50 focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:opacity-50"
                          disabled={isSubmitting}
                          {...field}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5 text-slate-400" />
                          ) : (
                            <Eye className="h-5 w-5 text-slate-400" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* Confirm password */}
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                        <Input
                          placeholder="Confirm your password"
                          type={showConfirmPassword ? "text" : "password"}
                          className="!h-[48px] pl-10 pr-10 py-3 rounded-lg border border-slate-200 bg-slate-50 focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:opacity-50"
                          disabled={isSubmitting}
                          {...field}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-3"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5 text-slate-400" />
                          ) : (
                            <Eye className="h-5 w-5 text-slate-400" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                      Gender
                    </FormLabel>
                    <FormControl>
                      <div className="flex gap-6 mt-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            value="male"
                            checked={field.value === "male"}
                            onChange={() => field.onChange("male")}
                            disabled={isSubmitting}
                            className="w-4 h-4 text-primary"
                          />
                          <span className="text-sm">Male</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            value="female"
                            checked={field.value === "female"}
                            onChange={() => field.onChange("female")}
                            disabled={isSubmitting}
                            className="w-4 h-4 text-primary"
                          />
                          <span className="text-sm">Female</span>
                        </label>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 mt-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </div>
          <div className="text-center text-sm">
            Already have an account?
            <Link
              href="/"
              className="underline underline-offset-4 hover:text-primary"
            >
              Sign in
            </Link>
          </div>
        </div>
      </form>
    </Form>
  );
}
