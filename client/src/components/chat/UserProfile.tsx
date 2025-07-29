import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { User, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export function UserProfile() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    setIsProfileOpen(false);
  };

  if (!user) return null;

  return (
    <div className="p-4 border-t border-gray-200">
      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogTrigger asChild>
          <Card className="p-3 cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.profilePic} alt={user.fullName} />
                <AvatarFallback className="bg-blue-600 text-white">
                  {user.fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.fullName}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  @{user.username}
                </p>
              </div>
              <User className="h-4 w-4 text-gray-400" />
            </div>
          </Card>
        </DialogTrigger>

        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">User Profile</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col items-center space-y-4 py-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.profilePic} alt={user.fullName} />
              <AvatarFallback className="bg-blue-600 text-white text-lg">
                {user.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-semibold text-gray-900">
                {user.fullName}
              </h3>
              <p className="text-sm text-gray-500">@{user.username}</p>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>

            <Button
              onClick={handleLogout}
              variant="destructive"
              className="w-full"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
