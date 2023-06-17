#!/usr/bin/python
# -*- coding: utf-8 -*-
import json
import os
import urllib.parse

from flask import Flask, redirect
from flask import request
from authlib.integrations.flask_oauth2 import AuthorizationServer
from authlib.oauth2.rfc6749 import grants
from supabase import create_client, Client

SUPABASE_URL = os.environ.get("VITE_SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SECRET_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

app = Flask(__name__)

class User:
    def __init__(self, id):
        self.id = id

    def get_user_id(self):
        return self.id


class Client:
    def __init__(
        self,
        id,
        client_id,
        client_secret,
        user_id,
        response_type,
        default_redirect_uri,
    ):
        self.id = id
        self.client_id = client_id
        self.client_secret = client_secret
        self.user_id = user_id
        self.response_type = response_type
        self.default_redirect_uri = default_redirect_uri

    def get_client_id(self):
        return self.client_id

    def get_default_redirect_uri(self):
        return self.default_redirect_uri

    def get_allowed_scope(self, scope):
        return [scope]

    def check_redirect_uri(self, redirect_uri):
        if os.environ.get("VERCEL_ENV") == "preview":
            return True
        else:
            return redirect_uri == self.default_redirect_uri

    def check_client_secret(self, client_secret):
        return client_secret == self.client_secret

    def check_response_type(self, response_type):
        return True

    def check_grant_type(self, grant_type):
        return True

    def check_endpoint_auth_method(self, method, endpoint):
        return True

    def get_client_secret(self):
        raise self.client_secret


class Token:
    def __init__(
        self,
        id,
        access_token,
        refresh_token,
        client_id,
        expires_at,
        scope,
        user_id,
    ):
        self.id = id
        self.access_token = access_token
        self.refresh_token = refresh_token
        self.client_id = client_id
        self.expires_at = expires_at
        self.scope = scope
        self.user_id = user_id


class OAuth2AuthorizationCode:
    def __init__(
        self,
        code,
        client_id,
        redirect_uri,
        scope,
        user_id,
        code_challenge,
        code_challenge_method,
    ):
        self.id = id
        self.redirect_uri = redirect_uri
        self.code = code
        self.client_id = client_id
        self.scope = scope
        self.user_id = user_id
        self.code_challenge = code_challenge
        self.code_challenge_method = code_challenge_method

    def get_redirect_uri(self):
        return self.redirect_uri

    def get_scope(self):
        return self.scope

class AuthorizationCodeGrant(grants.AuthorizationCodeGrant):

    TOKEN_ENDPOINT_AUTH_METHODS = ["client_secret_basic", "client_secret_post", "none"]

    def save_authorization_code(self, code, request):
        auth_code = OAuth2AuthorizationCode(
            code=code,
            client_id=request.client.client_id,
            redirect_uri=request.redirect_uri,
            scope=request.scope,
            user_id=request.user.id,
            code_challenge="",
            code_challenge_method="",
        )
        payload = {
            "code": auth_code.code,
            "scope": auth_code.scope,
            "user_id": auth_code.user_id,
            "client_id": auth_code.client_id
        }
        data = supabase.table("oauth_authorization_codes").insert(payload).execute()
        if len(data.data) > 0:
            return auth_code
        else:
            raise ValueError("Error")

    def query_authorization_code(self, code, client):
        data = supabase.table("oauth_authorization_codes").select("*").eq("code", code).execute()
        if len(data.data) > 0:
            obj = data.data[0]
            auth_code = OAuth2AuthorizationCode(  # PKCE specific fields
                code=obj.get("code"),
                client_id=client.client_id,
                redirect_uri=client.default_redirect_uri,
                scope=obj.get("scope"),
                user_id=obj.get("user_id"),
                code_challenge="",
                code_challenge_method="",
            )
            return auth_code

    def delete_authorization_code(self, authorization_code):
        return

    def authenticate_user(self, authorization_code):
        return User(id=authorization_code.user_id)


def query_client(client_id):
    data = supabase.table("oauth_clients").select("*").eq("client_id", urllib.parse.quote(client_id)).execute()

    if len(data.data) > 0:
        obj = data.data[0]
        print(obj.get("default_redirect_uri"))
        return Client(
            client_id=obj.get("client_id"),
            id=obj.get("id"),
            client_secret=obj.get("client_secret"),
            user_id=obj.get("user_id"),
            response_type="code",
            default_redirect_uri=obj.get("default_redirect_uri"),
        )


def save_token(token_data, request):
    payload = {
        "token": token_data.get("access_token"),
        "client_id": request.client.client_id,
        "user_id": request.user.id
    }
    data = supabase.table("oauth_tokens").insert(payload).execute()
    if len(data.data) > 0:
        return True
    else:
        raise ValueError("Error")


server = AuthorizationServer(app, query_client=query_client, save_token=save_token)
server.register_grant(AuthorizationCodeGrant)


def parse_cookie(cookie_string):
    auth_cookie = request.cookies.get("auth")
    if auth_cookie and len(auth_cookie) > 0:
        decoded_auth_cookie = urllib.parse.unquote(auth_cookie)
        auth = json.loads(decoded_auth_cookie)
        return auth


@app.route("/api/oauth/authorize", methods=["GET", "POST"])
def authorize():
    # Login is required since we need to know the current resource owner. It can be done with a redirection to the login page, or a login form on this authorization page.
    auth = parse_cookie(request.cookies.get("auth"))
    if request.method == "GET":
        grant_url = (
            "/hq/users/authorize_application?original_request={}&client_id={}".format(
            urllib.parse.quote(
                request.path + "?" + str(request.query_string, "utf-8")
            ),
            request.args.get('client_id')
            )
        )
        # here check if the user has already authorized and in that case instead of showing authorize page just send the code to redirect_url
        if auth and auth.get("user_id"):
            data = supabase.table("oauth_tokens").select("*").eq("user_id", auth.get("user_id")).eq('client_id', request.args.get('client_id')).execute()
            is_already_authorized = len(data.data) > 0

            if is_already_authorized:
                return server.create_authorization_response(
                    grant_user=User(auth.get("user_id"))
                )
            else:
                grant = server.get_consent_grant(end_user=User(auth.get("user_id")))
                client = grant.client
                scope = client.get_allowed_scope(grant.request.scope)
                return redirect(grant_url, code=302)
        else:
            return redirect(
                "/hq/users/sign_in?redirect_to=" + urllib.parse.quote(grant_url),
                code=302,
            )
    else:
        # POST 
        confirmed = request.form["confirm"]
        if confirmed and auth and auth.get("user_id"):
            # granted by resource owner
            return server.create_authorization_response(
                grant_user=User(auth.get("user_id"))
            )
        else:
            # denied by resource owner
            return server.create_authorization_response(grant_user=None)

@app.route("/api/oauth/token", methods=["POST"])
def issue_token():
    # todo: if token already exists reuse it instead of creating another
    return server.create_token_response()
