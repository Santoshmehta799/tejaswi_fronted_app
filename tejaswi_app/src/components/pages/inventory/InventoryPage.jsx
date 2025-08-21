import { Box, IconButton, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Pagination } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteInventory, getInventory, showInventorySticker } from "../../../features/inventory/inventorySlice";
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineDeleteOutline } from "react-icons/md";
import EditInventoryPage from "./EditInventoryPage";
import { IoMdEye } from "react-icons/io";
import InventoryBillPage from "./InventoryBillPage";

const Container = styled(Box)(({ theme }) => ({
    width: "100%",
    height: "max-content",
    background: "#06060",
    padding: "30px 0px",
}));


const InnerContainer = styled(Box)(({ theme }) => ({
    width: "90%",
    margin: "auto",
}));

const BoxContainer = styled(Paper)(({ theme }) => ({
    padding: "20px"
}));

const TableContainerComponent = styled(TableContainer)(({ theme }) => ({
    marginTop: "30px",
    background: "#FFFFFF",
    borderRadius: "5px",
}));

const Header = styled(Box)(({ theme }) => ({
    marginBottom: "30px"
}));

const Title = styled(Typography)(({ theme }) => ({
    fontSize: "20px",
    fontWeight: 600,
}));

const TableCellComponent = styled(TableCell)(({ theme }) => ({
    fontSize: "14px",
    fontWeight: 500,
    color: "#E5E5E8",
    padding: "12px 25px",
    whiteSpace: "nowrap",
}));

const TableCellContainer = styled(TableCell)(({ theme }) => ({
    padding: "12px 25px",
}));

const CategoryNotFound = styled(TableCell)(({ theme }) => ({
    fontSize: "22px",
    fontWeight: 600,
    height: "500px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    "&.MuiTableCell-root": {
        border: "0px",
    },
}));


function InventoryPage() {
    const runFunction = useRef(false);
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [isId, setIsId] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const { results, totalPages, items } = useSelector((state) => state.inventory);

    const [page, setPage] = useState(1);

    useEffect(() => {
        if (!runFunction.current) {
            dispatch(getInventory({ page, limit: 20 }));
            runFunction.current = true;
        }
    }, [dispatch, page]);

    const handlePageChange = (event, value) => {
        setPage(value);
        dispatch(getInventory({ page: value, limit: 20 }));
    };

    return (
        <>
            <EditInventoryPage isId={isId} open={open} setOpen={setOpen} />
            <InventoryBillPage isOpen={isOpen} setIsOpen={setIsOpen} items={items}/>
            <Container>
                <InnerContainer>
                    <BoxContainer elevation={2}>
                        <Header>
                            <Title>Inventory</Title>
                        </Header>
                        <TableContainerComponent>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ background: "#2B2C40" }}>
                                        <TableCellComponent sx={{ width: "10%" }}>Product No.</TableCellComponent>
                                        <TableCellComponent sx={{ width: "10%" }} align="center">Color</TableCellComponent>
                                        <TableCellComponent sx={{ width: "10%" }} align="center">Quality</TableCellComponent>
                                        <TableCellComponent sx={{ width: "10%" }}>Type</TableCellComponent>
                                        <TableCellComponent sx={{ width: "10%" }} align="center">Length</TableCellComponent>
                                        <TableCellComponent sx={{ width: "10%" }} align="center">Width</TableCellComponent>
                                        <TableCellComponent sx={{ width: "10%" }} align="center">Gross Weight</TableCellComponent>
                                        <TableCellComponent sx={{ width: "10%" }} align="center">Net Weight</TableCellComponent>
                                        <TableCellComponent sx={{ width: "10%" }} align="center">GSM</TableCellComponent>
                                        <TableCellComponent sx={{ width: "10%" }}>Laminated</TableCellComponent>
                                        <TableCellComponent sx={{ width: "15%" }} align="center">Action</TableCellComponent>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {results?.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={11} align="center">
                                            <CategoryNotFound>No Inventory Found.</CategoryNotFound>
                                            </TableCell>
                                        </TableRow>
                                        ) : (
                                        results?.map((row, index) => (
                                            <TableRow key={index} hover>
                                            <TableCellContainer>{row?.product_code || "-"}</TableCellContainer>
                                            <TableCellContainer align="center">{row?.color || "-"}</TableCellContainer>
                                            <TableCellContainer align="center">{row?.quality || "-"}</TableCellContainer>
                                            <TableCellContainer>{row?.type}</TableCellContainer>
                                            <TableCellContainer align="center">{row?.length || "-"}</TableCellContainer>
                                            <TableCellContainer align="center">{row?.width || "-"}</TableCellContainer>
                                            <TableCellContainer align="center">{row?.gross_weight}</TableCellContainer>
                                            <TableCellContainer align="center">{row?.net_weight || "-"}</TableCellContainer>
                                            <TableCellContainer align="center">{row?.gsm || "-"}</TableCellContainer>
                                            <TableCellContainer align="center">{row?.leminated === false ? "No" : "Yes"}</TableCellContainer>
                                            <TableCellContainer align="center">
                                                <Stack direction="row" gap={1}>
                                                <IconButton>
                                                    <IoMdEye
                                                    onClick={() => {
                                                        setIsOpen(true);
                                                        dispatch(showInventorySticker({ id: row?.product_code }));
                                                    }}
                                                    style={{ fontSize: "20px", color: "blue" }}
                                                    />
                                                </IconButton>
                                                <IconButton onClick={() => { setOpen(true); setIsId(row?.product_code); }}>
                                                    <FaRegEdit style={{ fontSize: "18px", color: "green" }} />
                                                </IconButton>
                                                <IconButton onClick={() => dispatch(deleteInventory({ id: row?.product_code }))}>
                                                    <MdOutlineDeleteOutline style={{ fontSize: "20px", color: "red" }} />
                                                </IconButton>
                                                </Stack>
                                            </TableCellContainer>
                                            </TableRow>
                                        ))
                                        )}
                                </TableBody>
                            </Table>
                        </TableContainerComponent>

                        {/* Pagination UI */}
                        <Box display="flex" justifyContent="center" mt={3}>
                            <Pagination
                                count={totalPages}
                                page={page}
                                onChange={handlePageChange}
                                color="primary"
                            />
                        </Box>
                    </BoxContainer>
                </InnerContainer>
            </Container>
        </>
    );
}

export default InventoryPage;