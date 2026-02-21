import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { AppNavbar } from "./app-navbar"
import { Content } from "./content"

export function Layout(){
    return (
        <SidebarProvider>
            <AppSidebar />
            
            {/* This wrapper forces the Navbar to the top and full width */}
            <main className="flex flex-1 flex-col w-full">
                 <AppNavbar />
                 <Content />
            </main>
            
        </SidebarProvider>
    )
}