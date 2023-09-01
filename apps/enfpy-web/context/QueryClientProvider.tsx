"use client";

import {
  focusManager,
  QueryClient,
  QueryClientProvider as _QueryClientProvider,
} from "@tanstack/react-query";
import React, { PropsWithChildren } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

/**
 * TODO: 디폴트 설정
 * TODO: RN 화면이동시 포커스되도록 할 수 있는지?
 * @note By default, React Query Devtools are only included in bundles when process.env.NODE_ENV === 'development', so you don't need to worry about excluding them during a production build.
 * @see https://tanstack.com/query/v4/docs/react/devtools
 */
const queryClient = new QueryClient({});

/**
 * 윈도우 포커스 시점을 커스텀한다.
 * WebView의 경우 화면 이동시 바로 포커스되지 않고 한번 탭해야 하는 이슈가 있다.
 * RN에서 App 포커스 시점을 구독후 메세지로 전달하는 방법도 있다.
 * @see https://tanstack.com/query/v4/docs/react/guides/window-focus-refetching#custom-window-focus-event
 * @see https://tanstack.com/query/v4/docs/react/guides/window-focus-refetching#managing-focus-in-react-native
 */
focusManager.setEventListener((handleFocus) => {
  // Listen to visibilitychange and focus
  if (typeof window !== "undefined" && window.addEventListener) {
    // @ts-ignore
    window.addEventListener("visibilitychange", handleFocus, false);
    // @ts-ignore
    window.addEventListener("focus", handleFocus, false);
  }

  return () => {
    // Be sure to unsubscribe if a new handler is set
    // @ts-ignore
    window.removeEventListener("visibilitychange", handleFocus);
    // @ts-ignore
    window.removeEventListener("focus", handleFocus);
  };
});

export default function QueryClientProvider({ children }: PropsWithChildren) {
  return (
    <_QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      {children}
    </_QueryClientProvider>
  );
}
