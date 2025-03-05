import React, { useEffect } from "react";
import {
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import useRoomStore from "../../stores/roomStore";
import { globalNavigate } from "../../hooks/useGlobalNavigate";
import ConfirmAlert from "../../components/ConfirmAlert";
import { deleteRoomApi } from "../../api/roomApi";
import Alert from "../../components/Alert";

function CustomRoomTable() {
  const { rooms, loading, error, fetchRooms } = useRoomStore();

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  const handleEdit = (roomId) => {
    globalNavigate(`/customroom/addEditRoom`, {
      state: { type: "edit", roomId },
    });
  };

  const handleDelete = (roomId) => {
    ConfirmAlert({
      title: "Are you sure?",
      btnText: "Yes delete room",
      action: async () => {
        try {
          const res = await deleteRoomApi(roomId);
          Alert({
            title: "Delete Success!!",
            text: "done",
            icon: "success",
          });
        } catch (error) {
          Alert({
            title: "Error",
            text: error,
            icon: "error",
          });
        }
      },
    });
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h5" gutterBottom>
          Room List
        </Typography>
        <Button
          variant="outlined"
          onClick={() => globalNavigate("/customroom/addEditRoom")}
        >
          เพิ่ม
        </Button>
      </div>

      <TableContainer component={Paper} sx={{ marginTop: 5 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Room Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Capacity</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rooms.map((room) => (
              <TableRow key={room.id}>
                <TableCell>{room.roomName}</TableCell>
                <TableCell>{room.status}</TableCell>
                <TableCell>{room.capacity}</TableCell>
                <TableCell>{room.location}</TableCell>
                <TableCell>{room.description}</TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(room.id)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(room.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default CustomRoomTable;
