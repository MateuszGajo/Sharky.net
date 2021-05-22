import React, { useEffect, useState } from "react";
import { useUserStore } from "~root/src/app/providers/RootStoreProvider";
import { useRouter } from "next/router";
import Loading from "~common/Loading/Loading";

const PrivateRoute = (WrappedComponent: any) => () => {
  const router = useRouter();
  const { verifyUser } = useUserStore();
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    verifyUser()
      .then(() => {
        setLoading(false);
      })
      .catch(() => {
        router.push("/signin");
      });
  }, []);
  if (isLoading) return <Loading />;
  return <WrappedComponent />;
};

export default PrivateRoute;
