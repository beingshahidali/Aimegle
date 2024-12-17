import {Typography, Box, Modal} from "@mui/material";
import Spinner from "../Spinner/Spinner";
function ModalContainer({isConnected}) {
  return (
    <Modal open={!isConnected}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "white",
          boxShadow: 24,
          p: 4,
          textAlign: "center",
          borderRadius: "8px",
          width: "90%", // Ensure the modal takes 90% of the screen width
          maxWidth: "400px", // Limit max width for large screens
          bgcolor: "white", //
          animation:
            "glowingBorder 3s linear infinite, rgbShift 3s linear infinite", // Apply glowing and moving animation
          backgroundClip: "border-box", // Clip gradient to border
          transition: "all 0.3s ease-in-out", // Smooth transition
          "@keyframes glowingBorder": {
            "0%": {
              boxShadow:
                "0 0 5px rgba(255, 87, 34, 1), 0 0 10px rgba(255, 87, 34, 1), 0 0 15px rgba(255, 87, 34, 1)",
            },
            "50%": {
              boxShadow:
                "0 0 10px rgba(33, 150, 243, 1), 0 0 20px rgba(33, 150, 243, 1), 0 0 30px rgba(33, 150, 243, 1)",
            },
            "100%": {
              boxShadow:
                "0 0 5px rgba(255, 87, 34, 1), 0 0 10px rgba(255, 87, 34, 1), 0 0 15px rgba(255, 87, 34, 1)",
            },
          },
          "@keyframes rgbShift": {
            "0%": {
              backgroundPosition: "0% 0%",
            },
            "50%": {
              backgroundPosition: "100% 100%",
            },
            "100%": {
              backgroundPosition: "0% 0%",
            },
          },
          // Media query for responsiveness on smaller screens
          "@media (max-width: 600px)": {
            width: "80%", // Adjust width for small screens
            padding: "16px", // Adjust padding for mobile view
            maxWidth: "90%", // Ensure it doesn't exceed screen width on mobile
            borderRadius: "4px", // Adjust border radius for smaller screens
          },
        }}
      >
        <Spinner />
        <Typography variant="h6" gutterBottom>
          {status || "Searching for a user..."}
        </Typography>
        <Typography variant="h7" sx={{color: "gray"}}>
          Please wait while we connect you to someone.
        </Typography>
      </Box>
    </Modal>
  );
}
export default ModalContainer;
