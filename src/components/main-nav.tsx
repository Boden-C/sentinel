import { NavLink } from "react-router-dom"
import { cn } from "@/lib/utils"

/**
 * Main navigation component with responsive styling
 * @param {Object} props - Component props
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element} Navigation component
 */
export function MainNav({ 
  className, 
  ...props 
}) { 
  return ( 
    <nav 
      className={cn("flex items-center space-x-4 lg:space-x-6", className)} 
      {...props} 
    > 
      <NavLink 
        to="/" 
        className={({ isActive }) => 
          cn(
            "text-sm font-medium transition-colors hover:text-primary",
            isActive ? "text-primary" : "text-muted-foreground"
          )
        }
      > 
        Overview 
      </NavLink> 
      <NavLink 
        to="/customers" 
        className={({ isActive }) => 
          cn(
            "text-sm font-medium transition-colors hover:text-primary",
            isActive ? "text-primary" : "text-muted-foreground"
          )
        }
      > 
        Customers 
      </NavLink> 
      <NavLink 
        to="/products" 
        className={({ isActive }) => 
          cn(
            "text-sm font-medium transition-colors hover:text-primary",
            isActive ? "text-primary" : "text-muted-foreground"
          )
        }
      > 
        Products 
      </NavLink> 
    </nav> 
  ) 
}
