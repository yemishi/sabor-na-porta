import DashboardHeader from "./DashboardHeader";
import { DashBoardProvider } from "./context/DashboardProvider";

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <DashBoardProvider>
        <DashboardHeader />
        {children}
      </DashBoardProvider>
    </div>
  );
}
