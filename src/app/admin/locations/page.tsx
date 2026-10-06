"use client";

import React from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { LocationSwitchManager } from "@/components/admin/LocationSwitchManager";

export default function AdminLocationsPage() {
  return (
    <div className="space-y-6 pb-12">
      <AdminHeader
        title="Location Switch & Destination Registration"
        subtitle="Select which Sri Lankan destinations creators and villas/stays are permitted to register for."
      />

      <div className="px-6">
        <LocationSwitchManager />
      </div>
    </div>
  );
}
