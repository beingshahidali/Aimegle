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
          backgroundColor: "#1F2937", // Use a solid color for the background
          boxShadow: 24,
          py: 4,
          textAlign: "center",
          borderRadius: "8px",
          width: "90%", // Ensure the modal takes 90% of the screen width
          maxWidth: "400px", // Limit max width for large screens
          animation:
            "glowingBorder 3s linear infinite, rgbShift 3s linear infinite", // Apply glowing and moving animation
          backgroundClip: "border-box", // Clip gradient to border
          transition: "all 0.3s ease-in-out", // Smooth transition
          border: "none", // Ensure no border appears
          "@keyframes glowingBorder": {
            "0%": {
              boxShadow:
                "0 0 5px rgba(255, 86, 34, 0.53), 0 0 10px rgba(255, 86, 34, 0.51), 0 0 15px rgba(255, 86, 34, 0.53)",
            },
            "50%": {
              boxShadow:
                "0 0 10px rgba(33, 149, 243, 0.54), 0 0 20px rgba(33, 149, 243, 0.61), 0 0 30px rgba(33, 149, 243, 0.54)",
            },
            "100%": {
              boxShadow:
                "0 0 5px rgba(255, 86, 34, 0.57), 0 0 10px rgba(255, 86, 34, 0.53), 0 0 15px rgba(255, 86, 34, 0.5)",
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
            boxShadow: "none", // Remove box shadow for smaller screens to prevent any white borders
          },
        }}
      >
        <Spinner />
        <Typography variant="h6" gutterBottom sx={{color: "white"}}>
          {status || "Searching for a user..."}
        </Typography>

        <Typography variant="h7" sx={{color: "white"}}>
          Please wait while we connect you to someone.
        </Typography>
      </Box>
    </Modal>
  );
}

export default ModalContainer;
