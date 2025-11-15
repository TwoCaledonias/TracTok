"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { loginSchema, registerSchema } from "@/lib/validations/auth";
import prisma from "@/lib/prisma";

type ActionResult = {
  error?: string;
  success?: boolean;
};

/**
 * Server action for user login
 */
export async function login(_prevState: unknown, formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();

  // Validate input
  const validationResult = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validationResult.success) {
    return {
      error: validationResult.error.issues[0]?.message ?? "Invalid input",
    };
  }

  const { email, password } = validationResult.data;

  // Attempt to sign in
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // Provide user-friendly error messages
    if (error.message.includes("Invalid login credentials")) {
      return { error: "Invalid email or password. Please try again." };
    }
    if (error.message.includes("Email not confirmed")) {
      return { error: "Please confirm your email address before logging in." };
    }
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

/**
 * Server action for user registration
 */
export async function register(_prevState: unknown, formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();

  // Validate input
  const validationResult = registerSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!validationResult.success) {
    return {
      error: validationResult.error.issues[0]?.message ?? "Invalid input",
    };
  }

  const { email, password } = validationResult.data;

  // Create user in Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    // Provide user-friendly error messages
    if (authError.message.includes("already registered")) {
      return {
        error: "An account with this email already exists. Try logging in instead.",
      };
    }
    if (authError.message.includes("User already registered")) {
      return {
        error: "An account with this email already exists. Try logging in instead.",
      };
    }
    return { error: authError.message };
  }

  if (!authData.user) {
    return { error: "Failed to create user account. Please try again." };
  }

  // Create user record in our database with free trial
  const trialStartDate = new Date();
  const trialEndDate = new Date();
  trialEndDate.setDate(trialEndDate.getDate() + 7); // 7-day free trial

  try {
    await prisma.user.create({
      data: {
        id: authData.user.id,
        email,
        subscriptionTier: "FREE_TRIAL",
        subscriptionStatus: "TRIALING",
        freeTrialStartDate: trialStartDate,
        freeTrialEndDate: trialEndDate,
        maxAccounts: 1,
        dataRetentionMonths: 6,
      },
    });
  } catch (error) {
    console.error("Failed to create user in database:", error);
    // If this is a unique constraint error, user already exists
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
      return {
        error: "An account with this email already exists. Try logging in instead.",
      };
    }
    return {
      error: "Failed to create user account. Please contact support.",
    };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

/**
 * Server action for user logout
 */
export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
