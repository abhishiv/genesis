/** @jsx h **/

import { component, h, When } from "rocky7";
import { Link } from "rocky7-router";

import { AuthContext } from "../../providers/index";

export const PrimaryCTA = component<{ label?: string }>(
  "PrimaryCTA",
  (props, { getContext }) => {
    const $session = getContext(AuthContext);
    return (
      <When
        condition={($) => {
          return $session($) !== null;
        }}
        views={{
          true: () => {
            return (
              <Link
                key="true"
                role="button"
                href="/dashboard"
                style="display: inline-block; border-radius: 3px;"
              >
                <span class="css-6ssg2k">
                  <i class="las la-stream"></i> Your Projects
                </span>
              </Link>
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
                <span style="margin-right: 5px;">
                  {props.label || "Sign up"}
                </span>
              </Link>
            );
          },
        }}
      ></When>
    );
  }
);
