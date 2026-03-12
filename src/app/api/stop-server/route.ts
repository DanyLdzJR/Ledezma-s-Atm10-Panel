import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { pin } = body;

    // Validate PIN
    const ADMIN_PIN = process.env.ADMIN_PIN;
    if (!ADMIN_PIN || pin !== ADMIN_PIN) {
      return NextResponse.json({ message: "Invalid or missing PIN" }, { status: 401 });
    }

    // Azure Credentials
    const tenantId = process.env.AZURE_TENANT_ID?.trim();
    const clientId = process.env.AZURE_CLIENT_ID?.trim();
    const clientSecret = process.env.AZURE_CLIENT_SECRET?.trim();
    const subscriptionId = process.env.AZURE_SUBSCRIPTION_ID?.trim();
    const resourceGroup = process.env.AZURE_RESOURCE_GROUP?.trim();
    const vmName = process.env.AZURE_VM_NAME?.trim();

    if (!tenantId || !clientId || !clientSecret || !subscriptionId || !resourceGroup || !vmName) {
      return NextResponse.json({ message: "Server misconfiguration: Missing Azure credentials" }, { status: 500 });
    }

    // 1. Get Azure AD Access Token
    const tokenParams = new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
      resource: "https://management.azure.com/",
    });

    const tokenRes = await fetch(`https://login.microsoftonline.com/${tenantId}/oauth2/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: tokenParams.toString(),
      cache: "no-store"
    });

    if (!tokenRes.ok) {
      throw new Error("Failed to obtain Azure AD token");
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // 2. Deallocate the VM using Azure REST API
    const deallocateRes = await fetch(
      `https://management.azure.com/subscriptions/${subscriptionId}/resourceGroups/${resourceGroup}/providers/Microsoft.Compute/virtualMachines/${vmName}/deallocate?api-version=2023-09-01`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!deallocateRes.ok && deallocateRes.status !== 202) {
      throw new Error(`Failed to deallocate VM: ${deallocateRes.statusText}`);
    }

    return NextResponse.json({ message: "Server is shutting down securely..." }, { status: 200 });

  } catch (error: any) {
    console.error("Stop Server Error:", error);
    return NextResponse.json({ message: error.message || "Internal server error" }, { status: 500 });
  }
}
