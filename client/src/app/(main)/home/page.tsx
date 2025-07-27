import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});
type LoginFormData = z.infer<typeof loginSchema>;

const { loading, login } = useLogin();

const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm<LoginFormData>({
  resolver: zodResolver(loginSchema),
});

const onSubmit = async (data: LoginFormData) => {
  await login(data.username, data.password);
};

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-2">
      <div className="w-full max-w-md p-6 rounded-lg shadow-md bg-background">
        <h1 className="text-3xl font-semibold text-center mb-6 text-foreground">
          Login
          <span className="text-primary ml-1">ChatApp</span>
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="username" className="text-base">
              Username
            </Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter username"
              {...register("username")}
              autoComplete="username"
            />
            {errors.username && (
              <p className="text-sm text-destructive mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="password" className="text-base">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter password"
              {...register("password")}
              autoComplete="current-password"
            />
            {errors.password && (
              <p className="text-sm text-destructive mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <Link
            to="/signup"
            className="text-sm hover:underline hover:text-primary mt-2 inline-block"
          >
            {"Don't"} have an account?
          </Link>

          <Button type="submit" className="w-full mt-2" disabled={loading}>
            {loading ? (
              <span className="animate-spin mr-2">&#9696;</span>
            ) : (
              "Login"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
