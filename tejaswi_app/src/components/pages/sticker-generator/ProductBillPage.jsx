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


const Header = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #dfdfdf",
    padding: "15px 25px",
}));

const InnerContainer = styled(Box)(({ theme }) => ({
    padding: "20px 25px",
    paddingBottom: "25px",
    maxHeight: "calc(75vh - 80px)",
    overflowY: "auto",
}));

const TableCellComponent = styled(TableCell)(({ theme }) => ({
    fontSize: "14px",
    fontWeight: 500,
    padding: "12px 25px",
    whiteSpace: "nowrap",
}));


const ProductBillModal = ({ open, setOpen, item, qr }) => {
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
        <Modal open={open} onClose={() => setOpen(false)}>
            <Container
                sx={{
                    "&:focus-visible": {
                        outline: "none",
                    },
                }}

            >
                <Header>
                    <Typography variant="h6" fontWeight="bold">
                        Product Invoice
                    </Typography>
                    <IconButton onClick={() => setOpen(false)}>
                        <IoClose />
                    </IconButton>
                </Header>

                <InnerContainer ref={printRef}>

                    <Stack direction="row" justifyContent="space-between" margin="15px 0">
                        <Box>
                            <h3 style={{ fontSize: "18px", margin: "0px" }}>{item?.trading_name}</h3>
                            <p style={{ fontSize: "12px", margin: "0px" }}>MADE IN INDIA</p>
                            {item?.trading_name?.toLowerCase() !== "green" && (
                                <>
                                    <p style={{ fontSize: "12px", margin: "0px" }}>Manufactured by</p>
                                    <h3 style={{ fontSize: "16px", margin: "0px" }}>Tejaswi Nonwovens Pvt. Ltd</h3>
                                </>
                            )}

                        </Box>
                        <Box
                            component="img"
                            src={qr}
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
                                    Roll No
                                </TableCellComponent>
                                <TableCellComponent sx={{ borderRight: "1px solid #ccc" }}>
                                    : {item?.serial_number}
                                </TableCellComponent>
                                <TableCellComponent>
                                    Colour
                                </TableCellComponent>
                                <TableCellComponent >
                                    : {item?.colour?.name}
                                </TableCellComponent>
                            </TableRow>
                            <TableRow>
                                <TableCellComponent>
                                    Length
                                </TableCellComponent>
                                <TableCellComponent sx={{ borderRight: "1px solid #ccc" }}>
                                    : {item?.length}
                                </TableCellComponent>
                                <TableCellComponent>
                                    Width
                                </TableCellComponent>
                                <TableCellComponent>
                                    : {item?.width}
                                </TableCellComponent>
                            </TableRow>
                            <TableRow>
                                <TableCellComponent>
                                    Quality
                                </TableCellComponent>
                                <TableCellComponent sx={{ borderRight: "1px solid #ccc" }}>
                                    : {item?.quality?.name}
                                </TableCellComponent>
                                <TableCellComponent>
                                    GSM
                                </TableCellComponent>
                                <TableCellComponent>
                                    : {item?.gsm}
                                </TableCellComponent>
                            </TableRow>
                            <TableRow>
                                <TableCellComponent>
                                    Gross Weight
                                </TableCellComponent>
                                <TableCellComponent sx={{ borderRight: "1px solid #ccc" }}>
                                    : {item?.gross_weight}
                                </TableCellComponent>
                                <TableCellComponent>
                                    Net Weight
                                </TableCellComponent>
                                <TableCellComponent>
                                    : {item?.net_weight}
                                </TableCellComponent>
                            </TableRow>
                        </TableHead>
                    </Table>

                    <Box sx={{ textAlign: "center", mt: 4 }}>
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
                </InnerContainer>
            </Container>
        </Modal>
    );
};

export default ProductBillModal;
