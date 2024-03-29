import React from 'react';
import { Button, Box } from '@mui/material';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

const ExportHighestPackageData = ({ data }) => {
    const csvConfig = mkConfig({
        fieldSeparator: ',',
        decimalSeparator: '.',
        useKeysAsHeaders: true,
    });
    const handleExportData = () => {
        const batchMap = new Map();
        // Iterate through the data to find the student with the highest package for each batch
        data.map((student, index) => {
            const batch = student.userInfo.batch;
            console.log("batch",batch)
            const currentPackage = student.placementData.package;
            console.log("currentPackage",currentPackage);
            if (
                    !batchMap.has(batch) ||
                    currentPackage > batchMap.get(batch).student.placementData.package
            ) {
                console.log("hi")
                batchMap.set(batch, { index, student });
            }
        });
        // Generate CSV data using the batchMap
        const filteredData = Array.from(batchMap.values()).map(({ index, student }, batchIndex) => {
            const filteredRow = {};
            filteredRow['S.No'] = batchIndex + 1;
            filteredRow['Batch'] = student.userInfo.batch;
            filteredRow['Student Name'] = student.userInfo.Name;
            filteredRow['Branch'] = student.userInfo.branch;
            filteredRow['URN'] = student.urn;
            filteredRow['Package'] = student.placementData.package;
            filteredRow['Company Name'] = student.placementData.company;
            return filteredRow;
        });
        // Sort filteredData by batch in descending order
        filteredData.sort((a, b) => {
            const batchA = a['Batch'];
            const batchB = b['Batch'];

            // Split the batch strings into arrays of years
            const yearsA = batchA.split('-');
            const yearsB = batchB.split('-');

            // Compare the second year (the end year) to sort in descending order
            return parseInt(yearsB[1]) - parseInt(yearsA[1]);
        });

        // Generate CSV
        const csv = generateCsv(csvConfig)(filteredData);

        // Download the CSV
        download(csvConfig)(csv);
    };

    return (
        <Box>
            <Button
                onClick={handleExportData}
                startIcon={<FileDownloadIcon />}
                variant='contained'
            >
                Export Highest Package Batch Wise
            </Button>
        </Box>
    );
};

export default ExportHighestPackageData;
