import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";

import {
  CalenderIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  TableIcon,
  UserIcon
} from "../icons";
import { useSidebar } from "../context/SidebarContext";


type MenuType = "main" | "others" | "users";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
  { icon: <GridIcon />, name: "Dashboard", path: "/board" },
  { icon: <CalenderIcon />, name: "Calendrier", path: "/calendar" },
];

const othersItems: NavItem[] = [
  { name: "Commandes", icon: <TableIcon />, path: "/order-tables" },
  { name: "Livreurs", icon: <TableIcon />, path: "/driver-tables" },
  { name: "Stock", icon: <TableIcon />, path: "/stock-tables" },
  { name: "Fournisseurs", icon: <TableIcon />, path: "/supplier-tables" },
];

const usersItems: NavItem[] = [
  { icon: <UserIcon />, name: "Utilisateurs", path: "/users-tables" },
  { icon: <UserIcon />, name: "Rôles Utilisateurs", path: "/roles-tables" },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: MenuType;
    index: number;
  } | null>(null);
  
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  
  useEffect(() => {
    let submenuMatched = false;
    const menuConfigs: { type: MenuType; items: NavItem[] }[] = [
      { type: "main", items: navItems },
      { type: "others", items: othersItems },
      { type: "users", items: usersItems },
    ];

    menuConfigs.forEach((config) => {
      config.items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({ type: config.type, index });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) setOpenSubmenu(null);
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prev) => ({
          ...prev,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: MenuType) => {
    setOpenSubmenu((prev) => {
      if (prev?.type === menuType && prev?.index === index) return null;
      return { type: menuType, index };
    });
  };


  const renderMenuItems = (items: NavItem[], menuType: MenuType) => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => {
        const isSubmenuOpen = openSubmenu?.type === menuType && openSubmenu?.index === index;
        
        return (
          <li key={nav.name}>
            {nav.subItems ? (
              <button
                onClick={() => handleSubmenuToggle(index, menuType)}
                className={`menu-item group ${isSubmenuOpen ? "menu-item-active" : "menu-item-inactive"} 
                cursor-pointer ${!isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"}`}
              >
                <span className={`menu-item-icon-size ${isSubmenuOpen ? "menu-item-icon-active" : "menu-item-icon-inactive"}`}>
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <>
                    <span className="menu-item-text">{nav.name}</span>
                    <ChevronDownIcon className={`ml-auto w-5 h-5 transition-transform duration-200 ${isSubmenuOpen ? "rotate-180 text-brand-500" : ""}`} />
                  </>
                )}
              </button>
            ) : (
              nav.path && (
                <Link
                  to={nav.path}
                  className={`menu-item group ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"}`}
                >
                  <span className={`menu-item-icon-size ${isActive(nav.path) ? "menu-item-icon-active" : "menu-item-icon-inactive"}`}>
                    {nav.icon}
                  </span>
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span className="menu-item-text">{nav.name}</span>
                  )}
                </Link>
              )
            )}

            {/* Submenu Logic */}
            {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
              <div
                ref={(el) => { subMenuRefs.current[`${menuType}-${index}`] = el; }}
                className="overflow-hidden transition-all duration-300"
                style={{ height: isSubmenuOpen ? `${subMenuHeight[`${menuType}-${index}`]}px` : "0px" }}
              >
                <ul className="mt-2 space-y-1 ml-9">
                  {nav.subItems.map((subItem) => (
                    <li key={subItem.name}>
                      <Link
                        to={subItem.path}
                        className={`menu-dropdown-item ${isActive(subItem.path) ? "menu-dropdown-item-active" : "menu-dropdown-item-inactive"}`}
                      >
                        {subItem.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen || isHovered ? "w-[290px]" : "w-[90px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`py-8 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}>
        <Link to="/">
          <img 
            src="/images/logo/logo.png" 
            alt="Logo" 
            width={isExpanded || isHovered || isMobileOpen ? 150 : 32} 
          />
        </Link>
      </div>

      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            
            {/* SECTION MAIN */}
            <div>
              <HeaderLabel label="Menu" isExpanded={isExpanded || isHovered || isMobileOpen} />
              {renderMenuItems(navItems, "main")}
            </div>

            {/* SECTION OTHERS */}
            <div>
              <HeaderLabel label="Gestion" isExpanded={isExpanded || isHovered || isMobileOpen} />
              {renderMenuItems(othersItems, "others")}
            </div>

            {/* SECTION USERS */}
            <div>
              <HeaderLabel label="Utilisateurs" isExpanded={isExpanded || isHovered || isMobileOpen} />
              {renderMenuItems(usersItems, "users")}
            </div>

          </div>
        </nav>
      </div>
    </aside>
  );
};

// Petit composant interne pour les titres de section
const HeaderLabel = ({ label, isExpanded }: { label: string; isExpanded: boolean }) => (
  <h2 className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded ? "lg:justify-center" : "justify-start"}`}>
    {isExpanded ? label : <HorizontaLDots className="size-6" />}
  </h2>
);

export default AppSidebar;