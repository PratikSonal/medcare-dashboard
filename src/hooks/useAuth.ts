// Components import useAuth — never the provider directly.
// To swap Firebase for Clerk/Auth0/Supabase: change the import below, nothing else.
export { useFirebaseAuth as useAuth } from "./useFirebaseAuth";
