import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { AppNavbar } from "./app-navbar"
import { Content } from "./content"




export function Layout(){
    return (
        <>
       
        

        <SidebarProvider>
                <AppSidebar>
                </AppSidebar>
                 <AppNavbar></AppNavbar>
                <Content></Content>
        </SidebarProvider>
        
        
        </>
        
    )
}