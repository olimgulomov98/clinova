export const permissions = {
  ADMIN: {
    appointment: ["*"],
    followup: ["*"],
    patient: ["*"],
    schedule: ["*"],
    kassa: ["*"],
  },
  RECEPTION: {
    appointment: ["add", "edit", "delete", "change_status"],
    patient: ["add_delete_patient", "add_new_to_visit"],
    followup: ["change_status"],
    schedule: ["full_access"],
  },
  CASHIER: {
    appointment: ["add", "edit", "delete", "change_status"],
    patient: ["add_delete_patient", "add_new_to_visit"],
    followup: ["change_status"],
    schedule: ["full_access"],
    kassa: ["full_access"],
  },
  DOCTOR: {
    patient: ["view_all_tabs_with_payments"],
  },
};
