"use client";
import { useNavigation } from "./navigation/useNavigation";
import {
  useSession,
  useSignIn,
  useSignOut,
  useSilentRefresh,
} from "./server/auth";

const useAuth = () => {
  const navigation = useNavigation();
  const session = useSession();
  const isSignIn = Boolean(session.data?.expires);
  const refetchSession = session.refetch;
  const signOut = useSignOut({
    onSuccess: (data, variable) => {
      if (variable.callbackUrl) {
        navigation.navigate(variable.callbackUrl);
      }
      refetchSession();
    },
  });

  const signIn = useSignIn({
    onSuccess: () => {
      refetchSession();
    },
  });

  const _silentRefresh = useSilentRefresh({
    onSuccess: () => {
      refetchSession();
    },
  });

  return {
    isSignIn,
    signIn: signIn.mutateAsync,
    signOut: signOut.mutateAsync,
    silentRefresh: _silentRefresh.mutateAsync,
    isLoading: session.isLoading,
    isRefetching: session.isRefetching,
  };
};

export default useAuth;
