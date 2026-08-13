import {
  LayoutDashboard,
  FileText,
  GraduationCap,
  BookOpenCheck,
  User,
  Users,
  CalendarRange,
  Archive,
} from "lucide-react";

export const mainNav = [
  {
    href: "/admin/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/applications",
    label: "Applications",
    icon: FileText,
  },
  {
    href: "/admin/grade-11",
    label: "Grade 11 Students",
    icon: GraduationCap,
  },
  {
    href: "/admin/grade-12",
    label: "Grade 12 Students",
    icon: BookOpenCheck,
  },
  {
    href: "/admin/profile",
    label: "My Profile",
    icon: User,
  },
];

export const adminOnlyNav = [
  {
    href: "/admin/staff",
    label: "Manage Staff",
    icon: Users,
  },
  {
    href: "/admin/school-years",
    label: "School Years",
    icon: CalendarRange,
  },
  {
    href: "/admin/archived",
    label: "Archived Students",
    icon: Archive,
  },
];
