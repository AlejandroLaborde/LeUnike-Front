import {
  BarChart3Icon,
  HomeIcon,
  MessageSquareIcon,
  Package2Icon,
  SettingsIcon,
  ShoppingCartIcon,
  UserIcon,
  Users2Icon,
} from "lucide-react";

// ... rest of the import statements ...

// ... rest of the code ...


//Example of where the sidebar item would be added (this needs to be adjusted to the actual code structure)
const Sidebar = () => {
  return (
    <aside className="sidebar">
      <SidebarItem icon={HomeIcon} href="/">
        Inicio
      </SidebarItem>
      <SidebarItem icon={MessageSquareIcon} href="/chat">
        Chat
      </SidebarItem>
      <SidebarItem icon={UserIcon} href="/profile">
        Perfil
      </SidebarItem>
      {/* ... other sidebar items ... */}
    </aside>
  );
};

// ... other components ...

const Navigation = () => {
  // ... other navigation items ...
  return (
    <nav>
      <ul>
        {/* ... other NavigationItems ... */}
        <NavigationItem href="/reports" icon={BarChart3Icon}>
          Reportes
        </NavigationItem>
        <NavigationItem href="/chat" icon={MessageSquareIcon}>
          Chat
        </NavigationItem>
        {/* ... other NavigationItems ... */}
      </ul>
    </nav>
  );
};

// ... rest of the code ...