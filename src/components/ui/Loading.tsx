import React from "react";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const Loading = React.forwardRef<HTMLDivElement, LoadingProps>(
  ({ size = "md", className }, ref) => {
    const sizes = {
      sm: "h-4 w-4",
      md: "h-8 w-8",
      lg: "h-12 w-12",
    };

    return (
      <div
        ref={ref}
        className={`inline-block animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] ${sizes[size]} ${className}`}
        role="status"
      >
        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
          加载中...
        </span>
      </div>
    );
  }
);

Loading.displayName = "Loading";

export { Loading };
