import { ClientRenderingPage } from "./ClientRenderingPage";

/*
  /csr route

  This file is a Server Component by default because it does not use "use client".
  Next.js can create the route shell on the server, but the actual CSR lesson lives
  in ClientRenderingPage because CSR needs browser-only React hooks like useEffect.

  In the browser:
  1. The user receives the page shell.
  2. The client JavaScript downloads and hydrates.
  3. ClientRenderingPage fetches posts after hydration.
  4. The loader is replaced with the real UI.
*/
export default function CsrPage() {
  return <ClientRenderingPage />;
}
