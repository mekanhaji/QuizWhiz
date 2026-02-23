"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { createClient } from "@/utils/supabase/server";

function toAuthPath(
  mode: "login" | "signup",
  key: "error" | "message",
  value: string,
) {
  const params = new URLSearchParams({ mode, [key]: value });
  return `/auth?${params.toString()}`;
}

export async function login(formData: FormData) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect(toAuthPath("login", "error", error.message));
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(formData: FormData) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { data: signUpData, error } = await supabase.auth.signUp(data);

  if (error) {
    redirect(toAuthPath("signup", "error", error.message));
  }

  if (!signUpData.session) {
    redirect(
      toAuthPath(
        "login",
        "message",
        "Check your email for a confirmation link before logging in.",
      ),
    );
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signout() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.auth.signOut();

  if (error) {
    redirect(toAuthPath("login", "error", error.message));
  }

  revalidatePath("/", "layout");
  redirect("/auth");
}
