import { defineContext, component, VElement, Signal } from "rocky7";
import { SupabaseClient, Session } from "@supabase/supabase-js";

export const AuthContext =
  defineContext<Signal<AuthSession | null>>("AUTH_CONTEXT");

export type AuthSession = Session | null;

export const AuthProvider = component<{
  children: VElement;
  client: SupabaseClient;
}>("AuthProvider", (props, { setContext, signal }) => {
  const $session = signal<AuthSession>("auth", null);
  props.client.auth.onAuthStateChange((event, session) => {
    //console.log(event, session);
    $session(session);
  });
  //console.log($session);
  setContext(AuthContext, $session);
  return props.children;
});
