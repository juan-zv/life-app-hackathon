import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import { NavUser } from "@/components/nav-user"

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <ModeToggle/>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}