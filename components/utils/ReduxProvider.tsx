"use client";

import { store } from "@/utils/redux/store";
import { Provider } from "react-redux";

type Props = {
  children: React.ReactNode;
};

const ReduxProvider = ({ children }: Props) => {
  return <Provider store={store}>{children}</Provider>;
};
export default ReduxProvider;
