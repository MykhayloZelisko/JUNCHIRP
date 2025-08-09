import {
  fetchBaseQuery,
  BaseQueryFn,
  createApi,
  QueryReturnValue,
  FetchBaseQueryMeta,
  BaseQueryApi,
} from '@reduxjs/toolkit/query/react';
import type { FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { csrfApi } from './csrfApi';
import csrfSelector from '@/redux/csrf/csrfSelector';

interface CsrfErrorData {
  code: string;
  message?: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const isAuthRequest = (args: string | FetchArgs, method: string): boolean => {
  const url = typeof args === 'string' ? args : args.url;
  return (
    method === 'POST' &&
    (url.endsWith('auth/login') || url.endsWith('auth/register'))
  );
};

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: 'include',
});

const isCsrfError = (error: FetchBaseQueryError | undefined): boolean => {
  return error
    ? error.status === 403 &&
        (error.data as CsrfErrorData)?.code === 'EBADCSRFTOKEN'
    : false;
};

const getCsrfTokenFromStore = (api: BaseQueryApi): string | undefined => {
  return csrfSelector.selectCsrfToken(api.getState());
};

const fetchNewCsrfToken = async (
  api: BaseQueryApi,
): Promise<string | undefined> => {
  const result = await api.dispatch(
    csrfApi.endpoints.getCsrfToken.initiate(undefined),
  );
  if ('data' in result) {
    return result.data;
  }
  return undefined;
};

const baseQueryWithReauthAndCsrf: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const method = typeof args === 'string' ? 'GET' : (args.method ?? 'GET');

  const attachCsrfHeader = async (
    arg: string | FetchArgs,
  ): Promise<string | FetchArgs> => {
    let token = getCsrfTokenFromStore(api);
    token ??= await fetchNewCsrfToken(api);

    if (!token) {
      return arg;
    }

    if (typeof arg === 'string') {
      return {
        url: arg,
        method,
        headers: { 'x-csrf-token': token },
      };
    } else {
      return {
        ...arg,
        headers: {
          ...arg.headers,
          'x-csrf-token': token,
        },
      };
    }
  };

  if (method !== 'GET') {
    args = await attachCsrfHeader(args);
  }

  let result = await baseQuery(args, api, extraOptions);

  const retryRequest = async (): Promise<
    QueryReturnValue<
      unknown,
      FetchBaseQueryError,
      FetchBaseQueryMeta | undefined
    >
  > => {
    args = await attachCsrfHeader(args);
    return baseQuery(args, api, extraOptions);
  };

  if (isCsrfError(result.error)) {
    await fetchNewCsrfToken(api);
    result = await retryRequest();
  }

  if (result.error?.status === 401 && !isAuthRequest(args, method)) {
    const token = getCsrfTokenFromStore(api) ?? (await fetchNewCsrfToken(api));

    const refreshResp = await fetch(`${BASE_URL}/auth/refresh-token`, {
      method: 'POST',
      credentials: 'include',
      headers: token ? { 'x-csrf-token': token } : {},
    });

    if (refreshResp.ok) {
      result = await retryRequest();
    } else {
      api.dispatch({ type: 'auth/logout' });
    }
  }

  return result;
};

const mainApi = createApi({
  reducerPath: 'mainApi',
  baseQuery: baseQueryWithReauthAndCsrf,
  tagTypes: [
    'auth',
    'soft-skills',
    'hard-skills',
    'educations',
    'socials',
    'project-roles-list',
    'users',
    'my-projects',
    'invites',
  ],
  endpoints: () => ({}),
});

export default mainApi;
