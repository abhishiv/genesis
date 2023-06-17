/** @jsx h **/

import { component, h, SubToken } from "rocky7";
import { Link, RouterContext } from "rocky7-router";
import { SupabaseContext } from "@app/providers/index";

import styles from "./Auth.module.css";
import { setTitle } from "@app/utils/index";

export function getSiteHostname() {
  const domain =
    import.meta.env.VITE_SITE_URL || import.meta.env.VITE_VERCEL_URL;
  const protocol = domain.match(/localhost/) ? "http" : `https`;
  return `${protocol}://${domain}`;
}

export const Login = component(
  "Login",
  (props, { getContext, signal, wire }) => {
    setTitle("Login");
    const router = getContext(RouterContext)();
    const supabase = getContext(SupabaseContext)();
    const $email = signal("email", "");
    const $loading = signal("loading", false);
    const redirectTo = router.getQuery().redirect_to;
    return (
      <div>
        <div class="form_container">
          <h2>Authenticate</h2>

          <div class={styles.socialLogin}>
            <a
              onClick={async (e) => {
                e.preventDefault();
                if (redirectTo && redirectTo[0] == "/")
                  localStorage.setItem("oauth_redirection", redirectTo);
                const { data, error } = await supabase.auth.signInWithOAuth({
                  provider: "github",
                  options: {},
                });
                console.log("data", data, error);
              }}
              class={"btn link " + styles.github}
              href="#"
            >
              Login with <i class="lab la-github-alt"></i>{" "}
            </a>

            <a
              onClick={async (e) => {
                e.preventDefault();
                const { data, error } = await supabase.auth.signInWithOAuth({
                  provider: "google",
                });
                console.log("data", data, error);
              }}
              class={"btn link disabled " + styles.google}
              href="#"
            >
              Login with <i class="lab la-google"></i>
            </a>
            <a
              onClick={async (e) => {
                e.preventDefault();
                const { data, error } = await supabase.auth.signInWithOAuth({
                  provider: "apple",
                });
                console.log("data", data, error);
              }}
              class={"btn link disabled " + styles.apple}
              href="#"
            >
              Login with <i class="lab la-apple"></i>
            </a>
          </div>
          <div class={styles.divider}>
            <p>Login with email</p>
            <div></div>
          </div>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              console.log($email());
              const email = $email();
              if (!email || email.length == 0) {
                alert("Please provide a valid email address");
                return;
              }
              $loading(true);
              const { data, error } = await supabase.auth.signInWithOtp({
                email: $email(),
                options: {
                  emailRedirectTo: new URL(
                    "hq/users/verify",
                    getSiteHostname()
                  ).toString(),
                },
              });
              $loading(false);
              console.log(data, error);
              if (error) {
                alert(error.message);
              } else {
                router.navigate(
                  `/hq/users/verify?email=${encodeURIComponent(
                    email
                  )}&redirect_to=${
                    redirectTo ? encodeURIComponent(redirectTo) : ""
                  }`
                );
              }
            }}
            accept-charset="UTF-8"
          >
            <p>
              We’ll email you a magic code for a password-free sign in. If you
              don't have an account, we'll create one for you!
            </p>

            <div class="field">
              <label for="user_email">Email</label>
              <br />
              <input
                autofocus={true}
                autocomplete="email"
                type="email"
                name="user[email]"
                value={wire($email)}
                onInput={(e) => {
                  const target = e.target as HTMLInputElement;
                  //              console.log("target", target, target.value);
                  if (target) {
                    $email(target.value);
                  }
                }}
              />
            </div>

            <p>
              By signing up you acknowledge that you agree with our{" "}
              <strong>
                <Link href="/legal/terms">Terms of Services</Link>
              </strong>{" "}
              and with our{" "}
              <strong>
                <Link href="/legal/privacy">Privacy Policy</Link>
              </strong>
            </p>

            <div class="actions">
              <button
                disabled={
                  wire(($: SubToken) => {
                    const email = $email($);
                    // console.log("email", email, $loading($));
                    const v =
                      !email || $loading($) ? (true as boolean) : undefined;
                    // console.log("v", v, $.wire);
                    return v;
                  }) as any
                }
                type="submit"
                name="commit"
                data-disable-with="Log in"
              >
                {" "}
                <i class="las la-fingerprint"></i> Log in{" "}
              </button>
            </div>
          </form>
          <a target="_blank" href="http://twitter.com/graticoTweets">
            Problems? Let us know!
          </a>
          <br />
        </div>
      </div>
    );
  }
);
