const ErrorText = (props: React.PropsWithChildren) => {
  return <p className="text-destructive text-sm">{props.children}</p>;
};

export default ErrorText;
