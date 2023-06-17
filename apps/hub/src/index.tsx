/** @jsx h **/

import { component, h, When } from "rocky7";
import {
  Switch,
  Route,
  Link,
  BrowserRouter,
  RouterContext,
} from "rocky7-router";

import { createClient } from "@supabase/supabase-js";

import {
  SupabaseProvider,
  AuthProvider,
  AuthContext,
  SupabaseContext,
} from "@app/providers/index";

import {
  Home,
  About,
  Terms,
  Privacy,
  CreateProject,
  Login,
  VerifyLogin,
  AuthorizeApplication,
  Sink,
  Dashboard,
} from "@app/pages/index";

import { setCookie, unsetCookie } from "./utils/index";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export const Header = component("Header", (props, { getContext }) => {
  const $session = getContext(AuthContext);
  const $supabase = getContext(SupabaseContext);
  const supabase = $supabase();
  const $router = getContext(RouterContext);

  // OAuth redirection hack since supabsae doesn't support redirection
  // todo: better way of doing it
  // https://github.com/orgs/supabase/discussions/3703
  const redirectTo = localStorage.getItem("oauth_redirection");
  if (redirectTo && redirectTo[0] === "/") {
    localStorage.removeItem("oauth_redirection");
    $router().navigate(redirectTo);
  }

  // refresh cookie on each page load
  setCookie(supabase).catch((err) => {
    console.error(err);
    // todo: does throwing work here?
    throw err;
  });

  return (
    <header style={`padding: 0 4px; z-index: 999999; `} class="navbar">
      <section class="navbar-section">
        <Link
          title="Home"
          style="font-size: 32px;"
          href="/"
          class="navbar-brand mr-2"
        >
          <i class="las la-cubes"></i>{" "}
        </Link>
      </section>
      <section class="navbar-section">
        <When
          condition={($) => {
            return $session($) !== null;
          }}
          views={{
            true: () => {
              return (
                <a
                  key="true"
                  role="button"
                  class="btn link"
                  href="#"
                  onClick={async (e) => {
                    e.preventDefault();
                    await unsetCookie(supabase);
                    // todo: clear cookies as well by exposing a method to clear cookies
                    //window.location.reload();
                  }}
                  style="display: inline-block;border-radius: 3px;"
                >
                  <i class="las la-sign-out-alt"></i>{" "}
                </a>
              );
            },
            false: () => {
              return (
                <Link
                  key="false"
                  role="button"
                  href="/hq/users/sign_in"
                  style="display: inline-block; border-radius: 3px;"
                >
                  <i class="las la-address-card"></i>{" "}
                  <span style="margin-right: 5px;">Sign up</span>
                </Link>
              );
            },
          }}
        ></When>
      </section>
    </header>
  );
});

export const Layout = component(
  "Layout",
  (props, { signal, wire, setContext }) => {
    return (
      <SupabaseProvider client={supabase}>
        <AuthProvider client={supabase}>
          <BrowserRouter>
            <div style=" display: flex; flex-direction: column; position: relative; padding-bottom: 37px;">
              <Header />
              <section
                style={`flex: 1; padding-top: 40px;`}
                class="container grid-md"
              >
                <Switch
                  onChange={() => {
                    if (typeof window !== "undefined") window.scrollTo(0, 0);
                  }}
                >
                  <Route key="home" path="" component={Home}></Route>
                  <Route key="about" path="about" component={About}></Route>
                  <Route
                    key="terms"
                    path="legal/terms"
                    component={Terms}
                  ></Route>
                  <Route
                    key="privacy"
                    path="legal/privacy"
                    component={Privacy}
                  ></Route>
                  <Route
                    key="dashboard"
                    path="dashboard"
                    component={Dashboard}
                  ></Route>
                  <Route
                    key="create_project"
                    path="projects/new"
                    component={CreateProject}
                  ></Route>
                  <Route
                    key="login"
                    path="hq/users/sign_in"
                    component={Login}
                  ></Route>
                  <Route
                    key="register"
                    path="hq/users/verify"
                    component={VerifyLogin}
                  ></Route>
                  <Route
                    key="authorize_application"
                    path="hq/users/authorize_application"
                    component={AuthorizeApplication}
                  ></Route>
                  <Route key="sink" path="meta/sink" component={Sink}></Route>
                </Switch>
              </section>

              <header
                style={`position: fixed; width: 100%; bottom: 0;`}
                class="navbar"
              >
                <section class="navbar-section">
                  <Link class="btn btn-link" href="/about">
                    About
                  </Link>
                  <Link class="btn btn-link" href="/legal/terms">
                    Terms
                  </Link>
                  <Link class="btn btn-link" href="/legal/privacy">
                    Privacy
                  </Link>
                  <a
                    href="javascript:window.cc.showSettings();"
                    data-cc="c-settings"
                    title="Cookie settings"
                  >
                    <i class="las la-cookie-bite"></i>{" "}
                  </a>{" "}
                </section>
                <section style="padding: 0 5px;" class="navbar-section">
                  <a
                    aria-label="gratico github"
                    style="margin: 0 5px"
                    target="_blank"
                    href="https://github.com/gratico"
                  >
                    <i class="lab la-github"></i>{" "}
                  </a>
                  <a
                    aria-label="gratico twitter"
                    style="margin: 0 5px"
                    target="_blank"
                    href="https://twitter.com/graticoTweets"
                  >
                    <i class="lab la-twitter"></i>{" "}
                  </a>
                </section>
              </header>
            </div>
          </BrowserRouter>
        </AuthProvider>
      </SupabaseProvider>
    );
  }
);
