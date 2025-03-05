import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  CircularProgress,
  Box,
  Card,
  CardContent,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { uploadImageApi } from "../../api/uploadApi";
import {
  createRoomApi,
  fetchRoomByIdApi,
  updateRoomApi,
} from "../../api/roomApi";
import Alert from "../../components/Alert";
import { useLocation } from "react-router-dom";

function AddEditRoomForm() {
  const location = useLocation();
  const { type, roomId } = location.state || {};

  const [formData, setFormData] = useState({
    roomName: "",
    capacity: "",
    location: "",
    description: "",
    status: "Available",
    imageUrl: "",
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (type === "edit") {
      getRoomDetails();
    }
  }, [roomId]);

  const getRoomDetails = async () => {
    try {
      const roomData = await fetchRoomByIdApi(roomId);
      setFormData(roomData);
    } catch (error) {
      console.error("Error fetching room details:", error);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append("image", file);

    try {
      setUploading(true);
      const result = await uploadImageApi(data);
      setFormData({ ...formData, imageUrl: result.imageUrl });
    } catch (error) {
      await Alert({
        title: "Error uploading image",
        text: error,
        icon: "error",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const res =
        type === "edit"
          ? await updateRoomApi(formData, roomId)
          : await createRoomApi(formData);

      if (res) {
        await Alert({
          title: "Room added successfully!",
          text: "done",
          icon: "success",
        });
      }
    } catch (error) {
      await Alert({
        title: "Failed to add room.",
        text: error.message || error,
        icon: "error",
      });
    }
  };

  return (
    <Card sx={{ margin: "20px auto" }}>
      <CardContent>
        <Box sx={{ maxWidth: 600, margin: "0 auto" }}>
          <TextField
            label="Room Name"
            name="roomName"
            value={formData.roomName}
            onChange={handleChange}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Capacity"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Price"
            name="location"
            value={formData.location}
            onChange={handleChange}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            sx={{ marginBottom: 2 }}
          />

          {/* Radio Group for Status */}
          <FormControl sx={{ marginBottom: 2 }}>
            <FormLabel>Status</FormLabel>
            <RadioGroup
              name="status"
              value={formData.status}
              onChange={handleChange}
              row
            >
              <FormControlLabel
                value="Available"
                control={<Radio />}
                label="Available"
              />
              <FormControlLabel
                value="Occupied"
                control={<Radio />}
                label="Occupied"
              />
            </RadioGroup>
          </FormControl>

          <input type="file" onChange={handleFileChange} />
          {uploading && <CircularProgress />}

          {formData.imageUrl && (
            <Box sx={{ marginTop: 2 }}>
              <img
                src={formData.imageUrl}
                alt="Uploaded"
                style={{ width: "100%" }}
              />
            </Box>
          )}

          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{ marginTop: 2 }}
          >
            Submit
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default AddEditRoomForm;
