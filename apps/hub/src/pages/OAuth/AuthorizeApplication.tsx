/** @jsx h **/

import { component, h, When } from "rocky7";
import { Link, RouterContext } from "rocky7-router";
import { SupabaseContext } from "@app/providers/index";
import { useSupabaseQuery } from "@app/hooks/index";
import { setTitle } from "@app/utils/index";

export const AuthorizeApplication = component(
  "AuthorizeApplication",
  (props, utils) => {
    setTitle("Authorize");
    const supabase = utils.getContext(SupabaseContext)();
    const router = utils.getContext(RouterContext)();
    const resp = useSupabaseQuery("projects", utils, (supabase) =>
      supabase
        .from("projects")
        .select("*")
        .eq("id", router.getQuery().client_id)
    );
    return (
      <When
        condition={($) => !!resp.$loading($)}
        views={{
          true: () => "...",
          false: () => {
            const data = resp.$data();
            if (data && data.length > 0) {
              const project = data[0];
              return <AuthorizeApplicationInner project={project} />;
            } else {
              return "Project not found";
            }
          },
        }}
      ></When>
    );
  }
);

export const AuthorizeApplicationInner = component<{ project: any }>(
  "AuthorizeApplicationInner",
  (props, { signal, getContext, wire }) => {
    const router = getContext(RouterContext)();
    const query = router.getQuery();
    return (
      <div>
        <div class="form_container">
          <h2>Authorize project</h2>

          <p>
            If you want to access the project{" "}
            <strong>{props.project.name}</strong>, please click on authorize.
          </p>
          <p>This project will only have access to your user profile.</p>
          <form
            method={"post"}
            action={query.original_request}
            accept-charset="UTF-8"
          >
            <div class="actions">
              <input type="hidden" name="confirm" value="true" />
              <input style="" type="submit" name="login" value="Authorize" />
            </div>
          </form>

          <p>
            <Link href="/">
              <strong>Go back!</strong>
            </Link>
          </p>
        </div>
      </div>
    );
  }
);
