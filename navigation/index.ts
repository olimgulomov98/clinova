export default [
  {
    title: "DASHBOARD",
    icon: "squares-four",
    to: "/",
    roles: ["ADMIN"],
  },
  {
    title: "APPOINTMENTS",
    // icon: "check-square",
    to: "/appointments",
    roles: ["RECEPTION", "DOCTOR", "ADMIN", "CASHIER"],
  },
  {
    title: "FOLLOW_UP",
    // icon: "check-square",
    to: "/follow-up",
    roles: ["RECEPTION", "DOCTOR", "ADMIN", "CASHIER"],
  },
  {
    title: "PATIENTS",
    // icon: "bed",
    to: "/patients",
    roles: ["RECEPTION", "ADMIN", "DOCTOR", "CASHIER"],
  },
  {
    title: "EMPLOYEE",
    // icon: "stethoscope",
    to: "/doctors",
    roles: ["ADMIN"],
  },
  {
    title: "DEPARTMENTS",
    // icon: "hospital",
    to: "/departments",
    roles: ["ADMIN"],
  },
  {
    title: "SERVICES",
    // icon: "hospital",
    to: "/services",
    roles: ["ADMIN"],
  },
  {
    title: "DOCTOR_SCHEDULE",
    // icon: "calendar-dots",
    to: "/schedule",
    roles: ["RECEPTION", "DOCTOR", "ADMIN", "CASHIER"],
  },
  {
    title: "PAYMENTS",
    icon: "credit-card",
    to: "/payments",
    roles: ["CASHIER", "ADMIN"],
  },
  // {
  //   title: "INVENTORY",
  //   icon: "cube",
  //   to: "/inventory",
  //   roles: ["CASHIER","ADMIN"]
  // },
];
