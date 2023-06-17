/** @jsx h **/

import { component, h } from "rocky7";
import { AuthContext } from "@app/providers/index";
import { RouterContext } from "rocky7-router";
import { SupabaseContext } from "@app/providers/index";

import styles from "./New.module.css";
import { setTitle } from "@app/utils/index";

export const CreateProject = component(
  "CreateProject",
  (props, { signal, wire, getContext }) => {
    setTitle("New Project");
    const $session = getContext(AuthContext);
    const supabase = getContext(SupabaseContext)();
    const router = getContext(RouterContext)();
    const $token = signal("code", "");
    const loading = signal("loading", false);
    return (
      <div id="projects">
        <div class="container">
          <div class="columns">
            <div class="column col-5 col-sm-12">
              <h2>
                <i class="las la-stream"></i> New Project
              </h2>
              <div style="margin: 0" class="form_container">
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const { data: sessionData, error: sessionError } =
                      await supabase.auth.getSession();
                    if (sessionError) return alert(sessionError.message);
                    const formData = new FormData(e.target as HTMLFormElement);
                    const json = Object.fromEntries(formData);
                    const { data: projectData, error: projectCreateError } =
                      await supabase.from("projects").insert({
                        name: json.name,
                        slug: json.name.toString().toLowerCase(),
                        is_public: true,
                        owner_id: sessionData.session?.user.id,
                      });
                    if (projectCreateError) {
                      alert(projectCreateError.message);
                    } else {
                      router.navigate("/dashboard");
                    }
                  }}
                  accept-charset="UTF-8"
                >
                  <div class="field">
                    <label>Name</label>
                    <input
                      autofocus={true}
                      name="name"
                      type="text"
                      pattern=".{1,}"
                      required
                      onInput={(e) => {
                        const target = e.target as HTMLInputElement;
                        if (target) {
                          $token(target.value);
                        }
                      }}
                    />
                  </div>
                  <br />
                  <div class="actions">
                    <button type="submit">
                      create <i class="las la-plus-circle"></i>
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div class="column col-7 col-sm-12">
              <div class={styles.columnImage} style=""></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);
