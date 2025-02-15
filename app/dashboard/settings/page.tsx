"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import LoadingPage from "../../../components/LoadingPage";
import { Loader2 } from "lucide-react";
const SettingsPage = () => {
  const { user, getUser } = useKindeBrowserClient();
  const alsoUser = getUser();

  //Various states
  const [userData, setUserData] = useState<{
    stripeCustomerId?: string;
    colorScheme?: string;
    name?: string;
  } | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const router = useRouter();

  // Fetch user data from API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/api/user/${alsoUser?.id}`);
        setUserData(response.data);
        console.log("Fetched data:", response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    if (alsoUser?.id) fetchUserData();
  }, [alsoUser]);

  // Handle form save
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const response = await axios.put(`/api/user/${alsoUser?.id}`, {
        name: userData?.name,
        colorScheme: userData?.colorScheme,
      });

      router.refresh();
      console.log(name);
      console.log("Save response:", response.data);

      setIsSaving(false);
    } catch (error) {
      console.log("Error saving user data:", error);
      setIsSaving(false);
    }
  };

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="overflow-hidden h-screen w-full bg-gray-100 dark:bg-gray-800 py-8 px-4">
      {/* Title and description */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Update your personal information and preferences below.
        </p>
      </div>

      {/* Form */}
      <form
        className="w-full max-w-4xl mx-auto space-y-6"
        onSubmit={handleSave}
      >
        <Card className="bg-white dark:bg-gray-900 shadow-xl rounded-xl w-full">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-white">
              General Settings
            </CardTitle>
            <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
              Provide details about yourself and personalize your experience.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Name Input */}
            <div>
              <Label
                htmlFor="name"
                className="text-lg text-gray-900 dark:text-white"
              >
                Your Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={userData?.name}
                onChange={(e) =>
                  setUserData({ ...userData, name: e.target.value })
                }
                className="mt-2 p-3 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
              />
            </div>

            {/* Email Input */}
            <div>
              <Label
                htmlFor="email"
                className="text-lg text-gray-900 dark:text-white"
              >
                Your Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                defaultValue={alsoUser?.email}
                disabled
                className="mt-2 p-3 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
              />
            </div>

            {/* Color Theme Selector */}
            {userData?.stripeCustomerId && (
              <div>
                <Label
                  htmlFor="color-theme"
                  className="text-lg text-gray-900 dark:text-white"
                >
                  Color Theme
                </Label>
                <Select
                  name="color-theme"
                  value={userData?.colorScheme}
                  onValueChange={(value) =>
                    setUserData({ ...userData, colorScheme: value })
                  }
                >
                  <SelectTrigger className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white">
                    <SelectValue placeholder="Select a theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="theme-green">Green</SelectItem>
                    <SelectItem value="theme-rose">Rose</SelectItem>
                    <SelectItem value="theme-violet">Violet</SelectItem>
                    <SelectItem value="theme-yellow">Yellow</SelectItem>
                    <SelectItem value="theme-orange">Orange</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>

          {/* Save Button */}
          <CardFooter className="flex justify-end pt-4">
            <Button type="submit" disabled={isSaving}>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default SettingsPage;
