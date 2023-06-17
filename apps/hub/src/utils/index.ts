import { SupabaseClient } from "@supabase/supabase-js";

export function setTitle(title: string) {
  try {
    document.title = `${title} | gratico`;
  } catch (e) {
    // ssr
  }
}

export async function unsetCookie(supabase: SupabaseClient) {
  const resp = await supabase.auth.signOut();
  console.log(resp);
  const deleteResp = await fetch("/api/auth/cookie", {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
}
export async function setCookie(supabase: SupabaseClient) {
  return supabase.auth.getSession().then(({ data, error }) => {
    console.log(data, error);
    if (error) {
      throw error;
    } else if (data && data.session) {
      const resp = fetch("/api/auth/cookie", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          expires_at: data.session.expires_at,
          user_id: data.session.user?.id,
        }),
      });
      return data;
    }
  });
}
