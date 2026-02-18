import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function App() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 overflow-auto bg-background">
          <div className=" flex h-8 items-center border-b px-4">
            
          </div>
          <div className="p-8">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Welcome back! Here is what's happening today.
            </p>
            {/* Your content here */}
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}