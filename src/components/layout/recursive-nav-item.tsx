
"use client";

import * as React from "react";
import Link from "next/link";
import { type NavItem } from "@/app/sitemap";
import {
  NavigationMenuLink,
  NavigationMenuItem,
  NavigationMenuSub,
  NavigationMenuSubTrigger,
  NavigationMenuSubContent,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { external?: boolean, title: string, description?: string }
>(({ className, title, children, description, href, external, ...props }, ref) => {
  const isExternal = external || (href && href.startsWith('http'));

  const content = (
    <div className={cn(
      "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
      className
    )}>
      <div className="text-sm font-medium leading-none">{title}</div>
       {description && <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
        {description}
      </p>}
    </div>
  );

  return (
    <li>
        {isExternal ? (
          <a ref={ref} href={href} target="_blank" rel="noopener noreferrer" {...props} className="block">
            {content}
          </a>
        ) : (
          <NavigationMenuLink asChild>
            <Link href={href || "#"} legacyBehavior passHref>
              <a ref={ref} {...props}>
                {content}
              </a>
            </Link>
          </NavigationMenuLink>
        )}
    </li>
  );
});
ListItem.displayName = "ListItem"


export const RecursiveNavItem = ({ item }: { item: NavItem }) => {
  if (item.children) {
    // Check if any child also has children (is a sub-category)
    const hasSubCategories = item.children.some(child => child.children);

    if (hasSubCategories) {
       return (
        <li className="row-span-3">
          <div className="flex h-full w-full flex-col justify-start rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md">
              <div className="mb-2 mt-4 text-lg font-medium">{item.title}</div>
              <ul className="flex flex-col gap-1">
                  {item.children.map((child) => (
                       <ListItem
                          key={child.title}
                          title={child.title}
                          href={child.href || "#"}
                          description={child.description}
                          external={child.external}
                        />
                  ))}
              </ul>
          </div>
        </li>
      );
    }
    
    // Render a simple column for the final list of links
    return (
        <li className="row-span-3">
        <div className="flex h-full w-full flex-col justify-start rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md">
            <div className="mb-2 mt-4 text-lg font-medium">{item.title}</div>
            <ul className="flex flex-col gap-1">
                {item.children.map((child) => (
                     <ListItem
                        key={child.title}
                        title={child.title}
                        href={child.href || "#"}
                        description={child.description}
                        external={child.external}
                      />
                ))}
            </ul>
        </div>
      </li>
    )
  }

  return (
      <ListItem
        key={item.title}
        title={item.title}
        href={item.href || "#"}
        description={item.description}
        external={item.external}
      />
  );
};
