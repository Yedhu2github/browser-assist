import {
  Home,
  Settings,
  User,
  Calendar,
  Search,
  Inbox,
  ChevronUp,
  SearchIcon,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
const items = [
  { title: "Home", url: "#", icon: Home, alwaysShow: false },
  { title: "Inbox", url: "#", icon: Inbox, alwaysShow: false },
  { title: "Calendar", url: "#", icon: Calendar, alwaysShow: false },
  { title: "Search", url: "#", icon: Search, alwaysShow: false },
  { title: "Settings", url: "#", icon: Settings, alwaysShow: false },
];

export function AppSidebar() {
  const { state } = useSidebar(); // "expanded" or "collapsed"
  const isCollapsed = state === "collapsed";
  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader>
        <SidebarTrigger />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Home </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              
                  <SidebarMenuItem key="Home">
                    <SidebarMenuButton  tooltip="Home">
                         <Home />
                      Dashboard
                       
                        </SidebarMenuButton>
                    </SidebarMenuItem>  
            </ SidebarMenu>
          </SidebarGroupContent>
          
          <div className="mt-3">
          <SidebarGroupContent>
          { !isCollapsed ? <InputGroup>
              <InputGroupInput  placeholder="Search..." />
              <InputGroupAddon>
                <SearchIcon />
              </InputGroupAddon>
            </InputGroup> : null}
             { isCollapsed ?
             <SidebarMenuButton tooltip="Search">
               <SearchIcon className="w-4 h-4" />
             </SidebarMenuButton>
             : null}
          </SidebarGroupContent>
          </div>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Quick notes </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                if (isCollapsed && !item.alwaysShow) return null;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <a href={item.url}>
                        <Calendar />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Sessions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                if (isCollapsed && !item.alwaysShow) return null;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="w-full">
                  <User /> username
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem>Account</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
