export const runtime = "edge";

import React from "react";
import TripForm from "@/components/admin/TripForm";

export default function NewTripPage() {
  return <TripForm isNew={true} />;
}

