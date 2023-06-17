/** @jsx h **/

import { component, h, render, When } from "rocky7";
import { AuthContext } from "@app/providers/index";
import { Link } from "rocky7-router";

import { useSupabaseQuery } from "@app/hooks/index";
import { AuthSession } from "@supabase/supabase-js";
import styles from "./Dashboard.module.css";
import { setTitle } from "@app/utils/index";

export const DashboardList = component<{ projects: any[] }>(
  "DashboardList",
  (props, utils) => {
    setTitle("Dashboard");
    return (
      <div class="container">
        <div class="columns">
          <div class="column col-8 col-sm-12">
            <div style="padding: 5px 0">
              {props.projects.map((project, i) => {
                return (
                  <div key={i} class={styles.item}>
                    <div style="">
                      <a
                        style="font-size:24px; font-weight: bold;"
                        target="_blank"
                        href={`https://${project.slug}.grati.co`}
                      >
                        <i class="las la-atom"></i> {project.name}
                      </a>
                    </div>
                    <p style="color: #444">(no description)</p>
                  </div>
                );
              })}
            </div>
          </div>
          <div class="column col-4 col-sm-12">
            <div class={styles.columnImage} style=""></div>
          </div>
        </div>
      </div>
    );
  }
);

export const Dashboard = component("Dashboard", (props, utils) => {
  const $session = utils.getContext(AuthContext);
  return (
    <When
      condition={($) => !!$session($)}
      views={{
        true: () => {
          const session = $session() as AuthSession;
          return <DashboardFetcher user_id={session.user.id} />;
        },
        false: () => {
          return (
            <div>
              Please{" "}
              <strong>
                <Link href="/hq/users/sign_in">login first</Link>
              </strong>
            </div>
          );
        },
      }}
    ></When>
  );
});
export const DashboardFetcher = component<{ user_id: string }>(
  "DashboardFetcher",
  (props, utils) => {
    const resp = useSupabaseQuery("projects", utils, (supabase) =>
      supabase
        .from("project_memberships")
        .select("projects(id, slug, name)")
        .eq("user_id", props.user_id)
    );
    console.log("resp", resp);

    return (
      <div id="dashboard">
        <div style="display: flex;">
          <h2 style="flex: 1">
            <i class="las la-stream"></i> workspaces
          </h2>
          <Link
            role="button"
            href="/projects/new"
            style="display: inline-block; border-radius: 3px;"
            class="btn link"
          >
            <i class="las la-plus-circle"></i>
          </Link>
        </div>
        <section>
          <When
            condition={($) => !!resp.$loading($)}
            views={{
              true: () => "...",
              false: () => (
                <DashboardList
                  projects={resp.$data().map((el: any) => el.projects)}
                />
              ),
            }}
          ></When>
        </section>
      </div>
    );
  }
);
