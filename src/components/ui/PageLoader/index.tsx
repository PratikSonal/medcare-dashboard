import { memo } from "react";
import styles from "./PageLoader.module.scss";

export const PageLoader = memo((): React.ReactElement => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className={`w-9 h-9 rounded-full animate-spin ${styles.spinner}`} />
  </div>
));
