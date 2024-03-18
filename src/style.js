export const buttonStyle = {
    backgroundColor: 'blue',
    color: 'white',
    padding: '10px 20px',
    margin: '10px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    // Add other styles as needed
  };
export const boardWrapper = {
    // display: 'flex',
    // justifyContent: 'center',
    // alignItems: 'center',
    // flexDirection: 'column',
    alignItems: 'center',
   margin: 'auto',
    width: 450, 
    
    // Add this if you want to center the board vertically as well
    // Add other styles as needed
  };
  export const stockfishMoveButton = {
    activeButton: {
      backgroundColor: 'red',
    color: 'white',
    padding: '10px 20px',
    margin: '10px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    },
    inactiveButton: {
      backgroundColor: 'green',
    color: 'white',
    padding: '10px 20px',
    margin: '10px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    }
  };
  export const appContainer = {
    display: 'flex',
    justifyContent: 'space-around', // Space items appropriately
    alignItems: 'center', // Align items vertically in the middle
    minHeight: '100vh', // Fill at least the entire height of the viewport
    padding: '10px', // Add padding around the entire app container
    flexWrap: 'wrap' // Allow items to wrap to next line if not enough space
  };
  
  
  export const chessboardContainer = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: '500px', // Maximum size of the chessboard
    width: '100%', // Make the chessboard responsive
    margin: '0 20px', // Add some margin to separate it from the buttons and other info
  };
  export const sideContainer = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center', // Center items horizontally in this column
    justifyContent: 'start', // Align items to the start vertically
    padding: '20px',
    flex: '1 1 auto', // Allow these containers to grow and shrink as needed
    maxWidth: '200px', // Set a maximum width to keep the UI tidy
  };
  
  
    