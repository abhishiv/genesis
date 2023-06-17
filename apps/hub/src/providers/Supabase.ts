import { defineContext, component, VElement, Signal } from "rocky7";
import { SupabaseClient } from "@supabase/supabase-js";

export const SupabaseContext =
  defineContext<Signal<SupabaseClient>>("SUPABASE_CONTEXT");

export const SupabaseProvider = component<{
  children: VElement;
  client: SupabaseClient;
}>("SupabaseProvider", (props, { setContext, signal }) => {
  setContext(SupabaseContext, signal("supabase", props.client));
  return props.children;
});
