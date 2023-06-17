import { SupabaseClient } from "@supabase/supabase-js";
import { ComponentUtils, Signal } from "rocky7";
import { SupabaseContext } from "../providers/index";

type Resp = {
  $data: Signal<any | null>;
  $error: Signal<any | null>;
  $loading: Signal<boolean | null>;
};

export function useSupabaseQuery(
  queryName: string,
  utils: ComponentUtils,
  query: (supabase: SupabaseClient) => any
): Resp {
  const supabase = utils.getContext(SupabaseContext)();
  const supabaseQuery = query(supabase) as Promise<any>;
  const $loading: Resp["$loading"] = utils.signal<boolean | null>(
    queryName + "/loading",
    true
  );
  const $data = utils.signal<any>(queryName + "/data", null);
  const $error = utils.signal<any>(queryName + "/error", true);

  supabaseQuery
    .then(({ data, error }) => {
      console.log("got", data, error);
      if (error) {
        $error(error);
        $data(null);
        $loading(false);
      } else {
        $error(null);
        $data(data);
        $loading(false);
      }
    })
    .catch((err) => {
      $error(err);
      $data(null);
      $loading(false);
    });
  return { $data, $loading, $error };
}
