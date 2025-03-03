import React from "react";
import { Card, CardContent } from "@mui/material";
import CustomRoomTable from "../features/CustomRoom/Table";

function CustomRoom() {
  return (
    <Card sx={{ margin: "20px auto", padding: "20px" }}>
      <CardContent>
        <CustomRoomTable />
      </CardContent>
    </Card>
  );
}

export default CustomRoom;
