import { NextResponse } from "next/server";

export async function GET() {
  // Redirect to the CurseForge .zip format which worked reliably in Prism Launcher
  return NextResponse.redirect("https://raw.githubusercontent.com/DanyLdzJR/Ledezma-s-Atm10/main/Ledezmas%20ATM10%20Server-1.0.0.zip");
}
