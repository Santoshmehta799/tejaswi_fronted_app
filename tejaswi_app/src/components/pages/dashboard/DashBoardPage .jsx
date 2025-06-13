import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const Container = styled(Box)(({ theme }) => ({
    width: "100%",
    height: "calc(100vh - 70px)",
    background: "#06060",
    padding: "30px 0px",
}));


const InnerContainer = styled(Box)(({ theme }) => ({
    width: "90%",
    margin: "auto",
}));

function DashBoardPage() {
    return (
        <Container><InnerContainer>DashBoard Page</InnerContainer> </Container>
    )
}

export default DashBoardPage 