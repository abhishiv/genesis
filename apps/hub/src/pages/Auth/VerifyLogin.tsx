/** @jsx h **/

import { component, h, SubToken } from "rocky7";
import { Link, RouterContext } from "rocky7-router";
import { SupabaseContext } from "@app/providers/index";
import { setCookie, setTitle } from "@app/utils/index";

export const VerifyLogin = component(
  "VerifyLogin",
  (props, { signal, getContext, wire }) => {
    setTitle("Verify Login");
    const supabase = getContext(SupabaseContext)();
    const router = getContext(RouterContext)();
    const $token = signal("token", "");
    const $loading = signal("loading", false);
    return (
      <div>
        <div class="form_container">
          <h2>Check your email for a code</h2>

          <p>
            We’ve sent a 6-character code to email you supplied. The code
            expires shortly, so please enter it soon.
          </p>

          <p>
            Can’t find your code? <strong>Check your spam folder!</strong>
          </p>

          <form
            onSubmit={async (e) => {
              console.log(router.getQuery().email);
              e.preventDefault();
              const token = $token();
              if (!token || token.length == 0) {
                alert("Please provide a code");
                return;
              }
              $loading(true);
              const { data, error } = await supabase.auth.verifyOtp({
                email: router.getQuery().email,
                token: token,
                type: "email",
              });
              console.log(data, error);
              if (error) {
                $loading(false);
                alert(error.message);
              } else {
                router.navigate(router.getQuery().redirect_to || "/");
                setCookie(supabase).catch((err) => {
                  console.error(err);
                  throw err;
                });
              }
            }}
            accept-charset="UTF-8"
          >
            <div class="field">
              <input
                autofocus={true}
                type="number"
                value={wire($token)}
                onInput={(e) => {
                  const target = e.target as HTMLInputElement;
                  if (target) {
                    $token(target.value);
                  }
                }}
              />
            </div>

            <div style="padding: 10px 0;" class="actions">
              <button
                disabled={
                  wire(($: SubToken) => {
                    const token = $token($);
                    return !token || $loading($)
                      ? (true as boolean)
                      : undefined;
                  }) as any
                }
                type="submit"
                name="login"
              >
                <i class="las la-fingerprint"></i> Login
              </button>
            </div>
          </form>
          <p>
            <Link
              href={wire(($: SubToken) => {
                const redirectTo = router.getQuery().redirect_to;
                return `/hq/users/sign_in?redirect_to=${
                  redirectTo && redirectTo.length > 0
                    ? encodeURIComponent(redirectTo)
                    : undefined
                }`;
              })}
            >
              <strong>Request code again!</strong>
            </Link>
          </p>
        </div>
      </div>
    );
  }
);
