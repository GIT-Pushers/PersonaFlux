"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import Image from "next/image";

const ProfilePage = () => {
  const router = useRouter();
  const supabase = createClient();

  // State to store the user data
  const [user, setUser] = useState<User | null>(null);
  // State for loading status
  const [loading, setLoading] = useState(true);

  // useEffect to fetch the user session on component mount
  useEffect(() => {
    const fetchUser = async () => {
      // Fetches the current user from Supabase auth
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.error("Error fetching user:", error);
        // Redirect to login if no user is found or an error occurs
        router.push("/login");
      } else {
        setUser(data.user);
      }
      setLoading(false);
    };

    fetchUser();
  }, [supabase, router]);

  // Handler for the sign-out button
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    // Redirect to the homepage after signing out
    router.push("/");
  };

  // Display a loading message while fetching user data
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl">Loading profile...</p>
      </div>
    );
  }

  // Render the profile information
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">Profile</h1>
          <p className="text-gray-500">Welcome back!</p>
        </div>

        {/* Profile Picture */}
        <div className="flex justify-center">
          {user?.user_metadata?.avatar_url ? (
            <Image
              height={100}
              width={100}
              src={user.user_metadata.avatar_url}
              alt="Profile"
              className="w-24 h-24 rounded-full"
            />
          ) : (
            <div className="flex items-center justify-center w-24 h-24 bg-gray-200 rounded-full text-gray-500 text-3xl font-bold">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* User Details */}
        <div className="space-y-2 text-center">
          <h2 className="text-xl font-semibold text-gray-700">
            {/* Display full name from metadata, or fall back to a generic greeting */}
            {user?.user_metadata?.full_name || "User"}
          </h2>
          <p className="text-md text-gray-500">
            {/* Display user's email */}
            {user?.email}
          </p>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={handleSignOut}
          className="w-full px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
