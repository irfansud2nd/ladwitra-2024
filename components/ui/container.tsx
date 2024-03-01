type ContainerProps = {
  children: React.ReactNode;
  className?: string;
};

const Container: React.FC<ContainerProps> = ({ children, className }) => {
  return (
    <div className={`${className} mx-auto w-full max-w-[1360px]`}>
      {children}
    </div>
  );
};

export default Container;
