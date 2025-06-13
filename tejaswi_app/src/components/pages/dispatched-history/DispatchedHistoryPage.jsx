import { Box, Button, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getDispatchHistoryData } from "../../../features/dispatch/dispatchSlice";
import axios from "axios";

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
    marginBottom: "30px",
    display: "flex",
    justifyContent: "space-between"
}));

const Title = styled(Typography)(({ theme }) => ({
    fontSize: "20px",
    fontWeight: 600,
}));


const TableCellContainer = styled(TableCell)(({ theme }) => ({
    padding: "3px 16px",
    borderBottom: "0px"
}));

const InputComponent = styled(TextField)(({ theme }) => ({
    fontSize: "14px",
    "& .MuiOutlinedInput-input": {
        padding: "10px",
        fontSize: "14px",
    },
    "& .MuiInputBase-input::placeholder": {
        fontSize: "14px",
        color: "#000",
    },
}));


function DispatchedHistoryPage() {
    const runFunction = useRef(false)
    const dispatch = useDispatch()
    const [expandedRows, setExpandedRows] = useState({});
    const [dateFilter, setDateFilter] = useState({
        startDate: "",
        endDate: "",
    });

    const { dispatchData } = useSelector((state) => state.dispatch)

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        if (isNaN(date)) return '';
        return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
    };

    const toggleRow = (id) => {
        setExpandedRows(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const dateChange = (e) => {
        const { name, value } = e.target;
        setDateFilter((prev) => ({
            ...prev,
            [name]: value,
        }));

    };


    const downloadPDF = async (id) => {
        try {
            let token = Cookies.get("access");

            const response = await axios.get(
                `${process.env.REACT_APP_API_KEY}/auth/dispatch-managers/${id}`,
                {
                    headers: {
                        'ngrok-skip-browser-warning': 'true',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const dispatch = response?.data;
            const doc = new jsPDF();
            doc.setFontSize(16);
            doc.text("Packing Slip", 14, 15);

            let y = 25;
            doc.setFontSize(12);
            doc.text(`Dispatch ID: ${dispatch.id || ''}`, 14, y);
            doc.text(`Client: ${dispatch.select_client || ''}`, 14, y += 6);
            doc.text(`Vehicle Number: ${dispatch.vehicle_number || ''}`, 14, y += 6);
            doc.text(`Driver Contact: ${dispatch.driver_contact || ''}`, 14, y += 6);
            doc.text(`Date: ${formatDate(dispatch.created_at)}`, 14, y += 6);
            doc.text(`Items: ${dispatch.total_items || 0} | Total Weight: ${dispatch.total_weight || 0} kg`, 14, y += 6);

            y += 10;

            const summary = dispatch.disptach_summary;

            const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

            const renderSection = (color, categories) => {
                doc.setFontSize(14);
                doc.text(`${color}`, 14, y += 8);
                Object.entries(categories).forEach(([category, items]) => {
                    doc.setFontSize(12);
                    doc.text(`${capitalize(category)}`, 16, y += 6);

                    items.forEach(({ type, pieces, total_weight_kg }) => {
                        doc.text(`• ${type} —  ${pieces} pcs  |  ${total_weight_kg} kg`, 18, y += 6);
                    });
                });
            };

            // Loop through White, Blue, Green sections
            Object.entries(summary).forEach(([color, categories]) => {
                renderSection(`${color}`, categories);
            });

            y += 10;
            autoTable(doc, {
                startY: y + 4,
                head: [['Product No.', 'Color', 'Quality', 'Type', 'Gross Weight', 'Weight', 'GSM', 'Length', 'Width']],
                body: dispatch.scanned_items?.map(item => ([
                    item.product_number || '-',
                    item.colour || '-',
                    item.quality || '-',
                    item.product_type || '-',
                    item.gross_weight || '-',
                    item.weight || '-',
                    item.gsm || '-',
                    item.length || '-',
                    item.width || '-',


                ])) || [],
            });

            doc.save('dispatch-history.pdf');
        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("Failed to generate PDF");
        }
    };


    useEffect(() => {
        if (!runFunction.current) {
            dispatch(getDispatchHistoryData())
            runFunction.current = true
        }
    }, [dispatch])

    return (
        <Container>
            <InnerContainer>
                <BoxContainer elevation={2}>
                    <Header>
                        <Title>Packing Slip</Title>
                        <Stack direction="row" gap={3} alignItems="flex-end">
                            {/* From Date */}
                            <Box>
                                <Box component="label" sx={{ fontSize: "13px", marginBottom: "4px", display: "block" }}>
                                    To Date
                                </Box>
                                <InputComponent
                                    type="date"
                                    name="startDate"
                                    value={dateFilter.startDate}
                                    onChange={dateChange}
                                />
                            </Box>

                            {/* To Date */}
                            <Box>
                                <Box component="label" sx={{ fontSize: "13px", marginBottom: "4px", display: "block" }}>
                                    From Date
                                </Box>
                                <InputComponent
                                    type="date"
                                    name="endDate"
                                    value={dateFilter.endDate}
                                    onChange={dateChange}
                                />
                            </Box>

                            <Button
                                variant="contained"
                                onClick={() =>
                                    dispatch(getDispatchHistoryData({
                                        startDate: dateFilter.startDate,
                                        endDate: dateFilter.endDate
                                    }))
                                }
                            >
                                Search
                            </Button>

                        </Stack>
                    </Header>


                    <TableContainerComponent>
                        <Table>
                            {dispatchData?.map((dispatch, index) => (
                                <React.Fragment key={index}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ border: 'none', fontWeight: 600, paddingBottom: 0 }}>
                                                <Box>
                                                    <Typography sx={{ fontWeight: 600 }}>
                                                        Dispatch ID: {dispatch?.id}
                                                    </Typography>
                                                    <Typography>Client: {dispatch?.select_client}</Typography>
                                                    <Typography>Date: {formatDate(dispatch?.created_at)}</Typography>
                                                    <Typography>
                                                        Items: {dispatch?.total_items} | Total Weight: {dispatch?.total_weight}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell align="right" sx={{ border: 'none', paddingBottom: 0 }}>
                                                <Stack direction="row" justifyContent="flex-end" gap={3}>
                                                    <Button
                                                        variant="outlined"
                                                        size="small"
                                                        sx={{ textTransform: "capitalize" }}
                                                        onClick={() => toggleRow(dispatch?.id)}
                                                    >
                                                        {!expandedRows[dispatch?.id] ? "Hide Details" : "Show Details"}
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        sx={{ textTransform: "capitalize" }}
                                                        onClick={() => downloadPDF(dispatch?.id)}
                                                    >
                                                        Download PDF
                                                    </Button>

                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    {!expandedRows[dispatch?.id] && (
                                        <TableBody sx={{
                                            borderBottom: "1px solid rgba(0, 0, 0, 0.2)"
                                        }}>
                                            {dispatch?.scanned_items?.map((item, itemIndex) => (
                                                <TableRow key={itemIndex}>
                                                    <TableCellContainer>{item?.product_number} - {item?.product_type} - {item?.weight} - {item?.colour} - {item?.quality}</TableCellContainer>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    )}
                                </React.Fragment>
                            ))}
                        </Table>
                    </TableContainerComponent>

                </BoxContainer>
            </InnerContainer>
        </Container>
    )
}

export default DispatchedHistoryPage