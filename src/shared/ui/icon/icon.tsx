type IconName =
  | "bookmark"
  | "check"
  | "heart"
  | "message"
  | "minus"
  | "plus"
  | "search"
  | "send";

const iconPaths: Record<IconName, React.ReactNode> = {
  bookmark: (
    <path d="M6.75 4.75A2.25 2.25 0 0 1 9 2.5h6a2.25 2.25 0 0 1 2.25 2.25v14.5L12 16.25l-5.25 3V4.75Z" />
  ),
  check: <path d="m5 12 4 4L19 6" />,
  heart: (
    <path d="M20.5 8.8c0 5.1-8.5 9.7-8.5 9.7s-8.5-4.6-8.5-9.7A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 8.5 2.8Z" />
  ),
  message: (
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9H13a8.48 8.48 0 0 1 8 8v.5Z" />
  ),
  minus: <path d="M5 12h14" />,
  plus: <path d="M12 5v14M5 12h14" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </>
  ),
  send: <path d="m22 2-7 20-4-9-9-4 20-7ZM11 13l4-4" />,
};

export const Icon = ({
  name,
  className = "",
}: {
  name: IconName;
  className?: string;
}) => {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      {iconPaths[name]}
    </svg>
  );
};
