import express from "express";
import CookieParser from "cookie-parser";
import BodyParser from "body-parser";
import morgan from "morgan";
import { createClient } from "@supabase/supabase-js";

const app = express();

app.use(morgan("tiny"));
app.use(CookieParser(undefined, {}));
app.use(BodyParser.json());

app.post("/api/auth/cookie", (req, res) => {
  const attrs = req.body;
  const value = JSON.stringify(attrs);
  res.cookie("auth", value, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 365,
  });

  res.send({});
});

app.delete("/api/auth/cookie", (req, res) => {
  res.clearCookie("auth");
  res.send({});
});

app.get("/api/auth/me", async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL as string,
    process.env.SUPABASE_SECRET_KEY as string
  );
  // todo: error handling
  const { data, error } = await supabase
    .from("oauth_tokens")
    .select()
    .eq("token", req.query.token);
  console.log(error);
  console.log("token", req.query.token);
  console.log("data", data);
  const accessToken = (data || [])[0];
  if (accessToken) {
    console.log("accessToken", accessToken);
    return res.status(200).send({
      id: accessToken.user_id,
    });
  } else {
    return res.status(401).send(error);
  }
});

export default app;
