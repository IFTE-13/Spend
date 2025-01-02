import React from "react";

const AuthLayout = ({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) => {
    return (
        <div className="flex justify-center items-center h-full min-h-[calc(100vh-3rem)]">
            { children }
        </div>
    )
}

export default AuthLayout;