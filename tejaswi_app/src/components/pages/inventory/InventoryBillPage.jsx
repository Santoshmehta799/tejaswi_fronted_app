import {
    Modal,
    Box,
    Typography,
    IconButton,
    Table,
    TableHead,
    TableRow,
    TableCell,
    Stack,
} from '@mui/material';
import { IoClose } from "react-icons/io5";
import { styled } from '@mui/material/styles';
import { useRef } from 'react';



const Container = styled(Box)(({ theme }) => ({
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "800px",
    background: "#fff",
    borderRadius: "7px",
    boxSizing: "border-box",
    [theme.breakpoints.between("md", "lg")]: {
        width: "90%",
    },
    [theme.breakpoints.down("md")]: {
        width: "95%",
    },
}));

const InnerContainer = styled(Box)(({ theme }) => ({
    padding: "20px 25px",
    paddingBottom: "25px",
    maxHeight: "calc(75vh - 80px)",
    overflowY: "auto",
}));

const Header = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #dfdfdf",
    padding: "15px 25px",
}));


const TableCellComponent = styled(TableCell)(({ theme }) => ({
    fontSize: "18px",
    fontWeight: 600,
    padding: "12px 25px",
    whiteSpace: "nowrap",
}));


function InventoryBillPage({ isOpen, setIsOpen, items }) {
    const printRef = useRef();

    const handlePrint = () => {
        const originalContents = document.body.innerHTML;
        const printContents = printRef.current.innerHTML;
        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload();
    };

    return (

        <Modal open={isOpen}
        >
            <Container
                sx={{
                    "&:focus-visible": {
                        outline: "none",
                    },
                }}

            >
                <Header>
                    <Typography variant="h6" fontWeight="bold">
                        Inventory Invoice
                    </Typography>
                    <IconButton onClick={() => setIsOpen(false)}>
                        <IoClose />
                    </IconButton>
                </Header>
                <InnerContainer ref={printRef}>

                    <Stack direction="row" justifyContent="space-between" margin="15px 0">
                        <Box>
                            <h3 style={{ fontSize: "18px", margin: "0px" }}>{items?.trading_name === "green" ? "GREEN" : "BHARAT"}</h3>
                            <p style={{ fontSize: "14px", fontWeight: 600, margin: "0px" }}>MADE IN INDIA</p>
                            {items?.trading_name?.toLowerCase() !== "green" && (
                                <>
                                    <p style={{ fontSize: "14px", fontWeight: 600, margin: "0px" }}>Manufactured by</p>
                                    <h3 style={{ fontSize: "16px", margin: "0px" }}>Tejaswi Nonwovens Pvt. Ltd</h3>
                                </>
                            )}
                        </Box>
                        <Box
                            component="img"
                            src={`data:image/png;base64,${items?.qr_code_base64}`}
                            alt="QR Code"
                            sx={{
                                width: "1181px",
                                maxWidth: 200,
                                height: 'auto',
                                borderRadius: 2,
                                border: '1px solid #ccc',
                                backgroundColor: '#fff',
                                p: 1,
                            }}
                        />

                    </Stack>

                    <Table sx={{ border: "1px solid #ccc" }}>
                        <TableHead>
                            <TableRow>
                                <TableCellComponent>
                                    Product No
                                </TableCellComponent>
                                <TableCellComponent sx={{ borderRight: "1px solid #ccc" }}>
                                    : {items?.product_number}
                                </TableCellComponent>
                                <TableCellComponent>
                                    Colour
                                </TableCellComponent>
                                <TableCellComponent >
                                    : {items?.colour?.name}
                                </TableCellComponent>
                            </TableRow>
                            <TableRow>
                                <TableCellComponent>
                                    Length
                                </TableCellComponent>
                                <TableCellComponent sx={{ borderRight: "1px solid #ccc" }}>
                                    : {items?.length}
                                </TableCellComponent>
                                <TableCellComponent>
                                    Width
                                </TableCellComponent>
                                <TableCellComponent>
                                    : {items?.width}
                                </TableCellComponent>
                            </TableRow>
                            <TableRow>
                                <TableCellComponent>
                                    Quality
                                </TableCellComponent>
                                <TableCellComponent sx={{ borderRight: "1px solid #ccc" }}>
                                    : {items?.quality?.name}
                                </TableCellComponent>
                                <TableCellComponent>
                                    GSM
                                </TableCellComponent>
                                <TableCellComponent>
                                    : {items?.gsm}
                                </TableCellComponent>
                            </TableRow>
                            <TableRow>
                                <TableCellComponent>
                                    Gross Weight
                                </TableCellComponent>
                                <TableCellComponent sx={{ borderRight: "1px solid #ccc" }}>
                                    : {items?.gross_weight}
                                </TableCellComponent>
                                <TableCellComponent>
                                    Net Weight
                                </TableCellComponent>
                                <TableCellComponent>
                                    : {items?.net_weight}
                                </TableCellComponent>
                            </TableRow>
                        </TableHead>
                    </Table>

                </InnerContainer>
                <Box sx={{ textAlign: "center", margin: "5px 0px 20px 0px" }}>
                    <button
                        onClick={handlePrint}
                        style={{
                            backgroundColor: "#151620",
                            color: "#fff",
                            padding: "10px 20px",
                            fontSize: "14px",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                        }}
                    >
                        🖨️ Print
                    </button>
                </Box>

            </Container>
        </Modal>

    );
}

export default InventoryBillPage