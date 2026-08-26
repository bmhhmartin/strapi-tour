export function UnknownBlock({
  __component,
}: {
  __component: string;
  id?: number;
}) {
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return (
    <div
      data-testid="unknown-block"
      data-component={__component}
      className="mx-auto max-w-6xl px-6 py-4 text-sm text-terracotta"
    >
      Unhandled block: {__component}
    </div>
  );
}
