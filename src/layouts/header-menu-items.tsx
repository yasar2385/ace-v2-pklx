// config/menu.config.tsx
import React from 'react';
import { LogoutIcon, PasswordIcon, ProfileV2Icon } from "../shared/icons";
import { FaRankingStar } from "react-icons/fa6";
import { IoIosPeople } from "react-icons/io";
import { BsTrophy } from "react-icons/bs";



interface UserMenuItem {
  title: string;
  icon: string;
  action: string;
  isOffcanvas?: boolean;
}

export const userMenu: UserMenuItem[] = [
  {
    title: 'Profile',
    icon: 'user',
    action: '#userProfileCanvas',
    isOffcanvas: true
  },
  {
    title: 'Settings',
    icon: 'gear',
    action: '#settingsCanvas',
    isOffcanvas: true
  },
  {
    title: 'Logout',
    icon: 'power',
    action: 'logout'
  }
];

// Map icon strings to actual icon components
export const iconMap: { [key: string]: React.ComponentType<any> } = {
  user: ProfileV2Icon,
  gear: PasswordIcon,
  power: LogoutIcon
};

export const UserMenu = () => {
  return (
    <div>
      {userMenu.map((item, index) => {
        const IconComponent = iconMap[item.icon];
        return (
          <div key={index} className="menu-item">
            <IconComponent />
            <span>{item.title}</span>
          </div>
        );
      })}
    </div>
  );
};



export interface MenuItem {
  title: string;
  path: string;
  icon: JSX.Element;
  disabled?: boolean;
  children?: MenuItem[];
  permission?: string[];
  badge?: {
    text: string;
    variant: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
  };
}



export interface User {
  user_fname: string;
  user_lname: string;
  user_image: string;
  user_lasllogin: string;
  user_lastlogin: string;
  permissions: string[];
}

export const menuItems: MenuItem[] = [
  {
    title: 'Home',
    path: '/ace/landing',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color="currentColor" fill="none">
        <path d="M9 22L9.00192 17.9976C9.00236 17.067 9.0025 16.6017 9.15462 16.2347C9.35774 15.7443 9.74746 15.3547 10.2379 15.1519C10.6051 15 11.0704 15 12.001 15V15C12.9319 15 13.3974 15 13.7647 15.152C14.2553 15.355 14.645 15.7447 14.848 16.2353C15 16.6026 15 17.0681 15 17.999V22" stroke="currentColor" strokeWidth="1.5" />
        <path d="M7.08848 4.76243L6.08847 5.54298C4.57181 6.72681 3.81348 7.31873 3.40674 8.15333C3 8.98792 3 9.95205 3 11.8803V13.9715C3 17.7562 3 19.6485 4.17157 20.8243C5.34315 22 7.22876 22 11 22H13C16.7712 22 18.6569 22 19.8284 20.8243C21 19.6485 21 17.7562 21 13.9715V11.8803C21 9.95205 21 8.98792 20.5933 8.15333C20.1865 7.31873 19.4282 6.72681 17.9115 5.54298L16.9115 4.76243C14.5521 2.92081 13.3724 2 12 2C10.6276 2 9.44787 2.92081 7.08848 4.76243Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Club',
    path: '/ap/club-league/clubs',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color="currentColor" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M3.33984 16.9996L7.66925 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M20.6596 16.9996L16.3301 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M12 2L12 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Tournaments',
    path: '/ace/landing',
    icon: <BsTrophy />,
    disabled: true
  },
  {
    title: 'Meet & Greet',
    path: '/ace/landing',
    icon: <IoIosPeople />,
    disabled: true
  },
  {
    title: 'Ranking',
    path: '/ace/landing',
    icon: <FaRankingStar />,
    disabled: true
  },
  {
    title: 'Resources',
    path: '/ap/landing',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} fill="none">
        <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M2 12C2 13.6569 3.34315 15 5 15C3.34315 15 2 16.3431 2 18C2 19.6569 3.34315 21 5 21C6.65685 21 8 19.6569 8 18C8 16.3431 6.65685 15 5 15C6.65685 15 8 13.6569 8 12C8 10.3431 6.65685 9 5 9C3.34315 9 2 10.3431 2 12Z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M19 15C17.3431 15 16 13.6569 16 12C16 10.3431 17.3431 9 19 9C20.6569 9 22 10.3431 22 12C22 13.6569 20.6569 15 19 15Z" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    disabled: true
  }
];




export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  const hours = date.getHours();
  const minutes = ('0' + date.getMinutes()).slice(-2);
  const seconds = ('0' + date.getSeconds()).slice(-2);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = ('0' + (hours % 12 || 12)).slice(-2);

  return `${year}-${month}-${day} ${formattedHours}:${minutes}:${seconds} ${ampm}`;
}
