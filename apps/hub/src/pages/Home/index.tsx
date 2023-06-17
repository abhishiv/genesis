/** @jsx h **/

import { component, h } from "rocky7";
import { PrimaryCTA } from "@app/components/index";
import styles from "./Home.module.css";
import { setTitle } from "@app/utils/index";

export const Home = component("Home", () => {
  setTitle("Home");
  return (
    <div>
      <h2 style="margin-top: 0;" class="css-1prverh">
        <i class="las la-rocket"></i> Future of work is here <br />
      </h2>
      <div class={styles.tagline}>
        <div class={styles.taglineColumn}>
          No-Code IDE with emacs style extensibility{" "}
        </div>
        <p>
          <PrimaryCTA label="Login" />
        </p>
        <div class={styles.integrations}>
          <h4>
            Works with{" "}
            <i class="fa-brands fa-github">
              {" "}
              <i class="fa-brands fa-npm"></i>
              <i class="fa-brands fa-square-js"></i>
            </i>
          </h4>
        </div>
      </div>
      <div class="container">
        <div class="columns">
          <div class="column col-12">
            <div class={styles.hero} style=""></div>
          </div>
        </div>
      </div>
    </div>
  );
});
