"use client"; // 必须声明为客户端组件
import { SWRConfig } from "swr";

const SWRGlobalConfig = ({ children }: { children: React.ReactNode }) => {
  const config = {
    revalidateOnFocus: false, // 失去焦点时不重新验证
    revalidateOnReconnect: true, // 网络恢复时重新验证
    revalidateOnMount: true, // 挂载时重新验证（可选，默认 true）
    refreshInterval: 60 * 1000, // 每隔 60 秒自动刷新（根据需求调整）
    errorRetryCount: 3, // 错误重试次数
  };

  return <SWRConfig value={config}>{children}</SWRConfig>;
};

export default SWRGlobalConfig;
