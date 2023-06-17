/** @jsx h **/

import { component, h, When } from "rocky7";
import { useSupabaseQuery } from "@app/hooks/index";

import styles from "./Legal.module.css";
import { setTitle } from "@app/utils/index";

export const Terms = component("Terms", (props, utils) => {
  setTitle("Terms");
  const resp = useSupabaseQuery("public_content", utils, (supabase) =>
    supabase.from("public_content").select("*").eq("id", "terms_of_service")
  );
  return (
    <When
      condition={($) => !!resp.$loading($)}
      views={{
        true: () => "...",
        false: () => {
          const data = resp.$data();
          if (data && data.length > 0) {
            const page = data[0];
            return (
              <div
                class={styles.page}
                dangerouslySetInnerHTML={{ __html: page.content }}
              />
            );
          } else {
            return "error";
          }
        },
      }}
    ></When>
  );
});
