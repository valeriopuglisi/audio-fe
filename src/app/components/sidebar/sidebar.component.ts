import { Component, OnInit } from "@angular/core";

declare interface RouteInfo {
  path: string;
  title: string;
  rtlTitle: string;
  icon: string;
  class: string;
}
export const ROUTES: RouteInfo[] = [
  
  {
    path: "/welcome",
    title: "Audio Analysis",
    rtlTitle: "لوحة القيادة",
    icon: "icon-sound-wave",
    class: ""
  },
  {
    path: "/preprocessing",
    title: "Audio Preprocessing",
    rtlTitle: "لوحة القيادة",
    icon: "icon-zoom-split",
    class: ""
  },
  {
    path: "/features",
    title: "Deep Learning Models",
    rtlTitle: "لوحة القيادة",
    icon: "icon-support-17",
    class: ""
  },
  
  {
    path: "/pipelines",
    title: "Dynamic Pipeline Creation",
    rtlTitle: "لوحة القيادة",
    icon: "icon-atom",
    class: ""
  },
  {
    path: "/stored-pipelines",
    title: "Deep Learing Pipelines",
    rtlTitle: "لوحة القيادة",
    icon: "icon-atom",
    class: ""
  },
  {
    path: "/evaluation",
    title: "DL Models Evaluation",
    rtlTitle: "لوحة القيادة",
    icon: "icon-support-17",
    class: ""
  },
  {
    path: "/dashboard",
    title: "Dashboard",
    rtlTitle: "لوحة القيادة",
    icon: "icon-chart-pie-36",
    class: ""
  },
  // {
  //   path: "/icons",
  //   title: "Icons",
  //   rtlTitle: "الرموز",
  //   icon: "icon-atom",
  //   class: ""
  // },
  // {
  //   path: "/maps",
  //   title: "Maps",
  //   rtlTitle: "خرائط",
  //   icon: "icon-pin",
  //   class: "" },
  // {
  //   path: "/notifications",
  //   title: "Notifications",
  //   rtlTitle: "إخطارات",
  //   icon: "icon-bell-55",
  //   class: ""
  // },

  {
    path: "/user",
    title: "User Profile",
    rtlTitle: "ملف تعريفي للمستخدم",
    icon: "icon-single-02",
    class: ""
  },
  // {
  //   path: "/tables",
  //   title: "Table List",
  //   rtlTitle: "قائمة الجدول",
  //   icon: "icon-puzzle-10",
  //   class: ""
  // },
  // {
  //   path: "/typography",
  //   title: "Typography",
  //   rtlTitle: "طباعة",
  //   icon: "icon-align-center",
  //   class: ""
  // },
  // {
  //   path: "/rtl",
  //   title: "RTL Support",
  //   rtlTitle: "ار تي ال",
  //   icon: "icon-world",
  //   class: ""
  // }
];

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"]
})
export class SidebarComponent implements OnInit {
  menuItems: any[];

  constructor() {}

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  isMobileMenu() {
    if (window.innerWidth > 991) {
      return false;
    }
    return true;
  }
}
